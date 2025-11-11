import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getImageHistoryProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    limit: z.number().default(20),
    offset: z.number().default(0),
  }))
  .query(async ({ input }) => {
    console.log("[Premium] Getting image history for user:", input.userId);

    // Mock implementation
    const mockImages = [
      {
        imageId: "img_001",
        prompt: "A futuristic cityscape at sunset",
        imageUrl: "https://placehold.co/1024x1024/png?text=Cityscape",
        size: "1024x1024" as const,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        imageId: "img_002",
        prompt: "Abstract art with vibrant colors",
        imageUrl: "https://placehold.co/1024x1792/png?text=Abstract",
        size: "1024x1792" as const,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return {
      success: true,
      images: mockImages,
      total: mockImages.length,
      hasMore: false,
    };
  });
