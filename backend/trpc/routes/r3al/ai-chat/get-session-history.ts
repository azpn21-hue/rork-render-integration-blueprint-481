import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getSessionHistoryProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    sessionId: z.string(),
    limit: z.number().default(50),
  }))
  .query(async ({ input }) => {
    console.log("[AI Chat] Getting session history:", input.sessionId);

    // Mock implementation - replace with actual DB query
    const mockMessages = [
      {
        messageId: "msg_001",
        role: "user" as const,
        content: "Help me develop a character for my novel.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        messageId: "msg_002",
        role: "assistant" as const,
        content: "I'd be happy to help! Let's start with the basics. What genre is your novel?",
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
    ];

    return {
      success: true,
      messages: mockMessages,
      hasMore: false,
    };
  });
