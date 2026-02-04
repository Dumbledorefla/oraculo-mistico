import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { saveTarotReading, getUserTarotReadings } from "./db";

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
});

export type AppRouter = typeof appRouter;
