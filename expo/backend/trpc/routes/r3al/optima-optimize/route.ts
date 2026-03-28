import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const optimaOptimizeProcedure = publicProcedure
  .input(
    z.object({
      baseScore: z.number(),
      context: z.object({
        answerCount: z.number(),
        completionTime: z.number().optional(),
        deviceType: z.string().optional(),
      }),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[R3AL] Optima II optimization request:", {
      baseScore: input.baseScore,
      context: input.context,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    let adjustmentFactor = 1.0 as number;

    if (input.context.answerCount >= 10) {
      adjustmentFactor += 0.05;
    }

    if (input.context.completionTime && input.context.completionTime < 300000) {
      adjustmentFactor += 0.02;
    }

    const adjustedScore = Math.min(100, Math.round(input.baseScore * adjustmentFactor));

    return {
      adjustedScore,
      adjustmentFactor: Math.round(adjustmentFactor * 100) / 100,
      optimizationNotes: [
        `Complete questionnaire bonus: +${input.context.answerCount >= 10 ? 5 : 0}%`,
        `Response time factor: +${input.context.completionTime && input.context.completionTime < 300000 ? 2 : 0}%`,
      ],
      timestamp: new Date().toISOString(),
    };
  });
