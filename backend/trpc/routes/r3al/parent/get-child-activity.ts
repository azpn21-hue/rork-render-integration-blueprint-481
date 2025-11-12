import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { pool } from '../../../../db/config';

export const getChildActivity = publicProcedure
  .input(z.object({
    parentUserId: z.string().uuid(),
    childUserId: z.string().uuid(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
    flaggedOnly: z.boolean().default(false),
    unreviewedOnly: z.boolean().default(false),
  }))
  .query(async ({ input }) => {
    const client = await pool.connect();
    
    try {
      console.log('[Get Child Activity]', {
        parentUserId: input.parentUserId,
        childUserId: input.childUserId,
        flaggedOnly: input.flaggedOnly,
        unreviewedOnly: input.unreviewedOnly
      });

      const relationship = await client.query(
        `SELECT 1 FROM parental_controls 
         WHERE parent_id = $1 AND child_id = $2`,
        [input.parentUserId, input.childUserId]
      );

      if (relationship.rows.length === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to view this child\'s activity.',
        });
      }

      let query = `
        SELECT 
          id, activity_type, activity_description, activity_data,
          related_user_id, flagged, flag_reason, flag_severity,
          reviewed_by_parent, created_at
        FROM child_activity_log
        WHERE child_id = $1 AND parent_id = $2
      `;

      const params: any[] = [input.childUserId, input.parentUserId];
      let paramIndex = 3;

      if (input.flaggedOnly) {
        query += ` AND flagged = TRUE`;
      }

      if (input.unreviewedOnly) {
        query += ` AND reviewed_by_parent = FALSE`;
      }

      query += ` ORDER BY created_at DESC LIMIT ${paramIndex} OFFSET ${paramIndex + 1}`;
      params.push(input.limit, input.offset);

      const result = await client.query(query, params);

      const countQuery = `
        SELECT COUNT(*) as total FROM child_activity_log
        WHERE child_id = $1 AND parent_id = $2
        ${input.flaggedOnly ? 'AND flagged = TRUE' : ''}
        ${input.unreviewedOnly ? 'AND reviewed_by_parent = FALSE' : ''}
      `;
      const countResult = await client.query(countQuery, [input.childUserId, input.parentUserId]);
      const totalCount = parseInt(countResult.rows[0]?.total || '0', 10);

      return {
        success: true,
        activities: result.rows.map(row => ({
          id: row.id,
          activityType: row.activity_type,
          activityDescription: row.activity_description,
          activityData: row.activity_data,
          relatedUserId: row.related_user_id,
          flagged: row.flagged,
          flagReason: row.flag_reason,
          flagSeverity: row.flag_severity,
          reviewedByParent: row.reviewed_by_parent,
          createdAt: row.created_at,
        })),
        totalCount,
        hasMore: (input.offset + input.limit) < totalCount,
      };
    } catch (error) {
      console.error('[Get Child Activity Error]', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch child activity.',
      });
    } finally {
      client.release();
    }
  });
