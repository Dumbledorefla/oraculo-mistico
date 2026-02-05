import { getDb } from "../db";
import { mercadoPagoTransactions, orders } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Mercado Pago credentials (deve ser configurado no .env)
const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "";
const MP_PUBLIC_KEY = process.env.MERCADO_PAGO_PUBLIC_KEY || "";

interface CreateMercadoPagoCheckoutParams {
  orderId: number;
  items: Array<{
    title: string;
    description?: string;
    quantity: number;
    unit_price: number;
  }>;
  payer: {
    email: string;
    name?: string;
  };
  backUrls: {
    success: string;
    failure: string;
    pending: string;
  };
}

interface MercadoPagoCheckoutResult {
  preferenceId: string;
  initPoint: string; // URL para redirecionar o usuário
  sandboxInitPoint: string; // URL para testes
}

/**
 * Cria uma preferência de pagamento no Mercado Pago
 * Documentação: https://www.mercadopago.com.br/developers/pt/reference/preferences/_checkout_preferences/post
 */
export async function createMercadoPagoCheckout(
  params: CreateMercadoPagoCheckoutParams
): Promise<MercadoPagoCheckoutResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { orderId, items, payer, backUrls } = params;

  // Calcular valor total
  const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  // Criar preferência no Mercado Pago
  const preferenceData = {
    items: items.map(item => ({
      title: item.title,
      description: item.description || "",
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: "BRL",
    })),
    payer: {
      email: payer.email,
      name: payer.name || "",
    },
    back_urls: backUrls,
    auto_return: "approved",
    external_reference: orderId.toString(),
    notification_url: `${backUrls.success.split("/checkout")[0]}/api/webhooks/mercadopago`,
    statement_descriptor: "CHAVE DO ORACULO",
    payment_methods: {
      excluded_payment_types: [],
      installments: 12, // Até 12 parcelas
    },
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mercado Pago API error: ${error}`);
    }

    const preference = await response.json();

    // Salvar no banco de dados
    await db.insert(mercadoPagoTransactions).values({
      orderId,
      preferenceId: preference.id,
      status: "pending",
      amount: totalAmount.toString(),
      payerEmail: payer.email,
    });

    return {
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    };
  } catch (error) {
    console.error("Error creating Mercado Pago checkout:", error);
    throw error;
  }
}

/**
 * Processa webhook do Mercado Pago
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export async function processMercadoPagoWebhook(webhookData: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { type, data } = webhookData;

  // Webhook de pagamento
  if (type === "payment") {
    const paymentId = data.id;

    // Buscar informações do pagamento
    const paymentInfo = await getMercadoPagoPayment(paymentId);

    if (!paymentInfo) {
      console.error("Payment not found:", paymentId);
      return;
    }

    const { external_reference, status, status_detail, transaction_amount, payer } = paymentInfo;

    // Atualizar transação no banco
    const [transaction] = await db
      .select()
      .from(mercadoPagoTransactions)
      .where(eq(mercadoPagoTransactions.preferenceId, external_reference))
      .limit(1);

    if (transaction) {
      await db
        .update(mercadoPagoTransactions)
        .set({
          paymentId,
          status: status as any,
          statusDetail: status_detail,
          paidAmount: transaction_amount?.toString(),
          webhookData: JSON.stringify(paymentInfo),
        })
        .where(eq(mercadoPagoTransactions.id, transaction.id));

      // Se pagamento aprovado, atualizar pedido
      if (status === "approved") {
        await db
          .update(orders)
          .set({
            status: "paid",
            paidAt: new Date(),
            paymentMethod: "mercadopago",
          })
          .where(eq(orders.id, transaction.orderId));
      }
    }
  }
}

/**
 * Busca informações de um pagamento no Mercado Pago
 */
async function getMercadoPagoPayment(paymentId: string) {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Mercado Pago payment:", error);
    return null;
  }
}

/**
 * Verifica status de uma transação Mercado Pago
 */
export async function checkMercadoPagoStatus(preferenceId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [transaction] = await db
    .select()
    .from(mercadoPagoTransactions)
    .where(eq(mercadoPagoTransactions.preferenceId, preferenceId))
    .limit(1);

  return transaction;
}

/**
 * Retorna a chave pública do Mercado Pago para uso no frontend
 */
export function getMercadoPagoPublicKey() {
  return MP_PUBLIC_KEY;
}
