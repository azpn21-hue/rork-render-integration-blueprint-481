import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const submitLiveDataProcedure = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
      bpm: z.number().optional(),
      resonance: z.number().min(0).max(1).optional(),
      emotionTone: z.string().optional(),
      emotionValue: z.number().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      const participantResult = await pool.query(
        `SELECT * FROM event_participants 
        WHERE event_id = $1 AND user_id = $2 AND leave_time IS NULL`,
        [input.eventId, userId]
      );

      if (participantResult.rows.length === 0) {
        throw new Error("Not currently in this event");
      }

      await pool.query(
        `INSERT INTO event_live_data 
        (event_id, user_id, bpm, resonance, emotion_tone, emotion_value)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          input.eventId,
          userId,
          input.bpm || null,
          input.resonance || null,
          input.emotionTone || null,
          input.emotionValue || null,
        ]
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error("[HiveEvents] Error submitting live data:", error);
      throw error;
    }
  });
