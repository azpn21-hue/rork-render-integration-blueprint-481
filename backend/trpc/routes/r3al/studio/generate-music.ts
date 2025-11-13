import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_URL = 'https://api.stability.ai/v2beta/stable-audio/generate/music';

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

      if (!STABILITY_API_KEY) {
        throw new Error('Stability API key not configured');
      }

      // Generate music using Stable Audio API
      const stableAudioResponse = await fetch(STABILITY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STABILITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input.prompt,
          duration: input.duration,
          output_format: 'mp3',
        }),
      });

      if (!stableAudioResponse.ok) {
        const error = await stableAudioResponse.text();
        console.error('[Studio] Stable Audio API error:', error);
        throw new Error(`Music generation failed: ${stableAudioResponse.statusText}`);
      }

      const audioBuffer = await stableAudioResponse.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');
      const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

      const stemResult = await pool.query(
        `INSERT INTO music_stems 
        (project_id, stem_type, file_url, duration_seconds, instrument, metadata, created_at)
        VALUES ($1, 'melody', $2, $3, $4, $5, NOW())
        RETURNING *`,
        [
          input.projectId,
          audioUrl,
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
          fileUrl: audioUrl,
          duration: input.duration,
          instrument: input.instrument || 'synth',
        },
        message: 'Music generated successfully using Stable Audio',
      };
    } catch (error) {
      console.error('[Studio] Failed to generate music:', error);
      throw error;
    }
  });
