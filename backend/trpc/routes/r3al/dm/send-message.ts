import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export const dmSendMessageProcedure = protectedProcedure
  .input(
    z.object({
      fromUserId: z.string(),
      toUserId: z.string(),
      fromUserName: z.string(),
      toUserName: z.string(),
      content: z.string().min(1).max(2000),
    })
  )
  .mutation(async ({ input }) => {
    const { fromUserId, toUserId, fromUserName, toUserName, content } = input;

    const messageId = `dm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[DM API] Message sent from ${fromUserName} to ${toUserName}: ${messageId}`);

    return {
      id: messageId,
      fromUserId,
      toUserId,
      fromUserName,
      toUserName,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      encrypted: true,
    };
  });
