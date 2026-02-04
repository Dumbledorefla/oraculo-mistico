import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tarot readings table - stores user's tarot readings history
 */
export const tarotReadings = mysqlTable("tarot_readings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  readingType: varchar("readingType", { length: 64 }).notNull(),
  cards: json("cards").notNull(),
  interpretation: text("interpretation"),
  userName: text("userName"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TarotReading = typeof tarotReadings.$inferSelect;
export type InsertTarotReading = typeof tarotReadings.$inferInsert;

/**
 * Products table - digital products (maps, games, reports)
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 512 }),
  category: mysqlEnum("category", ["tarot", "numerologia", "astrologia", "runas", "combo"]).notNull(),
  lifeArea: mysqlEnum("lifeArea", ["amor", "carreira", "dinheiro", "saude", "familia", "autoconhecimento", "espiritualidade", "geral"]).default("geral"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("originalPrice", { precision: 10, scale: 2 }),
  imageUrl: text("imageUrl"),
  hasSample: boolean("hasSample").default(true),
  sampleDescription: text("sampleDescription"),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  isCombo: boolean("isCombo").default(false),
  comboProducts: json("comboProducts"), // Array of product IDs for combos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Sample accesses table - tracks free sample views for remarketing
 */
export const sampleAccesses = mysqlTable("sample_accesses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  accessedAt: timestamp("accessedAt").defaultNow().notNull(),
});

export type SampleAccess = typeof sampleAccesses.$inferSelect;
export type InsertSampleAccess = typeof sampleAccesses.$inferInsert;

/**
 * Orders table - purchase orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["pending", "paid", "cancelled", "refunded"]).default("pending").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 64 }),
  stripeSessionId: varchar("stripeSessionId", { length: 256 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  paidAt: timestamp("paidAt"),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table - items in an order
 */
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 256 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").default(1).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * User products table - products owned by users (after purchase)
 */
export const userProducts = mysqlTable("user_products", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  orderId: int("orderId"),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type UserProduct = typeof userProducts.$inferSelect;
export type InsertUserProduct = typeof userProducts.$inferInsert;

/**
 * Relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  tarotReadings: many(tarotReadings),
  sampleAccesses: many(sampleAccesses),
  orders: many(orders),
  userProducts: many(userProducts),
}));

export const tarotReadingsRelations = relations(tarotReadings, ({ one }) => ({
  user: one(users, {
    fields: [tarotReadings.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  sampleAccesses: many(sampleAccesses),
  orderItems: many(orderItems),
  userProducts: many(userProducts),
}));

export const sampleAccessesRelations = relations(sampleAccesses, ({ one }) => ({
  user: one(users, {
    fields: [sampleAccesses.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [sampleAccesses.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const userProductsRelations = relations(userProducts, ({ one }) => ({
  user: one(users, {
    fields: [userProducts.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [userProducts.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [userProducts.orderId],
    references: [orders.id],
  }),
}));
