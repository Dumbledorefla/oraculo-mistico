/**
 * Tests for payments router
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/trpc';

// Mock Stripe
vi.mock('./stripe/stripe', () => ({
  createCheckoutSession: vi.fn().mockResolvedValue('https://checkout.stripe.com/test-session-url'),
  createConsultationCheckoutSession: vi.fn().mockResolvedValue('https://checkout.stripe.com/test-consultation-url'),
  createCourseCheckoutSession: vi.fn().mockResolvedValue('https://checkout.stripe.com/test-course-url'),
}));

describe('Payments Router', () => {
  let mockContext: TrpcContext;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    // Create mock context with authenticated user
    mockContext = {
      user: {
        id: 1,
        openId: 'test-open-id',
        projectId: 'test-project',
        name: 'Test User',
        email: 'test@example.com',
      },
      req: {
        headers: {
          origin: 'https://test.com',
        },
      } as any,
      res: {} as any,
    };

    caller = appRouter.createCaller(mockContext);
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session for authenticated user', async () => {
      const result = await caller.payments.createCheckoutSession({
        productName: 'Tarot Completo',
        price: 29.90,
        successUrl: 'https://test.com/success',
        cancelUrl: 'https://test.com/cancel',
      });

      expect(result).toHaveProperty('url');
      expect(result.url).toBe('https://checkout.stripe.com/test-session-url');
    });

    it('should throw error for unauthenticated user', async () => {
      // Create caller with no user
      const unauthCaller = appRouter.createCaller({
        ...mockContext,
        user: null,
      });

      await expect(
        unauthCaller.payments.createCheckoutSession({
          productName: 'Tarot Completo',
          price: 29.90,
          successUrl: 'https://test.com/success',
          cancelUrl: 'https://test.com/cancel',
        })
      ).rejects.toThrow('Please login (10001)');
    });

    it('should handle different product prices', async () => {
      const products = [
        { name: 'Tarot Completo', price: 29.90 },
        { name: 'Numerologia Completa', price: 47.00 },
        { name: 'Mapa Astral Completo', price: 97.00 },
      ];

      for (const product of products) {
        const result = await caller.payments.createCheckoutSession({
          productName: product.name,
          price: product.price,
          successUrl: 'https://test.com/success',
          cancelUrl: 'https://test.com/cancel',
        });

        expect(result).toHaveProperty('url');
        expect(typeof result.url).toBe('string');
      }
    });

    it('should use correct URLs from input', async () => {
      const customUrls = {
        successUrl: 'https://custom.com/checkout/success',
        cancelUrl: 'https://custom.com/checkout/cancel',
      };

      const result = await caller.payments.createCheckoutSession({
        productName: 'Test Product',
        price: 50.00,
        ...customUrls,
      });

      expect(result).toHaveProperty('url');
    });

    it('should handle user with null email gracefully', async () => {
      const callerWithNullEmail = appRouter.createCaller({
        ...mockContext,
        user: {
          ...mockContext.user!,
          email: null,
        },
      });

      const result = await callerWithNullEmail.payments.createCheckoutSession({
        productName: 'Test Product',
        price: 50.00,
        successUrl: 'https://test.com/success',
        cancelUrl: 'https://test.com/cancel',
      });

      expect(result).toHaveProperty('url');
    });

    it('should handle user with null name gracefully', async () => {
      const callerWithNullName = appRouter.createCaller({
        ...mockContext,
        user: {
          ...mockContext.user!,
          name: null,
        },
      });

      const result = await callerWithNullName.payments.createCheckoutSession({
        productName: 'Test Product',
        price: 50.00,
        successUrl: 'https://test.com/success',
        cancelUrl: 'https://test.com/cancel',
      });

      expect(result).toHaveProperty('url');
    });
  });
});
