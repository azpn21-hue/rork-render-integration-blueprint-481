import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const verdicts = [
  {
    icon: "❤️",
    title: "Truth Teller",
    description: "Your honesty shines through!",
    trustBonus: 1,
  },
  {
    icon: "💫",
    title: "Genuine Soul",
    description: "Authenticity is your strength!",
    trustBonus: 1,
  },
  {
    icon: "🔥",
    title: "Real One",
    description: "You keep it 100!",
    trustBonus: 1,
  },
  {
    icon: "🪞",
    title: "Crystal Clear",
    description: "Transparent and true!",
    trustBonus: 1,
  },
];

export const finishHonestyCheckProcedure = protectedProcedure
  .input(
    z.object({
      sessionId: z.string(),
      answers: z.record(z.string()),
    })
  )
  .mutation(async ({ input }) => {
    const { sessionId, answers } = input;

    const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];

    console.log(`[PulseChat API] Honesty Check finished for ${sessionId}: ${randomVerdict.title}`);

    return {
      sessionId,
      verdict: randomVerdict,
      trustTokensEarned: randomVerdict.trustBonus,
      endTime: new Date().toISOString(),
    };
  });
