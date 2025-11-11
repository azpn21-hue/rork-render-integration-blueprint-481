import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import {
  findSimilarEmotions,
  findSimilarUsers,
  getUserNodeByUserId,
  logMemoryAction
} from '../../../../db/memory-queries';

function generateDummyEmbedding(size: number): number[] {
  return Array.from({ length: size }, () => Math.random() * 2 - 1);
}

export const querySimilarityProcedure = protectedProcedure
  .input(
    z.object({
      queryType: z.enum(['emotions', 'users']),
      embedding: z.array(z.number()).optional(),
      limit: z.number().optional()
    })
  )
  .query(async ({ input, ctx }) => {
    console.log(`[MemoryGraph] Querying similar ${input.queryType}`);

    try {
      let results;

      switch (input.queryType) {
        case 'emotions':
          const emotionEmbedding = input.embedding || generateDummyEmbedding(128);
          results = await findSimilarEmotions(emotionEmbedding, input.limit || 5);
          break;

        case 'users':
          const userNode = await getUserNodeByUserId(ctx.userId);
          if (!userNode) {
            const profileVector = generateDummyEmbedding(512);
            results = await findSimilarUsers(profileVector, input.limit || 5, ctx.userId);
          } else {
            const profileVector = input.embedding || generateDummyEmbedding(512);
            results = await findSimilarUsers(profileVector, input.limit || 5, ctx.userId);
          }
          break;

        default:
          throw new Error(`Unknown query type: ${input.queryType}`);
      }

      await logMemoryAction(
        ctx.userId,
        'query_similarity',
        input.queryType
      );

      console.log(`[MemoryGraph] ✅ Found ${results.length} similar ${input.queryType}`);
      return {
        success: true,
        results
      };
    } catch (error) {
      console.error(`[MemoryGraph] ❌ Failed to query similarity:`, error);
      throw error;
    }
  });
