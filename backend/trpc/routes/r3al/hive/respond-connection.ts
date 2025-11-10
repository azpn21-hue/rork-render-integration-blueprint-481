import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const respondHiveConnectionProcedure = protectedProcedure
  .input(z.object({
    requestId: z.string(),
    action: z.enum(["accept", "decline"]),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id || "anonymous";
    
    console.log(`[Hive] User ${userId} ${input.action}ing connection request ${input.requestId}`);

    const connectionId = input.action === "accept" 
      ? `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : null;

    return {
      success: true,
      requestId: input.requestId,
      action: input.action,
      connectionId,
      status: input.action === "accept" ? "active" : "declined",
      timestamp: new Date().toISOString(),
    };
  });
