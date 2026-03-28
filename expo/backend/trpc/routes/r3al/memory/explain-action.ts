import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import {
  getExplainableChain,
  logMemoryAction
} from '../../../../db/memory-queries';

export const explainActionProcedure = protectedProcedure
  .input(
    z.object({
      actionId: z.string()
    })
  )
  .query(async ({ input, ctx }) => {
    console.log(`[MemoryGraph] Explaining action ${input.actionId}`);

    try {
      const chain = await getExplainableChain(input.actionId);

      if (!chain) {
        return {
          success: false,
          message: 'Action not found'
        };
      }

      await logMemoryAction(
        ctx.userId,
        'explain_action',
        'ai_action',
        input.actionId
      );

      console.log(`[MemoryGraph] ✅ Explainable chain built`);
      return {
        success: true,
        chain
      };
    } catch (error) {
      console.error(`[MemoryGraph] ❌ Failed to explain action:`, error);
      throw error;
    }
  });
