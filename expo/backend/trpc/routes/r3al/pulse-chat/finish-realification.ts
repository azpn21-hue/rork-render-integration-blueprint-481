import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const verdicts = [
  {
    icon: "💫",
    title: "Flutter",
    description: "Energy off the charts!",
    trustBonus: 0.1,
  },
  {
    icon: "❤️",
    title: "Heartbeat",
    description: "Strong and steady connection!",
    trustBonus: 0.1,
  },
  {
    icon: "🔥",
    title: "Spark",
    description: "Intense vibes detected!",
    trustBonus: 0.1,
  },
  {
    icon: "🪞",
    title: "Mirror",
    description: "Perfectly in sync!",
    trustBonus: 0.1,
  },
];

export const finishRealificationProcedure = protectedProcedure
  .input(
    z.object({
      sessionId: z.string(),
      answers: z.record(z.string()),
    })
  )
  .mutation(async ({ input }) => {
    const { sessionId, answers } = input;

    const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];

    console.log(`[PulseChat API] Realification finished for ${sessionId}: ${randomVerdict.title}`);

    return {
      sessionId,
      verdict: randomVerdict,
      endTime: new Date().toISOString(),
    };
  });
