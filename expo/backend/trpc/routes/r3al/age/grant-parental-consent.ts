import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { pool } from '../../../../db/config';

export const grantParentalConsent = publicProcedure
  .input(z.object({
    verificationCode: z.string(),
    parentUserId: z.string().uuid(),
    consentMethod: z.enum(['credit_card_verification', 'id_upload', 'video_call']),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const consentRequest = await client.query(
        `SELECT child_id, consent_given, verified FROM parental_consent_log 
         WHERE verification_code = $1 AND verified = FALSE AND created_at > NOW() - INTERVAL '7 days'`,
        [input.verificationCode]
      );

      if (consentRequest.rows.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid or expired verification code.',
        });
      }

      const childUserId = consentRequest.rows[0].child_id;
      const consentTimestamp = new Date().toISOString();

      console.log('[Parental Consent Granted]', {
        parentUserId: input.parentUserId,
        childUserId,
        consentMethod: input.consentMethod,
        timestamp: consentTimestamp
      });

      await client.query(
        `UPDATE parental_consent_log 
         SET consent_given = TRUE, 
             verified = TRUE, 
             verified_at = NOW(),
             ip_address = $1::inet,
             user_agent = $2,
             parent_id = $3,
             consent_method = $4
         WHERE verification_code = $5`,
        [input.ipAddress, input.userAgent, input.parentUserId, input.consentMethod, input.verificationCode]
      );

      await client.query(
        `UPDATE user_age_profiles 
         SET parental_consent_given = TRUE,
             parental_consent_given_at = NOW(),
             parent_id = $1,
             coppa_compliant = TRUE,
             updated_at = NOW()
         WHERE user_id = $2`,
        [input.parentUserId, childUserId]
      );

      const existingControls = await client.query(
        `SELECT id FROM parental_controls WHERE parent_id = $1 AND child_id = $2`,
        [input.parentUserId, childUserId]
      );

      if (existingControls.rows.length === 0) {
        await client.query(
          `INSERT INTO parental_controls 
           (parent_id, child_id, monitor_messages, monitor_posts, monitor_connections, require_contact_approval,
            screen_time_limit_minutes, daily_limit_enabled, alert_on_new_contact, alert_on_flagged_content,
            weekly_activity_report)
           VALUES ($1, $2, TRUE, TRUE, TRUE, TRUE, 120, TRUE, TRUE, TRUE, TRUE)`,
          [input.parentUserId, childUserId]
        );
      }

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Parental consent granted successfully. Child account is now active.',
        childUserId,
        consentTimestamp,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[Parental Consent Grant Error]', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to grant parental consent.',
      });
    } finally {
      client.release();
    }
  });
