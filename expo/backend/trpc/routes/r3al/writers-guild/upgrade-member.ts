import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const upgradeMemberProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      tier: z.enum(['basic', 'premium', 'unlimited']),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[WritersGuild] Upgrading member tier:', input);

    try {
      const features: Record<string, { unlimited_chat: boolean; unlimited_images: boolean; unrestricted_ai: boolean }> = {
        basic: { unlimited_chat: false, unlimited_images: false, unrestricted_ai: false },
        premium: { unlimited_chat: true, unlimited_images: true, unrestricted_ai: true },
        unlimited: { unlimited_chat: true, unlimited_images: true, unrestricted_ai: true },
      };

      const tierFeatures = features[input.tier];

      const result = await pool.query(
        `INSERT INTO guild_members 
        (user_id, tier, unlimited_chat, unlimited_images, unrestricted_ai, joined_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          tier = $2,
          unlimited_chat = $3,
          unlimited_images = $4,
          unrestricted_ai = $5
        RETURNING *`,
        [
          input.userId,
          input.tier,
          tierFeatures.unlimited_chat,
          tierFeatures.unlimited_images,
          tierFeatures.unrestricted_ai,
        ]
      );

      const member = result.rows[0];

      console.log('[WritersGuild] Member upgraded to:', input.tier);

      return {
        success: true,
        member: {
          memberId: member.member_id,
          userId: member.user_id,
          tier: member.tier,
          unlimitedChat: member.unlimited_chat,
          unlimitedImages: member.unlimited_images,
          unrestrictedAI: member.unrestricted_ai,
          joinedAt: member.joined_at,
        },
      };
    } catch (error) {
      console.error('[WritersGuild] Failed to upgrade member:', error);
      throw new Error('Failed to upgrade guild member');
    }
  });
