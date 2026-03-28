import { pool } from "../db/config";

export async function runEventScheduler() {
  console.log("[EventScheduler] Running scheduled tasks...");

  try {
    await autoStartEvents();
    await autoCompleteEvents();
    await cleanupOldLiveData();
  } catch (error) {
    console.error("[EventScheduler] Error running scheduler:", error);
  }
}

async function autoStartEvents() {
  try {
    const result = await pool.query(
      `UPDATE hive_events 
      SET status = 'active' 
      WHERE status = 'scheduled' 
      AND start_time <= NOW() 
      AND end_time > NOW()
      RETURNING event_id, title`,
    );

    if (result.rows.length > 0) {
      console.log("[EventScheduler] Auto-started events:", result.rows);
    }
  } catch (error) {
    console.error("[EventScheduler] Error auto-starting events:", error);
  }
}

async function autoCompleteEvents() {
  try {
    const result = await pool.query(
      `UPDATE hive_events 
      SET status = 'completed' 
      WHERE status = 'active' 
      AND end_time <= NOW()
      RETURNING event_id, title`,
    );

    if (result.rows.length > 0) {
      console.log("[EventScheduler] Auto-completed events:", result.rows);
      
      for (const event of result.rows) {
        await generateEventMetrics(event.event_id);
      }
    }
  } catch (error) {
    console.error("[EventScheduler] Error auto-completing events:", error);
  }
}

async function generateEventMetrics(eventId: string) {
  try {
    const liveDataResult = await pool.query(
      `SELECT 
        AVG(bpm) as avg_bpm,
        AVG(resonance) as avg_resonance,
        MAX(resonance) as peak_resonance,
        emotion_tone,
        COUNT(*) as count
      FROM event_live_data
      WHERE event_id = $1
      GROUP BY emotion_tone`,
      [eventId]
    );

    const participantResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as participant_count
      FROM event_participants
      WHERE event_id = $1`,
      [eventId]
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

    await pool.query(
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
        generated_at = NOW()`,
      [
        eventId,
        avgBpm,
        avgResonance,
        peakResonance,
        JSON.stringify(emotionDistribution),
        participantCount,
        coherenceScore,
        `The Hive maintained ${coherenceScore?.toFixed(0) || 0}% coherence during this session.`,
      ]
    );

    console.log("[EventScheduler] Generated metrics for event:", eventId);
  } catch (error) {
    console.error("[EventScheduler] Error generating metrics:", error);
  }
}

async function cleanupOldLiveData() {
  try {
    const result = await pool.query(
      `DELETE FROM event_live_data 
      WHERE created_at < NOW() - INTERVAL '7 days'
      RETURNING event_id`,
    );

    if (result.rows.length > 0) {
      console.log("[EventScheduler] Cleaned up old live data:", result.rows.length, "records");
    }
  } catch (error) {
    console.error("[EventScheduler] Error cleaning up old data:", error);
  }
}

let schedulerInterval: NodeJS.Timeout | null = null;

export function startEventScheduler() {
  if (schedulerInterval) {
    console.log("[EventScheduler] Scheduler already running");
    return;
  }

  console.log("[EventScheduler] Starting scheduler (runs every 30 seconds)");
  
  runEventScheduler();
  
  schedulerInterval = setInterval(() => {
    runEventScheduler();
  }, 30000);
}

export function stopEventScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("[EventScheduler] Scheduler stopped");
  }
}
