import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { getMessagesForConversation } from "./send-message";

export const dmGetMessagesProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string(),
      otherUserId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { userId, otherUserId } = input;

    const messages = getMessagesForConversation(userId, otherUserId);

    console.log(`[DM API] Fetching messages between ${userId} and ${otherUserId}: ${messages.length} found`);

    return {
      success: true,
      messages,
    };
  });
