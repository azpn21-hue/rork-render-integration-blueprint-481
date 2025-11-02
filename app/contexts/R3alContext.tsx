import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import manifest from "@/schemas/r3al/manifest.json";
import questionnaireSchema from "@/schemas/r3al/questionnaire_schema.json";
import truthscoreSchema from "@/schemas/r3al/truthscore_schema.json";

export interface Question {
  id: string;
  text: string;
  type: "multiple-choice" | "free-text" | "likert" | "slider";
  options?: string[];
  scale?: number;
  labels?: string[];
  min?: number;
  max?: number;
  max_length?: number;
  weight: number;
  truth_indicator: string;
}

export interface Answer {
  questionId: string;
  value: string | number;
  timestamp: number;
}

export interface TruthScore {
  score: number;
  level: string;
  summary: string;
  details: {
    honesty: number;
    diligence: number;
    transparency: number;
    integrity: number;
    accountability: number;
    values: number;
    self_assessment: number;
    consistencyChart: any;
    analysisText: string;
  };
}

export interface UserProfile {
  name: string;
  avatar?: string;
  bio?: string;
  verificationToken?: string;
  truthScore?: TruthScore;
}

export interface R3alState {
  currentScreen: string;
  onboardingPhase: number;
  hasConsented: boolean;
  isVerified: boolean;
  answers: Answer[];
  truthScore: TruthScore | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
}

const STORAGE_KEY = "@r3al_state";

export const [R3alContext, useR3al] = createContextHook(() => {
  const [state, setState] = useState<R3alState>({
    currentScreen: "splash",
    onboardingPhase: 0,
    hasConsented: false,
    isVerified: false,
    answers: [],
    truthScore: null,
    userProfile: null,
    isLoading: true,
  });

  useEffect(() => {
    loadState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadState = useCallback(async () => {
    try {
      console.log("[R3AL] Loading state from AsyncStorage...");
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        console.log("[R3AL] State loaded:", parsedState);
        setState({ ...parsedState, isLoading: false });
      } else {
        console.log("[R3AL] No stored state found, using initial state");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("[R3AL] Failed to load state:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const saveState = useCallback(async (newState: Partial<R3alState>) => {
    try {
      const updated = { ...state, ...newState };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setState(updated);
    } catch (error) {
      console.error("[R3AL] Failed to save state:", error);
    }
  }, [state]);

  const setCurrentScreen = useCallback((screen: string) => {
    saveState({ currentScreen: screen });
  }, [saveState]);

  const nextOnboardingPhase = useCallback(() => {
    saveState({ onboardingPhase: state.onboardingPhase + 1 });
  }, [saveState, state.onboardingPhase]);

  const giveConsent = useCallback(() => {
    saveState({ hasConsented: true });
  }, [saveState]);

  const setVerified = useCallback((token: string) => {
    saveState({ 
      isVerified: true,
      userProfile: { ...state.userProfile, verificationToken: token } as UserProfile
    });
  }, [saveState, state.userProfile]);

  const saveAnswer = useCallback((answer: Answer) => {
    const existingIndex = state.answers.findIndex(
      (a) => a.questionId === answer.questionId
    );
    const newAnswers = [...state.answers];
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers.push(answer);
    }
    
    saveState({ answers: newAnswers });
  }, [saveState, state.answers]);

  const calculateTruthScore = useCallback((): TruthScore => {
    const questions = questionnaireSchema.questions as Question[];
    const weights = truthscoreSchema.weights as Record<string, number>;
    const truthPoints = truthscoreSchema.truth_points as Record<string, Record<string, number>>;
    const textScoring = truthscoreSchema.text_scoring as Record<string, any>;
    const sliderScoring = truthscoreSchema.slider_scoring as Record<string, any>;
    const thresholds = truthscoreSchema.thresholds;

    let totalScore = 0 as number;
    let maxScore = 0 as number;
    const categoryScores: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    state.answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) return;

      const weight = weights[question.id] || question.weight;
      maxScore += weight;

      let points = 0 as number;

      if (question.type === "multiple-choice" || question.type === "likert") {
        const valueStr = String(answer.value);
        points = (truthPoints[question.id]?.[valueStr] || 0) * (weight / 10);
      } else if (question.type === "free-text") {
        const scoring = textScoring[question.id];
        if (scoring) {
          const text = String(answer.value).toLowerCase();
          const hasMinLength = text.length >= scoring.min_length;
          const keywordMatches = scoring.keywords.filter((kw: string) => 
            text.includes(kw.toLowerCase())
          ).length;
          points = hasMinLength ? (keywordMatches / scoring.keywords.length) * scoring.max_points : 0;
        }
      } else if (question.type === "slider") {
        const scoring = sliderScoring[question.id];
        if (scoring) {
          points = Number(answer.value) * scoring.multiplier;
        }
      }

      totalScore += points;

      if (!categoryScores[question.truth_indicator]) {
        categoryScores[question.truth_indicator] = 0;
        categoryCounts[question.truth_indicator] = 0;
      }
      categoryScores[question.truth_indicator] += points;
      categoryCounts[question.truth_indicator] += 1;
    });

    const normalizedScore = Math.round((totalScore / maxScore) * 100);
    
    let level = "low" as string;
    if (normalizedScore >= thresholds.high) level = "high";
    else if (normalizedScore >= thresholds.medium) level = "medium";

    const summary = level === "high" 
      ? "High Honesty" 
      : level === "medium" 
      ? "Medium Honesty" 
      : "Building Trust";

    const normalizedCategories: any = {};
    Object.keys(categoryScores).forEach((cat) => {
      normalizedCategories[cat] = Math.round(
        (categoryScores[cat] / categoryCounts[cat]) * 10
      );
    });

    const truthScore: TruthScore = {
      score: normalizedScore,
      level,
      summary,
      details: {
        honesty: normalizedCategories.honesty || 0,
        diligence: normalizedCategories.diligence || 0,
        transparency: normalizedCategories.transparency || 0,
        integrity: normalizedCategories.integrity || 0,
        accountability: normalizedCategories.accountability || 0,
        values: normalizedCategories.values || 0,
        self_assessment: normalizedCategories.self_assessment || 0,
        consistencyChart: categoryScores,
        analysisText: `Your truth score of ${normalizedScore} reflects your responses across ${state.answers.length} questions.`,
      },
    };

    saveState({ truthScore });
    return truthScore;
  }, [saveState, state.answers]);

  const saveProfile = useCallback((profile: UserProfile) => {
    saveState({ 
      userProfile: { ...state.userProfile, ...profile } as UserProfile
    });
  }, [saveState, state.userProfile]);

  const resetR3al = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState({
      currentScreen: "splash",
      onboardingPhase: 0,
      hasConsented: false,
      isVerified: false,
      answers: [],
      truthScore: null,
      userProfile: null,
      isLoading: false,
    });
  }, []);

  return useMemo(() => ({
    ...state,
    manifest,
    questions: questionnaireSchema.questions as Question[],
    setCurrentScreen,
    nextOnboardingPhase,
    giveConsent,
    setVerified,
    saveAnswer,
    calculateTruthScore,
    saveProfile,
    resetR3al,
  }), [state, setCurrentScreen, nextOnboardingPhase, giveConsent, setVerified, saveAnswer, calculateTruthScore, saveProfile, resetR3al]);
});
