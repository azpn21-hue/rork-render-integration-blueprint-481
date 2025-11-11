import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getProjectsProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    status: z.enum(['active', 'completed', 'archived']).optional(),
  }))
  .query(async ({ input }) => {
    console.log("[Writers Guild] Getting projects for user:", input.userId);

    // Mock implementation - replace with actual DB query
    const mockProjects = [
      {
        projectId: "project_001",
        userId: input.userId,
        title: "The Last Horizon",
        genre: "Science Fiction",
        description: "A space opera about humanity's final frontier",
        contentType: "novel" as const,
        matureContent: false,
        wordCount: 45230,
        status: "active" as const,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        projectId: "project_002",
        userId: input.userId,
        title: "Midnight Hearts",
        genre: "Romance",
        description: "A passionate love story set in New York City",
        contentType: "novel" as const,
        matureContent: true,
        wordCount: 12500,
        status: "active" as const,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return {
      success: true,
      projects: mockProjects,
    };
  });
