import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";
import { generateText } from "@rork-ai/toolkit-sdk";

export const completeEventProcedure = protectedProcedure
  .input(z.object({ eventId: z.string().uuid() }))
  .mutation(async ({ input }) => {
    console.log("[HiveEvents] Completing event:", input.eventId);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const eventResult = await client.query(
        `SELECT * FROM hive_events WHERE event_id = $1`,
        [input.eventId]
      );

      if (eventResult.rows.length === 0) {
        throw new Error("Event not found");
      }

      const liveDataResult = await client.query(
        `SELECT 
          AVG(bpm) as avg_bpm,
          AVG(resonance) as avg_resonance,
          MAX(resonance) as peak_resonance,
          emotion_tone,
          COUNT(*) as count
        FROM event_live_data
        WHERE event_id = $1
        GROUP BY emotion_tone`,
        [input.eventId]
      );

      const participantResult = await client.query(
        `SELECT COUNT(DISTINCT user_id) as participant_count
        FROM event_participants
        WHERE event_id = $1`,
        [input.eventId]
      );

      const avgBpm = liveDataResult.rows.length > 0 
        ? parseFloat(liveDataResult.rows[0].avg_bpm) || null
        : null;
      
      const avgResonance = liveDataResult.rows.length > 0
        ? parseFloat(liveDataResult.rows[0].avg_resonance) || null
        : null;

      const peakResonance = liveDataResult.rows.length > 0
        ? parseFloat(liveDataResult.rows[0].peak_resonance) || null
        : null;

      const emotionDistribution: Record<string, number> = {};
      liveDataResult.rows.forEach((row) => {
        if (row.emotion_tone) {
          emotionDistribution[row.emotion_tone] = parseInt(row.count);
        }
      });

      const participantCount = parseInt(participantResult.rows[0].participant_count) || 0;

      const coherenceScore = avgResonance && avgResonance > 0.7 ? avgResonance * 100 : (avgResonance || 0) * 80;

      const aiSummary = await generateEventSummary(
        eventResult.rows[0],
        {
          avgBpm,
          avgResonance,
          peakResonance,
          emotionDistribution,
          participantCount,
          coherenceScore,
        }
      );

      await client.query(
        `INSERT INTO event_metrics 
        (event_id, avg_bpm, avg_resonance, peak_resonance, emotion_distribution, participant_count, coherence_score, ai_summary)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (event_id) DO UPDATE SET
          avg_bpm = EXCLUDED.avg_bpm,
          avg_resonance = EXCLUDED.avg_resonance,
          peak_resonance = EXCLUDED.peak_resonance,
          emotion_distribution = EXCLUDED.emotion_distribution,
          participant_count = EXCLUDED.participant_count,
          coherence_score = EXCLUDED.coherence_score,
          ai_summary = EXCLUDED.ai_summary,
          generated_at = NOW()`,
        [
          input.eventId,
          avgBpm,
          avgResonance,
          peakResonance,
          JSON.stringify(emotionDistribution),
          participantCount,
          coherenceScore,
          aiSummary,
        ]
      );

      await client.query(
        `UPDATE hive_events SET status = 'completed' WHERE event_id = $1`,
        [input.eventId]
      );

      await client.query(
        `UPDATE event_participants SET leave_time = NOW() 
        WHERE event_id = $1 AND leave_time IS NULL`,
        [input.eventId]
      );

      await client.query("COMMIT");

      console.log("[HiveEvents] Event completed:", input.eventId);

      return {
        success: true,
        metrics: {
          avgBpm,
          avgResonance,
          peakResonance,
          emotionDistribution,
          participantCount,
          coherenceScore,
          aiSummary,
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("[HiveEvents] Error completing event:", error);
      throw error;
    } finally {
      client.release();
    }
  });

async function generateEventSummary(event: any, metrics: any): Promise<string> {
  try {
    const prompt = `Generate a concise, inspirational summary for a completed Hive Event:

Title: ${event.title}
Theme: ${event.theme}
Duration: ${event.duration} minutes
Participants: ${metrics.participantCount}
Average Resonance: ${metrics.avgResonance ? (metrics.avgResonance * 100).toFixed(1) : "N/A"}%
Coherence Score: ${metrics.coherenceScore ? metrics.coherenceScore.toFixed(1) : "N/A"}%

Write a 2-3 sentence summary that:
- Acknowledges the collective experience
- Highlights the resonance/coherence achieved
- Encourages future participation

Keep it warm, authentic, and under 150 words.`;

    const summary = await generateText(prompt);
    return summary.trim();
  } catch (error) {
    console.error("[HiveEvents] Error generating summary:", error);
    return `The Hive maintained ${metrics.coherenceScore?.toFixed(0) || 0}% coherence during this ${event.theme} session. ${metrics.participantCount} participants connected through shared intention.`;
  }
}
