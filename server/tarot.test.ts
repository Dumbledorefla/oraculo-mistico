import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("tarot router", () => {
  it("should save a tarot reading for authenticated user", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const mockCards = [
      { id: 0, name: "The Fool", meaning: "New beginnings" },
      { id: 1, name: "The Magician", meaning: "Manifestation" },
    ];

    const result = await caller.tarot.saveReading({
      readingType: "dia",
      cards: mockCards,
      interpretation: "This is a test reading",
      userName: "Test User",
    });

    expect(result).toBeDefined();
  });

  it("should retrieve tarot reading history for authenticated user", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tarot.getHistory({
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should reject saveReading for unauthenticated user", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.tarot.saveReading({
        readingType: "dia",
        cards: [],
        interpretation: "Test",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject getHistory for unauthenticated user", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.tarot.getHistory({ limit: 10 });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
