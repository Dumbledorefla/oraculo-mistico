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
