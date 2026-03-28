import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { modelOrchestrator } from '../../../../services/model-orchestrator';

export const deployModelProcedure = protectedProcedure
  .input(
    z.object({
      versionId: z.string(),
      deploymentType: z.enum(['full_rollout', 'shadow_test', 'canary', 'rollback']),
      trafficPercentage: z.number().min(0).max(100).default(100),
    })
  )
  .mutation(async ({ input }) => {
    console.log(
      `[Deployment] Deploying model ${input.versionId} (${input.deploymentType})`
    );

    const result = await modelOrchestrator.deployModel(input.versionId, {
      type: input.deploymentType,
      trafficPercentage: input.trafficPercentage,
    });

    console.log(`[Deployment] Result: ${result.message}`);

    return {
      success: result.success,
      message: result.message,
    };
  });
