import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { pool } from '../../../../db/config';

export const emergencyPause = publicProcedure
  .input(z.object({
    parentUserId: z.string().uuid(),
    childUserId: z.string().uuid(),
    pause: z.boolean(),
    reason: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      console.log('[Emergency Pause]', {
        parentUserId: input.parentUserId,
        childUserId: input.childUserId,
        pause: input.pause,
        reason: input.reason
      });

      const relationship = await client.query(
        `SELECT 1 FROM parental_controls 
         WHERE parent_id = $1 AND child_id = $2`,
        [input.parentUserId, input.childUserId]
      );

      if (relationship.rows.length === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to pause this account.',
        });
      }

      await client.query(
        `UPDATE parental_controls 
         SET account_paused = $1,
             paused_at = ${input.pause ? 'NOW()' : 'NULL'},
             pause_reason = $2,
             updated_at = NOW()
         WHERE parent_id = $3 AND child_id = $4`,
        [input.pause, input.reason, input.parentUserId, input.childUserId]
      );

      if (input.pause) {
        await client.query(
          `DELETE FROM sessions WHERE user_id = $1`,
          [input.childUserId]
        );
      }

      await client.query(
        `INSERT INTO child_activity_log 
         (child_id, parent_id, activity_type, activity_description, activity_data, flagged, flag_severity)
         VALUES ($1, $2, $3, $4, $5, TRUE, 'high')`,
        [
          input.childUserId,
          input.parentUserId,
          input.pause ? 'logout' : 'login',
          `Parent ${input.pause ? 'paused' : 'unpaused'} account`,
          JSON.stringify({ reason: input.reason, timestamp: new Date().toISOString() })
        ]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: input.pause 
          ? 'Child account paused. All active sessions terminated.' 
          : 'Child account unpaused. Access restored.',
        paused: input.pause,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[Emergency Pause Error]', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to pause/unpause account.',
      });
    } finally {
      client.release();
    }
  });
