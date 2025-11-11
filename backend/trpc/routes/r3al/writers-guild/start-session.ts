import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const startWritingSessionProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    projectId: z.string(),
  }))
  .mutation(async ({ input }) => {
    console.log("[Writers Guild] Starting writing session:", input.projectId);

    const mockSession = {
      sessionId: `session_${Date.now()}`,
      projectId: input.projectId,
      userId: input.userId,
      startTime: new Date().toISOString(),
      wordsWritten: 0,
      aiInteractions: 0,
      aiSuggestionsAccepted: 0,
    };

    return {
      success: true,
      session: mockSession,
    };
  });
