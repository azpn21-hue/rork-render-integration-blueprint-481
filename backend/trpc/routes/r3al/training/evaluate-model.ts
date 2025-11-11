import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { modelOrchestrator } from '../../../../services/model-orchestrator';

export const evaluateModelProcedure = protectedProcedure
  .input(
    z.object({
      versionId: z.string(),
    })
  )
  .query(async ({ input }) => {
    console.log(`[Evaluation] Evaluating model ${input.versionId}`);

    const mockTestData: any[] = [];

    const evaluation = await modelOrchestrator.evaluateModel(input.versionId, mockTestData);

    console.log(`[Evaluation] Model ${input.versionId}: ${evaluation.passed ? 'PASSED' : 'FAILED'}`);

    return {
      success: true,
      evaluation: {
        passed: evaluation.passed,
        metrics: evaluation.metrics,
        recommendation: evaluation.recommendation,
      },
    };
  });
