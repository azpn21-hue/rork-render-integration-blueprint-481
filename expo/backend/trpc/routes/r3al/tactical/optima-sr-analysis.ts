import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";
import { generateText } from "@rork-ai/toolkit-sdk";

export const getOptimaSRAnalysisProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      sessionType: z.enum(['stress_assessment', 'pre_deployment', 'post_incident', 'routine_check', 'crisis']),
      stressIndicators: z.object({
        heartRate: z.number().optional(),
        sleepQuality: z.number().min(0).max(10).optional(),
        moodRating: z.number().min(0).max(10).optional(),
        recentIncidents: z.array(z.string()).optional(),
      }),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[Tactical-HQ] Generating Optima SR analysis:', input.sessionType);

    try {
      const tacticalCheck = await pool.query(
        `SELECT tactical_id, role, organization, clearance_level 
        FROM tactical_users 
        WHERE user_id = $1`,
        [input.userId]
      );

      if (tacticalCheck.rows.length === 0) {
        throw new Error('User not registered in Tactical HQ');
      }

      const tacticalUser = tacticalCheck.rows[0];

      const analysisPrompt = `You are Optima SR, an AI specialized in supporting military personnel and first responders with stress resilience and mental health.

User Role: ${tacticalUser.role}
Organization: ${tacticalUser.organization}
Session Type: ${input.sessionType}

Current Indicators:
- Heart Rate: ${input.stressIndicators.heartRate || 'Not provided'}
- Sleep Quality: ${input.stressIndicators.sleepQuality || 'Not provided'}/10
- Mood Rating: ${input.stressIndicators.moodRating || 'Not provided'}/10
- Recent Incidents: ${input.stressIndicators.recentIncidents?.join(', ') || 'None reported'}

Provide a compassionate, professional stress resilience analysis including:
1. Current stress level assessment
2. Specific recommendations for this ${input.sessionType} session
3. Coping strategies tailored to ${tacticalUser.role}
4. Warning signs to monitor
5. When to seek additional support

Keep it concise, actionable, and supportive. Acknowledge the unique challenges of their role.`;

      const analysis = await generateText({
        messages: [
          { role: 'user', content: analysisPrompt }
        ]
      });

      const stressLevel = input.stressIndicators.moodRating 
        ? (10 - input.stressIndicators.moodRating) / 10 
        : 0.5;

      const recommendations = [
        'Practice box breathing: 4 seconds in, 4 hold, 4 out, 4 hold',
        'Maintain regular sleep schedule',
        'Connect with peer support network',
        'Physical activity for stress release',
        'Professional counseling if symptoms persist',
      ];

      const sessionResult = await pool.query(
        `INSERT INTO optima_sr_sessions 
        (tactical_user_id, session_type, stress_level, recommendations, interventions, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *`,
        [
          tacticalUser.tactical_id,
          input.sessionType,
          stressLevel,
          recommendations,
          JSON.stringify({ indicators: input.stressIndicators }),
        ]
      );

      console.log('[Tactical-HQ] Optima SR session created:', sessionResult.rows[0].session_id);

      return {
        success: true,
        session: {
          sessionId: sessionResult.rows[0].session_id,
          sessionType: input.sessionType,
          stressLevel,
        },
        analysis,
        recommendations,
        supportResources: {
          veteransCrisisLine: '1-800-273-8255',
          militaryOneSource: '1-800-342-9647',
          copline: '1-800-267-5463',
        },
      };
    } catch (error) {
      console.error('[Tactical-HQ] Failed to generate Optima SR analysis:', error);
      throw error;
    }
  });
