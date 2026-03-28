import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getPulseStateProcedure = protectedProcedure
  .input(z.object({
    userId: z.string().optional(),
  }))
  .query(async ({ ctx, input }) => {
    const userId = input.userId || ctx.user?.id || "anonymous";
    
    console.log(`[Pulse] Getting pulse state for user: ${userId}`);

    return {
      userId,
      heartbeat: 60,
      emotionalState: "calm",
      aiSync: true,
      lastUpdate: new Date().toISOString(),
      pulseSignature: generatePulseSignature(userId),
      metrics: {
        coherence: 0.85,
        energy: 0.72,
        resonance: 0.91,
      },
    };
  });

function generatePulseSignature(userId: string): number[] {
  const seed = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const signature: number[] = [];
  
  for (let i = 0; i < 20; i++) {
    const value = Math.sin(seed * (i + 1) * 0.1) * 50 + 60;
    signature.push(Math.round(value));
  }
  
  return signature;
}
