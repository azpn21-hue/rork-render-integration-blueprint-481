import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { modelOrchestrator } from '../../../../services/model-orchestrator';

export const rollbackModelProcedure = protectedProcedure
  .input(
    z.object({
      versionId: z.string(),
      reason: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log(`[Rollback] Rolling back model ${input.versionId}: ${input.reason}`);

    const result = await modelOrchestrator.rollbackModel(input.versionId, input.reason);

    return {
      success: result.success,
      message: result.message,
    };
  });
