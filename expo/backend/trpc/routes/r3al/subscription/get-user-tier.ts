import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getUserTierProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    console.log("[Subscription] Getting tier for user:", input.userId);

    // Mock implementation - replace with actual DB query
    // In production, query user_subscriptions and subscription_tiers tables
    
    const mockSubscription = {
      userId: input.userId,
      tier: {
        tierId: "tier_premium",
        tierName: "premium",
        displayName: "Premium",
        description: "Unlimited chat, images, and Writers Guild access",
        priceMonthly: 14.99,
        priceYearly: 149.99,
        
        // Feature flags
        chatLimit: null, // unlimited
        imageGenerationLimit: null, // unlimited
        aiWritingAccess: true,
        unrestrictedContent: true,
        writersGuildAccess: true,
        tacticalFeatures: false,
        prioritySupport: true,
      },
      subscription: {
        subscriptionId: "sub_001",
        status: "active",
        billingPeriod: "monthly",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        chatUsageThisPeriod: 0,
        imageGenerationUsageThisPeriod: 0,
      }
    };

    return {
      success: true,
      data: mockSubscription,
    };
  });
