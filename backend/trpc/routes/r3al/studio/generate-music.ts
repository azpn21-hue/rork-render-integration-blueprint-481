import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const generateMusicProcedure = publicProcedure
  .input(
    z.object({
      projectId: z.string().uuid(),
      userId: z.string(),
      prompt: z.string().min(1).max(1000),
      duration: z.number().int().min(10).max(180).default(30),
      style: z.enum(['ambient', 'electronic', 'pop', 'rock', 'classical', 'jazz', 'hiphop', 'custom']).optional(),
      instrument: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[Studio] Generating music for project:', input.projectId);

    try {
      const tierCheck = await pool.query(
        `SELECT tier, unlimited_images 
        FROM guild_members 
        WHERE user_id = $1`,
        [input.userId]
      );

      const canGenerate = tierCheck.rows.length > 0 && 
        (tierCheck.rows[0].tier === 'premium' || tierCheck.rows[0].tier === 'unlimited');

      if (!canGenerate) {
        throw new Error('Premium subscription required for music generation');
      }

      const mockAudioUrl = `https://example.com/music/${input.projectId}_${Date.now()}.mp3`;

      const stemResult = await pool.query(
        `INSERT INTO music_stems 
        (project_id, stem_type, file_url, duration_seconds, instrument, metadata, created_at)
        VALUES ($1, 'melody', $2, $3, $4, $5, NOW())
        RETURNING *`,
        [
          input.projectId,
          mockAudioUrl,
          input.duration,
          input.instrument || 'synth',
          JSON.stringify({ prompt: input.prompt, style: input.style })
        ]
      );

      await pool.query(
        `UPDATE music_projects 
        SET status = 'completed', duration_seconds = $1, updated_at = NOW()
        WHERE project_id = $2`,
        [input.duration, input.projectId]
      );

      await pool.query(
        `INSERT INTO premium_usage 
        (user_id, feature_type, usage_count, cost_tokens, metadata, created_at)
        VALUES ($1, 'music_generation', 1, 10.0, $2, NOW())`,
        [input.userId, JSON.stringify({ projectId: input.projectId })]
      );

      console.log('[Studio] Music generated successfully:', stemResult.rows[0].stem_id);

      return {
        success: true,
        stem: {
          stemId: stemResult.rows[0].stem_id,
          fileUrl: mockAudioUrl,
          duration: input.duration,
          instrument: input.instrument || 'synth',
        },
        message: 'Music generation complete. In production, this would use Mubert, Aiva, or similar API.',
      };
    } catch (error) {
      console.error('[Studio] Failed to generate music:', error);
      throw error;
    }
  });
