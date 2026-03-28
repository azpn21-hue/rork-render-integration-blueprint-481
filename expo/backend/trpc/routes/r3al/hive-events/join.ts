import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const joinEventProcedure = protectedProcedure
  .input(z.object({ eventId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    console.log("[HiveEvents] User joining event:", input.eventId);

    const userId = ctx.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

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

      const event = eventResult.rows[0];
      const now = new Date();

      if (event.status === "cancelled") {
        throw new Error("Event is cancelled");
      }

      if (event.status === "completed") {
        throw new Error("Event has already completed");
      }

      if (new Date(event.start_time) > now) {
        if (new Date(event.start_time).getTime() - now.getTime() > 15 * 60000) {
          throw new Error("Event has not started yet");
        }
      }

      const existingResult = await client.query(
        `SELECT * FROM event_participants WHERE event_id = $1 AND user_id = $2`,
        [input.eventId, userId]
      );

      if (existingResult.rows.length > 0) {
        const participant = existingResult.rows[0];
        if (!participant.leave_time) {
          return {
            success: true,
            message: "Already joined",
            participantId: participant.id,
          };
        }

        await client.query(
          `UPDATE event_participants 
          SET join_time = NOW(), leave_time = NULL
          WHERE id = $1`,
          [participant.id]
        );

        await client.query("COMMIT");

        return {
          success: true,
          message: "Rejoined event",
          participantId: participant.id,
        };
      }

      const result = await client.query(
        `INSERT INTO event_participants (event_id, user_id)
        VALUES ($1, $2)
        RETURNING id`,
        [input.eventId, userId]
      );

      if (event.status === "scheduled" && new Date(event.start_time) <= now) {
        await client.query(
          `UPDATE hive_events SET status = 'active' WHERE event_id = $1`,
          [input.eventId]
        );
      }

      await client.query("COMMIT");

      console.log("[HiveEvents] User joined event:", result.rows[0].id);

      return {
        success: true,
        message: "Joined event",
        participantId: result.rows[0].id,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("[HiveEvents] Error joining event:", error);
      throw error;
    } finally {
      client.release();
    }
  });
