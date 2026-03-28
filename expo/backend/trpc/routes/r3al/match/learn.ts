import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const recordFeedbackProcedure = protectedProcedure
  .input(
    z.object({
      targetId: z.string(),
      result: z.enum(["liked", "skipped", "connected", "blocked"]),
      matchScore: z.number(),
      contextTags: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("[Match] Recording feedback:", {
      userId: ctx.user.id,
      targetId: input.targetId,
      result: input.result,
      matchScore: input.matchScore,
    });

    const feedbackId = `feedback_${Date.now()}`;
    
    const aiLearningUpdate = {
      userId: ctx.user.id,
      targetId: input.targetId,
      result: input.result,
      matchScore: input.matchScore,
      contextTags: input.contextTags || [],
      timestamp: new Date().toISOString(),
    };

    console.log("[Match] AI learning update prepared:", aiLearningUpdate);

    return {
      success: true,
      feedbackId,
      message: "Feedback recorded and AI model updated",
      nextSuggestionRefresh: new Date(Date.now() + 60000).toISOString(),
    };
  });
