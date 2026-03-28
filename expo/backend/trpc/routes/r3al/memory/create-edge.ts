import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import {
  createFeltEdge,
  createPairedWithEdge,
  createJoinedEdge,
  createCausedEdge,
  logMemoryAction
} from '../../../../db/memory-queries';

export const createEdgeProcedure = protectedProcedure
  .input(
    z.object({
      edgeType: z.enum(['felt', 'paired_with', 'joined', 'caused', 'derived_from']),
      data: z.any()
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log(`[MemoryGraph] Creating ${input.edgeType} edge`);

    try {
      let result;

      switch (input.edgeType) {
        case 'felt':
          result = await createFeltEdge(
            input.data.userNodeId,
            input.data.emotionNodeId,
            input.data.confidence || 0.8
          );
          break;

        case 'paired_with':
          result = await createPairedWithEdge(
            input.data.userNodeAId,
            input.data.userNodeBId,
            input.data.resonance || 0.5,
            input.data.duration || 0
          );
          break;

        case 'joined':
          result = await createJoinedEdge(
            input.data.userNodeId,
            input.data.hiveEventNodeId
          );
          break;

        case 'caused':
          result = await createCausedEdge(
            input.data.emotionNodeId,
            input.data.aiActionNodeId,
            input.data.reasonWeight || 0.5
          );
          break;

        default:
          throw new Error(`Unknown edge type: ${input.edgeType}`);
      }

      await logMemoryAction(
        ctx.userId,
        'create_edge',
        undefined,
        undefined,
        input.edgeType,
        result.id
      );

      console.log(`[MemoryGraph] ✅ Edge created successfully: ${result.id}`);
      return {
        success: true,
        edge: result
      };
    } catch (error) {
      console.error(`[MemoryGraph] ❌ Failed to create edge:`, error);
      throw error;
    }
  });
