import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const startWritingSessionProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      projectId: z.string(),
      chapterNumber: z.number().int().positive().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[WritersGuild] Starting writing session:', input);

    try {
      const memberCheck = await pool.query(
        `SELECT member_id, tier, unrestricted_ai, unlimited_chat 
        FROM guild_members 
        WHERE user_id = $1`,
        [input.userId]
      );

      if (memberCheck.rows.length === 0) {
        await pool.query(
          `INSERT INTO guild_members (user_id, tier, unrestricted_ai, unlimited_chat, joined_at)
          VALUES ($1, 'free', false, false, NOW())`,
          [input.userId]
        );
        console.log('[WritersGuild] Created new guild member');
      }

      const projectCheck = await pool.query(
        `SELECT project_id, title, content_rating FROM writers_projects WHERE project_id = $1 AND user_id = $2`,
        [input.projectId, input.userId]
      );

      if (projectCheck.rows.length === 0) {
        throw new Error('Project not found or access denied');
      }

      const result = await pool.query(
        `INSERT INTO writing_sessions 
        (project_id, user_id, chapter_number, content, started_at)
        VALUES ($1, $2, $3, '', NOW())
        RETURNING *`,
        [input.projectId, input.userId, input.chapterNumber || null]
      );

      const session = result.rows[0];
      const member = memberCheck.rows[0] || { tier: 'free', unrestricted_ai: false, unlimited_chat: false };

      return {
        success: true,
        session: {
          sessionId: session.session_id,
          projectId: session.project_id,
          userId: session.user_id,
          chapterNumber: session.chapter_number,
          startedAt: session.started_at,
        },
        capabilities: {
          unrestrictedAI: member.unrestricted_ai,
          unlimitedChat: member.unlimited_chat,
          tier: member.tier,
          contentRating: projectCheck.rows[0].content_rating,
        },
      };
    } catch (error) {
      console.error('[WritersGuild] Failed to start session:', error);
      throw new Error('Failed to start writing session');
    }
  });
