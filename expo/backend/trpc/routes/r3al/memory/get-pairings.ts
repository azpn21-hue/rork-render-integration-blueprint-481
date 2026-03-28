import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import {
  getUserPairings,
  logMemoryAction
} from '../../../../db/memory-queries';

export const getPairingsProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string().optional()
    })
  )
  .query(async ({ input, ctx }) => {
    const targetUserId = input.userId || ctx.userId;
    console.log(`[MemoryGraph] Retrieving pairings for ${targetUserId}`);

    try {
      const pairings = await getUserPairings(targetUserId);

      await logMemoryAction(
        ctx.userId,
        'get_pairings',
        'user',
        targetUserId
      );

      console.log(`[MemoryGraph] ✅ Found ${pairings.length} pairings`);
      return {
        success: true,
        pairings
      };
    } catch (error) {
      console.error(`[MemoryGraph] ❌ Failed to retrieve pairings:`, error);
      throw error;
    }
  });
