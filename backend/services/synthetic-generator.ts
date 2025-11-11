import { AnonymizedData } from './anonymization';

export interface SyntheticConfig {
  method: 'vae' | 'diffusion' | 'gan' | 'rule_based';
  sampleCount: number;
  qualityThreshold?: number;
  diversityTarget?: number;
}

export interface SyntheticSample {
  features: Record<string, any>;
  sourceDistribution: string;
  qualityScore: number;
  syntheticId: string;
  generatedAt: string;
}

export class SyntheticDataGenerator {
  async generateFromAnonymized(
    sourceData: AnonymizedData[],
    config: SyntheticConfig
  ): Promise<SyntheticSample[]> {
    console.log(`[Synthetic] Generating ${config.sampleCount} samples using ${config.method}...`);

    const startTime = Date.now();

    let samples: SyntheticSample[];

    switch (config.method) {
      case 'vae':
        samples = await this.generateVAE(sourceData, config.sampleCount);
        break;
      case 'diffusion':
        samples = await this.generateDiffusion(sourceData, config.sampleCount);
        break;
      case 'gan':
        samples = await this.generateGAN(sourceData, config.sampleCount);
        break;
      case 'rule_based':
        samples = await this.generateRuleBased(sourceData, config.sampleCount);
        break;
      default:
        throw new Error(`Unknown generation method: ${config.method}`);
    }

    const qualityFiltered = samples.filter(
      (s) => s.qualityScore >= (config.qualityThreshold || 0.7)
    );

    const processingTime = Date.now() - startTime;

    console.log(
      `[Synthetic] Generated ${qualityFiltered.length}/${samples.length} quality samples in ${processingTime}ms`
    );

    return qualityFiltered;
  }

  private async generateVAE(
    sourceData: AnonymizedData[],
    count: number
  ): Promise<SyntheticSample[]> {
    const distributionStats = this.analyzeDistribution(sourceData);

    const samples: SyntheticSample[] = [];

    for (let i = 0; i < count; i++) {
      const latentVector = this.sampleLatentSpace(distributionStats.dimensions);

      const decodedFeatures = this.decodeVAE(latentVector, distributionStats);

      const qualityScore = this.evaluateQuality(decodedFeatures, distributionStats);

      samples.push({
        features: decodedFeatures,
        sourceDistribution: 'vae_latent',
        qualityScore,
        syntheticId: this.generateId(),
        generatedAt: new Date().toISOString(),
      });
    }

    return samples;
  }

  private async generateDiffusion(
    sourceData: AnonymizedData[],
    count: number
  ): Promise<SyntheticSample[]> {
    const distributionStats = this.analyzeDistribution(sourceData);

    const samples: SyntheticSample[] = [];

    for (let i = 0; i < count; i++) {
      const noisyVector = this.addGaussianNoise(
        distributionStats.mean,
        distributionStats.stdDev
      );

      const denoisedFeatures = this.denoiseDiffusion(noisyVector, distributionStats, 50);

      const qualityScore = this.evaluateQuality(denoisedFeatures, distributionStats);

      samples.push({
        features: denoisedFeatures,
        sourceDistribution: 'diffusion_denoised',
        qualityScore,
        syntheticId: this.generateId(),
        generatedAt: new Date().toISOString(),
      });
    }

    return samples;
  }

  private async generateGAN(
    sourceData: AnonymizedData[],
    count: number
  ): Promise<SyntheticSample[]> {
    const distributionStats = this.analyzeDistribution(sourceData);

    const samples: SyntheticSample[] = [];

    for (let i = 0; i < count; i++) {
      const noise = this.sampleLatentSpace(distributionStats.dimensions);

      const generatedFeatures = this.generateGANSample(noise, distributionStats);

      const qualityScore = this.evaluateQuality(generatedFeatures, distributionStats);

      samples.push({
        features: generatedFeatures,
        sourceDistribution: 'gan_generated',
        qualityScore,
        syntheticId: this.generateId(),
        generatedAt: new Date().toISOString(),
      });
    }

    return samples;
  }

  private async generateRuleBased(
    sourceData: AnonymizedData[],
    count: number
  ): Promise<SyntheticSample[]> {
    const distributionStats = this.analyzeDistribution(sourceData);

    const samples: SyntheticSample[] = [];

    for (let i = 0; i < count; i++) {
      const features: Record<string, any> = {};

      for (const [key, stats] of Object.entries(distributionStats.featureStats)) {
        if (stats.type === 'numeric') {
          features[key] = this.sampleGaussian(stats.mean, stats.stdDev);
        } else if (stats.type === 'categorical') {
          features[key] = this.sampleCategorical(stats.distribution);
        } else if (stats.type === 'boolean') {
          features[key] = Math.random() < (stats.trueRatio || 0.5);
        }
      }

      const qualityScore = this.evaluateQuality(features, distributionStats);

      samples.push({
        features,
        sourceDistribution: 'rule_based',
        qualityScore,
        syntheticId: this.generateId(),
        generatedAt: new Date().toISOString(),
      });
    }

    return samples;
  }

  private analyzeDistribution(data: AnonymizedData[]): any {
    const featureVectors = data.map((d) => d.features);

    const allKeys = new Set<string>();
    featureVectors.forEach((fv) => Object.keys(fv).forEach((k) => allKeys.add(k)));

    const featureStats: Record<string, any> = {};

    allKeys.forEach((key) => {
      const values = featureVectors.map((fv) => fv[key]).filter((v) => v !== undefined);

      if (values.length === 0) return;

      const firstValue = values[0];

      if (typeof firstValue === 'number') {
        const numericValues = values.filter((v) => typeof v === 'number') as number[];
        const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
        const variance =
          numericValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numericValues.length;
        const stdDev = Math.sqrt(variance);

        featureStats[key] = {
          type: 'numeric',
          mean,
          stdDev,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
        };
      } else if (typeof firstValue === 'boolean') {
        const boolValues = values.filter((v) => typeof v === 'boolean') as boolean[];
        const trueCount = boolValues.filter((v) => v).length;

        featureStats[key] = {
          type: 'boolean',
          trueRatio: trueCount / boolValues.length,
        };
      } else {
        const distribution: Record<string, number> = {};
        values.forEach((v) => {
          const strValue = String(v);
          distribution[strValue] = (distribution[strValue] || 0) + 1;
        });

        const total = values.length;
        const normalizedDist: Record<string, number> = {};
        Object.entries(distribution).forEach(([k, v]) => {
          normalizedDist[k] = v / total;
        });

        featureStats[key] = {
          type: 'categorical',
          distribution: normalizedDist,
        };
      }
    });

    const numericFeatures = Object.values(featureStats).filter((s) => s.type === 'numeric');
    const dimensions = numericFeatures.length;

    const means = numericFeatures.map((s) => s.mean);
    const stdDevs = numericFeatures.map((s) => s.stdDev);

    return {
      featureStats,
      dimensions,
      mean: means,
      stdDev: stdDevs,
      sampleCount: data.length,
    };
  }

  private sampleLatentSpace(dimensions: number): number[] {
    return Array.from({ length: dimensions }, () => this.sampleGaussian(0, 1));
  }

  private sampleGaussian(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  private sampleCategorical(distribution: Record<string, number>): string {
    const rand = Math.random();
    let cumulative = 0;

    for (const [value, prob] of Object.entries(distribution)) {
      cumulative += prob;
      if (rand <= cumulative) {
        return value;
      }
    }

    return Object.keys(distribution)[0] || '';
  }

  private addGaussianNoise(means: number[], stdDevs: number[]): number[] {
    return means.map((mean, i) => this.sampleGaussian(mean, stdDevs[i] * 2));
  }

  private decodeVAE(latentVector: number[], stats: any): Record<string, any> {
    const features: Record<string, any> = {};

    let latentIdx = 0;

    for (const [key, featureStat] of Object.entries(stats.featureStats)) {
      const stat = featureStat as any;

      if (stat.type === 'numeric' && latentIdx < latentVector.length) {
        features[key] = latentVector[latentIdx] * stat.stdDev + stat.mean;
        features[key] = Math.max(stat.min, Math.min(stat.max, features[key]));
        latentIdx++;
      } else if (stat.type === 'boolean') {
        features[key] = Math.random() < stat.trueRatio;
      } else if (stat.type === 'categorical') {
        features[key] = this.sampleCategorical(stat.distribution);
      }
    }

    return features;
  }

  private denoiseDiffusion(
    noisyVector: number[],
    stats: any,
    steps: number
  ): Record<string, any> {
    let current = [...noisyVector];

    for (let step = 0; step < steps; step++) {
      const alpha = 1 - step / steps;

      current = current.map((val, i) => {
        const targetMean = stats.mean[i] || 0;
        const targetStd = stats.stdDev[i] || 1;

        return val * alpha + targetMean * (1 - alpha) + this.sampleGaussian(0, targetStd * 0.1);
      });
    }

    return this.decodeVAE(current, stats);
  }

  private generateGANSample(noise: number[], stats: any): Record<string, any> {
    const transformedNoise = noise.map((n, i) => {
      const mean = stats.mean[i] || 0;
      const stdDev = stats.stdDev[i] || 1;
      return Math.tanh(n) * stdDev + mean;
    });

    return this.decodeVAE(transformedNoise, stats);
  }

  private evaluateQuality(features: Record<string, any>, stats: any): number {
    let score = 0;
    let count = 0;

    for (const [key, value] of Object.entries(features)) {
      const featureStat = stats.featureStats[key];
      if (!featureStat) continue;

      if (featureStat.type === 'numeric' && typeof value === 'number') {
        const zScore = Math.abs((value - featureStat.mean) / (featureStat.stdDev || 1));
        const inRange = value >= featureStat.min && value <= featureStat.max;
        const localScore = inRange ? Math.exp(-zScore / 3) : 0.3;
        score += localScore;
        count++;
      } else if (featureStat.type === 'boolean') {
        score += 0.8;
        count++;
      } else if (featureStat.type === 'categorical') {
        const hasKey = Object.prototype.hasOwnProperty.call(
          featureStat.distribution,
          String(value)
        );
        score += hasKey ? 0.9 : 0.5;
        count++;
      }
    }

    return count > 0 ? score / count : 0.5;
  }

  async generatePulseSequence(
    sourceData: AnonymizedData[],
    sequenceLength: number,
    count: number
  ): Promise<SyntheticSample[]> {
    const samples: SyntheticSample[] = [];

    for (let i = 0; i < count; i++) {
      const baseStats = this.analyzeDistribution(sourceData);

      const sequence: number[] = [];
      let currentBpm = this.sampleGaussian(
        baseStats.featureStats.bpm?.mean || 70,
        baseStats.featureStats.bpm?.stdDev || 10
      );

      for (let t = 0; t < sequenceLength; t++) {
        const drift = this.sampleGaussian(0, 2);
        currentBpm = Math.max(50, Math.min(120, currentBpm + drift));
        sequence.push(currentBpm);
      }

      samples.push({
        features: { pulseSequence: sequence },
        sourceDistribution: 'temporal_sequence',
        qualityScore: 0.85,
        syntheticId: this.generateId(),
        generatedAt: new Date().toISOString(),
      });
    }

    return samples;
  }

  async generateEmotionTrajectory(
    sourceData: AnonymizedData[],
    trajectoryLength: number,
    count: number
  ): Promise<SyntheticSample[]> {
    const samples: SyntheticSample[] = [];

    for (let i = 0; i < count; i++) {
      const trajectory: { valence: number; arousal: number }[] = [];

      let valence = this.sampleGaussian(0, 0.5);
      let arousal = this.sampleGaussian(0, 0.5);

      for (let t = 0; t < trajectoryLength; t++) {
        valence = Math.max(-1, Math.min(1, valence + this.sampleGaussian(0, 0.15)));
        arousal = Math.max(-1, Math.min(1, arousal + this.sampleGaussian(0, 0.15)));

        trajectory.push({ valence, arousal });
      }

      samples.push({
        features: { emotionTrajectory: trajectory },
        sourceDistribution: 'emotion_temporal',
        qualityScore: 0.88,
        syntheticId: this.generateId(),
        generatedAt: new Date().toISOString(),
      });
    }

    return samples;
  }

  calculateDiversityScore(samples: SyntheticSample[]): number {
    if (samples.length < 2) return 0;

    let totalDistance = 0;
    let comparisons = 0;

    for (let i = 0; i < samples.length; i++) {
      for (let j = i + 1; j < Math.min(i + 10, samples.length); j++) {
        const distance = this.euclideanDistance(
          this.flattenFeatures(samples[i].features),
          this.flattenFeatures(samples[j].features)
        );
        totalDistance += distance;
        comparisons++;
      }
    }

    const avgDistance = comparisons > 0 ? totalDistance / comparisons : 0;

    return Math.min(1, avgDistance / 10);
  }

  private flattenFeatures(features: Record<string, any>): number[] {
    const flattened: number[] = [];

    const process = (value: any): void => {
      if (typeof value === 'number') {
        flattened.push(value);
      } else if (typeof value === 'boolean') {
        flattened.push(value ? 1 : 0);
      } else if (Array.isArray(value)) {
        value.forEach(process);
      } else if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(process);
      }
    };

    process(features);

    return flattened;
  }

  private euclideanDistance(a: number[], b: number[]): number {
    const minLength = Math.min(a.length, b.length);
    let sum = 0;

    for (let i = 0; i < minLength; i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }

    return Math.sqrt(sum);
  }

  private generateId(): string {
    return `syn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const syntheticGenerator = new SyntheticDataGenerator();
