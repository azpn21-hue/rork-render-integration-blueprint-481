import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import {
  getUserContext,
  logMemoryAction
} from '../../../../db/memory-queries';

export const getContextProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string().optional()
    })
  )
  .query(async ({ input, ctx }) => {
    const targetUserId = input.userId || ctx.userId;
    console.log(`[MemoryGraph] Retrieving context for ${targetUserId}`);

    try {
      const context = await getUserContext(targetUserId);

      await logMemoryAction(
        ctx.userId,
        'get_context',
        'user',
        targetUserId
      );

      console.log(`[MemoryGraph] ✅ Context retrieved successfully`);
      return {
        success: true,
        context
      };
    } catch (error) {
      console.error(`[MemoryGraph] ❌ Failed to retrieve context:`, error);
      throw error;
    }
  });
