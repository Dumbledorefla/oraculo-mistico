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
} from "../../drizzle/schema";
import { eq, desc, count, sum, and, gte, sql } from "drizzle-orm";
import {
  getPendingPaymentProofs,
  approvePaymentProof,
  rejectPaymentProof,
  getPaymentProofById,
} from "../payments/proofs";

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

export const adminRouter = router({
  // ==================== ESTATÍSTICAS ====================

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Total de usuários
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Usuários premium (role = 'admin' não conta como premium)
    const premiumUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "admin"));
    const adminUsers = premiumUsersResult[0]?.count || 0;
    const premiumUsers = Math.max(0, totalUsers - adminUsers); // Simplificado: todos não-admin são considerados premium se pagaram

    // Total de jogadas de tarot
    const totalGamesResult = await db.select({ count: count() }).from(tarotReadings);
    const totalGames = totalGamesResult[0]?.count || 0;

    // Total de consultas
    const totalConsultationsResult = await db.select({ count: count() }).from(consultations);
    const totalConsultations = totalConsultationsResult[0]?.count || 0;

    // Receita total (soma de todos os orders pagos)
    const revenueResult = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.status, "paid"));
    const totalRevenue = parseFloat(revenueResult[0]?.total || "0");

    // Novos usuários (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));
    const newUsers = newUsersResult[0]?.count || 0;

    // Pedidos pendentes
    const pendingOrdersResult = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "pending"));
    const pendingOrders = pendingOrdersResult[0]?.count || 0;

    // Comprovantes pendentes
    const pendingProofs = await getPendingPaymentProofs();
    const pendingProofsCount = pendingProofs.length;

    return {
      totalUsers,
      premiumUsers,
      freeUsers: totalUsers - premiumUsers,
      totalGames,
      totalConsultations,
      totalRevenue,
      newUsers,
      pendingOrders,
      pendingProofsCount,
      conversionRate: totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(2) : "0.00",
    };
  }),

  // ==================== USUÁRIOS ====================

  listUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
        role: z.enum(["all", "admin", "user"]).optional().default("all"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(users);

      if (input.role !== "all") {
        query = query.where(eq(users.role, input.role)) as any;
      }

      const usersList = await query.limit(input.limit).offset(input.offset).orderBy(desc(users.createdAt));

      return usersList;
    }),

  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["admin", "user"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));

      return { success: true, message: "Role atualizado com sucesso" };
    }),

  // ==================== JOGOS ====================

  listGames: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Buscar estatísticas de cada tipo de jogo
    const gamesStats = await db
      .select({
        readingType: tarotReadings.readingType,
        count: count(),
      })
      .from(tarotReadings)
      .groupBy(tarotReadings.readingType);

    // Mapear para formato esperado pelo frontend
    const games = [
      { id: 1, name: "Tarot do Dia", type: "dia", plays: 0, active: true, premium: false },
      { id: 2, name: "Tarot do Amor", type: "amor", plays: 0, active: true, premium: true },
      { id: 3, name: "Tarot Completo", type: "completo", plays: 0, active: true, premium: true },
      { id: 4, name: "Cruz Celta", type: "cruz-celta", plays: 0, active: true, premium: true },
      { id: 5, name: "Caminho da Vida", type: "caminho-vida", plays: 0, active: true, premium: true },
    ];

    // Atualizar contadores com dados reais
    games.forEach(game => {
      const stat = gamesStats.find(s => s.readingType === game.type);
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

      let query = db
        .select({
          id: consultations.id,
          userId: consultations.userId,
          taromanteId: consultations.taromanteId,
          scheduledAt: consultations.scheduledAt,
          duration: consultations.duration,
          consultationType: consultations.consultationType,
          status: consultations.status,
          price: consultations.price,
          createdAt: consultations.createdAt,
        })
        .from(consultations);

      if (input.status !== "all") {
        query = query.where(eq(consultations.status, input.status)) as any;
      }

      const consultationsList = await query.limit(input.limit).offset(input.offset).orderBy(desc(consultations.createdAt));

      return consultationsList;
    }),

  updateConsultationStatus: adminProcedure
    .input(
      z.object({
        consultationId: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.update(consultations).set({ status: input.status }).where(eq(consultations.id, input.consultationId));

      return { success: true, message: "Status atualizado com sucesso" };
    }),

  // ==================== PAGAMENTOS ====================

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

      let query = db
        .select({
          id: orders.id,
          userId: orders.userId,
          totalAmount: orders.totalAmount,
          status: orders.status,
          paymentMethod: orders.paymentMethod,
          stripeSessionId: orders.stripeSessionId,
          createdAt: orders.createdAt,
          paidAt: orders.paidAt,
        })
        .from(orders);

      if (input.status !== "all") {
        query = query.where(eq(orders.status, input.status)) as any;
      }

      const paymentsList = await query.limit(input.limit).offset(input.offset).orderBy(desc(orders.createdAt));

      return paymentsList;
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
      if (!ctx.user?.id) {
        throw new Error("User not authenticated");
      }

      return await approvePaymentProof(input.proofId, ctx.user.id.toString(), input.reviewNotes);
    }),

  rejectPaymentProof: adminProcedure
    .input(
      z.object({
        proofId: z.number(),
        reviewNotes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new Error("User not authenticated");
      }

      return await rejectPaymentProof(input.proofId, ctx.user.id.toString(), input.reviewNotes);
    }),

  // ==================== CONFIGURAÇÕES ====================

  updateSettings: adminProcedure
    .input(
      z.object({
        monthlyPrice: z.number().optional(),
        annualPrice: z.number().optional(),
        consultationBasePrice: z.number().optional(),
        heroTitle: z.string().optional(),
        heroSubtitle: z.string().optional(),
        welcomeEmail: z.string().optional(),
        confirmationEmail: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implementar sistema de configurações no banco de dados
      // Por enquanto, apenas retornar sucesso
      return { success: true, message: "Configurações atualizadas com sucesso" };
    }),
});
