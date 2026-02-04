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
  getOrderItems,
  getAllTaromantes,
  getFeaturedTaromantes,
  getTaromanteBySlug,
  getTaromanteById,
  getTaromanteAvailability,
  getTaromanteServices,
  getTaromanteReviews,
  createConsultation,
  getUserConsultations,
  getTaromanteConsultations,
  getTaromanteBookedSlots,
  getConsultationById,
  updateConsultationStatus,
  createConsultationReview,
  getTaromanteByUserId,
  getAllCourses,
  getFeaturedCourses,
  getCourseBySlug,
  getCourseById,
  getCourseModules,
  getModuleLessons,
  getCourseLessons,
  getLessonById,
  enrollUserInCourse,
  getUserEnrollments,
  getUserEnrollment,
  updateLessonProgress,
  getUserLessonProgress
} from "./db";
import { createCheckoutSession, createConsultationCheckoutSession } from "./stripe/stripe";

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

  // ==================== TAROMANTES ====================
  
  taromantes: router({
    list: publicProcedure
      .input(z.object({
        featuredOnly: z.boolean().optional().default(false),
      }))
      .query(async ({ input }) => {
        if (input.featuredOnly) {
          return await getFeaturedTaromantes();
        }
        return await getAllTaromantes();
      }),

    getBySlug: publicProcedure
      .input(z.object({
        slug: z.string(),
      }))
      .query(async ({ input }) => {
        return await getTaromanteBySlug(input.slug);
      }),

    getById: publicProcedure
      .input(z.object({
        id: z.number(),
      }))
      .query(async ({ input }) => {
        return await getTaromanteById(input.id);
      }),

    getAvailability: publicProcedure
      .input(z.object({
        taromanteId: z.number(),
      }))
      .query(async ({ input }) => {
        return await getTaromanteAvailability(input.taromanteId);
      }),

    getServices: publicProcedure
      .input(z.object({
        taromanteId: z.number(),
      }))
      .query(async ({ input }) => {
        return await getTaromanteServices(input.taromanteId);
      }),

    getReviews: publicProcedure
      .input(z.object({
        taromanteId: z.number(),
        limit: z.number().optional().default(10),
      }))
      .query(async ({ input }) => {
        return await getTaromanteReviews(input.taromanteId, input.limit);
      }),

    getBookedSlots: publicProcedure
      .input(z.object({
        taromanteId: z.number(),
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ input }) => {
        const slots = await getTaromanteBookedSlots(
          input.taromanteId,
          new Date(input.startDate),
          new Date(input.endDate)
        );
        // Return only the scheduled times, not full consultation details
        return slots.map(s => ({
          scheduledAt: s.scheduledAt,
          duration: s.duration,
        }));
      }),

    getByUserId: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await getTaromanteByUserId(ctx.user.id);
      }),

    getConsultations: protectedProcedure
      .input(z.object({
        taromanteId: z.number(),
      }))
      .query(async ({ input }) => {
        return await getTaromanteConsultations(input.taromanteId);
      }),
  }),

  // ==================== CONSULTATIONS ====================

  consultations: router({
    create: protectedProcedure
      .input(z.object({
        taromanteId: z.number(),
        serviceId: z.number().optional(),
        scheduledAt: z.string(),
        duration: z.number().default(30),
        consultationType: z.enum(["video", "chat", "phone"]).default("video"),
        topic: z.string().optional(),
        price: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }

        const result = await createConsultation({
          userId: ctx.user.id,
          taromanteId: input.taromanteId,
          scheduledAt: new Date(input.scheduledAt),
          duration: input.duration,
          consultationType: input.consultationType,
          topic: input.topic,
          price: input.price,
          status: "pending",
        });

        return result;
      }),

    createWithPayment: protectedProcedure
      .input(z.object({
        taromanteId: z.number(),
        taromanteSlug: z.string(),
        taromanteName: z.string(),
        serviceName: z.string(),
        scheduledAt: z.string(),
        duration: z.number().default(30),
        consultationType: z.enum(["video", "chat", "phone"]).default("video"),
        topic: z.string().optional(),
        price: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id || !ctx.user?.email) {
          throw new Error("User not authenticated");
        }

        const origin = ctx.req.headers.origin || "https://chavedooraculo.com";

        const checkoutUrl = await createConsultationCheckoutSession({
          taromanteId: input.taromanteId,
          taromanteSlug: input.taromanteSlug,
          taromanteName: input.taromanteName,
          serviceName: input.serviceName,
          scheduledAt: input.scheduledAt,
          duration: input.duration,
          consultationType: input.consultationType,
          topic: input.topic,
          price: input.price,
          userId: ctx.user.id,
          userEmail: ctx.user.email,
          userName: ctx.user.name || "Cliente",
          origin,
        });

        return { url: checkoutUrl };
      }),

    getMyConsultations: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await getUserConsultations(ctx.user.id);
      }),

    getById: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        const consultation = await getConsultationById(input.id);
        // Only return if user is the client or the taromante
        if (consultation && consultation.userId === ctx.user.id) {
          return consultation;
        }
        return null;
      }),

    cancel: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        const consultation = await getConsultationById(input.id);
        if (!consultation || consultation.userId !== ctx.user.id) {
          throw new Error("Consultation not found");
        }
        return await updateConsultationStatus(input.id, "cancelled");
      }),

    addReview: protectedProcedure
      .input(z.object({
        consultationId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        const consultation = await getConsultationById(input.consultationId);
        if (!consultation || consultation.userId !== ctx.user.id) {
          throw new Error("Consultation not found");
        }
        if (consultation.status !== "completed") {
          throw new Error("Can only review completed consultations");
        }
        return await createConsultationReview({
          consultationId: input.consultationId,
          userId: ctx.user.id,
          taromanteId: consultation.taromanteId,
          rating: input.rating,
          comment: input.comment,
        });
      }),
  }),

  // ==================== TAROMANTE PANEL ====================

  taromantePanel: router({
    getMyConsultations: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        // For now, we'll use a simple check - in production, you'd verify the user is a taromante
        // This would require linking the taromante record to the user
        return await getTaromanteConsultations(ctx.user.id, input.status);
      }),

    updateConsultationStatus: protectedProcedure
      .input(z.object({
        consultationId: z.number(),
        status: z.enum(["confirmed", "completed", "cancelled", "no_show"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await updateConsultationStatus(input.consultationId, input.status);
      }),
  }),

  // ==================== COURSES ====================

  courses: router({
    list: publicProcedure
      .input(z.object({
        featuredOnly: z.boolean().optional().default(false),
        category: z.string().optional(),
      }))
      .query(async ({ input }) => {
        if (input.featuredOnly) {
          return await getFeaturedCourses();
        }
        const allCourses = await getAllCourses();
        if (input.category) {
          return allCourses.filter(c => c.category === input.category);
        }
        return allCourses;
      }),

    getBySlug: publicProcedure
      .input(z.object({
        slug: z.string(),
      }))
      .query(async ({ input }) => {
        return await getCourseBySlug(input.slug);
      }),

    getById: publicProcedure
      .input(z.object({
        id: z.number(),
      }))
      .query(async ({ input }) => {
        return await getCourseById(input.id);
      }),

    getModules: publicProcedure
      .input(z.object({
        courseId: z.number(),
      }))
      .query(async ({ input }) => {
        return await getCourseModules(input.courseId);
      }),

    getLessons: publicProcedure
      .input(z.object({
        moduleId: z.number(),
      }))
      .query(async ({ input }) => {
        return await getModuleLessons(input.moduleId);
      }),

    getLesson: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        const lesson = await getLessonById(input.lessonId);
        if (!lesson) return null;
        
        // Check if user has access (enrolled or free lesson)
        if (!lesson.isFree) {
          const enrollment = await getUserEnrollment(ctx.user.id, lesson.courseId);
          if (!enrollment) {
            return { ...lesson, textContent: null, videoUrl: null, locked: true };
          }
        }
        return { ...lesson, locked: false };
      }),

    enroll: protectedProcedure
      .input(z.object({
        courseId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        
        // Check if already enrolled
        const existing = await getUserEnrollment(ctx.user.id, input.courseId);
        if (existing) {
          return existing;
        }

        // Check if course is free
        const course = await getCourseById(input.courseId);
        if (!course) {
          throw new Error("Course not found");
        }
        if (!course.isFree) {
          throw new Error("This course requires payment");
        }

        return await enrollUserInCourse({
          userId: ctx.user.id,
          courseId: input.courseId,
          status: "active",
        });
      }),

    getMyEnrollments: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await getUserEnrollments(ctx.user.id);
      }),

    getProgress: protectedProcedure
      .input(z.object({
        courseId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await getUserLessonProgress(ctx.user.id, input.courseId);
      }),

    updateProgress: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        courseId: z.number(),
        isCompleted: z.boolean().default(false),
        watchedSeconds: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) {
          throw new Error("User not authenticated");
        }
        return await updateLessonProgress({
          userId: ctx.user.id,
          lessonId: input.lessonId,
          courseId: input.courseId,
          isCompleted: input.isCompleted,
          watchedSeconds: input.watchedSeconds,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
