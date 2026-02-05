import { getDb } from "../db";
import { paymentProofs, orders } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { storagePut } from "../storage";

interface UploadPaymentProofParams {
  orderId: number;
  userId: string;
  file: {
    buffer: Buffer;
    filename: string;
    size: number;
    mimetype: string;
  };
  paymentMethod: string;
  paymentDate: Date;
  amount: number;
  notes?: string;
}

/**
 * Faz upload de um comprovante de pagamento
 */
export async function uploadPaymentProof(params: UploadPaymentProofParams) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { orderId, userId, file, paymentMethod, paymentDate, amount, notes } = params;

  // Validar tamanho do arquivo (máximo 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Arquivo muito grande. Tamanho máximo: 5MB");
  }

  // Validar tipo de arquivo (apenas imagens e PDFs)
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error("Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou PDF");
  }

  // Gerar nome único para o arquivo
  const timestamp = Date.now();
  const extension = file.filename.split(".").pop();
  const fileKey = `payment-proofs/${userId}/${orderId}-${timestamp}.${extension}`;

  // Upload para S3
  const { url: fileUrl } = await storagePut(fileKey, file.buffer, file.mimetype);

  // Salvar no banco de dados
  const [proof] = await db
    .insert(paymentProofs)
    .values({
      orderId,
      userId,
      fileUrl,
      fileName: file.filename,
      fileSize: file.size,
      paymentMethod,
      paymentDate,
      amount: amount.toString(),
      notes,
      status: "pending",
    })
    .$returningId();

  return {
    id: proof.id,
    fileUrl,
    status: "pending",
  };
}

/**
 * Lista comprovantes pendentes de revisão (para admin)
 */
export async function getPendingPaymentProofs() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const proofs = await db
    .select()
    .from(paymentProofs)
    .where(eq(paymentProofs.status, "pending"))
    .orderBy(desc(paymentProofs.createdAt));

  return proofs;
}

/**
 * Lista todos os comprovantes com filtro de status
 */
export async function getPaymentProofs(status?: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let query = db.select().from(paymentProofs);

  if (status) {
    query = query.where(eq(paymentProofs.status, status)) as any;
  }

  const proofs = await query.orderBy(desc(paymentProofs.createdAt));

  return proofs;
}

/**
 * Busca comprovantes de um pedido específico
 */
export async function getPaymentProofsByOrder(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const proofs = await db
    .select()
    .from(paymentProofs)
    .where(eq(paymentProofs.orderId, orderId))
    .orderBy(desc(paymentProofs.createdAt));

  return proofs;
}

/**
 * Busca comprovantes de um usuário
 */
export async function getPaymentProofsByUser(userId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const proofs = await db
    .select()
    .from(paymentProofs)
    .where(eq(paymentProofs.userId, userId))
    .orderBy(desc(paymentProofs.createdAt));

  return proofs;
}

/**
 * Aprova um comprovante de pagamento (admin)
 */
export async function approvePaymentProof(proofId: number, reviewedBy: string, reviewNotes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar o comprovante
  const [proof] = await db
    .select()
    .from(paymentProofs)
    .where(eq(paymentProofs.id, proofId))
    .limit(1);

  if (!proof) {
    throw new Error("Comprovante não encontrado");
  }

  if (proof.status !== "pending") {
    throw new Error("Comprovante já foi revisado");
  }

  // Atualizar status do comprovante
  await db
    .update(paymentProofs)
    .set({
      status: "approved",
      reviewedBy,
      reviewedAt: new Date(),
      reviewNotes,
    })
    .where(eq(paymentProofs.id, proofId));

  // Atualizar status do pedido
  await db
    .update(orders)
    .set({
      status: "paid",
      paidAt: new Date(),
      paymentMethod: "manual",
    })
    .where(eq(orders.id, proof.orderId));

  return { success: true, message: "Comprovante aprovado com sucesso" };
}

/**
 * Rejeita um comprovante de pagamento (admin)
 */
export async function rejectPaymentProof(proofId: number, reviewedBy: string, reviewNotes: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar o comprovante
  const [proof] = await db
    .select()
    .from(paymentProofs)
    .where(eq(paymentProofs.id, proofId))
    .limit(1);

  if (!proof) {
    throw new Error("Comprovante não encontrado");
  }

  if (proof.status !== "pending") {
    throw new Error("Comprovante já foi revisado");
  }

  // Atualizar status do comprovante
  await db
    .update(paymentProofs)
    .set({
      status: "rejected",
      reviewedBy,
      reviewedAt: new Date(),
      reviewNotes,
    })
    .where(eq(paymentProofs.id, proofId));

  return { success: true, message: "Comprovante rejeitado" };
}

/**
 * Busca um comprovante por ID
 */
export async function getPaymentProofById(proofId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [proof] = await db
    .select()
    .from(paymentProofs)
    .where(eq(paymentProofs.id, proofId))
    .limit(1);

  return proof;
}
