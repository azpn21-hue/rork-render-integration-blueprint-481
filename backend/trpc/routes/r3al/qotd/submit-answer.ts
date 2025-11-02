import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

const questionDb = {
  meta: {
    token_rewards: {
      daily_answer: 5,
      streak_7_days: 10,
      streak_30_days: 25,
      streak_90_days: 50
    }
  }
};

interface UserQotdState {
  lastAnswered: string;
  currentStreak: number;
  longestStreak: number;
  totalAnswers: number;
  answeredQuestions: string[];
  totalTokensEarned: number;
}

interface EncryptedAnswer {
  questionId: string;
  timestamp: string;
  encrypted: boolean;
  hash: string;
}

const userStates = new Map<string, UserQotdState>();
const answerVault = new Map<string, EncryptedAnswer[]>();

function calculateDayDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function hashAnswer(answer: string): string {
  let hash = 0;
  for (let i = 0; i < answer.length; i++) {
    const char = answer.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export const submitAnswerProcedure = publicProcedure
  .input(
    z.object({
      questionId: z.string(),
      answer: z.string().min(10, "Answer must be at least 10 characters"),
    })
  )
  .mutation(({ ctx, input }) => {
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
        totalTokensEarned: 0,
      };
      userStates.set(userId, state);
    }

    const hasAnsweredToday = state.lastAnswered === today;
    if (hasAnsweredToday) {
      return {
        success: false,
        message: "You have already answered today's question",
        tokensEarned: 0,
      };
    }

    const encryptedAnswer: EncryptedAnswer = {
      questionId: input.questionId,
      timestamp: new Date().toISOString(),
      encrypted: true,
      hash: hashAnswer(input.answer),
    };

    let vault = answerVault.get(userId);
    if (!vault) {
      vault = [];
      answerVault.set(userId, vault);
    }
    vault.push(encryptedAnswer);

    state.totalAnswers += 1;
    state.answeredQuestions.push(input.questionId);

    const daysSinceLastAnswer = state.lastAnswered
      ? calculateDayDifference(state.lastAnswered, today)
      : 999;

    if (daysSinceLastAnswer === 1) {
      state.currentStreak += 1;
    } else if (daysSinceLastAnswer > 1) {
      state.currentStreak = 1;
    }

    if (state.currentStreak > state.longestStreak) {
      state.longestStreak = state.currentStreak;
    }

    state.lastAnswered = today;

    let tokensEarned = questionDb.meta.token_rewards.daily_answer;
    let bonusMessage = "";

    if (state.currentStreak === 7) {
      tokensEarned += questionDb.meta.token_rewards.streak_7_days;
      bonusMessage = "🔥 7-day streak bonus!";
    } else if (state.currentStreak === 30) {
      tokensEarned += questionDb.meta.token_rewards.streak_30_days;
      bonusMessage = "🔥 30-day streak bonus!";
    } else if (state.currentStreak === 90) {
      tokensEarned += questionDb.meta.token_rewards.streak_90_days;
      bonusMessage = "🔥 90-day streak bonus!";
    }

    state.totalTokensEarned += tokensEarned;

    console.log(
      `✅ [QotD] User ${userId} answered question ${input.questionId}. Tokens: ${tokensEarned}, Streak: ${state.currentStreak}`
    );

    return {
      success: true,
      message: bonusMessage || "Thank you for your reflection",
      tokensEarned,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      totalAnswers: state.totalAnswers,
      totalTokensEarned: state.totalTokensEarned,
    };
  });
