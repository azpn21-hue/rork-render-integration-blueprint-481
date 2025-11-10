import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const logHistoryEventProcedure = protectedProcedure
  .input(z.object({
    eventType: z.enum([
      "pulse_update",
      "hive_connection",
      "qotd_answer",
      "nft_mint",
      "chat_session",
      "verification_step",
      "profile_update",
      "feed_interaction",
    ]),
    metadata: z.record(z.any()).optional(),
    duration: z.number().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id || "anonymous";
    
    console.log(`[History] Logging event for user ${userId}: ${input.eventType}`);

    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      eventId,
      userId,
      eventType: input.eventType,
      timestamp: new Date().toISOString(),
      metadata: input.metadata || {},
      duration: input.duration,
    };
  });
