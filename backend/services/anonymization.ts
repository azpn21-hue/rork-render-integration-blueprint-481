import crypto from 'crypto';

export interface AnonymizationConfig {
  technique: 'k-anonymity' | 'differential_privacy' | 'generalization' | 'pseudonymization';
  privacyEpsilon?: number;
  kValue?: number;
  saltRounds?: number;
}

export interface AnonymizedData {
  features: Record<string, any>;
  metadata: {
    originalType: string;
    anonymizationTechnique: string;
    privacyLoss: number;
    timestamp: string;
  };
}

export class DataAnonymizer {
  private readonly salt: string;

  constructor(salt?: string) {
    this.salt = salt || process.env.ANONYMIZATION_SALT || 'default-salt-change-in-production';
  }

  async anonymizeUserData(
    userId: string,
    data: Record<string, any>,
    config: AnonymizationConfig
  ): Promise<AnonymizedData> {
    const startTime = Date.now();

    let anonymizedFeatures: Record<string, any>;
    let privacyLoss = 0;

    switch (config.technique) {
      case 'pseudonymization':
        anonymizedFeatures = await this.pseudonymize(userId, data);
        privacyLoss = 0.1;
        break;

      case 'differential_privacy':
        anonymizedFeatures = await this.applyDifferentialPrivacy(
          data,
          config.privacyEpsilon || 1.0
        );
        privacyLoss = config.privacyEpsilon || 1.0;
        break;

      case 'k-anonymity':
        anonymizedFeatures = await this.applyKAnonymity(data, config.kValue || 5);
        privacyLoss = 0.3;
        break;

      case 'generalization':
        anonymizedFeatures = await this.generalize(data);
        privacyLoss = 0.2;
        break;

      default:
        throw new Error(`Unknown anonymization technique: ${config.technique}`);
    }

    const processingTime = Date.now() - startTime;

    console.log(`[Anonymization] Technique: ${config.technique}, Time: ${processingTime}ms, Privacy Loss: ${privacyLoss}`);

    return {
      features: anonymizedFeatures,
      metadata: {
        originalType: typeof data,
        anonymizationTechnique: config.technique,
        privacyLoss,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private async pseudonymize(
    userId: string,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    const pseudoId = this.hashUserId(userId);

    const anonymized: Record<string, any> = {
      pseudoId,
    };

    for (const [key, value] of Object.entries(data)) {
      if (this.isIdentifier(key)) {
        continue;
      }

      if (typeof value === 'string' && this.looksLikePersonalInfo(value)) {
        anonymized[key] = this.maskString(value);
      } else if (typeof value === 'number') {
        anonymized[key] = this.addNoise(value, 0.05);
      } else {
        anonymized[key] = value;
      }
    }

    return anonymized;
  }

  private async applyDifferentialPrivacy(
    data: Record<string, any>,
    epsilon: number
  ): Promise<Record<string, any>> {
    const anonymized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (this.isIdentifier(key)) {
        continue;
      }

      if (typeof value === 'number') {
        const sensitivity = this.calculateSensitivity(value);
        const noise = this.laplaceNoise(sensitivity / epsilon);
        anonymized[key] = value + noise;
      } else if (Array.isArray(value)) {
        anonymized[key] = value.map((v) =>
          typeof v === 'number' ? v + this.laplaceNoise(1 / epsilon) : v
        );
      } else if (typeof value === 'object' && value !== null) {
        anonymized[key] = await this.applyDifferentialPrivacy(value, epsilon);
      } else {
        anonymized[key] = value;
      }
    }

    return anonymized;
  }

  private async applyKAnonymity(
    data: Record<string, any>,
    k: number
  ): Promise<Record<string, any>> {
    const anonymized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (this.isIdentifier(key)) {
        continue;
      }

      if (typeof value === 'number') {
        anonymized[key] = this.generalizeNumber(value, k);
      } else if (typeof value === 'string') {
        anonymized[key] = this.generalizeString(value);
      } else {
        anonymized[key] = value;
      }
    }

    return anonymized;
  }

  private async generalize(data: Record<string, any>): Promise<Record<string, any>> {
    const anonymized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (this.isIdentifier(key)) {
        continue;
      }

      if (typeof value === 'number') {
        anonymized[key] = this.generalizeNumber(value, 10);
      } else if (typeof value === 'string') {
        anonymized[key] = this.generalizeString(value);
      } else if (Array.isArray(value)) {
        anonymized[key] = value.map((v) =>
          typeof v === 'number' ? this.generalizeNumber(v, 10) : v
        );
      } else {
        anonymized[key] = value;
      }
    }

    return anonymized;
  }

  private hashUserId(userId: string): string {
    return crypto
      .createHash('sha256')
      .update(userId + this.salt)
      .digest('hex')
      .substring(0, 16);
  }

  private isIdentifier(key: string): boolean {
    const identifiers = [
      'userId',
      'user_id',
      'id',
      'email',
      'phone',
      'phoneNumber',
      'ssn',
      'name',
      'firstName',
      'lastName',
      'address',
      'ip',
      'ipAddress',
    ];
    return identifiers.some((id) => key.toLowerCase().includes(id.toLowerCase()));
  }

  private looksLikePersonalInfo(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-()]+$/;
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;

    return emailRegex.test(value) || phoneRegex.test(value) || ssnRegex.test(value);
  }

  private maskString(value: string): string {
    if (value.length <= 4) {
      return '***';
    }
    const visibleChars = 2;
    const masked =
      value.substring(0, visibleChars) +
      '*'.repeat(value.length - visibleChars * 2) +
      value.substring(value.length - visibleChars);
    return masked;
  }

  private addNoise(value: number, noiseLevel: number): number {
    const noise = (Math.random() - 0.5) * 2 * noiseLevel * value;
    return value + noise;
  }

  private laplaceNoise(scale: number): number {
    const u = Math.random() - 0.5;
    return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  }

  private calculateSensitivity(value: number): number {
    return Math.abs(value) * 0.1;
  }

  private generalizeNumber(value: number, binSize: number): number {
    return Math.floor(value / binSize) * binSize;
  }

  private generalizeString(value: string): string {
    if (value.length > 10) {
      return value.substring(0, 10) + '...';
    }
    return value;
  }

  async anonymizePulseData(pulseData: {
    userId: string;
    bpm: number;
    resonanceIndex: number;
    timestamp: Date;
    context?: string;
  }): Promise<AnonymizedData> {
    return this.anonymizeUserData(
      pulseData.userId,
      {
        bpm: pulseData.bpm,
        resonanceIndex: pulseData.resonanceIndex,
        hour: pulseData.timestamp.getHours(),
        dayOfWeek: pulseData.timestamp.getDay(),
        context: pulseData.context,
      },
      { technique: 'differential_privacy', privacyEpsilon: 0.5 }
    );
  }

  async anonymizeEmotionData(emotionData: {
    userId: string;
    valence: number;
    arousal: number;
    dominance?: number;
    context: string;
    timestamp: Date;
  }): Promise<AnonymizedData> {
    return this.anonymizeUserData(
      emotionData.userId,
      {
        valence: emotionData.valence,
        arousal: emotionData.arousal,
        dominance: emotionData.dominance,
        context: emotionData.context,
        hour: emotionData.timestamp.getHours(),
      },
      { technique: 'differential_privacy', privacyEpsilon: 0.8 }
    );
  }

  async anonymizeInteractionData(interactionData: {
    userId: string;
    partnerId: string;
    duration: number;
    resonance: number;
    sentiment: number;
    timestamp: Date;
  }): Promise<AnonymizedData> {
    return this.anonymizeUserData(
      interactionData.userId,
      {
        partnerPseudo: this.hashUserId(interactionData.partnerId),
        duration: interactionData.duration,
        resonance: interactionData.resonance,
        sentiment: interactionData.sentiment,
        hour: interactionData.timestamp.getHours(),
      },
      { technique: 'pseudonymization' }
    );
  }

  async batchAnonymize(
    dataItems: { userId: string; data: Record<string, any> }[],
    config: AnonymizationConfig
  ): Promise<AnonymizedData[]> {
    console.log(`[Anonymization] Batch processing ${dataItems.length} items...`);

    const results = await Promise.all(
      dataItems.map((item) => this.anonymizeUserData(item.userId, item.data, config))
    );

    console.log(`[Anonymization] Batch complete: ${results.length} items anonymized`);

    return results;
  }

  extractFeatureVector(anonymizedData: AnonymizedData): number[] {
    const features: number[] = [];

    const processValue = (value: any): void => {
      if (typeof value === 'number') {
        features.push(value);
      } else if (typeof value === 'boolean') {
        features.push(value ? 1 : 0);
      } else if (Array.isArray(value)) {
        value.forEach(processValue);
      } else if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(processValue);
      }
    };

    processValue(anonymizedData.features);

    return features;
  }
}

export const anonymizer = new DataAnonymizer();
