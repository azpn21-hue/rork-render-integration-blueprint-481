import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const getCircleEventsProcedure = protectedProcedure
  .input(z.object({ circleId: z.string().uuid() }))
  .query(async ({ input }) => {
    console.log("[HiveEvents] Fetching events for circle:", input.circleId);

    try {
      const result = await pool.query(
        `SELECT 
          e.*,
          (SELECT COUNT(*) FROM event_participants WHERE event_id = e.event_id) as participant_count
        FROM hive_events e
        WHERE e.circle_id = $1
        ORDER BY e.start_time DESC`,
        [input.circleId]
      );

      return {
        success: true,
        events: result.rows.map((row) => ({
          id: row.event_id,
          circleId: row.circle_id,
          title: row.title,
          theme: row.theme,
          description: row.description,
          startTime: row.start_time,
          endTime: row.end_time,
          duration: row.duration,
          status: row.status,
          aiCuratorNotes: row.ai_curator_notes,
          participantCount: parseInt(row.participant_count) || 0,
          createdAt: row.created_at,
        })),
      };
    } catch (error) {
      console.error("[HiveEvents] Error fetching events:", error);
      throw new Error("Failed to fetch events");
    }
  });
