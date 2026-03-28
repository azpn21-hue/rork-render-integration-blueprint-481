import { trpc } from "@/lib/trpc";

export type EmotionalState = "calm" | "excited" | "anxious" | "focused" | "creative" | "tired";

export interface PulseState {
  userId: string;
  heartbeat: number;
  emotionalState: EmotionalState;
  aiSync: boolean;
  lastUpdate: string;
  pulseSignature: number[];
  metrics: {
    coherence: number;
    energy: number;
    resonance: number;
  };
}

export interface InteractionData {
  type: "message" | "connection" | "reflection" | "activity";
  intensity: number;
  timestamp: string;
}

export const usePulseState = (userId?: string) => {
  return trpc.r3al.pulse.getState.useQuery({ userId });
};

export const useUpdatePulseState = () => {
  return trpc.r3al.pulse.updateState.useMutation();
};

export const useSharePulse = () => {
  return trpc.r3al.pulse.sharePulse.useMutation();
};

export const getEmotionalStateColor = (state: EmotionalState): string => {
  const colorMap: Record<EmotionalState, string> = {
    calm: "#4FC3F7",
    excited: "#FF6B6B",
    anxious: "#FFD93D",
    focused: "#6C5CE7",
    creative: "#A29BFE",
    tired: "#74B9FF",
  };
  return colorMap[state];
};

export const getEmotionalStateIcon = (state: EmotionalState): string => {
  const iconMap: Record<EmotionalState, string> = {
    calm: "calm",
    excited: "zap",
    anxious: "alert-circle",
    focused: "target",
    creative: "sparkles",
    tired: "moon",
  };
  return iconMap[state];
};
