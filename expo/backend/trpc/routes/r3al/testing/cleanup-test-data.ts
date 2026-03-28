import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const cleanupTestDataProcedure = protectedProcedure
  .input(z.object({
    confirmDeletion: z.boolean(),
    deleteProfiles: z.boolean().default(true),
    deletePosts: z.boolean().default(true),
    deleteInteractions: z.boolean().default(true),
    deleteMatches: z.boolean().default(true)
  }))
  .mutation(async ({ input }) => {
    if (!input.confirmDeletion) {
      throw new Error('Must confirm deletion by setting confirmDeletion to true');
    }

    console.log('[AI Testing] Starting cleanup of test data...');

    const deletionStats = {
      profiles: 0,
      posts: 0,
      interactions: 0,
      matches: 0,
      tokens: 0,
      verifications: 0
    };

    try {
      if (input.deleteProfiles) {
        const result = await pool.query(
          `SELECT id FROM users WHERE id LIKE 'test_%'`
        );
        const testUserIds = result.rows.map(r => r.id);
        
        console.log(`[AI Testing] Found ${testUserIds.length} test users to delete`);

        for (const userId of testUserIds) {
          await pool.query(`DELETE FROM profiles WHERE user_id = $1`, [userId]);
          await pool.query(`DELETE FROM verifications WHERE user_id = $1`, [userId]);
          await pool.query(`DELETE FROM tokens WHERE user_id = $1`, [userId]);
          await pool.query(`DELETE FROM token_transactions WHERE user_id = $1`, [userId]);
          await pool.query(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
        }

        const deleteUsers = await pool.query(`DELETE FROM users WHERE id LIKE 'test_%' RETURNING id`);
        deletionStats.profiles = deleteUsers.rowCount || 0;
      }

      if (input.deletePosts) {
        const deletePosts = await pool.query(
          `DELETE FROM posts WHERE user_id LIKE 'test_%' OR id LIKE 'post_%' RETURNING id`
        );
        deletionStats.posts = deletePosts.rowCount || 0;
      }

      if (input.deleteInteractions) {
        const tables = ['post_comments', 'post_resonances', 'post_amplifications', 'post_witnesses'];
        for (const table of tables) {
          try {
            const result = await pool.query(
              `DELETE FROM ${table} WHERE user_id LIKE 'test_%' RETURNING id`
            );
            deletionStats.interactions += result.rowCount || 0;
          } catch (error) {
            console.warn(`[AI Testing] Could not delete from ${table}:`, error);
          }
        }
      }

      if (input.deleteMatches) {
        const deleteMatches = await pool.query(
          `DELETE FROM matches 
           WHERE user_id_1 LIKE 'test_%' 
              OR user_id_2 LIKE 'test_%' 
              OR created_by_ai = true 
           RETURNING id`
        );
        deletionStats.matches = deleteMatches.rowCount || 0;
      }

      console.log('[AI Testing] ✓ Cleanup complete:', deletionStats);

      return {
        success: true,
        deleted: deletionStats,
        message: `Deleted ${deletionStats.profiles} profiles, ${deletionStats.posts} posts, ${deletionStats.interactions} interactions, ${deletionStats.matches} matches`
      };
    } catch (error) {
      console.error('[AI Testing] Cleanup failed:', error);
      throw new Error(`Cleanup failed: ${error}`);
    }
  });
