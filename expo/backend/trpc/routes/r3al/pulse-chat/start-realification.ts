import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const realificationQuestions = [
  { id: "r1", text: "What's your go-to emoji right now?", category: "emotion" },
  { id: "r2", text: "Beach or mountains?", category: "decision" },
  { id: "r3", text: "Coffee or tea?", category: "decision" },
  { id: "r4", text: "What's your current vibe in one word?", category: "vibe" },
  { id: "r5", text: "Night owl or early bird?", category: "decision" },
  { id: "r6", text: "Pizza or tacos?", category: "decision" },
  { id: "r7", text: "How are you feeling right now?", category: "emotion" },
];

export const startRealificationProcedure = protectedProcedure
  .input(
    z.object({
      sessionId: z.string(),
      participants: z.array(z.string()),
    })
  )
  .mutation(async ({ input }) => {
    const { sessionId, participants } = input;

    const shuffled = [...realificationQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 5);

    console.log(`[PulseChat API] Realification started for session ${sessionId}`);

    return {
      sessionId,
      participants,
      startTime: new Date().toISOString(),
      questions: selectedQuestions,
      currentQuestionIndex: 0,
    };
  });
