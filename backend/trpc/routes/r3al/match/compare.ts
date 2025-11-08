import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const compareUsersProcedure = protectedProcedure
  .input(
    z.object({
      targetId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log("[Match] Comparing users:", ctx.user.id, "and", input.targetId);

    const comparison = {
      matchScore: 0.88,
      compatibilityType: "Flow Resonance",
      sharedTraits: ["Empathy", "Creativity", "Authenticity"],
      complementaryTraits: {
        userA: ["Analytical thinking", "Planning"],
        userB: ["Spontaneity", "Intuition"],
      },
      personalityAlignment: {
        emotional: 0.92,
        intellectual: 0.85,
        values: 0.91,
        energy: 0.78,
      },
      pulseCompatibility: {
        rhythmSync: 0.86,
        emotionalResonance: 0.89,
        communicationStyle: 0.84,
      },
      aiInsight:
        "Your emotional wavelengths align beautifully, creating natural understanding and flow in communication.",
      suggestedActivities: [
        "Start Pulse Chat session",
        "Join shared Circle",
        "Collaborate on QOTD",
      ],
      potentialChallenges: [
        "Different energy levels may need conscious balance",
        "Communication pacing preferences vary slightly",
      ],
      strengthAreas: [
        "Deep empathy creates safe space",
        "Shared creativity sparks innovation",
        "Value alignment builds trust",
      ],
    };

    return {
      success: true,
      comparison,
      comparedAt: new Date().toISOString(),
    };
  });
