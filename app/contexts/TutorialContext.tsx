import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";

export type TutorialStep = {
  id: string;
  target: string;
  title: string;
  message: string;
  placement: "top" | "bottom" | "left" | "right" | "center";
  spotlightPadding?: number;
  optimaMessage?: string;
  action?: () => void;
};

export type TutorialFlow = {
  id: string;
  name: string;
  steps: TutorialStep[];
  autoStart?: boolean;
  repeatable?: boolean;
};

const TUTORIAL_FLOWS: Record<string, TutorialFlow> = {
  home_tour: {
    id: "home_tour",
    name: "Home Tour",
    autoStart: true,
    repeatable: false,
    steps: [
      {
        id: "welcome",
        target: "home-header",
        title: "Welcome to R3AL",
        message: "I'm Optima, your AI guide. Let me show you around.",
        placement: "center",
        optimaMessage: "Built by a Special Forces operator, R3AL is designed to protect truth, privacy, and authenticity. Let's explore together."
      },
      {
        id: "truth_score",
        target: "truth-score-card",
        title: "Your Truth Score",
        message: "This is your baseline Trust Score. It refines over ~7 days as you interact authentically.",
        placement: "bottom",
        spotlightPadding: 12,
        optimaMessage: "Your score reflects transparency, safety posture, and coherent disclosures. Interact in the Hive and messages to improve accuracy."
      },
      {
        id: "profile",
        target: "edit-profile-btn",
        title: "Edit Your Profile",
        message: "Update your info, verify your identity, and manage disclosure settings here.",
        placement: "top",
        spotlightPadding: 8,
        optimaMessage: "Keep your profile authentic. Verified profiles build higher trust faster."
      },
      {
        id: "settings",
        target: "settings-btn",
        title: "Settings & Privacy",
        message: "Control your privacy, notifications, and security preferences.",
        placement: "top",
        spotlightPadding: 8,
        optimaMessage: "R3AL never sells your data. Two-factor auth and encryption are built-in."
      },
      {
        id: "hive_intro",
        target: "home-content",
        title: "The Hive",
        message: "Connect, share responsibly, and build your reputation through authentic interactions.",
        placement: "center",
        optimaMessage: "The Hive is where community happens. Report misuse, respect boundaries, and contribute positively."
      },
      {
        id: "complete",
        target: "home-footer",
        title: "You're Ready!",
        message: "Build your reputation through authentic interaction. Reveal • Relate • Respect.",
        placement: "top",
        optimaMessage: "I'm always here if you need help. Just ask, and I'll guide you. Let's build something real together."
      }
    ]
  },
  vault_tour: {
    id: "vault_tour",
    name: "Trust Vault Tour",
    autoStart: false,
    repeatable: true,
    steps: [
      {
        id: "vault_intro",
        target: "vault-header",
        title: "Trust Vault",
        message: "Manage your disclosures, answer truth questions, and refine your score.",
        placement: "center",
        optimaMessage: "This is your private space. Only you control what gets revealed, and only with mutual consent."
      }
    ]
  }
};

const TUTORIAL_STORAGE_KEY = "@r3al_tutorial_state";

interface TutorialState {
  completedFlows: string[];
  currentFlow: string | null;
  currentStepIndex: number;
  lastCompletedAt: string | null;
}

interface TutorialContextValue {
  isActive: boolean;
  currentFlow: TutorialFlow | null;
  currentStep: TutorialStep | null;
  currentStepIndex: number;
  totalSteps: number;
  completedFlows: string[];
  
  startTutorial: (flowId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorial: (flowId: string) => void;
  shouldAutoStart: (flowId: string) => boolean;
}

export const [TutorialProvider, useTutorial] = createContextHook<TutorialContextValue>(() => {
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const tutorialQuery = useQuery({
    queryKey: ["tutorial-state"],
    queryFn: async (): Promise<TutorialState> => {
      try {
        const stored = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
        if (!stored) {
          return {
            completedFlows: [],
            currentFlow: null,
            currentStepIndex: 0,
            lastCompletedAt: null
          };
        }
        
        if (typeof stored !== 'string' || stored.trim().length === 0) {
          console.error("[Tutorial] Invalid stored data");
          await AsyncStorage.removeItem(TUTORIAL_STORAGE_KEY);
          return {
            completedFlows: [],
            currentFlow: null,
            currentStepIndex: 0,
            lastCompletedAt: null
          };
        }
        
        return JSON.parse(stored);
      } catch (error: any) {
        console.error("[Tutorial] JSON parse error:", error?.message || error);
        await AsyncStorage.removeItem(TUTORIAL_STORAGE_KEY);
        return {
          completedFlows: [],
          currentFlow: null,
          currentStepIndex: 0,
          lastCompletedAt: null
        };
      }
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (state: TutorialState) => {
      await AsyncStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(state));
      return state;
    },
    onSuccess: () => {
      tutorialQuery.refetch();
    }
  });

  const currentFlow = currentFlowId ? TUTORIAL_FLOWS[currentFlowId] : null;
  const currentStep = currentFlow ? currentFlow.steps[currentStepIndex] : null;
  const completedFlows = tutorialQuery.data?.completedFlows || [];

  const startTutorial = useCallback((flowId: string) => {
    if (!TUTORIAL_FLOWS[flowId]) {
      console.warn(`Tutorial flow ${flowId} not found`);
      return;
    }
    setCurrentFlowId(flowId);
    setCurrentStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    if (!currentFlow) return;
    
    if (currentStepIndex < currentFlow.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTutorial();
    }
  }, [currentFlow, currentStepIndex]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTutorial = useCallback(() => {
    setCurrentFlowId(null);
    setCurrentStepIndex(0);
  }, []);

  const completeTutorial = useCallback(() => {
    if (!currentFlowId) return;

    const updatedCompleted = [...completedFlows];
    if (!updatedCompleted.includes(currentFlowId)) {
      updatedCompleted.push(currentFlowId);
    }

    saveMutation.mutate({
      completedFlows: updatedCompleted,
      currentFlow: null,
      currentStepIndex: 0,
      lastCompletedAt: new Date().toISOString()
    });

    setCurrentFlowId(null);
    setCurrentStepIndex(0);
  }, [currentFlowId, completedFlows, saveMutation]);

  const resetTutorial = useCallback((flowId: string) => {
    const updatedCompleted = completedFlows.filter(id => id !== flowId);
    saveMutation.mutate({
      completedFlows: updatedCompleted,
      currentFlow: null,
      currentStepIndex: 0,
      lastCompletedAt: null
    });
  }, [completedFlows, saveMutation]);

  const shouldAutoStart = useCallback((flowId: string) => {
    const flow = TUTORIAL_FLOWS[flowId];
    if (!flow || !flow.autoStart) return false;
    return !completedFlows.includes(flowId);
  }, [completedFlows]);

  return {
    isActive: currentFlowId !== null,
    currentFlow,
    currentStep,
    currentStepIndex,
    totalSteps: currentFlow?.steps.length || 0,
    completedFlows,
    
    startTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    resetTutorial,
    shouldAutoStart
  };
});
