import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const createMusicProjectProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      title: z.string().min(1).max(500),
      genre: z.string().optional(),
      bpm: z.number().int().min(40).max(200).optional(),
      mood: z.string().optional(),
      key: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[Studio] Creating music project:', input);

    try {
      const result = await pool.query(
        `INSERT INTO music_projects 
        (user_id, title, genre, bpm, key, status, visibility, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, 'draft', 'private', NOW(), NOW())
        RETURNING *`,
        [input.userId, input.title, input.genre || null, input.bpm || null, input.key || null]
      );

      const project = result.rows[0];

      console.log('[Studio] Music project created:', project.project_id);

      return {
        success: true,
        project: {
          projectId: project.project_id,
          userId: project.user_id,
          title: project.title,
          genre: project.genre,
          bpm: project.bpm,
          key: project.key,
          status: project.status,
          visibility: project.visibility,
          createdAt: project.created_at,
        },
      };
    } catch (error) {
      console.error('[Studio] Failed to create project:', error);
      throw new Error('Failed to create music project');
    }
  });
