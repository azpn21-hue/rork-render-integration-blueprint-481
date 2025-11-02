import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export const startVideoProcedure = protectedProcedure
  .input(
    z.object({
      sessionId: z.string(),
      participants: z.array(z.string()),
    })
  )
  .mutation(async ({ input }) => {
    const { sessionId, participants } = input;

    console.log(`[PulseChat API] Video call started for session ${sessionId}`);

    return {
      sessionId,
      startTime: new Date().toISOString(),
      participants,
      encrypted: true,
    };
  });
