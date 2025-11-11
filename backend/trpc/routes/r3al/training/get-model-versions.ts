import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { modelOrchestrator } from '../../../../services/model-orchestrator';

export const getModelVersionsProcedure = protectedProcedure
  .input(
    z
      .object({
        status: z.enum(['training', 'evaluating', 'deployed', 'archived', 'rollback']).optional(),
        modelType: z.enum(['policy', 'empathy', 'timing', 'tone']).optional(),
      })
      .optional()
  )
  .query(async ({ input }) => {
    console.log('[Model Versions] Fetching model versions');

    let versions = modelOrchestrator.getActiveModels();

    if (input?.status) {
      versions = versions.filter((v) => v.status === input.status);
    }

    if (input?.modelType) {
      versions = versions.filter((v) => v.modelType === input.modelType);
    }

    return {
      success: true,
      versions: versions.map((v) => ({
        versionId: v.versionId,
        versionTag: v.versionTag,
        modelType: v.modelType,
        status: v.status,
        metrics: v.metrics,
        deployedAt: v.deployedAt?.toISOString(),
        createdAt: v.createdAt.toISOString(),
      })),
    };
  });
