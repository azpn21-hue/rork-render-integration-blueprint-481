import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const updatePulseStateProcedure = protectedProcedure
  .input(z.object({
    emotionalState: z.enum(["calm", "excited", "anxious", "focused", "creative", "tired"]),
    heartbeat: z.number().min(40).max(200).optional(),
    interactionData: z.object({
      type: z.enum(["message", "connection", "reflection", "activity"]),
      intensity: z.number().min(0).max(1),
      timestamp: z.string(),
    }).optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id || "anonymous";
    
    console.log(`[Pulse] Updating pulse state for user: ${userId}`, input);

    const aiResponse = await generateAIFeedback(input.emotionalState, input.interactionData);

    return {
      success: true,
      userId,
      updatedState: {
        emotionalState: input.emotionalState,
        heartbeat: input.heartbeat || 60,
        aiSync: true,
        lastUpdate: new Date().toISOString(),
      },
      aiFeedback: aiResponse,
      metrics: {
        coherence: Math.random() * 0.3 + 0.7,
        energy: Math.random() * 0.3 + 0.6,
        resonance: Math.random() * 0.2 + 0.8,
      },
    };
  });

async function generateAIFeedback(
  state: string,
  interaction?: { type: string; intensity: number; timestamp: string }
): Promise<string> {
  const feedbackMap: Record<string, string[]> = {
    calm: [
      "You're centered and aligned",
      "Your energy flows smoothly",
      "Peace resonates through your pulse",
    ],
    excited: [
      "Your energy is vibrant and strong",
      "Excitement amplifies your presence",
      "Your pulse radiates enthusiasm",
    ],
    anxious: [
      "Take a breath, you're not alone",
      "Your pulse seeks balance",
      "Ground yourself in the present",
    ],
    focused: [
      "Sharp clarity in your presence",
      "Your pulse is laser-aligned",
      "Focused energy drives you forward",
    ],
    creative: [
      "Innovation flows through you",
      "Your pulse sparks with new ideas",
      "Creative energy radiates outward",
    ],
    tired: [
      "Rest is part of your rhythm",
      "Your pulse calls for restoration",
      "Gentle energy, gentle pace",
    ],
  };

  const messages = feedbackMap[state] || feedbackMap.calm;
  return messages[Math.floor(Math.random() * messages.length)];
}
