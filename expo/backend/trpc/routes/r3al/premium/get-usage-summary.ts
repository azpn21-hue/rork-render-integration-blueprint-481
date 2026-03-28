import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getUsageSummaryProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input }) => {
    console.log("[Premium] Getting usage summary for user:", input.userId);

    // Mock implementation - in production, query actual usage data
    const mockUsage = {
      userId: input.userId,
      currentPeriod: {
        start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      chat: {
        used: 127,
        limit: null, // unlimited
      },
      imageGeneration: {
        used: 23,
        limit: null, // unlimited
      },
      aiWriting: {
        sessionsUsed: 15,
        wordsProcessed: 45820,
        limit: null, // unlimited
      },
      tier: "premium" as const,
      features: {
        unrestrictedContent: true,
        writersGuildAccess: true,
        prioritySupport: true,
        tacticalAccess: false,
      },
    };

    return {
      success: true,
      usage: mockUsage,
    };
  });
