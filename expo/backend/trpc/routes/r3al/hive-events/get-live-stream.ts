import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const getLiveStreamProcedure = publicProcedure
  .input(z.object({ eventId: z.string().uuid() }))
  .query(async ({ input }) => {
    try {
      const result = await pool.query(
        `SELECT 
          user_id,
          bpm,
          resonance,
          emotion_tone,
          emotion_value,
          timestamp
        FROM event_live_data
        WHERE event_id = $1 
        AND timestamp > NOW() - INTERVAL '10 seconds'
        ORDER BY timestamp DESC`,
        [input.eventId]
      );

      const avgResonance = result.rows.length > 0
        ? result.rows
            .filter((r) => r.resonance !== null)
            .reduce((sum, r) => sum + parseFloat(r.resonance), 0) / 
          result.rows.filter((r) => r.resonance !== null).length
        : 0;

      const avgBpm = result.rows.length > 0
        ? result.rows
            .filter((r) => r.bpm !== null)
            .reduce((sum, r) => sum + parseFloat(r.bpm), 0) / 
          result.rows.filter((r) => r.bpm !== null).length
        : 0;

      return {
        success: true,
        avgResonance: avgResonance || 0,
        avgBpm: avgBpm || 0,
        activeParticipants: [...new Set(result.rows.map((r) => r.user_id))].length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[HiveEvents] Error getting live stream:", error);
      throw error;
    }
  });
