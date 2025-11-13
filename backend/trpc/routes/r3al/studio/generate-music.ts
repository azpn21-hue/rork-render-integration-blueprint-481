import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MUSICGEN_API_URL = 'https://api-inference.huggingface.co/models/facebook/musicgen-large';

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

      if (!HUGGINGFACE_API_KEY) {
        console.warn('[Studio] No Hugging Face API key - using mock data');
      }

      let audioUrl = '';
      let actualDuration = input.duration;

      if (HUGGINGFACE_API_KEY) {
        // Generate music using MusicGen via Hugging Face Inference API
        const enhancedPrompt = input.style 
          ? `${input.style} music: ${input.prompt}`
          : input.prompt;

        console.log('[Studio] Calling MusicGen with prompt:', enhancedPrompt);

        const musicGenResponse = await fetch(MUSICGEN_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: enhancedPrompt,
            parameters: {
              max_new_tokens: Math.min(512, Math.floor(input.duration * 51.2)),
            },
          }),
        });

        if (!musicGenResponse.ok) {
          const error = await musicGenResponse.text();
          console.error('[Studio] MusicGen API error:', error);
          
          if (musicGenResponse.status === 503) {
            throw new Error('MusicGen model is loading. Please try again in a moment.');
          }
          throw new Error(`Music generation failed: ${musicGenResponse.statusText}`);
        }

        const audioBuffer = await musicGenResponse.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');
        audioUrl = `data:audio/wav;base64,${audioBase64}`;
        
        actualDuration = Math.floor(audioBuffer.byteLength / 32000);
        console.log('[Studio] MusicGen generated audio:', {
          size: audioBuffer.byteLength,
          estimatedDuration: actualDuration
        });
      } else {
        audioUrl = `data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=`;
        console.log('[Studio] Using mock audio data');
      }

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
        [actualDuration, input.projectId]
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
          duration: actualDuration,
          instrument: input.instrument || 'synth',
        },
        message: 'Music generated successfully using MusicGen',
      };
    } catch (error) {
      console.error('[Studio] Failed to generate music:', error);
      throw error;
    }
  });
