import { publicProcedure } from "@/backend/trpc/create-context";
import questionDb from "@/schemas/r3al/qotd_questions.json";

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
