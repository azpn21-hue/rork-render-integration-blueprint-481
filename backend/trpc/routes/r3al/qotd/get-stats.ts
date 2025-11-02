import { publicProcedure } from "@/backend/trpc/create-context";

interface UserQotdState {
  lastAnswered: string;
  currentStreak: number;
  longestStreak: number;
  totalAnswers: number;
  answeredQuestions: string[];
  totalTokensEarned: number;
}

const userStates = new Map<string, UserQotdState>();

export const getStatsProcedure = publicProcedure.query(({ ctx }) => {
  const userId = ctx.userId || "anonymous";

  const state = userStates.get(userId);
  if (!state) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalAnswers: 0,
      totalTokensEarned: 0,
      lastAnswered: null,
      nextRewardAt: null,
    };
  }

  const nextRewardStreak =
    state.currentStreak < 7 ? 7 : state.currentStreak < 30 ? 30 : 90;

  return {
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    totalAnswers: state.totalAnswers,
    totalTokensEarned: state.totalTokensEarned,
    lastAnswered: state.lastAnswered || null,
    nextRewardAt: nextRewardStreak,
  };
});
