import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const getMusicProjectsProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      status: z.enum(['draft', 'generating', 'completed', 'published', 'archived']).optional(),
      limit: z.number().int().min(1).max(100).default(20),
      offset: z.number().int().min(0).default(0),
    })
  )
  .query(async ({ input }) => {
    console.log('[Studio] Fetching music projects for user:', input.userId);

    try {
      let query = `
        SELECT p.*, 
               COUNT(s.stem_id) as stem_count,
               COALESCE(SUM(a.plays), 0) as total_plays
        FROM music_projects p
        LEFT JOIN music_stems s ON p.project_id = s.project_id
        LEFT JOIN music_analytics a ON p.project_id = a.project_id
        WHERE p.user_id = $1
      `;

      const params: any[] = [input.userId];

      if (input.status) {
        query += ` AND p.status = $${params.length + 1}`;
        params.push(input.status);
      }

      query += `
        GROUP BY p.project_id
        ORDER BY p.updated_at DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;
      params.push(input.limit, input.offset);

      const result = await pool.query(query, params);

      const projects = result.rows.map((row) => ({
        projectId: row.project_id,
        userId: row.user_id,
        title: row.title,
        genre: row.genre,
        bpm: row.bpm,
        key: row.key,
        duration: row.duration_seconds,
        status: row.status,
        visibility: row.visibility,
        stemCount: parseInt(row.stem_count) || 0,
        totalPlays: parseInt(row.total_plays) || 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return {
        success: true,
        projects,
        total: result.rows.length,
      };
    } catch (error) {
      console.error('[Studio] Failed to fetch projects:', error);
      throw new Error('Failed to fetch music projects');
    }
  });
