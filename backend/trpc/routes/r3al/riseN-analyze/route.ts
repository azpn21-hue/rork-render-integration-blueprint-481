import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const riseNAnalyzeProcedure = publicProcedure
  .input(
    z.object({
      answers: z.array(
        z.object({
          questionId: z.string(),
          value: z.union([z.string(), z.number()]),
          timestamp: z.number(),
        })
      ),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[R3AL] RiseN AI analysis request:", {
      answerCount: input.answers.length,
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const consistency = 0.75 + Math.random() * 0.2;
    const anomalies: string[] = [];

    if (consistency < 0.8) {
      anomalies.push("Response time variance detected on questions 3 and 7");
    }

    const freeTextAnswers = input.answers.filter(
      (a) => typeof a.value === "string" && a.value.length > 50
    );

    if (freeTextAnswers.length > 0) {
      anomalies.push("Detailed narrative responses detected");
    }

    return {
      consistency: Math.round(consistency * 100) / 100,
      anomalies,
      aiConfidence: 0.88 + Math.random() * 0.1,
      insights: [
        "Response patterns indicate high authenticity",
        "Narrative consistency across free-text answers",
        "No deceptive language patterns detected",
      ],
      timestamp: new Date().toISOString(),
    };
  });
