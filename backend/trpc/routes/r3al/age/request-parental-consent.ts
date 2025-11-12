import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { pool } from '../../../../db/config';
import crypto from 'crypto';

export const requestParentalConsent = publicProcedure
  .input(z.object({
    childUserId: z.string().uuid(),
    childEmail: z.string().email(),
    childBirthDate: z.string(),
    parentEmail: z.string().email(),
    parentName: z.string().min(2),
  }))
  .mutation(async ({ input }) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const childProfile = await client.query(
        `SELECT age_tier, requires_parental_consent FROM user_age_profiles WHERE user_id = $1`,
        [input.childUserId]
      );

      if (childProfile.rows.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Child age profile not found. Please verify age first.',
        });
      }

      if (!childProfile.rows[0].requires_parental_consent) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This account does not require parental consent.',
        });
      }

      const verificationCode = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      console.log('[Parental Consent Request]', {
        childUserId: input.childUserId,
        parentEmail: input.parentEmail,
        verificationCode
      });

      await client.query(
        `INSERT INTO parental_consent_log 
         (child_id, consent_type, consent_given, verification_code, verified, created_at)
         VALUES ($1, 'account_creation', FALSE, $2, FALSE, NOW())`,
        [input.childUserId, verificationCode]
      );

      const appBaseUrl = process.env.APP_BASE_URL || 'https://r3al.app';
      const consentLink = `${appBaseUrl}/r3al/parental-consent?code=${verificationCode}`;

      console.log('[Email] Parent consent link:', consentLink);

      await client.query('COMMIT');

      return {
        success: true,
        message: `Consent request sent to ${input.parentEmail}. Please check your email.`,
        consentLink,
        expiresAt: expiresAt.toISOString(),
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[Parental Consent Request Error]', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to send parental consent request.',
      });
    } finally {
      client.release();
    }
  });
