export interface RewardWeights {
  sentiment: number;
  engagement: number;
  compliance: number;
  empathy: number;
  timing: number;
}

export interface RewardInput {
  sentimentBefore: number;
  sentimentAfter: number;
  engagementBefore: number;
  engagementAfter: number;
  consentGiven: boolean;
  privacyRespected: boolean;
  actionType: string;
  actionTiming: number;
  userFeedback?: number;
  contextRelevance?: number;
}

export interface RewardOutput {
  totalReward: number;
  components: {
    sentimentGain: number;
    engagementDelta: number;
    complianceScore: number;
    empathyScore: number;
    timingScore: number;
  };
  explanation: string;
}

export class RewardModel {
  private weights: RewardWeights;

  constructor(weights?: Partial<RewardWeights>) {
    this.weights = {
      sentiment: weights?.sentiment || 0.4,
      engagement: weights?.engagement || 0.4,
      compliance: weights?.compliance || 0.2,
      empathy: weights?.empathy || 0.0,
      timing: weights?.timing || 0.0,
    };

    this.normalizeWeights();

    console.log('[Reward Model] Initialized with weights:', this.weights);
  }

  private normalizeWeights(): void {
    const sum =
      this.weights.sentiment +
      this.weights.engagement +
      this.weights.compliance +
      this.weights.empathy +
      this.weights.timing;

    if (sum > 0) {
      this.weights.sentiment /= sum;
      this.weights.engagement /= sum;
      this.weights.compliance /= sum;
      this.weights.empathy /= sum;
      this.weights.timing /= sum;
    }
  }

  calculateReward(input: RewardInput): RewardOutput {
    const sentimentGain = this.calculateSentimentGain(input);

    const engagementDelta = this.calculateEngagementDelta(input);

    const complianceScore = this.calculateComplianceScore(input);

    const empathyScore = this.calculateEmpathyScore(input);

    const timingScore = this.calculateTimingScore(input);

    const totalReward =
      sentimentGain * this.weights.sentiment +
      engagementDelta * this.weights.engagement +
      complianceScore * this.weights.compliance +
      empathyScore * this.weights.empathy +
      timingScore * this.weights.timing;

    const explanation = this.generateExplanation({
      sentimentGain,
      engagementDelta,
      complianceScore,
      empathyScore,
      timingScore,
    });

    return {
      totalReward,
      components: {
        sentimentGain,
        engagementDelta,
        complianceScore,
        empathyScore,
        timingScore,
      },
      explanation,
    };
  }

  private calculateSentimentGain(input: RewardInput): number {
    const rawGain = input.sentimentAfter - input.sentimentBefore;

    const normalizedGain = Math.tanh(rawGain);

    if (input.userFeedback !== undefined) {
      const feedbackWeight = 0.3;
      return normalizedGain * (1 - feedbackWeight) + input.userFeedback * feedbackWeight;
    }

    return normalizedGain;
  }

  private calculateEngagementDelta(input: RewardInput): number {
    const rawDelta = input.engagementAfter - input.engagementBefore;

    const normalizedDelta = Math.tanh(rawDelta);

    if (input.engagementAfter < 0.1) {
      return normalizedDelta - 0.3;
    }

    return normalizedDelta;
  }

  private calculateComplianceScore(input: RewardInput): number {
    let score = 0.0;

    if (input.consentGiven) {
      score += 0.5;
    }

    if (input.privacyRespected) {
      score += 0.5;
    }

    if (!input.consentGiven || !input.privacyRespected) {
      score -= 1.0;
    }

    return Math.max(-1.0, Math.min(1.0, score));
  }

  private calculateEmpathyScore(input: RewardInput): number {
    let score = 0.5;

    if (input.actionType === 'intervene' && input.sentimentBefore < 0) {
      score += 0.3;
    }

    if (input.actionType === 'listen' && input.sentimentBefore < -0.5) {
      score += 0.2;
    }

    if (input.actionType === 'intervene' && input.sentimentBefore > 0.3) {
      score -= 0.4;
    }

    if (input.contextRelevance !== undefined) {
      score *= input.contextRelevance;
    }

    return Math.max(-1.0, Math.min(1.0, score));
  }

  private calculateTimingScore(input: RewardInput): number {
    const optimalTiming = 2.0;

    const timingError = Math.abs(input.actionTiming - optimalTiming);

    const score = Math.exp(-timingError / 2);

    if (input.actionType === 'wait' && input.actionTiming < 1) {
      return score - 0.2;
    }

    if (input.actionType === 'intervene' && input.actionTiming > 5) {
      return score - 0.3;
    }

    return score;
  }

  private generateExplanation(components: {
    sentimentGain: number;
    engagementDelta: number;
    complianceScore: number;
    empathyScore: number;
    timingScore: number;
  }): string {
    const parts: string[] = [];

    if (components.sentimentGain > 0.3) {
      parts.push('Positive sentiment improvement');
    } else if (components.sentimentGain < -0.3) {
      parts.push('Negative sentiment change');
    }

    if (components.engagementDelta > 0.3) {
      parts.push('Increased user engagement');
    } else if (components.engagementDelta < -0.3) {
      parts.push('Decreased engagement');
    }

    if (components.complianceScore < 0) {
      parts.push('Privacy or consent violation');
    } else if (components.complianceScore > 0.5) {
      parts.push('Full compliance');
    }

    if (components.empathyScore > 0.7) {
      parts.push('Highly empathetic action');
    } else if (components.empathyScore < 0.3) {
      parts.push('Low empathy match');
    }

    if (components.timingScore > 0.8) {
      parts.push('Well-timed');
    } else if (components.timingScore < 0.5) {
      parts.push('Poor timing');
    }

    return parts.length > 0 ? parts.join(', ') : 'Standard interaction';
  }

  async batchCalculateRewards(inputs: RewardInput[]): Promise<RewardOutput[]> {
    console.log(`[Reward Model] Batch calculating rewards for ${inputs.length} inputs...`);

    const results = inputs.map((input) => this.calculateReward(input));

    const avgReward = results.reduce((sum, r) => sum + r.totalReward, 0) / results.length;

    console.log(`[Reward Model] Batch complete. Average reward: ${avgReward.toFixed(3)}`);

    return results;
  }

  updateWeights(newWeights: Partial<RewardWeights>): void {
    this.weights = {
      ...this.weights,
      ...newWeights,
    };

    this.normalizeWeights();

    console.log('[Reward Model] Updated weights:', this.weights);
  }

  getWeights(): RewardWeights {
    return { ...this.weights };
  }

  evaluateModelPerformance(
    predictions: RewardOutput[],
    actual: number[]
  ): {
    mse: number;
    mae: number;
    correlation: number;
  } {
    if (predictions.length !== actual.length || predictions.length === 0) {
      throw new Error('Predictions and actual values must have the same non-zero length');
    }

    const predicted = predictions.map((p) => p.totalReward);

    let sumSquaredError = 0;
    let sumAbsError = 0;

    for (let i = 0; i < predicted.length; i++) {
      const error = predicted[i] - actual[i];
      sumSquaredError += error * error;
      sumAbsError += Math.abs(error);
    }

    const mse = sumSquaredError / predicted.length;
    const mae = sumAbsError / predicted.length;

    const correlation = this.calculateCorrelation(predicted, actual);

    console.log(`[Reward Model] Performance: MSE=${mse.toFixed(4)}, MAE=${mae.toFixed(4)}, Correlation=${correlation.toFixed(3)}`);

    return { mse, mae, correlation };
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;

    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;

    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;

      numerator += dx * dy;
      denominatorX += dx * dx;
      denominatorY += dy * dy;
    }

    const denominator = Math.sqrt(denominatorX * denominatorY);

    return denominator > 0 ? numerator / denominator : 0;
  }

  simulateRewardFromMemoryNode(memoryNode: {
    userEmotionBefore: { valence: number; arousal: number };
    userEmotionAfter: { valence: number; arousal: number };
    aiAction: { type: string; timing: number };
    engagement: { before: number; after: number };
    consent: boolean;
  }): RewardOutput {
    return this.calculateReward({
      sentimentBefore: memoryNode.userEmotionBefore.valence,
      sentimentAfter: memoryNode.userEmotionAfter.valence,
      engagementBefore: memoryNode.engagement.before,
      engagementAfter: memoryNode.engagement.after,
      consentGiven: memoryNode.consent,
      privacyRespected: true,
      actionType: memoryNode.aiAction.type,
      actionTiming: memoryNode.aiAction.timing,
    });
  }

  exportModel(): { weights: RewardWeights; version: string } {
    return {
      weights: this.getWeights(),
      version: '1.0.0',
    };
  }

  importModel(data: { weights: RewardWeights; version: string }): void {
    this.weights = { ...data.weights };
    console.log(`[Reward Model] Imported model version ${data.version}`);
  }
}

export const rewardModel = new RewardModel();
