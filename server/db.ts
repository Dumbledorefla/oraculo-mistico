import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  tarotReadings, InsertTarotReading,
  products, InsertProduct,
  sampleAccesses, InsertSampleAccess,
  orders, InsertOrder,
  orderItems, InsertOrderItem,
  userProducts, InsertUserProduct
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER QUERIES ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== TAROT READING QUERIES ====================

export async function saveTarotReading(reading: InsertTarotReading) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save tarot reading: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(tarotReadings).values(reading);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save tarot reading:", error);
    throw error;
  }
}

export async function getUserTarotReadings(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get tarot readings: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(tarotReadings)
      .where(eq(tarotReadings.userId, userId))
      .orderBy(desc(tarotReadings.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get tarot readings:", error);
    return [];
  }
}

export async function getTarotReadingById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get tarot reading: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(tarotReadings)
      .where(eq(tarotReadings.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get tarot reading:", error);
    return undefined;
  }
}

// ==================== PRODUCT QUERIES ====================

export async function getAllProducts(activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }

  try {
    if (activeOnly) {
      return await db.select().from(products).where(eq(products.isActive, true));
    }
    return await db.select().from(products);
  } catch (error) {
    console.error("[Database] Failed to get products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get product:", error);
    return undefined;
  }
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get product:", error);
    return undefined;
  }
}

export async function getProductsByCategory(category: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }

  try {
    return await db.select().from(products).where(
      and(
        eq(products.category, category as any),
        eq(products.isActive, true)
      )
    );
  } catch (error) {
    console.error("[Database] Failed to get products by category:", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get featured products: database not available");
    return [];
  }

  try {
    return await db.select().from(products).where(
      and(
        eq(products.isFeatured, true),
        eq(products.isActive, true)
      )
    );
  } catch (error) {
    console.error("[Database] Failed to get featured products:", error);
    return [];
  }
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create product: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(products).values(product);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create product:", error);
    throw error;
  }
}

// ==================== SAMPLE ACCESS QUERIES ====================

export async function recordSampleAccess(access: InsertSampleAccess) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record sample access: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(sampleAccesses).values(access);
    return result;
  } catch (error) {
    console.error("[Database] Failed to record sample access:", error);
    throw error;
  }
}

export async function getUserSampleAccesses(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get sample accesses: database not available");
    return [];
  }

  try {
    return await db.select().from(sampleAccesses).where(eq(sampleAccesses.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get sample accesses:", error);
    return [];
  }
}

// ==================== ORDER QUERIES ====================

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create order: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(orders).values(order);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get order:", error);
    return undefined;
  }
}

export async function getOrderByStripeSessionId(sessionId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(orders).where(eq(orders.stripeSessionId, sessionId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get order by session:", error);
    return undefined;
  }
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user orders: database not available");
    return [];
  }

  try {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get user orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: number, status: "pending" | "paid" | "cancelled" | "refunded", paidAt?: Date) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update order: database not available");
    return undefined;
  }

  try {
    const updateData: any = { status };
    if (paidAt) {
      updateData.paidAt = paidAt;
    }
    return await db.update(orders).set(updateData).where(eq(orders.id, orderId));
  } catch (error) {
    console.error("[Database] Failed to update order:", error);
    throw error;
  }
}

// ==================== ORDER ITEMS QUERIES ====================

export async function createOrderItem(item: InsertOrderItem) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create order item: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(orderItems).values(item);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create order item:", error);
    throw error;
  }
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order items: database not available");
    return [];
  }

  try {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  } catch (error) {
    console.error("[Database] Failed to get order items:", error);
    return [];
  }
}

// ==================== USER PRODUCTS QUERIES ====================

export async function grantUserProduct(userProduct: InsertUserProduct) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot grant user product: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(userProducts).values(userProduct);
    return result;
  } catch (error) {
    console.error("[Database] Failed to grant user product:", error);
    throw error;
  }
}

export async function getUserProducts(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user products: database not available");
    return [];
  }

  try {
    return await db.select().from(userProducts).where(eq(userProducts.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user products:", error);
    return [];
  }
}

export async function userOwnsProduct(userId: number, productId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot check product ownership: database not available");
    return false;
  }

  try {
    const result = await db.select().from(userProducts).where(
      and(
        eq(userProducts.userId, userId),
        eq(userProducts.productId, productId)
      )
    ).limit(1);
    return result.length > 0;
  } catch (error) {
    console.error("[Database] Failed to check product ownership:", error);
    return false;
  }
}


// ==================== TAROMANTE QUERIES ====================

import { 
  taromantes, InsertTaromante,
  taromanteAvailability, InsertTaromanteAvailability,
  taromanteServices, InsertTaromanteService,
  consultations, InsertConsultation,
  consultationReviews, InsertConsultationReview
} from "../drizzle/schema";

export async function getAllTaromantes(activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get taromantes: database not available");
    return [];
  }

  try {
    if (activeOnly) {
      return await db.select().from(taromantes).where(eq(taromantes.isActive, true));
    }
    return await db.select().from(taromantes);
  } catch (error) {
    console.error("[Database] Failed to get taromantes:", error);
    return [];
  }
}

export async function getFeaturedTaromantes() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get featured taromantes: database not available");
    return [];
  }

  try {
    return await db.select().from(taromantes).where(
      and(
        eq(taromantes.isFeatured, true),
        eq(taromantes.isActive, true)
      )
    );
  } catch (error) {
    console.error("[Database] Failed to get featured taromantes:", error);
    return [];
  }
}

export async function getTaromanteBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get taromante: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(taromantes).where(eq(taromantes.slug, slug)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get taromante:", error);
    return undefined;
  }
}

export async function getTaromanteById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get taromante: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(taromantes).where(eq(taromantes.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get taromante:", error);
    return undefined;
  }
}

export async function getTaromanteAvailability(taromanteId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get taromante availability: database not available");
    return [];
  }

  try {
    return await db.select().from(taromanteAvailability).where(
      and(
        eq(taromanteAvailability.taromanteId, taromanteId),
        eq(taromanteAvailability.isActive, true)
      )
    );
  } catch (error) {
    console.error("[Database] Failed to get taromante availability:", error);
    return [];
  }
}

export async function getTaromanteServices(taromanteId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get taromante services: database not available");
    return [];
  }

  try {
    return await db.select().from(taromanteServices).where(
      and(
        eq(taromanteServices.taromanteId, taromanteId),
        eq(taromanteServices.isActive, true)
      )
    );
  } catch (error) {
    console.error("[Database] Failed to get taromante services:", error);
    return [];
  }
}

export async function getTaromanteReviews(taromanteId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get taromante reviews: database not available");
    return [];
  }

  try {
    return await db.select().from(consultationReviews).where(
      and(
        eq(consultationReviews.taromanteId, taromanteId),
        eq(consultationReviews.isPublic, true)
      )
    ).orderBy(desc(consultationReviews.createdAt)).limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get taromante reviews:", error);
    return [];
  }
}

// ==================== CONSULTATION QUERIES ====================

export async function createConsultation(consultation: InsertConsultation) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create consultation: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(consultations).values(consultation);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create consultation:", error);
    throw error;
  }
}

export async function getConsultationById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get consultation: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(consultations).where(eq(consultations.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get consultation:", error);
    return undefined;
  }
}

export async function getUserConsultations(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user consultations: database not available");
    return [];
  }

  try {
    return await db.select().from(consultations).where(eq(consultations.userId, userId)).orderBy(desc(consultations.scheduledAt));
  } catch (error) {
    console.error("[Database] Failed to get user consultations:", error);
    return [];
  }
}

export async function getTaromanteConsultations(taromanteId: number, status?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get taromante consultations: database not available");
    return [];
  }

  try {
    if (status) {
      return await db.select().from(consultations).where(
        and(
          eq(consultations.taromanteId, taromanteId),
          eq(consultations.status, status as any)
        )
      ).orderBy(desc(consultations.scheduledAt));
    }
    return await db.select().from(consultations).where(eq(consultations.taromanteId, taromanteId)).orderBy(desc(consultations.scheduledAt));
  } catch (error) {
    console.error("[Database] Failed to get taromante consultations:", error);
    return [];
  }
}

export async function updateConsultationStatus(consultationId: number, status: string, paidAt?: Date) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update consultation: database not available");
    return undefined;
  }

  try {
    const updateData: any = { status };
    if (paidAt) {
      updateData.paidAt = paidAt;
    }
    return await db.update(consultations).set(updateData).where(eq(consultations.id, consultationId));
  } catch (error) {
    console.error("[Database] Failed to update consultation:", error);
    throw error;
  }
}

export async function getConsultationByStripeSessionId(sessionId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get consultation: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(consultations).where(eq(consultations.stripeSessionId, sessionId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get consultation by session:", error);
    return undefined;
  }
}

export async function getTaromanteBookedSlots(taromanteId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get booked slots: database not available");
    return [];
  }

  try {
    return await db.select().from(consultations).where(
      and(
        eq(consultations.taromanteId, taromanteId),
        sql`${consultations.scheduledAt} >= ${startDate}`,
        sql`${consultations.scheduledAt} <= ${endDate}`,
        sql`${consultations.status} NOT IN ('cancelled')`
      )
    );
  } catch (error) {
    console.error("[Database] Failed to get booked slots:", error);
    return [];
  }
}

// ==================== REVIEW QUERIES ====================

export async function createConsultationReview(review: InsertConsultationReview) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create review: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(consultationReviews).values(review);
    
    // Update taromante rating
    const reviews = await getTaromanteReviews(review.taromanteId, 1000);
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await db.update(taromantes).set({
        rating: avgRating.toFixed(1),
        totalReviews: reviews.length,
      }).where(eq(taromantes.id, review.taromanteId));
    }
    
    return result;
  } catch (error) {
    console.error("[Database] Failed to create review:", error);
    throw error;
  }
}
