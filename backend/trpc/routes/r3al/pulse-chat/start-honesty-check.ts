import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const honestyQuestions = [
  {
    id: "h1",
    text: "How honest are you in your daily life?",
    options: ["Very honest", "Mostly honest", "Sometimes honest", "Rarely honest"],
  },
  {
    id: "h2",
    text: "Do you keep promises you make?",
    options: ["Always", "Usually", "Sometimes", "Rarely"],
  },
  {
    id: "h3",
    text: "How comfortable are you admitting mistakes?",
    options: ["Very comfortable", "Comfortable", "Uncomfortable", "Very uncomfortable"],
  },
  {
    id: "h4",
    text: "Do you admit when you don't know something?",
    options: ["Always", "Usually", "Sometimes", "Never"],
  },
  {
    id: "h5",
    text: "How transparent are you about your intentions?",
    options: ["Very transparent", "Mostly transparent", "Somewhat transparent", "Not transparent"],
  },
];

export const startHonestyCheckProcedure = protectedProcedure
  .input(
    z.object({
      sessionId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { sessionId } = input;

    const shuffled = [...honestyQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 3);

    console.log(`[PulseChat API] Honesty Check started for session ${sessionId}`);

    return {
      sessionId,
      startTime: new Date().toISOString(),
      questions: selectedQuestions,
      currentQuestionIndex: 0,
    };
  });
