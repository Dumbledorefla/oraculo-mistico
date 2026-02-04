/**
 * Stripe Server Integration
 * Handles checkout sessions and webhooks
 */

import Stripe from "stripe";
import { Express, Request, Response } from "express";
import { getProductBySlug, STRIPE_PRODUCTS } from "./products";
import { 
  createOrder, 
  createOrderItem, 
  updateOrderStatus, 
  grantUserProduct,
  getOrderByStripeSessionId,
  getProductBySlug as getDbProductBySlug
} from "../db";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

export interface CheckoutItem {
  slug: string;
  quantity?: number;
}

export interface CreateCheckoutParams {
  items: CheckoutItem[];
  userId: number;
  userEmail: string;
  userName: string;
  origin: string;
}

/**
 * Create a Stripe Checkout Session
 */
export async function createCheckoutSession(params: CreateCheckoutParams): Promise<string> {
  const { items, userId, userEmail, userName, origin } = params;

  // Build line items from cart
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const productSlugs: string[] = [];

  for (const item of items) {
    const product = getProductBySlug(item.slug);
    if (!product) {
      throw new Error(`Product not found: ${item.slug}`);
    }

    lineItems.push({
      price_data: {
        currency: product.currency,
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.priceInCents,
      },
      quantity: item.quantity || 1,
    });

    productSlugs.push(item.slug);
  }

  if (lineItems.length === 0) {
    throw new Error("No valid items in cart");
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${origin}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/carrinho?cancelled=true`,
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    allow_promotion_codes: true,
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      product_slugs: productSlugs.join(","),
    },
  });

  return session.url || "";
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(
  payload: Buffer,
  signature: string
): Promise<{ received: boolean; type?: string }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return { received: true, type: "test" };
  }

  // Process different event types
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id}`);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return { received: true, type: event.type };
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Stripe] Checkout completed: ${session.id}`);

  const userId = parseInt(session.metadata?.user_id || "0");
  const productSlugs = session.metadata?.product_slugs?.split(",") || [];

  if (!userId) {
    console.error("[Stripe] No user_id in session metadata");
    return;
  }

  // Calculate total from session
  const totalAmount = (session.amount_total || 0) / 100;

  try {
    // Create order in database
    const orderResult = await createOrder({
      userId,
      status: "paid",
      totalAmount: totalAmount.toFixed(2),
      paymentMethod: "stripe",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
    });

    // Get the order ID (MySQL returns insertId)
    const orderId = (orderResult as any)?.[0]?.insertId;

    if (!orderId) {
      console.error("[Stripe] Failed to create order");
      return;
    }

    // Create order items and grant products to user
    for (const slug of productSlugs) {
      const product = await getDbProductBySlug(slug);
      if (product) {
        // Create order item
        await createOrderItem({
          orderId,
          productId: product.id,
          productName: product.name,
          price: product.price as string,
          quantity: 1,
        });

        // Grant product to user
        await grantUserProduct({
          userId,
          productId: product.id,
          orderId,
        });

        console.log(`[Stripe] Granted product ${product.name} to user ${userId}`);
      }
    }

    console.log(`[Stripe] Order ${orderId} created successfully`);
  } catch (error) {
    console.error("[Stripe] Error processing checkout:", error);
  }
}

/**
 * Register Stripe routes with Express
 */
export function registerStripeRoutes(app: Express) {
  // Webhook endpoint - MUST be registered before express.json()
  app.post(
    "/api/stripe/webhook",
    (req: Request, res: Response) => {
      const signature = req.headers["stripe-signature"] as string;

      if (!signature) {
        console.error("[Stripe Webhook] No signature header");
        return res.status(400).json({ error: "No signature header" });
      }

      // Get raw body
      const chunks: Buffer[] = [];
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", async () => {
        const rawBody = Buffer.concat(chunks);

        try {
          const result = await handleWebhook(rawBody, signature);
          
          // For test events, return verified: true
          if (result.type === "test") {
            return res.json({ verified: true });
          }
          
          res.json({ received: true });
        } catch (error: any) {
          console.error("[Stripe Webhook] Error:", error.message);
          res.status(400).json({ error: error.message });
        }
      });
    }
  );
}


/**
 * Create a Stripe Checkout Session for Consultations
 */
export interface CreateConsultationCheckoutParams {
  taromanteId: number;
  taromanteSlug: string;
  taromanteName: string;
  serviceName: string;
  scheduledAt: string;
  duration: number;
  consultationType: "video" | "chat" | "phone";
  topic?: string;
  price: string;
  userId: number;
  userEmail: string;
  userName: string;
  origin: string;
}

export async function createConsultationCheckoutSession(params: CreateConsultationCheckoutParams): Promise<string> {
  const {
    taromanteId,
    taromanteSlug,
    taromanteName,
    serviceName,
    scheduledAt,
    duration,
    consultationType,
    topic,
    price,
    userId,
    userEmail,
    userName,
    origin,
  } = params;

  // Convert price to cents
  const priceInCents = Math.round(parseFloat(price) * 100);

  // Format date for display
  const scheduledDate = new Date(scheduledAt);
  const formattedDate = scheduledDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: `Consulta com ${taromanteName}`,
            description: `${serviceName} (${duration} min) - ${formattedDate}`,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/consulta/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/taromante/${taromanteSlug}?cancelled=true`,
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    allow_promotion_codes: true,
    metadata: {
      type: "consultation",
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      taromante_id: taromanteId.toString(),
      taromante_name: taromanteName,
      scheduled_at: scheduledAt,
      duration: duration.toString(),
      consultation_type: consultationType,
      topic: topic || "",
      price: price,
    },
  });

  return session.url || "";
}
