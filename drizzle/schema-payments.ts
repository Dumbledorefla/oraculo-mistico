import { mysqlTable, varchar, decimal, timestamp, text, int, mysqlEnum, boolean } from "drizzle-orm/mysql-core";

// Tabela de métodos de pagamento disponíveis
export const paymentMethods = mysqlTable("payment_methods", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(), // Stripe, Mercado Pago, PIX, Comprovante
  type: mysqlEnum("type", ["credit_card", "pix", "boleto", "wallet", "manual"]).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(), // stripe, mercadopago, manual
  isActive: boolean("is_active").default(true).notNull(),
  config: text("config"), // JSON com configurações específicas
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tabela de transações PIX
export const pixTransactions = mysqlTable("pix_transactions", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull(),
  txid: varchar("txid", { length: 255 }).notNull().unique(), // ID único da transação PIX
  qrCode: text("qr_code").notNull(), // QR Code em base64 ou URL
  qrCodeText: text("qr_code_text").notNull(), // PIX copia e cola
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "expired", "cancelled"]).default("pending").notNull(),
  payerName: varchar("payer_name", { length: 255 }),
  payerDocument: varchar("payer_document", { length: 20 }),
  paidAt: timestamp("paid_at"),
  expiresAt: timestamp("expires_at").notNull(),
  webhookData: text("webhook_data"), // JSON com dados do webhook de confirmação
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tabela de comprovantes manuais
export const paymentProofs = mysqlTable("payment_proofs", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(), // URL do comprovante no S3
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: int("file_size").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // PIX, TED, DOC, etc
  paymentDate: timestamp("payment_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"), // Observações do usuário
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  reviewedBy: varchar("reviewed_by", { length: 255 }), // ID do admin que revisou
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"), // Motivo da aprovação/rejeição
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tabela de transações Mercado Pago
export const mercadoPagoTransactions = mysqlTable("mercado_pago_transactions", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull(),
  preferenceId: varchar("preference_id", { length: 255 }).notNull().unique(),
  paymentId: varchar("payment_id", { length: 255 }).unique(),
  status: mysqlEnum("status", ["pending", "approved", "authorized", "in_process", "in_mediation", "rejected", "cancelled", "refunded", "charged_back"]).default("pending").notNull(),
  statusDetail: varchar("status_detail", { length: 100 }),
  paymentType: varchar("payment_type", { length: 50 }), // credit_card, debit_card, ticket, pix
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }),
  payerEmail: varchar("payer_email", { length: 255 }),
  webhookData: text("webhook_data"), // JSON com dados do webhook
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tabela de webhooks recebidos (para debug e auditoria)
export const webhookLogs = mysqlTable("webhook_logs", {
  id: int("id").primaryKey().autoincrement(),
  provider: varchar("provider", { length: 50 }).notNull(), // stripe, mercadopago, pix
  eventType: varchar("event_type", { length: 100 }).notNull(),
  payload: text("payload").notNull(), // JSON completo do webhook
  processed: boolean("processed").default(false).notNull(),
  processedAt: timestamp("processed_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de configurações de pagamento (preços, taxas, etc)
export const paymentSettings = mysqlTable("payment_settings", {
  id: int("id").primaryKey().autoincrement(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: varchar("updated_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
