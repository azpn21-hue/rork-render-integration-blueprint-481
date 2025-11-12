import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { pool } from '../../../../db/config';

export const approveContact = publicProcedure
  .input(z.object({
    parentUserId: z.string().uuid(),
    childUserId: z.string().uuid(),
    requesterId: z.string().uuid(),
    approved: z.boolean(),
    notes: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      console.log('[Approve Contact Request]', {
        parentUserId: input.parentUserId,
        childUserId: input.childUserId,
        requesterId: input.requesterId,
        approved: input.approved
      });

      const relationship = await client.query(
        `SELECT 1 FROM parental_controls 
         WHERE parent_id = $1 AND child_id = $2`,
        [input.parentUserId, input.childUserId]
      );

      if (relationship.rows.length === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to approve contacts for this child.',
        });
      }

      const updateResult = await client.query(
        `UPDATE child_contact_requests 
         SET status = $1::contact_request_status_enum,
             reviewed_by_parent = TRUE,
             reviewed_at = NOW(),
             parent_notes = $2
         WHERE child_id = $3 AND requester_id = $4 AND status = 'pending'
         RETURNING id`,
        [
          input.approved ? 'approved' : 'denied',
          input.notes,
          input.childUserId,
          input.requesterId
        ]
      );

      if (updateResult.rows.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contact request not found or already processed.',
        });
      }

      if (input.approved) {
        await client.query(
          `UPDATE parental_controls 
           SET approved_contact_ids = array_append(approved_contact_ids, $1::uuid)
           WHERE parent_id = $2 AND child_id = $3`,
          [input.requesterId, input.parentUserId, input.childUserId]
        );
      } else {
        await client.query(
          `UPDATE parental_controls 
           SET blocked_contact_ids = array_append(blocked_contact_ids, $1::uuid)
           WHERE parent_id = $2 AND child_id = $3`,
          [input.requesterId, input.parentUserId, input.childUserId]
        );
      }

      await client.query(
        `INSERT INTO child_activity_log 
         (child_id, parent_id, activity_type, activity_description, activity_data, flagged, flag_severity)
         VALUES ($1, $2, $3, $4, $5, $6, 'medium')`,
        [
          input.childUserId,
          input.parentUserId,
          input.approved ? 'connection_accepted' : 'connection_requested',
          `Parent ${input.approved ? 'approved' : 'denied'} contact request from user ${input.requesterId}`,
          JSON.stringify({ requesterId: input.requesterId, approved: input.approved, notes: input.notes }),
          !input.approved
        ]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: input.approved 
          ? 'Contact request approved. Connection established.' 
          : 'Contact request denied.',
        approved: input.approved,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[Approve Contact Error]', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to process contact approval.',
      });
    } finally {
      client.release();
    }
  });
