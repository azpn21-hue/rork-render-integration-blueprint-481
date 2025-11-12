import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { pool } from '../../../../db/config';

export const linkChildAccount = publicProcedure
  .input(z.object({
    parentUserId: z.string().uuid(),
    childUserId: z.string().uuid(),
    monitoringSettings: z.object({
      monitorMessages: z.boolean().default(true),
      monitorPosts: z.boolean().default(true),
      monitorConnections: z.boolean().default(true),
      requireContactApproval: z.boolean().default(true),
      screenTimeLimitMinutes: z.number().min(0).max(480).default(120),
      alertOnNewContact: z.boolean().default(true),
      alertOnFlaggedContent: z.boolean().default(true),
    }).optional(),
  }))
  .mutation(async ({ input }) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const settings = input.monitoringSettings || {
        monitorMessages: true,
        monitorPosts: true,
        monitorConnections: true,
        requireContactApproval: true,
        screenTimeLimitMinutes: 120,
        alertOnNewContact: true,
        alertOnFlaggedContent: true,
      };

      console.log('[Link Child Account]', {
        parentUserId: input.parentUserId,
        childUserId: input.childUserId,
        settings
      });

      const childAge = await client.query(
        `SELECT age_tier FROM user_age_profiles WHERE user_id = $1`,
        [input.childUserId]
      );

      if (childAge.rows.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Child age profile not found.',
        });
      }

      if (childAge.rows[0].age_tier !== 'kid' && childAge.rows[0].age_tier !== 'teen') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User is not a minor.',
        });
      }

      const result = await client.query(
        `INSERT INTO parental_controls 
         (parent_id, child_id, monitor_messages, monitor_posts, monitor_connections,
          require_contact_approval, screen_time_limit_minutes, alert_on_new_contact,
          alert_on_flagged_content, daily_limit_enabled, weekly_activity_report)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, TRUE)
         ON CONFLICT (parent_id, child_id) 
         DO UPDATE SET 
           monitor_messages = EXCLUDED.monitor_messages,
           monitor_posts = EXCLUDED.monitor_posts,
           monitor_connections = EXCLUDED.monitor_connections,
           require_contact_approval = EXCLUDED.require_contact_approval,
           screen_time_limit_minutes = EXCLUDED.screen_time_limit_minutes,
           alert_on_new_contact = EXCLUDED.alert_on_new_contact,
           alert_on_flagged_content = EXCLUDED.alert_on_flagged_content,
           updated_at = NOW()
         RETURNING id`,
        [
          input.parentUserId, input.childUserId,
          settings.monitorMessages, settings.monitorPosts, settings.monitorConnections,
          settings.requireContactApproval, settings.screenTimeLimitMinutes,
          settings.alertOnNewContact, settings.alertOnFlaggedContent
        ]
      );

      await client.query(
        `INSERT INTO child_activity_log 
         (child_id, parent_id, activity_type, activity_description)
         VALUES ($1, $2, 'profile_updated', 'Parental controls established')`,
        [input.childUserId, input.parentUserId]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Parental controls established successfully.',
        linkId: result.rows[0].id,
        settings,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[Link Child Account Error]', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to link child account.',
      });
    } finally {
      client.release();
    }
  });
