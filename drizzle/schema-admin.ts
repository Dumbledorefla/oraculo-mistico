import { mysqlTable, varchar, text, int, timestamp, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Site settings - key/value store for site-wide configuration
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  label: varchar("label", { length: 256 }), // Human-readable label
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // pricing, content, integration, general
  updatedBy: varchar("updated_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Admin activity logs - audit trail for admin actions
 */
export const adminActivityLogs = mysqlTable("admin_activity_logs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: varchar("admin_id", { length: 255 }).notNull(), // Admin user ID or email
  adminName: varchar("admin_name", { length: 255 }),
  action: varchar("action", { length: 100 }).notNull(), // ban_user, update_product, etc.
  entityType: varchar("entity_type", { length: 50 }).notNull(), // user, product, taromante, order, etc.
  entityId: varchar("entity_id", { length: 255 }), // ID of the affected entity
  details: text("details"), // JSON with action details
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
export type InsertAdminActivityLog = typeof adminActivityLogs.$inferInsert;

/**
 * Webhook configurations - custom webhooks for integrations
 */
export const webhookConfigs = mysqlTable("webhook_configs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  secret: varchar("secret", { length: 256 }), // For signature verification
  events: json("events").notNull(), // Array of event types to listen for
  isActive: boolean("is_active").default(true).notNull(),
  lastTriggeredAt: timestamp("last_triggered_at"),
  lastStatus: int("last_status"), // HTTP status of last delivery
  failureCount: int("failure_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type WebhookConfig = typeof webhookConfigs.$inferSelect;
export type InsertWebhookConfig = typeof webhookConfigs.$inferInsert;

/**
 * API keys - for external integrations
 */
export const apiKeys = mysqlTable("api_keys", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  keyHash: varchar("key_hash", { length: 256 }).notNull(), // Hashed API key
  keyPrefix: varchar("key_prefix", { length: 10 }).notNull(), // First 8 chars for identification
  permissions: json("permissions"), // Array of allowed permissions
  isActive: boolean("is_active").default(true).notNull(),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;
