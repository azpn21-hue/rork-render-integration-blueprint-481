import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { modelOrchestrator } from '../../../../services/model-orchestrator';

export const monitorModelProcedure = protectedProcedure
  .input(
    z.object({
      versionId: z.string(),
    })
  )
  .query(async ({ input }) => {
    console.log(`[Monitoring] Monitoring model ${input.versionId}`);

    const monitoring = modelOrchestrator.monitorDeployedModel(input.versionId);

    return {
      success: true,
      health: monitoring.health,
      metrics: monitoring.metrics,
      recommendations: monitoring.recommendations,
    };
  });
