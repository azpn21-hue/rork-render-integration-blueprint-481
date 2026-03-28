import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { pool } from '../../../../db/config';

export const verifyAge = publicProcedure
  .input(z.object({
    userId: z.string().uuid(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
    verificationMethod: z.enum(['id_upload', 'credit_card', 'educational_email', 'parent_verified']),
    verificationData: z.record(z.any()).optional(),
  }))
  .mutation(async ({ input }) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const birthDate = new Date(input.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
        ? age - 1 
        : age;

      let ageTier: 'adult' | 'teen' | 'kid';
      let requiresParentalConsent = false;
      let coppaCompliant = false;

      if (actualAge < 13) {
        ageTier = 'kid';
        requiresParentalConsent = true;
        coppaCompliant = false;
      } else if (actualAge >= 13 && actualAge < 18) {
        ageTier = 'teen';
        requiresParentalConsent = false;
        coppaCompliant = true;
      } else {
        ageTier = 'adult';
        requiresParentalConsent = false;
        coppaCompliant = true;
      }

      console.log('[Age Verification]', {
        userId: input.userId,
        birthDate: input.birthDate,
        actualAge,
        ageTier,
        requiresParentalConsent,
        verificationMethod: input.verificationMethod
      });

      const existingProfile = await client.query(
        `SELECT id FROM user_age_profiles WHERE user_id = $1`,
        [input.userId]
      );

      if (existingProfile.rows.length > 0) {
        await client.query(
          `UPDATE user_age_profiles 
           SET age_tier = $1::age_tier_enum, 
               birth_date = $2, 
               age_verified = TRUE, 
               verification_method = $3::verification_method_enum,
               requires_parental_consent = $4,
               coppa_compliant = $5,
               verified_at = NOW(),
               verification_data = $6,
               updated_at = NOW()
           WHERE user_id = $7`,
          [
            ageTier, 
            input.birthDate, 
            input.verificationMethod, 
            requiresParentalConsent,
            coppaCompliant,
            JSON.stringify(input.verificationData || {}),
            input.userId
          ]
        );
      } else {
        await client.query(
          `INSERT INTO user_age_profiles 
           (user_id, age_tier, birth_date, age_verified, verification_method, requires_parental_consent, coppa_compliant, verified_at, verification_data)
           VALUES ($1, $2::age_tier_enum, $3, TRUE, $4::verification_method_enum, $5, $6, NOW(), $7)`,
          [
            input.userId, 
            ageTier, 
            input.birthDate, 
            input.verificationMethod, 
            requiresParentalConsent,
            coppaCompliant,
            JSON.stringify(input.verificationData || {})
          ]
        );
      }

      await client.query('COMMIT');

      return {
        success: true,
        ageTier,
        actualAge,
        requiresParentalConsent,
        coppaCompliant,
        message: requiresParentalConsent 
          ? 'Parental consent required before account activation.'
          : 'Age verified successfully.',
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[Age Verification Error]', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to verify age. Please try again.',
      });
    } finally {
      client.release();
    }
  });
