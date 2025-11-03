import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export const dmGetMessagesProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string(),
      otherUserId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { userId, otherUserId } = input;

    console.log(`[DM API] Fetching messages between ${userId} and ${otherUserId}`);

    return {
      messages: [],
    };
  });
