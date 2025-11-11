import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const checkFeatureAccessProcedure = publicProcedure
  .input(z.object({ 
    userId: z.string(),
    feature: z.enum(['chat', 'image_generation', 'ai_writing', 'unrestricted_content', 'writers_guild', 'tactical'])
  }))
  .query(async ({ input }) => {
    console.log(`[Subscription] Checking ${input.feature} access for user:`, input.userId);

    // Mock implementation - replace with actual DB query
    // In production, check user_subscriptions and usage_logs
    
    // For now, grant access to all features (dev mode)
    const hasAccess = true;
    const usageRemaining = null; // unlimited
    const resetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return {
      success: true,
      hasAccess,
      usageRemaining,
      resetDate,
      tierName: "premium",
    };
  });
