/**
 * Stripe Webhook Handler
 * Processa eventos de pagamento do Stripe
 * 
 * Eventos suportados:
 * - payment_intent.succeeded: Pagamento bem-sucedido
 * - charge.refunded: Reembolso processado
 * - customer.subscription.updated: Assinatura atualizada
 */

import Stripe from "stripe";
import { getDb } from "../db";
import { orders, consultations, courseEnrollments, InsertCourseEnrollment } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: unknown;
  };
}

/**
 * Processa pagamento bem-sucedido
 */
async function handlePaymentIntentSucceeded(event: unknown) {
  const paymentIntent = (event as any).data.object as Stripe.PaymentIntent;
  const db = await getDb();
  if (!db) return;
  
  // Extrair metadata do pagamento
  const { orderId, consultationId, courseId, userId } = paymentIntent.metadata || {};
  
  if (orderId) {
    // Atualizar status do pedido
    await db
      .update(orders)
      .set({
        status: "paid",
        stripePaymentIntentId: paymentIntent.id,
        paidAt: new Date(paymentIntent.created * 1000),
      })
      .where(eq(orders.id, parseInt(orderId)));
    
    console.log(`✅ Pedido ${orderId} marcado como pago`);
  }
  
  if (consultationId) {
    // Atualizar status da consulta
    await db
      .update(consultations)
      .set({
        status: "confirmed",
        stripePaymentIntentId: paymentIntent.id,
        paidAt: new Date(paymentIntent.created * 1000),
      })
      .where(eq(consultations.id, parseInt(consultationId)));
    
    console.log(`✅ Consulta ${consultationId} marcada como paga`);
  }
  
  if (courseId && userId) {
    // Inscrever usuário no curso
    await db.insert(courseEnrollments).values({
      userId: parseInt(userId),
      courseId: parseInt(courseId),
      status: "active",
      progress: 0,
      stripeSessionId: paymentIntent.id,
      enrolledAt: new Date(),
    });
    
    console.log(`✅ Usuário ${userId} inscrito no curso ${courseId}`);
  }
}

/**
 * Processa reembolso
 */
async function handleChargeRefunded(event: unknown) {
  const charge = (event as any).data.object as Stripe.Charge;
  const db = await getDb();
  if (!db) return;
  
  // Encontrar pedido ou consulta associada
  const paymentId = charge.payment_intent as string;
  
  // Atualizar status para refunded
  if (charge.metadata?.orderId) {
    await db
      .update(orders)
      .set({
        status: "refunded",
      })
      .where(eq(orders.stripePaymentIntentId, paymentId));
    
    console.log(`💰 Pedido ${charge.metadata.orderId} reembolsado`);
  }
  
  if (charge.metadata?.consultationId) {
    await db
      .update(consultations)
      .set({
        status: "cancelled",
      })
      .where(eq(consultations.stripePaymentIntentId, paymentId));
    
    console.log(`💰 Consulta ${charge.metadata.consultationId} reembolsada`);
  }
}

/**
 * Processa atualização de assinatura
 */
async function handleSubscriptionUpdated(event: unknown) {
  const subscription = (event as any).data.object as Stripe.Subscription;
  
  console.log(`📋 Assinatura ${subscription.id} atualizada:`, subscription.status);
  
  // Implementar lógica de assinatura conforme necessário
  // Por exemplo: renovação automática de acesso, cancelamento, etc.
}

/**
 * Valida e processa webhook do Stripe
 */
export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validar assinatura do webhook
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
    
    // Processar evento
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event);
        break;
      
      case "charge.refunded":
        await handleChargeRefunded(event);
        break;
      
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event);
        break;
      
      default:
        console.log(`⚠️ Evento não tratado: ${event.type}`);
    }
    
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Erro ao processar webhook:", message);
    return { success: false, error: message };
  }
}
