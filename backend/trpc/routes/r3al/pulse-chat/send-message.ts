import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export const sendMessageProcedure = protectedProcedure
  .input(
    z.object({
      sessionId: z.string(),
      content: z.string(),
      type: z.enum(["text", "emoji", "file"]).default("text"),
    })
  )
  .mutation(async ({ input }) => {
    const { sessionId, content, type } = input;

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[PulseChat API] Message sent in session ${sessionId}: ${messageId}`);

    return {
      id: messageId,
      sessionId,
      senderId: "user",
      senderName: "You",
      content,
      type,
      timestamp: new Date().toISOString(),
      encrypted: true,
    };
  });
