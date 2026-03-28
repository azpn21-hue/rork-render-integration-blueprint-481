import { publicProcedure } from "@/backend/trpc/create-context";

const questionDb = {
  meta: {
    version: "1.0.0",
    total_questions: 100,
    categories: ["ethics", "emotion", "decision", "professional", "relationship"],
    token_rewards: {
      daily_answer: 5,
      streak_7_days: 10,
      streak_30_days: 25,
      streak_90_days: 50
    }
  },
  questions: {
    ethics: [
      { id: "eth_001", prompt: "If you witnessed someone cheating on an important exam, would you report it? Why or why not?", weight: "medium" },
      { id: "eth_002", prompt: "You find $500 in cash with no identification. What do you do and why?", weight: "high" },
      { id: "eth_003", prompt: "A close friend admits to lying on their resume to get a job. How do you respond?", weight: "medium" }
    ],
    emotion: [
      { id: "emo_001", prompt: "What emotion do you struggle to express, and why do you think that is?", weight: "medium" },
      { id: "emo_002", prompt: "Describe a moment when you felt completely understood by someone.", weight: "low" },
      { id: "emo_003", prompt: "What makes you feel most vulnerable, and how do you protect yourself from it?", weight: "high" }
    ],
    decision: [
      { id: "dec_001", prompt: "What's the most difficult decision you've ever had to make?", weight: "high" },
      { id: "dec_002", prompt: "When making big decisions, do you trust your gut or logic more?", weight: "medium" },
      { id: "dec_003", prompt: "Describe a choice you made that changed the course of your life.", weight: "high" }
    ],
    professional: [
      { id: "pro_001", prompt: "What motivates you more at work: recognition or financial reward?", weight: "medium" },
      { id: "pro_002", prompt: "Describe a time when you failed professionally. What did you learn?", weight: "high" },
      { id: "pro_003", prompt: "Would you accept a higher-paying job you'd hate, or stay at a lower-paying job you love?", weight: "high" }
    ],
    relationship: [
      { id: "rel_001", prompt: "What's the most important quality you look for in a close friend?", weight: "low" },
      { id: "rel_002", prompt: "Describe a relationship that taught you the most about yourself.", weight: "high" },
      { id: "rel_003", prompt: "How do you handle conflict with someone you care about?", weight: "medium" }
    ]
  }
};

interface UserQotdState {
  lastAnswered: string;
  currentStreak: number;
  longestStreak: number;
  totalAnswers: number;
  answeredQuestions: string[];
}

const userStates = new Map<string, UserQotdState>();

export const getDailyQuestionProcedure = publicProcedure.query(({ ctx }) => {
  const userId = ctx.userId || "anonymous";
  const today = new Date().toISOString().split("T")[0];

  let state = userStates.get(userId);
  if (!state) {
    state = {
      lastAnswered: "",
      currentStreak: 0,
      longestStreak: 0,
      totalAnswers: 0,
      answeredQuestions: [],
    };
    userStates.set(userId, state);
  }

  const allQuestions = Object.values(questionDb.questions).flat();
  const availableQuestions = allQuestions.filter(
    (q) => !state!.answeredQuestions.includes(q.id)
  );

  if (availableQuestions.length === 0) {
    state.answeredQuestions = [];
  }

  const questionsToChooseFrom =
    availableQuestions.length > 0 ? availableQuestions : allQuestions;
  const seed = new Date().getDate() + new Date().getMonth() * 31;
  const dailyIndex = seed % questionsToChooseFrom.length;
  const question = questionsToChooseFrom[dailyIndex];

  const hasAnsweredToday = state.lastAnswered === today;

  return {
    question,
    meta: {
      hasAnsweredToday,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      totalAnswers: state.totalAnswers,
      rewardAvailable: !hasAnsweredToday ? questionDb.meta.token_rewards.daily_answer : 0,
    },
  };
});
