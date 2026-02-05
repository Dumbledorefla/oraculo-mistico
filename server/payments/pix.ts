import crypto from "crypto";
import { getDb } from "../db";
import { pixTransactions, orders } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Chave PIX da empresa (deve ser configurada no .env)
const PIX_KEY = process.env.PIX_KEY || "contato@chavedooraculo.com";
const PIX_MERCHANT_NAME = process.env.PIX_MERCHANT_NAME || "Chave do Oraculo LTDA";
const PIX_MERCHANT_CITY = process.env.PIX_MERCHANT_CITY || "Sao Paulo";

interface CreatePixPaymentParams {
  orderId: number;
  amount: number;
  description: string;
  expiresInMinutes?: number;
}

interface PixPaymentResult {
  txid: string;
  qrCode: string;
  qrCodeText: string;
  amount: number;
  expiresAt: Date;
}

/**
 * Gera um payload PIX estático (sem integração com PSP)
 * Para produção, recomenda-se integrar com:
 * - Banco do Brasil API PIX
 * - Mercado Pago PIX
 * - PagSeguro PIX
 * - Asaas PIX
 */
export async function createPixPayment(params: CreatePixPaymentParams): Promise<PixPaymentResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { orderId, amount, description, expiresInMinutes = 30 } = params;

  // Gerar TXID único
  const txid = `PIX${Date.now()}${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

  // Calcular data de expiração
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

  // Gerar payload PIX (formato EMV)
  const qrCodeText = generatePixPayload({
    pixKey: PIX_KEY,
    merchantName: PIX_MERCHANT_NAME,
    merchantCity: PIX_MERCHANT_CITY,
    txid,
    amount,
    description,
  });

  // Em produção, você geraria um QR Code real aqui
  // Por enquanto, vamos usar um placeholder que pode ser convertido em QR Code no frontend
  const qrCode = qrCodeText; // O frontend pode usar bibliotecas como qrcode.react para gerar a imagem

  // Salvar no banco de dados
  await db.insert(pixTransactions).values({
    orderId,
    txid,
    qrCode,
    qrCodeText,
    amount: amount.toString(),
    status: "pending",
    expiresAt,
  });

  return {
    txid,
    qrCode,
    qrCodeText,
    amount,
    expiresAt,
  };
}

/**
 * Gera o payload PIX no formato EMV (copia e cola)
 * Especificação: https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II-ManualdePadroesparaIniciacaodoPix.pdf
 */
function generatePixPayload(params: {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  txid: string;
  amount: number;
  description?: string;
}): string {
  const { pixKey, merchantName, merchantCity, txid, amount, description } = params;

  // Função auxiliar para criar campos EMV
  const emvField = (id: string, value: string) => {
    const length = value.length.toString().padStart(2, "0");
    return `${id}${length}${value}`;
  };

  // Merchant Account Information (campo 26 - PIX)
  const merchantAccountInfo =
    emvField("00", "BR.GOV.BCB.PIX") + // Indicador de arranjo
    emvField("01", pixKey) + // Chave PIX
    (description ? emvField("02", description.substring(0, 25)) : ""); // Descrição (opcional)

  const payload =
    emvField("00", "01") + // Payload Format Indicator
    emvField("26", merchantAccountInfo) + // Merchant Account Information
    emvField("52", "0000") + // Merchant Category Code
    emvField("53", "986") + // Transaction Currency (986 = BRL)
    emvField("54", amount.toFixed(2)) + // Transaction Amount
    emvField("58", "BR") + // Country Code
    emvField("59", merchantName.substring(0, 25)) + // Merchant Name
    emvField("60", merchantCity.substring(0, 15)) + // Merchant City
    emvField("62", emvField("05", txid.substring(0, 25))); // Additional Data Field (TXID)

  // Calcular CRC16
  const crc = calculateCRC16(payload + "6304");
  return payload + "6304" + crc;
}

/**
 * Calcula CRC16-CCITT para o payload PIX
 */
function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }

  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Verifica o status de um pagamento PIX
 */
export async function checkPixPaymentStatus(txid: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [transaction] = await db
    .select()
    .from(pixTransactions)
    .where(eq(pixTransactions.txid, txid))
    .limit(1);

  return transaction;
}

/**
 * Confirma um pagamento PIX (chamado pelo webhook ou manualmente)
 */
export async function confirmPixPayment(txid: string, webhookData?: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Atualizar transação PIX
  await db
    .update(pixTransactions)
    .set({
      status: "paid",
      paidAt: new Date(),
      webhookData: webhookData ? JSON.stringify(webhookData) : null,
    })
    .where(eq(pixTransactions.txid, txid));

  // Buscar a transação para pegar o orderId
  const [transaction] = await db
    .select()
    .from(pixTransactions)
    .where(eq(pixTransactions.txid, txid))
    .limit(1);

  if (transaction) {
    // Atualizar status do pedido
    await db
      .update(orders)
      .set({
        status: "paid",
        paidAt: new Date(),
      })
      .where(eq(orders.id, transaction.orderId));
  }

  return transaction;
}

/**
 * Cancela/expira um pagamento PIX
 */
export async function expirePixPayment(txid: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pixTransactions)
    .set({
      status: "expired",
    })
    .where(eq(pixTransactions.txid, txid));
}

/**
 * Lista transações PIX pendentes expiradas (para job de limpeza)
 */
export async function getExpiredPixTransactions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const expired = await db
    .select()
    .from(pixTransactions)
    .where(eq(pixTransactions.status, "pending"));

  return expired.filter((t: any) => new Date(t.expiresAt) < now);
}
