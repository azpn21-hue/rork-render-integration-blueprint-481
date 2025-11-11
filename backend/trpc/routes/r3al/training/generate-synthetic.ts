import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { syntheticGenerator } from '../../../../services/synthetic-generator';
import { anonymizer } from '../../../../services/anonymization';

export const generateSyntheticDataProcedure = protectedProcedure
  .input(
    z.object({
      method: z.enum(['vae', 'diffusion', 'gan', 'rule_based']),
      sampleCount: z.number().min(10).max(5000).default(100),
      sourceDataCount: z.number().min(10).max(500).default(50),
      qualityThreshold: z.number().min(0).max(1).default(0.7),
    })
  )
  .mutation(async ({ input }) => {
    console.log(
      `[Synthetic Generation] Generating ${input.sampleCount} samples using ${input.method}`
    );

    const mockSourceData = Array.from({ length: input.sourceDataCount }, (_, i) => ({
      userId: `user_${i}`,
      data: {
        valence: Math.random() * 2 - 1,
        arousal: Math.random() * 2 - 1,
        bpm: 60 + Math.random() * 40,
        resonanceIndex: Math.random(),
        timestamp: new Date(),
        hour: Math.floor(Math.random() * 24),
      },
    }));

    const anonymizedData = await anonymizer.batchAnonymize(mockSourceData, {
      technique: 'differential_privacy',
      privacyEpsilon: 0.5,
    });

    const syntheticSamples = await syntheticGenerator.generateFromAnonymized(anonymizedData, {
      method: input.method,
      sampleCount: input.sampleCount,
      qualityThreshold: input.qualityThreshold,
    });

    const diversityScore = syntheticGenerator.calculateDiversityScore(syntheticSamples);

    const avgQuality =
      syntheticSamples.reduce((sum, s) => sum + s.qualityScore, 0) / syntheticSamples.length;

    console.log(
      `[Synthetic Generation] Generated ${syntheticSamples.length} samples. Quality: ${avgQuality.toFixed(3)}, Diversity: ${diversityScore.toFixed(3)}`
    );

    return {
      success: true,
      summary: {
        method: input.method,
        sourceCount: mockSourceData.length,
        generatedCount: syntheticSamples.length,
        avgQuality,
        diversityScore,
      },
      samples: syntheticSamples.slice(0, 5).map((s) => ({
        features: s.features,
        qualityScore: s.qualityScore,
        sourceDistribution: s.sourceDistribution,
      })),
    };
  });
