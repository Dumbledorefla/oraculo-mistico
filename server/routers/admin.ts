import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import {
  users,
  tarotReadings,
  consultations,
  orders,
  orderItems,
  products,
  paymentProofs,
  pixTransactions,
  mercadoPagoTransactions,
  taromantes,
  taromanteAvailability,
  taromanteServices,
  consultationReviews,
  courses,
  courseEnrollments,
  siteSettings,
  adminActivityLogs,
  webhookConfigs,
  apiKeys,
  webhookLogs,
} from "../../drizzle/schema";
import { eq, desc, count, sum, and, gte, like, or, sql, asc } from "drizzle-orm";
import {
  getPendingPaymentProofs,
  approvePaymentProof,
  rejectPaymentProof,
} from "../payments/proofs";
import crypto from "crypto";

// Middleware para verificar se o usuário é admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Acesso negado. Apenas administradores podem acessar este recurso.",
    });
  }
  return next({ ctx });
});

// Helper para registrar atividade admin
async function logAdminActivity(
  adminEmail: string,
  adminName: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: string
) {
  try {
    const db = await getDb();
    if (!db) return;
    await db.insert(adminActivityLogs).values({
      adminId: adminEmail,
      adminName,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (e) {
    console.error("[AdminLog] Failed to log activity:", e);
  }
}

export const adminRouter = router({
  // ==================== ESTATÍSTICAS ====================

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    const bannedUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isBanned, true));
    const bannedUsers = bannedUsersResult[0]?.count || 0;

    const adminUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "admin"));
    const adminUsers = adminUsersResult[0]?.count || 0;

    const totalGamesResult = await db.select({ count: count() }).from(tarotReadings);
    const totalGames = totalGamesResult[0]?.count || 0;

    const totalConsultationsResult = await db.select({ count: count() }).from(consultations);
    const totalConsultations = totalConsultationsResult[0]?.count || 0;

    const revenueResult = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.status, "paid"));
    const totalRevenue = parseFloat(revenueResult[0]?.total || "0");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));
    const newUsers = newUsersResult[0]?.count || 0;

    const pendingOrdersResult = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "pending"));
    const pendingOrders = pendingOrdersResult[0]?.count || 0;

    const totalProductsResult = await db.select({ count: count() }).from(products);
    const totalProducts = totalProductsResult[0]?.count || 0;

    const activeProductsResult = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true));
    const activeProducts = activeProductsResult[0]?.count || 0;

    const totalTaromantesResult = await db.select({ count: count() }).from(taromantes);
    const totalTaromantes = totalTaromantesResult[0]?.count || 0;

    const activeTaromantesResult = await db
      .select({ count: count() })
      .from(taromantes)
      .where(eq(taromantes.isActive, true));
    const activeTaromantes = activeTaromantesResult[0]?.count || 0;

    const totalCoursesResult = await db.select({ count: count() }).from(courses);
    const totalCourses = totalCoursesResult[0]?.count || 0;

    const totalEnrollmentsResult = await db.select({ count: count() }).from(courseEnrollments);
    const totalEnrollments = totalEnrollmentsResult[0]?.count || 0;

    let pendingProofsCount = 0;
    try {
      const pendingProofs = await getPendingPaymentProofs();
      pendingProofsCount = pendingProofs.length;
    } catch (e) {}

    const pendingConsultationsResult = await db
      .select({ count: count() })
      .from(consultations)
      .where(eq(consultations.status, "pending"));
    const pendingConsultations = pendingConsultationsResult[0]?.count || 0;

    return {
      totalUsers,
      bannedUsers,
      adminUsers,
      newUsers,
      totalGames,
      totalConsultations,
      pendingConsultations,
      totalRevenue,
      pendingOrders,
      pendingProofsCount,
      totalProducts,
      activeProducts,
      totalTaromantes,
      activeTaromantes,
      totalCourses,
      totalEnrollments,
      conversionRate: totalUsers > 0 ? ((pendingOrders / totalUsers) * 100).toFixed(2) : "0.00",
    };
  }),

  // ==================== USUÁRIOS ====================

  listUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
        role: z.enum(["all", "admin", "user"]).optional().default("all"),
        search: z.string().optional().default(""),
        bannedOnly: z.boolean().optional().default(false),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions: any[] = [];

      if (input.role !== "all") {
        conditions.push(eq(users.role, input.role));
      }

      if (input.bannedOnly) {
        conditions.push(eq(users.isBanned, true));
      }

      if (input.search) {
        conditions.push(
          or(
            like(users.email, `%${input.search}%`),
            like(users.name, `%${input.search}%`),
            like(users.fullName, `%${input.search}%`)
          )
        );
      }

      let query = db.select().from(users);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      const usersList = await query
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(users.createdAt));

      const totalResult = await db.select({ count: count() }).from(users);
      const total = totalResult[0]?.count || 0;

      return { users: usersList, total };
    }),

  getUserDetails: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const userResult = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!userResult[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });

      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, input.userId))
        .orderBy(desc(orders.createdAt))
        .limit(10);

      const userReadings = await db
        .select({ count: count() })
        .from(tarotReadings)
        .where(eq(tarotReadings.userId, input.userId));

      const userConsultations = await db
        .select()
        .from(consultations)
        .where(eq(consultations.userId, input.userId))
        .orderBy(desc(consultations.createdAt))
        .limit(10);

      return {
        user: userResult[0],
        orders: userOrders,
        totalReadings: userReadings[0]?.count || 0,
        consultations: userConsultations,
      };
    }),

  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["admin", "user"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "update_role",
        "user",
        input.userId.toString(),
        JSON.stringify({ newRole: input.role })
      );

      return { success: true, message: `Role atualizado para ${input.role}` };
    }),

  banUser: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        reason: z.string().min(1, "Motivo é obrigatório"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(users)
        .set({
          isBanned: true,
          banReason: input.reason,
          bannedAt: new Date(),
        })
        .where(eq(users.id, input.userId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "ban_user",
        "user",
        input.userId.toString(),
        JSON.stringify({ reason: input.reason })
      );

      return { success: true, message: "Usuário banido com sucesso" };
    }),

  unbanUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(users)
        .set({
          isBanned: false,
          banReason: null,
          bannedAt: null,
        })
        .where(eq(users.id, input.userId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "unban_user",
        "user",
        input.userId.toString()
      );

      return { success: true, message: "Usuário desbanido com sucesso" };
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Don't allow deleting admins
      const userResult = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (userResult[0]?.role === "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Não é possível excluir um administrador" });
      }

      await db.delete(users).where(eq(users.id, input.userId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "delete_user",
        "user",
        input.userId.toString()
      );

      return { success: true, message: "Usuário excluído com sucesso" };
    }),

  // ==================== PRODUTOS ====================

  listProducts: adminProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
        category: z.string().optional().default("all"),
        activeOnly: z.boolean().optional().default(false),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions: any[] = [];

      if (input.category !== "all") {
        conditions.push(eq(products.category, input.category as any));
      }

      if (input.activeOnly) {
        conditions.push(eq(products.isActive, true));
      }

      let query = db.select().from(products);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      const productsList = await query
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(products.createdAt));

      return productsList;
    }),

  createProduct: adminProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        category: z.enum(["tarot", "numerologia", "astrologia", "runas", "combo"]),
        price: z.string(),
        originalPrice: z.string().optional(),
        isActive: z.boolean().optional().default(true),
        isFeatured: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(products).values({
        slug: input.slug,
        name: input.name,
        description: input.description,
        shortDescription: input.shortDescription,
        category: input.category,
        price: input.price,
        originalPrice: input.originalPrice,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
      });

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "create_product",
        "product",
        undefined,
        JSON.stringify({ name: input.name, price: input.price })
      );

      return { success: true, message: "Produto criado com sucesso" };
    }),

  updateProduct: adminProcedure
    .input(
      z.object({
        productId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        price: z.string().optional(),
        originalPrice: z.string().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { productId, ...updateData } = input;
      const cleanData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      if (Object.keys(cleanData).length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Nenhum campo para atualizar" });
      }

      await db.update(products).set(cleanData).where(eq(products.id, productId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "update_product",
        "product",
        productId.toString(),
        JSON.stringify(cleanData)
      );

      return { success: true, message: "Produto atualizado com sucesso" };
    }),

  deleteProduct: adminProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(products).where(eq(products.id, input.productId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "delete_product",
        "product",
        input.productId.toString()
      );

      return { success: true, message: "Produto excluído com sucesso" };
    }),

  // ==================== TAROMANTES ====================

  listTaromantes: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const taromantesList = await db.select().from(taromantes).orderBy(desc(taromantes.createdAt));
    return taromantesList;
  }),

  createTaromante: adminProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        title: z.string().optional(),
        bio: z.string().optional(),
        shortBio: z.string().optional(),
        specialties: z.array(z.string()).optional(),
        experience: z.number().optional(),
        pricePerHour: z.string(),
        pricePerSession: z.string().optional(),
        isActive: z.boolean().optional().default(true),
        isFeatured: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(taromantes).values({
        slug: input.slug,
        name: input.name,
        title: input.title,
        bio: input.bio,
        shortBio: input.shortBio,
        specialties: input.specialties,
        experience: input.experience,
        pricePerHour: input.pricePerHour,
        pricePerSession: input.pricePerSession,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
      });

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "create_taromante",
        "taromante",
        undefined,
        JSON.stringify({ name: input.name })
      );

      return { success: true, message: "Taromante criado com sucesso" };
    }),

  updateTaromante: adminProcedure
    .input(
      z.object({
        taromanteId: z.number(),
        name: z.string().optional(),
        title: z.string().optional(),
        bio: z.string().optional(),
        shortBio: z.string().optional(),
        pricePerHour: z.string().optional(),
        pricePerSession: z.string().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        experience: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { taromanteId, ...updateData } = input;
      const cleanData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      await db.update(taromantes).set(cleanData).where(eq(taromantes.id, taromanteId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "update_taromante",
        "taromante",
        taromanteId.toString(),
        JSON.stringify(cleanData)
      );

      return { success: true, message: "Taromante atualizado com sucesso" };
    }),

  deleteTaromante: adminProcedure
    .input(z.object({ taromanteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(taromantes).where(eq(taromantes.id, input.taromanteId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "delete_taromante",
        "taromante",
        input.taromanteId.toString()
      );

      return { success: true, message: "Taromante excluído com sucesso" };
    }),

  // ==================== JOGOS ====================

  listGames: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const gamesStats = await db
      .select({
        readingType: tarotReadings.readingType,
        count: count(),
      })
      .from(tarotReadings)
      .groupBy(tarotReadings.readingType);

    const games = [
      { id: 1, name: "Tarot do Dia", type: "dia", plays: 0, active: true, premium: false },
      { id: 2, name: "Tarot do Amor", type: "amor", plays: 0, active: true, premium: true },
      { id: 3, name: "Tarot Completo", type: "completo", plays: 0, active: true, premium: true },
      { id: 4, name: "Cruz Celta", type: "cruz-celta", plays: 0, active: true, premium: true },
      { id: 5, name: "Caminho da Vida", type: "caminho-vida", plays: 0, active: true, premium: true },
    ];

    games.forEach((game) => {
      const stat = gamesStats.find((s) => s.readingType === game.type);
      if (stat) {
        game.plays = stat.count;
      }
    });

    return games;
  }),

  // ==================== CONSULTAS ====================

  listConsultations: adminProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
        status: z
          .enum(["all", "pending", "confirmed", "completed", "cancelled", "no_show"])
          .optional()
          .default("all"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions: any[] = [];

      if (input.status !== "all") {
        conditions.push(eq(consultations.status, input.status));
      }

      let query = db.select().from(consultations);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      const consultationsList = await query
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(consultations.createdAt));

      return consultationsList;
    }),

  updateConsultationStatus: adminProcedure
    .input(
      z.object({
        consultationId: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(consultations)
        .set({ status: input.status })
        .where(eq(consultations.id, input.consultationId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "update_consultation_status",
        "consultation",
        input.consultationId.toString(),
        JSON.stringify({ newStatus: input.status })
      );

      return { success: true, message: "Status atualizado com sucesso" };
    }),

  // ==================== PEDIDOS / PAGAMENTOS ====================

  listPayments: adminProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
        status: z.enum(["all", "pending", "paid", "cancelled", "refunded"]).optional().default("all"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions: any[] = [];

      if (input.status !== "all") {
        conditions.push(eq(orders.status, input.status));
      }

      let query = db.select().from(orders);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      const paymentsList = await query
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(orders.createdAt));

      return paymentsList;
    }),

  updateOrderStatus: adminProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "paid", "cancelled", "refunded"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = { status: input.status };
      if (input.status === "paid") {
        updateData.paidAt = new Date();
      }

      await db.update(orders).set(updateData).where(eq(orders.id, input.orderId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "update_order_status",
        "order",
        input.orderId.toString(),
        JSON.stringify({ newStatus: input.status })
      );

      return { success: true, message: `Pedido atualizado para ${input.status}` };
    }),

  // ==================== COMPROVANTES ====================

  listPaymentProofs: adminProcedure
    .input(
      z.object({
        status: z.enum(["all", "pending", "approved", "rejected"]).optional().default("all"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(paymentProofs);

      if (input.status !== "all") {
        query = query.where(eq(paymentProofs.status, input.status)) as any;
      }

      const proofs = await query.orderBy(desc(paymentProofs.createdAt));
      return proofs;
    }),

  approvePaymentProof: adminProcedure
    .input(
      z.object({
        proofId: z.number(),
        reviewNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("User not authenticated");
      const result = await approvePaymentProof(input.proofId, ctx.user.id.toString(), input.reviewNotes);

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "approve_payment_proof",
        "payment_proof",
        input.proofId.toString()
      );

      return result;
    }),

  rejectPaymentProof: adminProcedure
    .input(
      z.object({
        proofId: z.number(),
        reviewNotes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("User not authenticated");
      const result = await rejectPaymentProof(input.proofId, ctx.user.id.toString(), input.reviewNotes);

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "reject_payment_proof",
        "payment_proof",
        input.proofId.toString()
      );

      return result;
    }),

  // ==================== CURSOS ====================

  listCourses: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const coursesList = await db.select().from(courses).orderBy(desc(courses.createdAt));
    return coursesList;
  }),

  updateCourse: adminProcedure
    .input(
      z.object({
        courseId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        isFree: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { courseId, ...updateData } = input;
      const cleanData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      await db.update(courses).set(cleanData).where(eq(courses.id, courseId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "update_course",
        "course",
        courseId.toString(),
        JSON.stringify(cleanData)
      );

      return { success: true, message: "Curso atualizado com sucesso" };
    }),

  // ==================== CONFIGURAÇÕES DO SITE ====================

  getSettings: adminProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(siteSettings);

      if (input.category) {
        query = query.where(eq(siteSettings.category, input.category)) as any;
      }

      const settingsList = await query.orderBy(asc(siteSettings.category), asc(siteSettings.key));
      return settingsList;
    }),

  upsertSetting: adminProcedure
    .input(
      z.object({
        key: z.string().min(1),
        value: z.string(),
        label: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional().default("general"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if setting exists
      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, input.key))
        .limit(1);

      if (existing[0]) {
        await db
          .update(siteSettings)
          .set({
            value: input.value,
            label: input.label,
            description: input.description,
            updatedBy: ctx.user?.email || "unknown",
          })
          .where(eq(siteSettings.key, input.key));
      } else {
        await db.insert(siteSettings).values({
          key: input.key,
          value: input.value,
          label: input.label,
          description: input.description,
          category: input.category,
          updatedBy: ctx.user?.email || "unknown",
        });
      }

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "update_setting",
        "setting",
        input.key,
        JSON.stringify({ value: input.value })
      );

      return { success: true, message: "Configuração salva com sucesso" };
    }),

  // ==================== WEBHOOKS ====================

  listWebhooks: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const webhooks = await db.select().from(webhookConfigs).orderBy(desc(webhookConfigs.createdAt));
    return webhooks;
  }),

  createWebhook: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        url: z.string().url(),
        events: z.array(z.string()).min(1),
        secret: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const secret = input.secret || crypto.randomBytes(32).toString("hex");

      await db.insert(webhookConfigs).values({
        name: input.name,
        url: input.url,
        events: input.events,
        secret,
        isActive: true,
      });

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "create_webhook",
        "webhook",
        undefined,
        JSON.stringify({ name: input.name, url: input.url })
      );

      return { success: true, message: "Webhook criado com sucesso", secret };
    }),

  updateWebhook: adminProcedure
    .input(
      z.object({
        webhookId: z.number(),
        name: z.string().optional(),
        url: z.string().url().optional(),
        events: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { webhookId, ...updateData } = input;
      const cleanData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      await db.update(webhookConfigs).set(cleanData).where(eq(webhookConfigs.id, webhookId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "update_webhook",
        "webhook",
        webhookId.toString(),
        JSON.stringify(cleanData)
      );

      return { success: true, message: "Webhook atualizado com sucesso" };
    }),

  deleteWebhook: adminProcedure
    .input(z.object({ webhookId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(webhookConfigs).where(eq(webhookConfigs.id, input.webhookId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "delete_webhook",
        "webhook",
        input.webhookId.toString()
      );

      return { success: true, message: "Webhook excluído com sucesso" };
    }),

  // ==================== WEBHOOK LOGS ====================

  listWebhookLogs: adminProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        provider: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(webhookLogs);

      if (input.provider) {
        query = query.where(eq(webhookLogs.provider, input.provider)) as any;
      }

      const logs = await query.limit(input.limit).orderBy(desc(webhookLogs.createdAt));
      return logs;
    }),

  // ==================== API KEYS ====================

  listApiKeys: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        permissions: apiKeys.permissions,
        isActive: apiKeys.isActive,
        lastUsedAt: apiKeys.lastUsedAt,
        expiresAt: apiKeys.expiresAt,
        createdBy: apiKeys.createdBy,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .orderBy(desc(apiKeys.createdAt));

    return keys;
  }),

  createApiKey: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        permissions: z.array(z.string()).optional(),
        expiresInDays: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const rawKey = `ok_${crypto.randomBytes(32).toString("hex")}`;
      const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
      const keyPrefix = rawKey.substring(0, 10);

      const expiresAt = input.expiresInDays
        ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined;

      await db.insert(apiKeys).values({
        name: input.name,
        keyHash,
        keyPrefix,
        permissions: input.permissions || ["read"],
        isActive: true,
        expiresAt,
        createdBy: ctx.user?.email || "unknown",
      });

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "create_api_key",
        "api_key",
        undefined,
        JSON.stringify({ name: input.name })
      );

      return { success: true, message: "API Key criada com sucesso", apiKey: rawKey };
    }),

  revokeApiKey: adminProcedure
    .input(z.object({ keyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.update(apiKeys).set({ isActive: false }).where(eq(apiKeys.id, input.keyId));

      await logAdminActivity(
        ctx.user?.email || "unknown",
        ctx.user?.name || "Admin",
        "revoke_api_key",
        "api_key",
        input.keyId.toString()
      );

      return { success: true, message: "API Key revogada com sucesso" };
    }),

  // ==================== LOGS DE ATIVIDADE ====================

  listActivityLogs: adminProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
        entityType: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(adminActivityLogs);

      if (input.entityType) {
        query = query.where(eq(adminActivityLogs.entityType, input.entityType)) as any;
      }

      const logs = await query
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(adminActivityLogs.createdAt));

      return logs;
    }),

  // ==================== INTEGRAÇÕES STATUS ====================

  getIntegrationStatus: adminProcedure.query(async () => {
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    const hasAuth0Domain = !!process.env.VITE_AUTH0_DOMAIN;
    const hasAuth0ClientId = !!process.env.VITE_AUTH0_CLIENT_ID;
    const hasLLMKey = !!process.env.BUILT_IN_FORGE_API_KEY;
    const hasDatabaseUrl = !!process.env.DATABASE_URL;

    return {
      stripe: {
        connected: hasStripeKey,
        label: "Stripe",
        description: "Processamento de pagamentos",
      },
      auth0: {
        connected: hasAuth0Domain && hasAuth0ClientId,
        label: "Auth0",
        description: "Autenticação de usuários",
      },
      llm: {
        connected: hasLLMKey,
        label: "LLM / IA",
        description: "Inteligência artificial para leituras",
      },
      database: {
        connected: hasDatabaseUrl,
        label: "Banco de Dados",
        description: "MySQL / TiDB",
      },
    };
  }),
});
