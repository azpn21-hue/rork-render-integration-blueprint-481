import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";
import { generateText } from "@rork-ai/toolkit-sdk";

const createEventSchema = z.object({
  circleId: z.string().uuid(),
  title: z.string().min(1).max(255),
  theme: z.enum(["calm", "focus", "gratitude", "energy", "empathy", "mindful", "celebration"]),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  duration: z.number().int().min(5).max(180),
});

export const createHiveEventProcedure = protectedProcedure
  .input(createEventSchema)
  .mutation(async ({ input, ctx }) => {
    console.log("[HiveEvents] Creating event:", input);

    const userId = ctx.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const startTime = new Date(input.startTime);
      const endTime = new Date(startTime.getTime() + input.duration * 60000);

      const aiNotes = await generateAICuratorNotes(input.theme, input.title, input.duration);

      const result = await client.query(
        `INSERT INTO hive_events 
        (circle_id, title, theme, description, start_time, end_time, duration, ai_curator_notes, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          input.circleId,
          input.title,
          input.theme,
          input.description || null,
          startTime,
          endTime,
          input.duration,
          JSON.stringify(aiNotes),
          "scheduled",
        ]
      );

      await client.query("COMMIT");

      console.log("[HiveEvents] Event created:", result.rows[0].event_id);

      return {
        success: true,
        event: {
          id: result.rows[0].event_id,
          circleId: result.rows[0].circle_id,
          title: result.rows[0].title,
          theme: result.rows[0].theme,
          description: result.rows[0].description,
          startTime: result.rows[0].start_time,
          endTime: result.rows[0].end_time,
          duration: result.rows[0].duration,
          status: result.rows[0].status,
          aiCuratorNotes: result.rows[0].ai_curator_notes,
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("[HiveEvents] Error creating event:", error);
      throw new Error("Failed to create event");
    } finally {
      client.release();
    }
  });

async function generateAICuratorNotes(
  theme: string,
  title: string,
  duration: number
): Promise<any> {
  try {
    const prompt = `Generate a brief AI curator note for a Hive Event with the following details:
Theme: ${theme}
Title: ${title}
Duration: ${duration} minutes

Provide a JSON response with:
- mood: A single word describing the desired emotional state
- soundscape: A brief description of recommended ambient sounds
- colorScheme: An array of 2-3 hex colors
- guidance: A short phrase to guide participants (max 15 words)

Keep it concise and aligned with the theme.`;

    const response = await generateText(prompt);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      mood: theme,
      soundscape: "Ambient atmosphere",
      colorScheme: ["#6366f1", "#8b5cf6"],
      guidance: `Experience ${theme} together`,
    };
  } catch (error) {
    console.error("[HiveEvents] Error generating AI notes:", error);
    return {
      mood: theme,
      soundscape: "Ambient atmosphere",
      colorScheme: ["#6366f1", "#8b5cf6"],
      guidance: `Experience ${theme} together`,
    };
  }
}
