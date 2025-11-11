import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const leaveEventProcedure = protectedProcedure
  .input(z.object({ eventId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    console.log("[HiveEvents] User leaving event:", input.eventId);

    const userId = ctx.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      const result = await pool.query(
        `UPDATE event_participants 
        SET leave_time = NOW()
        WHERE event_id = $1 AND user_id = $2 AND leave_time IS NULL
        RETURNING id`,
        [input.eventId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error("Not currently in this event");
      }

      console.log("[HiveEvents] User left event");

      return {
        success: true,
        message: "Left event",
      };
    } catch (error) {
      console.error("[HiveEvents] Error leaving event:", error);
      throw error;
    }
  });
