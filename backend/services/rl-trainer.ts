import { SyntheticSample } from './synthetic-generator';

export interface RLState {
  userEmotionVector: number[];
  contextFeatures: Record<string, any>;
  recentActions: string[];
  timeOfDay: number;
  conversationTurn: number;
}

export interface RLAction {
  type: 'intervene' | 'listen' | 'suggest' | 'wait';
  content?: string;
  tone?: 'empathetic' | 'neutral' | 'encouraging';
  timing?: number;
}

export interface RLTransition {
  state: RLState;
  action: RLAction;
  reward: number;
  nextState: RLState;
  terminal: boolean;
}

export interface PolicyConfig {
  learningRate: number;
  gamma: number;
  epsilon: number;
  batchSize: number;
  updateFrequency: number;
}

export interface TrainingEpisode {
  episodeId: string;
  transitions: RLTransition[];
  totalReward: number;
  avgReward: number;
  loss: number;
  policyEntropy: number;
}

export class RLPolicyTrainer {
  private policy: Map<string, number[]>;
  private valueFunction: Map<string, number>;
  private config: PolicyConfig;

  constructor(config?: Partial<PolicyConfig>) {
    this.policy = new Map();
    this.valueFunction = new Map();

    this.config = {
      learningRate: config?.learningRate || 0.001,
      gamma: config?.gamma || 0.99,
      epsilon: config?.epsilon || 0.1,
      batchSize: config?.batchSize || 32,
      updateFrequency: config?.updateFrequency || 4,
    };

    console.log('[RL Trainer] Initialized with config:', this.config);
  }

  async trainOnSyntheticData(
    syntheticSamples: SyntheticSample[],
    epochs: number
  ): Promise<TrainingEpisode[]> {
    console.log(`[RL Trainer] Starting training for ${epochs} epochs on ${syntheticSamples.length} samples...`);

    const episodes: TrainingEpisode[] = [];

    for (let epoch = 0; epoch < epochs; epoch++) {
      const batchSamples = this.sampleBatch(syntheticSamples, this.config.batchSize);

      const transitions = this.generateTransitions(batchSamples);

      const { totalReward, avgReward, loss } = this.updatePolicy(transitions);

      const policyEntropy = this.calculatePolicyEntropy();

      episodes.push({
        episodeId: `epoch_${epoch}`,
        transitions,
        totalReward,
        avgReward,
        loss,
        policyEntropy,
      });

      if (epoch % 10 === 0) {
        console.log(
          `[RL Trainer] Epoch ${epoch}: Reward=${avgReward.toFixed(3)}, Loss=${loss.toFixed(4)}, Entropy=${policyEntropy.toFixed(3)}`
        );
      }
    }

    console.log('[RL Trainer] Training complete');

    return episodes;
  }

  private sampleBatch(samples: SyntheticSample[], batchSize: number): SyntheticSample[] {
    const shuffled = [...samples].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(batchSize, shuffled.length));
  }

  private generateTransitions(samples: SyntheticSample[]): RLTransition[] {
    const transitions: RLTransition[] = [];

    samples.forEach((sample) => {
      const state = this.extractState(sample);

      const action = this.selectAction(state);

      const { nextState, reward, terminal } = this.simulateEnvironment(state, action, sample);

      transitions.push({
        state,
        action,
        reward,
        nextState,
        terminal,
      });
    });

    return transitions;
  }

  private extractState(sample: SyntheticSample): RLState {
    const features = sample.features;

    const emotionVector: number[] = [];
    if (features.valence !== undefined) emotionVector.push(features.valence);
    if (features.arousal !== undefined) emotionVector.push(features.arousal);
    if (features.dominance !== undefined) emotionVector.push(features.dominance);

    if (emotionVector.length === 0) {
      emotionVector.push(0, 0, 0);
    }

    return {
      userEmotionVector: emotionVector,
      contextFeatures: {
        resonance: features.resonanceIndex || features.resonance || 0.5,
        bpm: features.bpm || 70,
        sentiment: features.sentiment || 0,
      },
      recentActions: [],
      timeOfDay: features.hour || 12,
      conversationTurn: 0,
    };
  }

  private selectAction(state: RLState): RLAction {
    if (Math.random() < this.config.epsilon) {
      return this.randomAction();
    }

    const stateKey = this.stateToKey(state);
    const actionValues = this.policy.get(stateKey) || [0.25, 0.25, 0.25, 0.25];

    const actionIndex = actionValues.indexOf(Math.max(...actionValues));

    return this.indexToAction(actionIndex);
  }

  private randomAction(): RLAction {
    const types: RLAction['type'][] = ['intervene', 'listen', 'suggest', 'wait'];
    const tones: RLAction['tone'][] = ['empathetic', 'neutral', 'encouraging'];

    return {
      type: types[Math.floor(Math.random() * types.length)],
      tone: tones[Math.floor(Math.random() * tones.length)],
      timing: Math.random() * 5,
    };
  }

  private indexToAction(index: number): RLAction {
    const actions: RLAction[] = [
      { type: 'intervene', tone: 'empathetic', timing: 0 },
      { type: 'listen', tone: 'neutral', timing: 1 },
      { type: 'suggest', tone: 'encouraging', timing: 2 },
      { type: 'wait', tone: 'neutral', timing: 3 },
    ];

    return actions[index] || actions[0];
  }

  private simulateEnvironment(
    state: RLState,
    action: RLAction,
    sample: SyntheticSample
  ): { nextState: RLState; reward: number; terminal: boolean } {
    const baseReward = this.calculateReward(state, action, sample);

    const nextEmotionVector = state.userEmotionVector.map((v, i) => {
      let change = 0;

      if (action.type === 'intervene') {
        change = action.tone === 'empathetic' ? 0.1 : 0.05;
      } else if (action.type === 'listen') {
        change = 0.02;
      } else if (action.type === 'suggest') {
        change = 0.05;
      }

      return Math.max(-1, Math.min(1, v + change + (Math.random() - 0.5) * 0.1));
    });

    const nextState: RLState = {
      ...state,
      userEmotionVector: nextEmotionVector,
      conversationTurn: state.conversationTurn + 1,
      recentActions: [...state.recentActions.slice(-4), action.type],
    };

    const terminal = state.conversationTurn >= 10 || Math.random() < 0.1;

    return {
      nextState,
      reward: baseReward,
      terminal,
    };
  }

  private calculateReward(state: RLState, action: RLAction, sample: SyntheticSample): number {
    const emotionValence = state.userEmotionVector[0] || 0;
    const emotionArousal = state.userEmotionVector[1] || 0;

    let reward = 0;

    if (emotionValence < -0.5 && action.type === 'intervene' && action.tone === 'empathetic') {
      reward += 0.8;
    } else if (emotionValence > 0.3 && action.type === 'wait') {
      reward += 0.5;
    } else if (emotionArousal > 0.7 && action.type === 'listen') {
      reward += 0.6;
    } else if (action.type === 'intervene' && emotionValence > 0) {
      reward -= 0.3;
    }

    const resonance = state.contextFeatures.resonance || 0.5;
    reward += resonance * 0.2;

    const actionFrequency = state.recentActions.filter((a) => a === action.type).length;
    if (actionFrequency > 3) {
      reward -= 0.4;
    }

    reward *= sample.qualityScore;

    return reward;
  }

  private updatePolicy(transitions: RLTransition[]): {
    totalReward: number;
    avgReward: number;
    loss: number;
  } {
    let totalReward = 0;
    let totalLoss = 0;

    transitions.forEach((transition) => {
      totalReward += transition.reward;

      const stateKey = this.stateToKey(transition.state);
      const nextStateKey = this.stateToKey(transition.nextState);

      const currentValue = this.valueFunction.get(stateKey) || 0;
      const nextValue = transition.terminal ? 0 : this.valueFunction.get(nextStateKey) || 0;

      const tdTarget = transition.reward + this.config.gamma * nextValue;
      const tdError = tdTarget - currentValue;

      const newValue = currentValue + this.config.learningRate * tdError;
      this.valueFunction.set(stateKey, newValue);

      const actionValues = this.policy.get(stateKey) || [0.25, 0.25, 0.25, 0.25];
      const actionIndex = this.actionToIndex(transition.action);

      actionValues[actionIndex] += this.config.learningRate * tdError;

      this.normalizeActionValues(actionValues);
      this.policy.set(stateKey, actionValues);

      totalLoss += Math.abs(tdError);
    });

    return {
      totalReward,
      avgReward: transitions.length > 0 ? totalReward / transitions.length : 0,
      loss: transitions.length > 0 ? totalLoss / transitions.length : 0,
    };
  }

  private stateToKey(state: RLState): string {
    const emotionBucket = state.userEmotionVector
      .map((v) => Math.floor(v * 10))
      .join(',');
    const timeBucket = Math.floor(state.timeOfDay / 6);
    const turnBucket = Math.floor(state.conversationTurn / 3);

    return `e:${emotionBucket}|t:${timeBucket}|c:${turnBucket}`;
  }

  private actionToIndex(action: RLAction): number {
    const types = ['intervene', 'listen', 'suggest', 'wait'];
    return types.indexOf(action.type);
  }

  private normalizeActionValues(values: number[]): void {
    const sum = values.reduce((a, b) => a + Math.abs(b), 0);
    if (sum > 0) {
      for (let i = 0; i < values.length; i++) {
        values[i] = Math.abs(values[i]) / sum;
      }
    }
  }

  private calculatePolicyEntropy(): number {
    let totalEntropy = 0;
    let count = 0;

    this.policy.forEach((actionValues) => {
      let entropy = 0;
      actionValues.forEach((p) => {
        if (p > 0) {
          entropy -= p * Math.log2(p);
        }
      });
      totalEntropy += entropy;
      count++;
    });

    return count > 0 ? totalEntropy / count : 0;
  }

  exportPolicy(): { policy: [string, number[]][]; valueFunction: [string, number][] } {
    return {
      policy: Array.from(this.policy.entries()),
      valueFunction: Array.from(this.valueFunction.entries()),
    };
  }

  importPolicy(data: { policy: [string, number[]][]; valueFunction: [string, number][] }): void {
    this.policy = new Map(data.policy);
    this.valueFunction = new Map(data.valueFunction);

    console.log(
      `[RL Trainer] Imported policy with ${this.policy.size} states and ${this.valueFunction.size} value estimates`
    );
  }

  async evaluatePolicy(testSamples: SyntheticSample[]): Promise<{
    avgReward: number;
    falseInterventionRate: number;
    empathyScore: number;
  }> {
    console.log(`[RL Trainer] Evaluating policy on ${testSamples.length} test samples...`);

    const oldEpsilon = this.config.epsilon;
    this.config.epsilon = 0;

    const transitions = this.generateTransitions(testSamples);

    this.config.epsilon = oldEpsilon;

    const totalReward = transitions.reduce((sum, t) => sum + t.reward, 0);
    const avgReward = transitions.length > 0 ? totalReward / transitions.length : 0;

    const interventionActions = transitions.filter((t) => t.action.type === 'intervene');
    const unnecessaryInterventions = interventionActions.filter(
      (t) => t.state.userEmotionVector[0] > 0.3
    );
    const falseInterventionRate =
      interventionActions.length > 0
        ? unnecessaryInterventions.length / interventionActions.length
        : 0;

    const empatheticActions = transitions.filter(
      (t) =>
        t.action.type === 'intervene' &&
        t.action.tone === 'empathetic' &&
        t.state.userEmotionVector[0] < 0
    );
    const empathyScore = transitions.length > 0 ? empatheticActions.length / transitions.length : 0;

    console.log(`[RL Trainer] Evaluation complete: Reward=${avgReward.toFixed(3)}, FIR=${falseInterventionRate.toFixed(3)}, Empathy=${empathyScore.toFixed(3)}`);

    return {
      avgReward,
      falseInterventionRate,
      empathyScore,
    };
  }
}

export const rlTrainer = new RLPolicyTrainer();
