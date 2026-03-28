import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const shareMusicProcedure = publicProcedure
  .input(
    z.object({
      projectId: z.string().uuid(),
      userId: z.string(),
      platforms: z.array(z.enum(['facebook', 'instagram', 'twitter', 'soundcloud', 'tiktok', 'youtube'])),
      caption: z.string().max(500).optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[Studio] Sharing music project:', input.projectId);

    try {
      const projectCheck = await pool.query(
        `SELECT project_id, title, status 
        FROM music_projects 
        WHERE project_id = $1 AND user_id = $2`,
        [input.projectId, input.userId]
      );

      if (projectCheck.rows.length === 0) {
        throw new Error('Project not found or unauthorized');
      }

      if (projectCheck.rows[0].status !== 'completed' && projectCheck.rows[0].status !== 'published') {
        throw new Error('Project must be completed before sharing');
      }

      const shares = [];

      for (const platform of input.platforms) {
        const mockExternalUrl = `https://${platform}.com/r3al/${input.projectId}`;
        
        const shareResult = await pool.query(
          `INSERT INTO music_shares 
          (project_id, platform, external_url, share_count, created_at)
          VALUES ($1, $2, $3, 1, NOW())
          ON CONFLICT (project_id, platform) 
          DO UPDATE SET share_count = music_shares.share_count + 1
          RETURNING *`,
          [input.projectId, platform, mockExternalUrl]
        );

        shares.push({
          platform,
          externalUrl: mockExternalUrl,
          shareCount: shareResult.rows[0].share_count,
        });
      }

      await pool.query(
        `UPDATE music_projects 
        SET status = 'published', visibility = 'public', updated_at = NOW()
        WHERE project_id = $1`,
        [input.projectId]
      );

      console.log('[Studio] Music shared to platforms:', input.platforms);

      return {
        success: true,
        shares,
        message: 'In production, this would use platform APIs (Graph API, Twitter API, etc.)',
      };
    } catch (error) {
      console.error('[Studio] Failed to share music:', error);
      throw error;
    }
  });
