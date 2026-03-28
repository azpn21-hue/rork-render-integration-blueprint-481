import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { messageStore } from "./send-message";

export const dmMarkReadProcedure = protectedProcedure
  .input(
    z.object({
      messageId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { messageId } = input;

    console.log(`[DM API] Marking message as read: ${messageId}`);

    for (const [key, messages] of messageStore.entries()) {
      const message = messages.find((m) => m.id === messageId);
      if (message) {
        message.read = true;
        messageStore.set(key, messages);
        console.log(`[DM API] Message ${messageId} marked as read`);
        break;
      }
    }

    return {
      success: true,
      messageId,
      readAt: new Date().toISOString(),
    };
  });
