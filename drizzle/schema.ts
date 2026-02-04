import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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
  readingType: varchar("readingType", { length: 64 }).notNull(), // "dia", "amor", "completo", etc
  cards: json("cards").notNull(), // Array of card objects
  interpretation: text("interpretation"),
  userName: text("userName"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TarotReading = typeof tarotReadings.$inferSelect;
export type InsertTarotReading = typeof tarotReadings.$inferInsert;

/**
 * Relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  tarotReadings: many(tarotReadings),
}));

export const tarotReadingsRelations = relations(tarotReadings, ({ one }) => ({
  user: one(users, {
    fields: [tarotReadings.userId],
    references: [users.id],
  }),
}));