import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export const dmGetConversationsProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { userId } = input;

    console.log(`[DM API] Fetching conversations for user: ${userId}`);

    return {
      conversations: [],
      totalUnread: 0,
    };
  });
