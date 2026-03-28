import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { pool } from '../../../../db/config';

export const updateControls = publicProcedure
  .input(z.object({
    parentUserId: z.string().uuid(),
    childUserId: z.string().uuid(),
    controls: z.object({
      monitorMessages: z.boolean().optional(),
      monitorPosts: z.boolean().optional(),
      monitorConnections: z.boolean().optional(),
      requireContactApproval: z.boolean().optional(),
      screenTimeLimitMinutes: z.number().min(0).max(480).optional(),
      dailyLimitEnabled: z.boolean().optional(),
      quietHoursStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
      quietHoursEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
      quietHoursEnabled: z.boolean().optional(),
      allowedFeatures: z.array(z.string()).optional(),
      restrictedFeatures: z.array(z.string()).optional(),
      alertOnNewContact: z.boolean().optional(),
      alertOnFlaggedContent: z.boolean().optional(),
      weeklyActivityReport: z.boolean().optional(),
    }),
  }))
  .mutation(async ({ input }) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      console.log('[Update Parental Controls]', {
        parentUserId: input.parentUserId,
        childUserId: input.childUserId,
        controls: input.controls
      });

      const relationship = await client.query(
        `SELECT 1 FROM parental_controls 
         WHERE parent_id = $1 AND child_id = $2`,
        [input.parentUserId, input.childUserId]
      );

      if (relationship.rows.length === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update controls for this child.',
        });
      }

      const { fields, values } = buildUpdateQuery(input.controls);

      if (fields.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No controls to update.',
        });
      }

      const paramIndex = values.length + 1;
      values.push(input.parentUserId, input.childUserId);

      await client.query(
        `UPDATE parental_controls 
         SET ${fields.join(', ')}, updated_at = NOW()
         WHERE parent_id = ${paramIndex} AND child_id = ${paramIndex + 1}`,
        values
      );

      await client.query(
        `INSERT INTO child_activity_log 
         (child_id, parent_id, activity_type, activity_description, activity_data)
         VALUES ($1, $2, 'profile_updated', 'Parent updated parental controls', $3)`,
        [input.childUserId, input.parentUserId, JSON.stringify(input.controls)]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Parental controls updated successfully.',
        updatedControls: input.controls,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[Update Parental Controls Error]', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update parental controls.',
      });
    } finally {
      client.release();
    }
  });

// Helper function to convert camelCase to snake_case
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function buildUpdateQuery(controls: Record<string, any>): { fields: string[], values: any[] } {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(controls).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${toSnakeCase(key)} = ${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  return { fields, values };
}
