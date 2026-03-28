import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const getEventDetailProcedure = protectedProcedure
  .input(z.object({ eventId: z.string().uuid() }))
  .query(async ({ input }) => {
    console.log("[HiveEvents] Fetching event detail:", input.eventId);

    try {
      const eventResult = await pool.query(
        `SELECT * FROM hive_events WHERE event_id = $1`,
        [input.eventId]
      );

      if (eventResult.rows.length === 0) {
        throw new Error("Event not found");
      }

      const participantsResult = await pool.query(
        `SELECT 
          ep.*,
          u.username,
          p.display_name,
          p.avatar_url
        FROM event_participants ep
        LEFT JOIN users u ON ep.user_id = u.id
        LEFT JOIN profiles p ON ep.user_id = p.user_id
        WHERE ep.event_id = $1
        ORDER BY ep.join_time DESC`,
        [input.eventId]
      );

      const metricsResult = await pool.query(
        `SELECT * FROM event_metrics WHERE event_id = $1`,
        [input.eventId]
      );

      const event = eventResult.rows[0];
      const metrics = metricsResult.rows[0] || null;

      return {
        success: true,
        event: {
          id: event.event_id,
          circleId: event.circle_id,
          title: event.title,
          theme: event.theme,
          description: event.description,
          startTime: event.start_time,
          endTime: event.end_time,
          duration: event.duration,
          status: event.status,
          aiCuratorNotes: event.ai_curator_notes,
          createdAt: event.created_at,
        },
        participants: participantsResult.rows.map((p) => ({
          userId: p.user_id,
          username: p.username,
          displayName: p.display_name,
          avatarUrl: p.avatar_url,
          joinTime: p.join_time,
          leaveTime: p.leave_time,
          resonanceAvg: p.resonance_avg ? parseFloat(p.resonance_avg) : null,
        })),
        metrics: metrics
          ? {
              avgBpm: metrics.avg_bpm ? parseFloat(metrics.avg_bpm) : null,
              avgResonance: metrics.avg_resonance ? parseFloat(metrics.avg_resonance) : null,
              peakResonance: metrics.peak_resonance ? parseFloat(metrics.peak_resonance) : null,
              emotionDistribution: metrics.emotion_distribution,
              participantCount: metrics.participant_count,
              coherenceScore: metrics.coherence_score ? parseFloat(metrics.coherence_score) : null,
              aiSummary: metrics.ai_summary,
              generatedAt: metrics.generated_at,
            }
          : null,
      };
    } catch (error) {
      console.error("[HiveEvents] Error fetching event detail:", error);
      throw new Error("Failed to fetch event detail");
    }
  });
