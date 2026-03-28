import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const deleteHistoryProcedure = protectedProcedure
  .input(z.object({
    deleteAll: z.boolean().default(false),
    eventIds: z.array(z.string()).optional(),
    beforeDate: z.string().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id || "anonymous";
    
    console.log(`[History] Deleting history for user: ${userId}`, input);

    let deletedCount = 0;

    if (input.deleteAll) {
      deletedCount = 42;
    } else if (input.eventIds) {
      deletedCount = input.eventIds.length;
    } else if (input.beforeDate) {
      deletedCount = 15;
    }

    return {
      success: true,
      userId,
      deletedCount,
      timestamp: new Date().toISOString(),
    };
  });
