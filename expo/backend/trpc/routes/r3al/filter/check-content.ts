import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { pool } from '../../../../db/config';

export const checkContent = publicProcedure
  .input(z.object({
    userId: z.string().uuid(),
    contentType: z.enum(['post', 'message', 'comment', 'media']),
    content: z.string(),
    mediaUrls: z.array(z.string()).optional(),
  }))
  .query(async ({ input }) => {
    const client = await pool.connect();
    
    try {
      console.log('[Content Filter Check]', {
        userId: input.userId,
        contentType: input.contentType,
        contentLength: input.content.length
      });

      const userAge = await client.query(
        `SELECT age_tier FROM user_age_profiles WHERE user_id = $1`,
        [input.userId]
      );

      const ageTier = userAge.rows[0]?.age_tier || 'adult';

      const filterRules = await client.query(
        `SELECT * FROM content_filter_rules 
         WHERE age_tier = $1::age_tier_enum AND active = TRUE`,
        [ageTier]
      );

      let isBlocked = false;
      let flaggedKeywords: string[] = [];
      let flagSeverity = 'low';

      for (const rule of filterRules.rows) {
        if (rule.filter_type === 'keyword') {
          const keywords = rule.rule_data.keywords || [];
          const contentLower = input.content.toLowerCase();
          
          const foundKeywords = keywords.filter((keyword: string) => 
            contentLower.includes(keyword.toLowerCase())
          );

          if (foundKeywords.length > 0) {
            flaggedKeywords.push(...foundKeywords);
            if (rule.action === 'block') {
              isBlocked = true;
              flagSeverity = rule.severity;
            }
          }
        }
      }

      const shouldFlag = flaggedKeywords.length > 0;

      if (shouldFlag) {
        const parentResult = await client.query(
          `SELECT parent_id FROM parental_controls WHERE child_id = $1`,
          [input.userId]
        );

        const parentId = parentResult.rows[0]?.parent_id;

        await client.query(
          `INSERT INTO child_activity_log 
           (child_id, parent_id, activity_type, activity_description, flagged, flag_reason, flag_severity, auto_flagged)
           VALUES ($1, $2, 'content_flagged', 'Attempted to post potentially inappropriate content', TRUE, $3, $4, TRUE)`,
          [
            input.userId, 
            parentId, 
            `Flagged keywords: ${flaggedKeywords.join(', ')}`,
            flagSeverity
          ]
        );
      }

      return {
        success: true,
        allowed: !isBlocked,
        blocked: isBlocked,
        flagged: shouldFlag,
        flaggedKeywords: flaggedKeywords,
        severity: shouldFlag ? flagSeverity : undefined,
        message: isBlocked 
          ? `This content is not appropriate for ${ageTier} users. Please revise.`
          : shouldFlag
          ? 'This content has been flagged for review.'
          : 'Content is appropriate.',
        ageTier,
      };
    } catch (error) {
      console.error('[Content Filter Error]', error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to check content.',
      });
    } finally {
      client.release();
    }
  });
