import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { trpc } from '@/lib/trpc';

interface EmotionNode {
  id: string;
  valence: number;
  arousal: number;
  context: string;
  timestamp: string;
}

interface PulseNode {
  id: string;
  bpm: number;
  resonance_index: number;
  timestamp: string;
}

interface InteractionNode {
  id: string;
  type: string;
  content_ref: string;
  timestamp: string;
}

interface MemoryContext {
  emotions: EmotionNode[];
  pulses: PulseNode[];
  interactions: InteractionNode[];
  isLoadingContext: boolean;
  refreshContext: () => Promise<void>;
  logEmotion: (valence: number, arousal: number, context: string) => Promise<void>;
  logPulse: (bpm: number, resonanceIndex: number) => Promise<void>;
  logInteraction: (type: string, contentRef: string) => Promise<void>;
  findSimilarUsers: () => Promise<any[]>;
  getPairings: () => Promise<any[]>;
  explainAction: (actionId: string) => Promise<any>;
}

const MemoryGraphContext = createContext<MemoryContext | undefined>(undefined);

export function MemoryGraphProvider({ children }: { children: ReactNode }) {
  const [emotions, setEmotions] = useState<EmotionNode[]>([]);
  const [pulses, setPulses] = useState<PulseNode[]>([]);
  const [interactions, setInteractions] = useState<InteractionNode[]>([]);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  const getContextMutation = trpc.r3al.memory.getContext.useMutation();
  const createNodeMutation = trpc.r3al.memory.createNode.useMutation();
  const querySimilarityMutation = trpc.r3al.memory.querySimilarity.useMutation();
  const getPairingsMutation = trpc.r3al.memory.getPairings.useMutation();
  const explainActionMutation = trpc.r3al.memory.explainAction.useMutation();

  const refreshContext = useCallback(async () => {
    console.log('[MemoryGraph] Refreshing context...');
    setIsLoadingContext(true);
    try {
      const result = await getContextMutation.mutateAsync({});
      if (result.success && result.context) {
        setEmotions(result.context.emotions || []);
        setPulses(result.context.pulses || []);
        setInteractions(result.context.interactions || []);
        console.log('[MemoryGraph] ✅ Context refreshed');
      }
    } catch (error) {
      console.error('[MemoryGraph] ❌ Failed to refresh context:', error);
    } finally {
      setIsLoadingContext(false);
    }
  }, [getContextMutation]);

  const logEmotion = useCallback(
    async (valence: number, arousal: number, context: string) => {
      console.log('[MemoryGraph] Logging emotion:', { valence, arousal, context });
      try {
        await createNodeMutation.mutateAsync({
          nodeType: 'emotion',
          data: { valence, arousal, context, confidence: 0.8 }
        });
        console.log('[MemoryGraph] ✅ Emotion logged');
        await refreshContext();
      } catch (error) {
        console.error('[MemoryGraph] ❌ Failed to log emotion:', error);
      }
    },
    [createNodeMutation, refreshContext]
  );

  const logPulse = useCallback(
    async (bpm: number, resonanceIndex: number) => {
      console.log('[MemoryGraph] Logging pulse:', { bpm, resonanceIndex });
      try {
        await createNodeMutation.mutateAsync({
          nodeType: 'pulse',
          data: { bpm, resonanceIndex, pulseId: `pulse_${Date.now()}` }
        });
        console.log('[MemoryGraph] ✅ Pulse logged');
        await refreshContext();
      } catch (error) {
        console.error('[MemoryGraph] ❌ Failed to log pulse:', error);
      }
    },
    [createNodeMutation, refreshContext]
  );

  const logInteraction = useCallback(
    async (type: string, contentRef: string) => {
      console.log('[MemoryGraph] Logging interaction:', { type, contentRef });
      try {
        await createNodeMutation.mutateAsync({
          nodeType: 'interaction',
          data: { type, contentRef }
        });
        console.log('[MemoryGraph] ✅ Interaction logged');
        await refreshContext();
      } catch (error) {
        console.error('[MemoryGraph] ❌ Failed to log interaction:', error);
      }
    },
    [createNodeMutation, refreshContext]
  );

  const findSimilarUsers = useCallback(async () => {
    console.log('[MemoryGraph] Finding similar users...');
    try {
      const result = await querySimilarityMutation.mutateAsync({
        queryType: 'users',
        limit: 10
      });
      console.log('[MemoryGraph] ✅ Found similar users:', result.results?.length || 0);
      return result.results || [];
    } catch (error) {
      console.error('[MemoryGraph] ❌ Failed to find similar users:', error);
      return [];
    }
  }, [querySimilarityMutation]);

  const getPairings = useCallback(async () => {
    console.log('[MemoryGraph] Getting pairings...');
    try {
      const result = await getPairingsMutation.mutateAsync({});
      console.log('[MemoryGraph] ✅ Found pairings:', result.pairings?.length || 0);
      return result.pairings || [];
    } catch (error) {
      console.error('[MemoryGraph] ❌ Failed to get pairings:', error);
      return [];
    }
  }, [getPairingsMutation]);

  const explainAction = useCallback(
    async (actionId: string) => {
      console.log('[MemoryGraph] Explaining action:', actionId);
      try {
        const result = await explainActionMutation.mutateAsync({ actionId });
        console.log('[MemoryGraph] ✅ Action explained');
        return result.chain;
      } catch (error) {
        console.error('[MemoryGraph] ❌ Failed to explain action:', error);
        return null;
      }
    },
    [explainActionMutation]
  );

  const value: MemoryContext = {
    emotions,
    pulses,
    interactions,
    isLoadingContext,
    refreshContext,
    logEmotion,
    logPulse,
    logInteraction,
    findSimilarUsers,
    getPairings,
    explainAction
  };

  return (
    <MemoryGraphContext.Provider value={value}>
      {children}
    </MemoryGraphContext.Provider>
  );
}

export function useMemoryGraph() {
  const context = useContext(MemoryGraphContext);
  if (!context) {
    throw new Error('useMemoryGraph must be used within MemoryGraphProvider');
  }
  return context;
}
