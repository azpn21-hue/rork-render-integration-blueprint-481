import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const createProjectProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    title: z.string(),
    genre: z.string().optional(),
    description: z.string().optional(),
    contentType: z.enum(['novel', 'short_story', 'screenplay', 'poetry', 'other']),
    matureContent: z.boolean().default(false),
  }))
  .mutation(async ({ input }) => {
    console.log("[Writers Guild] Creating project:", input.title);

    // Mock implementation - replace with actual DB insert
    const mockProject = {
      projectId: `project_${Date.now()}`,
      userId: input.userId,
      title: input.title,
      genre: input.genre,
      description: input.description,
      contentType: input.contentType,
      matureContent: input.matureContent,
      wordCount: 0,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      project: mockProject,
    };
  });
