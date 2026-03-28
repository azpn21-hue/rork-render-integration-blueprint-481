import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { 
  createUserNode,
  createEmotionNode,
  createPulseNode,
  createInteractionNode,
  createHiveEventNode,
  createAIActionNode,
  logMemoryAction
} from '../../../../db/memory-queries';

function generateDummyEmbedding(size: number): number[] {
  return Array.from({ length: size }, () => Math.random() * 2 - 1);
}

export const createNodeProcedure = protectedProcedure
  .input(
    z.object({
      nodeType: z.enum(['user', 'emotion', 'pulse', 'interaction', 'hive_event', 'ai_action']),
      data: z.any()
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log(`[MemoryGraph] Creating ${input.nodeType} node`);

    try {
      let result;

      switch (input.nodeType) {
        case 'user':
          const profileVector = generateDummyEmbedding(512);
          result = await createUserNode(
            ctx.userId,
            profileVector,
            input.data.personalityTraits || {}
          );
          break;

        case 'emotion':
          const emotionEmbedding = generateDummyEmbedding(128);
          result = await createEmotionNode(
            ctx.userId,
            input.data.valence || 0,
            input.data.arousal || 0,
            input.data.context || '',
            emotionEmbedding,
            input.data.confidence || 0.8
          );
          break;

        case 'pulse':
          const pulseEmbedding = generateDummyEmbedding(64);
          result = await createPulseNode(
            ctx.userId,
            input.data.pulseId || `pulse_${Date.now()}`,
            input.data.bpm || 72,
            input.data.resonanceIndex || 0.5,
            pulseEmbedding
          );
          break;

        case 'interaction':
          const interactionEmbedding = generateDummyEmbedding(256);
          result = await createInteractionNode(
            ctx.userId,
            input.data.type || 'message',
            input.data.contentRef || '',
            interactionEmbedding
          );
          break;

        case 'hive_event':
          const hiveEmbedding = generateDummyEmbedding(256);
          result = await createHiveEventNode(
            input.data.eventId || `event_${Date.now()}`,
            input.data.theme || 'general',
            input.data.avgResonance || 0.5,
            hiveEmbedding
          );
          break;

        case 'ai_action':
          const aiEmbedding = generateDummyEmbedding(128);
          result = await createAIActionNode(
            input.data.actionId || `action_${Date.now()}`,
            input.data.intent || '',
            input.data.outcome || '',
            aiEmbedding
          );
          break;

        default:
          throw new Error(`Unknown node type: ${input.nodeType}`);
      }

      await logMemoryAction(
        ctx.userId,
        'create_node',
        input.nodeType,
        result.id
      );

      console.log(`[MemoryGraph] ✅ Node created successfully: ${result.id}`);
      return {
        success: true,
        node: result
      };
    } catch (error) {
      console.error(`[MemoryGraph] ❌ Failed to create node:`, error);
      throw error;
    }
  });
