import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export const startSessionProcedure = protectedProcedure
  .input(
    z.object({
      participantName: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { participantName } = input;

    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const autoDeleteTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    console.log(`[PulseChat API] Creating session ${sessionId} with ${participantName}`);

    return {
      sessionId,
      participants: ["user", participantName],
      startTime: new Date().toISOString(),
      autoDeleteTime,
      encrypted: true,
    };
  });
