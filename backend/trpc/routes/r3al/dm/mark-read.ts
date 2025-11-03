import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export const dmMarkReadProcedure = protectedProcedure
  .input(
    z.object({
      messageId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { messageId } = input;

    console.log(`[DM API] Marking message as read: ${messageId}`);

    return {
      success: true,
      messageId,
      readAt: new Date().toISOString(),
    };
  });
