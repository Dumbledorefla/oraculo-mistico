import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  saveTarotReading, 
  getUserTarotReadings,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  recordSampleAccess,
  getUserSampleAccesses,
  getUserProducts,
  userOwnsProduct,
  getUserOrders,
  getOrderItems
} from "./db";
import { createCheckoutSession } from "./stripe/stripe";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  tarot: router({
    saveReading: protectedProcedure
      .input(z.object({
        readingType: z.string(),
        cards: z.array(z.any()),
        interpretation: z.string().optional(),
        userName: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await saveTarotReading({
          userId: ctx.user.id,
          readingType: input.readingType,
          cards: input.cards,
          interpretation: input.interpretation,
          userName: input.userName || ctx.user.name || undefined,
        });
      }),
    
    getHistory: protectedProcedure
      .input(z.object({
        limit: z.number().optional().default(10),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await getUserTarotReadings(ctx.user.id, input.limit);
      }),
  }),

  products: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        featuredOnly: z.boolean().optional().default(false),
      }))
      .query(async ({ input }) => {
        if (input.featuredOnly) {
          return await getFeaturedProducts();
        }
        if (input.category) {
          return await getProductsByCategory(input.category);
        }
        return await getAllProducts();
      }),

    getBySlug: publicProcedure
      .input(z.object({
        slug: z.string(),
      }))
      .query(async ({ input }) => {
        return await getProductBySlug(input.slug);
      }),

    checkOwnership: protectedProcedure
      .input(z.object({
        productId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          return false;
        }
        return await userOwnsProduct(ctx.user.id, input.productId);
      }),
  }),

  samples: router({
    recordAccess: protectedProcedure
      .input(z.object({
        productId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await recordSampleAccess({
          userId: ctx.user.id,
          productId: input.productId,
        });
      }),

    getMyAccesses: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await getUserSampleAccesses(ctx.user.id);
      }),
  }),

  userProducts: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await getUserProducts(ctx.user.id);
      }),
  }),

  orders: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await getUserOrders(ctx.user.id);
      }),

    getItems: protectedProcedure
      .input(z.object({
        orderId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await getOrderItems(input.orderId);
      }),
  }),

  checkout: router({
    createSession: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          slug: z.string(),
          quantity: z.number().optional().default(1),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id || !ctx.user?.email) {
          throw new Error("User not authenticated");
        }

        const origin = ctx.req.headers.origin || "https://chavedooraculo.com";

        const checkoutUrl = await createCheckoutSession({
          items: input.items,
          userId: ctx.user.id,
          userEmail: ctx.user.email,
          userName: ctx.user.name || "Cliente",
          origin,
        });

        return { url: checkoutUrl };
      }),
  }),
});

export type AppRouter = typeof appRouter;
