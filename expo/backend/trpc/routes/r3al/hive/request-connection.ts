import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const requestHiveConnectionProcedure = protectedProcedure
  .input(z.object({
    targetUserId: z.string(),
    message: z.string().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id || "anonymous";
    
    console.log(`[Hive] User ${userId} requesting connection with ${input.targetUserId}`);

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      requestId,
      fromUserId: userId,
      toUserId: input.targetUserId,
      status: "pending",
      message: input.message,
      createdAt: new Date().toISOString(),
    };
  });
