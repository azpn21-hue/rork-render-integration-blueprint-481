import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "emoji" | "file";
  timestamp: string;
  encrypted: boolean;
}

export interface VideoCallState {
  active: boolean;
  sessionId: string | null;
  startTime: string | null;
  participants: string[];
}

export interface RealificationSession {
  sessionId: string;
  participants: string[];
  startTime: string;
  questions: RealificationQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  pulseData: PulseData[];
  verdict: RealificationVerdict | null;
}

export interface RealificationQuestion {
  id: string;
  text: string;
  category: "emotion" | "decision" | "rapid" | "vibe";
}

export interface PulseData {
  timestamp: string;
  color: "green" | "blue" | "crimson";
  intensity: number;
}

export interface RealificationVerdict {
  icon: "❤️" | "💫" | "🔥" | "🪞";
  title: string;
  description: string;
  trustBonus: number;
}

export interface HonestyCheckSession {
  sessionId: string;
  questions: HonestyQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  verdict: HonestyVerdict | null;
}

export interface HonestyQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface HonestyVerdict {
  icon: "❤️" | "💫" | "🔥" | "🪞";
  title: string;
  description: string;
  trustBonus: number;
}

export interface ChatSession {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  startTime: string;
  endTime: string | null;
  messages: Message[];
  hasVideo: boolean;
  hasRealification: boolean;
  hasHonestyCheck: boolean;
  autoDeleteTime: string;
}

export interface PulseChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  videoCall: VideoCallState;
  realificationSession: RealificationSession | null;
  honestyCheckSession: HonestyCheckSession | null;
  isLoading: boolean;
}

const STORAGE_KEY = "@pulse_chat_state";

export const [PulseChatContext, usePulseChat] = createContextHook(() => {
  const [state, setState] = useState<PulseChatState>({
    sessions: [],
    activeSessionId: null,
    videoCall: {
      active: false,
      sessionId: null,
      startTime: null,
      participants: [],
    },
    realificationSession: null,
    honestyCheckSession: null,
    isLoading: true,
  });

  const loadState = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        setState({ ...parsedState, isLoading: false });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("[PulseChat] Failed to load state:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const saveState = useCallback(
    async (newState: Partial<PulseChatState>) => {
      try {
        const updated = { ...state, ...newState };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setState(updated);
      } catch (error) {
        console.error("[PulseChat] Failed to save state:", error);
      }
    },
    [state]
  );

  const startChatSession = useCallback(
    (participantName: string) => {
      const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const autoDeleteTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const newSession: ChatSession = {
        id: sessionId,
        participants: ["user", participantName],
        participantNames: {
          user: "You",
          [participantName]: participantName,
        },
        startTime: new Date().toISOString(),
        endTime: null,
        messages: [],
        hasVideo: false,
        hasRealification: false,
        hasHonestyCheck: false,
        autoDeleteTime,
      };

      console.log(`💬 [PulseChat] Started session ${sessionId}`);
      saveState({
        sessions: [...state.sessions, newSession],
        activeSessionId: sessionId,
      });

      return sessionId;
    },
    [saveState, state.sessions]
  );

  const sendMessage = useCallback(
    (sessionId: string, content: string, type: Message["type"] = "text") => {
      const message: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        senderId: "user",
        senderName: "You",
        content,
        type,
        timestamp: new Date().toISOString(),
        encrypted: true,
      };

      const updatedSessions = state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      );

      console.log(`📨 [PulseChat] Message sent in ${sessionId}`);
      saveState({ sessions: updatedSessions });
    },
    [saveState, state.sessions]
  );

  const startVideoCall = useCallback(
    (sessionId: string, participants: string[]) => {
      const updatedSessions = state.sessions.map((session) =>
        session.id === sessionId ? { ...session, hasVideo: true } : session
      );

      console.log(`🎥 [PulseChat] Video call started for ${sessionId}`);
      saveState({
        sessions: updatedSessions,
        videoCall: {
          active: true,
          sessionId,
          startTime: new Date().toISOString(),
          participants,
        },
      });
    },
    [saveState, state.sessions]
  );

  const endVideoCall = useCallback(() => {
    console.log(`🎥 [PulseChat] Video call ended`);
    saveState({
      videoCall: {
        active: false,
        sessionId: null,
        startTime: null,
        participants: [],
      },
    });
  }, [saveState]);

  const startRealificationSession = useCallback(
    (sessionId: string, participants: string[]) => {
      const questions: RealificationQuestion[] = [
        { id: "r1", text: "What's your go-to emoji right now?", category: "emotion" },
        { id: "r2", text: "Beach or mountains?", category: "decision" },
        { id: "r3", text: "Coffee or tea?", category: "decision" },
        { id: "r4", text: "What's your current vibe in one word?", category: "vibe" },
        { id: "r5", text: "Night owl or early bird?", category: "decision" },
      ];

      const realificationSession: RealificationSession = {
        sessionId,
        participants,
        startTime: new Date().toISOString(),
        questions,
        currentQuestionIndex: 0,
        answers: {},
        pulseData: [],
        verdict: null,
      };

      const updatedSessions = state.sessions.map((session) =>
        session.id === sessionId ? { ...session, hasRealification: true } : session
      );

      console.log(`🫀 [PulseChat] Realification session started for ${sessionId}`);
      saveState({ sessions: updatedSessions, realificationSession });
    },
    [saveState, state.sessions]
  );

  const answerRealificationQuestion = useCallback(
    (questionId: string, answer: string) => {
      if (!state.realificationSession) return;

      const updatedSession = {
        ...state.realificationSession,
        answers: { ...state.realificationSession.answers, [questionId]: answer },
        currentQuestionIndex: state.realificationSession.currentQuestionIndex + 1,
      };

      const pulseColor: "green" | "blue" | "crimson" = ["green", "blue", "crimson"][
        Math.floor(Math.random() * 3)
      ] as "green" | "blue" | "crimson";

      updatedSession.pulseData.push({
        timestamp: new Date().toISOString(),
        color: pulseColor,
        intensity: Math.random() * 0.5 + 0.5,
      });

      saveState({ realificationSession: updatedSession });
    },
    [saveState, state.realificationSession]
  );

  const finishRealification = useCallback(() => {
    if (!state.realificationSession) return;

    const verdicts: RealificationVerdict[] = [
      {
        icon: "💫",
        title: "Flutter",
        description: "Energy off the charts!",
        trustBonus: 0.1,
      },
      {
        icon: "❤️",
        title: "Heartbeat",
        description: "Strong and steady connection!",
        trustBonus: 0.1,
      },
      {
        icon: "🔥",
        title: "Spark",
        description: "Intense vibes detected!",
        trustBonus: 0.1,
      },
      {
        icon: "🪞",
        title: "Mirror",
        description: "Perfectly in sync!",
        trustBonus: 0.1,
      },
    ];

    const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];

    const updatedSession = {
      ...state.realificationSession,
      verdict: randomVerdict,
    };

    console.log(`🫀 [PulseChat] Realification verdict: ${randomVerdict.title}`);
    saveState({ realificationSession: updatedSession });

    return randomVerdict;
  }, [saveState, state.realificationSession]);

  const endRealificationSession = useCallback(() => {
    console.log(`🫀 [PulseChat] Realification session ended`);
    saveState({ realificationSession: null });
  }, [saveState]);

  const startHonestyCheck = useCallback(
    (sessionId: string) => {
      const questions: HonestyQuestion[] = [
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
      ];

      const honestyCheckSession: HonestyCheckSession = {
        sessionId,
        questions,
        currentQuestionIndex: 0,
        answers: {},
        verdict: null,
      };

      const updatedSessions = state.sessions.map((session) =>
        session.id === sessionId ? { ...session, hasHonestyCheck: true } : session
      );

      console.log(`🧠 [PulseChat] Honesty Check started for ${sessionId}`);
      saveState({ sessions: updatedSessions, honestyCheckSession });
    },
    [saveState, state.sessions]
  );

  const answerHonestyQuestion = useCallback(
    (questionId: string, answer: string) => {
      if (!state.honestyCheckSession) return;

      const updatedSession = {
        ...state.honestyCheckSession,
        answers: { ...state.honestyCheckSession.answers, [questionId]: answer },
        currentQuestionIndex: state.honestyCheckSession.currentQuestionIndex + 1,
      };

      saveState({ honestyCheckSession: updatedSession });
    },
    [saveState, state.honestyCheckSession]
  );

  const finishHonestyCheck = useCallback(() => {
    if (!state.honestyCheckSession) return;

    const verdicts: HonestyVerdict[] = [
      {
        icon: "❤️",
        title: "Truth Teller",
        description: "Your honesty shines through!",
        trustBonus: 1,
      },
      {
        icon: "💫",
        title: "Genuine Soul",
        description: "Authenticity is your strength!",
        trustBonus: 1,
      },
      {
        icon: "🔥",
        title: "Real One",
        description: "You keep it 100!",
        trustBonus: 1,
      },
      {
        icon: "🪞",
        title: "Crystal Clear",
        description: "Transparent and true!",
        trustBonus: 1,
      },
    ];

    const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];

    const updatedSession = {
      ...state.honestyCheckSession,
      verdict: randomVerdict,
    };

    console.log(`🧠 [PulseChat] Honesty Check verdict: ${randomVerdict.title}`);
    saveState({ honestyCheckSession: updatedSession });

    return randomVerdict;
  }, [saveState, state.honestyCheckSession]);

  const endHonestyCheck = useCallback(() => {
    console.log(`🧠 [PulseChat] Honesty Check ended`);
    saveState({ honestyCheckSession: null });
  }, [saveState]);

  const endChatSession = useCallback(
    (sessionId: string) => {
      const updatedSessions = state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, endTime: new Date().toISOString() }
          : session
      );

      console.log(`💬 [PulseChat] Session ${sessionId} ended`);
      saveState({
        sessions: updatedSessions,
        activeSessionId: null,
      });
    },
    [saveState, state.sessions]
  );

  const getActiveSession = useCallback(() => {
    if (!state.activeSessionId) return null;
    return state.sessions.find((s) => s.id === state.activeSessionId) || null;
  }, [state.activeSessionId, state.sessions]);

  return useMemo(
    () => ({
      ...state,
      loadState,
      startChatSession,
      sendMessage,
      startVideoCall,
      endVideoCall,
      startRealificationSession,
      answerRealificationQuestion,
      finishRealification,
      endRealificationSession,
      startHonestyCheck,
      answerHonestyQuestion,
      finishHonestyCheck,
      endHonestyCheck,
      endChatSession,
      getActiveSession,
    }),
    [
      state,
      loadState,
      startChatSession,
      sendMessage,
      startVideoCall,
      endVideoCall,
      startRealificationSession,
      answerRealificationQuestion,
      finishRealification,
      endRealificationSession,
      startHonestyCheck,
      answerHonestyQuestion,
      finishHonestyCheck,
      endHonestyCheck,
      endChatSession,
      getActiveSession,
    ]
  );
});
