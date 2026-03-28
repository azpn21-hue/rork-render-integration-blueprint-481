import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { rewardModel } from '../../../../services/reward-model';

export const calculateRewardProcedure = protectedProcedure
  .input(
    z.object({
      sentimentBefore: z.number().min(-1).max(1),
      sentimentAfter: z.number().min(-1).max(1),
      engagementBefore: z.number().min(0).max(1),
      engagementAfter: z.number().min(0).max(1),
      actionType: z.string(),
      actionTiming: z.number().min(0),
      consentGiven: z.boolean(),
      privacyRespected: z.boolean(),
      userFeedback: z.number().min(-1).max(1).optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[Reward Calculation] Computing reward for action');

    const reward = rewardModel.calculateReward({
      sentimentBefore: input.sentimentBefore,
      sentimentAfter: input.sentimentAfter,
      engagementBefore: input.engagementBefore,
      engagementAfter: input.engagementAfter,
      consentGiven: input.consentGiven,
      privacyRespected: input.privacyRespected,
      actionType: input.actionType,
      actionTiming: input.actionTiming,
      userFeedback: input.userFeedback,
    });

    console.log(`[Reward Calculation] Total reward: ${reward.totalReward.toFixed(3)}`);

    return {
      success: true,
      reward: {
        totalReward: reward.totalReward,
        components: reward.components,
        explanation: reward.explanation,
      },
    };
  });
