import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const sharePulseProcedure = protectedProcedure
  .input(z.object({
    targetType: z.enum(["hive", "profile", "feed"]),
    message: z.string().optional(),
    pulseSnapshot: z.object({
      emotionalState: z.string(),
      heartbeat: z.number(),
      signature: z.array(z.number()),
    }),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id || "anonymous";
    
    console.log(`[Pulse] User ${userId} sharing pulse to ${input.targetType}`);

    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      shareId,
      sharedTo: input.targetType,
      timestamp: new Date().toISOString(),
      visibility: "public",
      pulseData: {
        ...input.pulseSnapshot,
        userId,
        message: input.message,
      },
    };
  });
