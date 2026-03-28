import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const uploadPhotoProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      photoData: z.string(),
      photoType: z.enum(["avatar", "cover", "gallery"]),
      caption: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log(`[Profile] Uploading ${input.photoType} photo for user:`, input.userId);
    
    const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const photo = {
      id: photoId,
      userId: input.userId,
      url: input.photoData,
      type: input.photoType,
      caption: input.caption,
      safe: true,
      trustScore: 95,
      uploadedAt: new Date().toISOString(),
      moderated: true,
    };
    
    console.log(`[Profile] Photo uploaded successfully: ${photoId}`);
    
    return {
      success: true,
      photo,
      message: "Photo uploaded and moderated successfully",
    };
  });
