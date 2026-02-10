import { mysqlTable, varchar, text, int, timestamp, mysqlEnum, json, decimal, boolean, date } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Export payment-related tables
export * from "./schema-payments";

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
  fullName: text("fullName"), // OB1: Nome completo do usuário
  birthDate: date("birthDate"), // OB1: Data de nascimento do usuário
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

/**
 * Taromantes table - esoteric consultants/readers
 */
export const taromantes = mysqlTable("taromantes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Link to user account if they have one
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  title: varchar("title", { length: 256 }), // e.g., "Tarologa e Numerologa"
  bio: text("bio"),
  shortBio: varchar("shortBio", { length: 512 }),
  photoUrl: text("photoUrl"),
  specialties: json("specialties"), // Array of specialties: ["tarot", "numerologia", "astrologia"]
  experience: int("experience"), // Years of experience
  rating: decimal("rating", { precision: 2, scale: 1 }).default("5.0"),
  totalReviews: int("totalReviews").default(0),
  totalConsultations: int("totalConsultations").default(0),
  pricePerHour: decimal("pricePerHour", { precision: 10, scale: 2 }).notNull(),
  pricePerSession: decimal("pricePerSession", { precision: 10, scale: 2 }), // 30 min session
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Taromante = typeof taromantes.$inferSelect;
export type InsertTaromante = typeof taromantes.$inferInsert;

/**
 * Taromante availability - weekly schedule
 */
export const taromanteAvailability = mysqlTable("taromante_availability", {
  id: int("id").autoincrement().primaryKey(),
  taromanteId: int("taromanteId").notNull(),
  dayOfWeek: int("dayOfWeek").notNull(), // 0 = Sunday, 6 = Saturday
  startTime: varchar("startTime", { length: 5 }).notNull(), // "09:00"
  endTime: varchar("endTime", { length: 5 }).notNull(), // "18:00"
  isActive: boolean("isActive").default(true),
});

export type TaromanteAvailability = typeof taromanteAvailability.$inferSelect;
export type InsertTaromanteAvailability = typeof taromanteAvailability.$inferInsert;

/**
 * Consultations table - scheduled consultations
 */
export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  taromanteId: int("taromanteId").notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  duration: int("duration").default(30).notNull(), // Duration in minutes
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled", "no_show"]).default("pending").notNull(),
  consultationType: mysqlEnum("consultationType", ["video", "chat", "phone"]).default("video").notNull(),
  topic: varchar("topic", { length: 256 }), // What the user wants to discuss
  notes: text("notes"), // Taromante notes after consultation
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 256 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 256 }),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

/**
 * Consultation reviews - user reviews for taromantes
 */
export const consultationReviews = mysqlTable("consultation_reviews", {
  id: int("id").autoincrement().primaryKey(),
  consultationId: int("consultationId").notNull(),
  userId: int("userId").notNull(),
  taromanteId: int("taromanteId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  isPublic: boolean("isPublic").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ConsultationReview = typeof consultationReviews.$inferSelect;
export type InsertConsultationReview = typeof consultationReviews.$inferInsert;

/**
 * Taromante services - specific services offered
 */
export const taromanteServices = mysqlTable("taromante_services", {
  id: int("id").autoincrement().primaryKey(),
  taromanteId: int("taromanteId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  duration: int("duration").notNull(), // Duration in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("isActive").default(true),
});

export type TaromanteService = typeof taromanteServices.$inferSelect;
export type InsertTaromanteService = typeof taromanteServices.$inferInsert;

/**
 * Relations for taromantes
 */
export const taromantesRelations = relations(taromantes, ({ one, many }) => ({
  user: one(users, {
    fields: [taromantes.userId],
    references: [users.id],
  }),
  availability: many(taromanteAvailability),
  consultations: many(consultations),
  reviews: many(consultationReviews),
  services: many(taromanteServices),
}));

export const taromanteAvailabilityRelations = relations(taromanteAvailability, ({ one }) => ({
  taromante: one(taromantes, {
    fields: [taromanteAvailability.taromanteId],
    references: [taromantes.id],
  }),
}));

export const consultationsRelations = relations(consultations, ({ one }) => ({
  user: one(users, {
    fields: [consultations.userId],
    references: [users.id],
  }),
  taromante: one(taromantes, {
    fields: [consultations.taromanteId],
    references: [taromantes.id],
  }),
}));

export const consultationReviewsRelations = relations(consultationReviews, ({ one }) => ({
  consultation: one(consultations, {
    fields: [consultationReviews.consultationId],
    references: [consultations.id],
  }),
  user: one(users, {
    fields: [consultationReviews.userId],
    references: [users.id],
  }),
  taromante: one(taromantes, {
    fields: [consultationReviews.taromanteId],
    references: [taromantes.id],
  }),
}));

export const taromanteServicesRelations = relations(taromanteServices, ({ one }) => ({
  taromante: one(taromantes, {
    fields: [taromanteServices.taromanteId],
    references: [taromantes.id],
  }),
}));


/**
 * Courses table - educational courses
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 512 }),
  category: mysqlEnum("category", ["tarot", "numerologia", "astrologia", "runas", "espiritualidade", "autoconhecimento"]).notNull(),
  level: mysqlEnum("level", ["iniciante", "intermediario", "avancado"]).default("iniciante"),
  imageUrl: text("imageUrl"),
  instructorId: int("instructorId"), // Link to taromante if applicable
  instructorName: varchar("instructorName", { length: 256 }),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"), // 0 = free
  isFree: boolean("isFree").default(true),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  totalModules: int("totalModules").default(0),
  totalLessons: int("totalLessons").default(0),
  totalDuration: int("totalDuration").default(0), // Total duration in minutes
  enrollmentCount: int("enrollmentCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Course modules - sections within a course
 */
export const courseModules = mysqlTable("course_modules", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  orderIndex: int("orderIndex").default(0),
  isActive: boolean("isActive").default(true),
});

export type CourseModule = typeof courseModules.$inferSelect;
export type InsertCourseModule = typeof courseModules.$inferInsert;

/**
 * Course lessons - individual lessons within modules
 */
export const courseLessons = mysqlTable("course_lessons", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  contentType: mysqlEnum("contentType", ["video", "text", "quiz", "exercise"]).default("video"),
  videoUrl: text("videoUrl"),
  textContent: text("textContent"),
  duration: int("duration").default(0), // Duration in minutes
  orderIndex: int("orderIndex").default(0),
  isFree: boolean("isFree").default(false), // Free preview lesson
  isActive: boolean("isActive").default(true),
});

export type CourseLesson = typeof courseLessons.$inferSelect;
export type InsertCourseLesson = typeof courseLessons.$inferInsert;

/**
 * Course enrollments - user enrollments in courses
 */
export const courseEnrollments = mysqlTable("course_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  status: mysqlEnum("status", ["active", "completed", "cancelled"]).default("active"),
  progress: int("progress").default(0), // Percentage 0-100
  completedLessons: int("completedLessons").default(0),
  orderId: int("orderId"), // Link to order if paid course
  stripeSessionId: varchar("stripeSessionId", { length: 256 }),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;

/**
 * Lesson progress - tracks user progress on individual lessons
 */
export const lessonProgress = mysqlTable("lesson_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  courseId: int("courseId").notNull(),
  isCompleted: boolean("isCompleted").default(false),
  watchedSeconds: int("watchedSeconds").default(0),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = typeof lessonProgress.$inferInsert;

/**
 * Relations for courses
 */
export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(taromantes, {
    fields: [courses.instructorId],
    references: [taromantes.id],
  }),
  modules: many(courseModules),
  lessons: many(courseLessons),
  enrollments: many(courseEnrollments),
}));

export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
  lessons: many(courseLessons),
}));

export const courseLessonsRelations = relations(courseLessons, ({ one }) => ({
  module: one(courseModules, {
    fields: [courseLessons.moduleId],
    references: [courseModules.id],
  }),
  course: one(courses, {
    fields: [courseLessons.courseId],
    references: [courses.id],
  }),
}));

export const courseEnrollmentsRelations = relations(courseEnrollments, ({ one }) => ({
  user: one(users, {
    fields: [courseEnrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [courseEnrollments.courseId],
    references: [courses.id],
  }),
  order: one(orders, {
    fields: [courseEnrollments.orderId],
    references: [orders.id],
  }),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [lessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(courseLessons, {
    fields: [lessonProgress.lessonId],
    references: [courseLessons.id],
  }),
  course: one(courses, {
    fields: [lessonProgress.courseId],
    references: [courses.id],
  }),
}));
