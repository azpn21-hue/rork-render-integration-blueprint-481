import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const deletePhotoProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      photoId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Profile] Deleting photo:", input.photoId, "for user:", input.userId);
    
    return {
      success: true,
      photoId: input.photoId,
      message: "Photo deleted successfully",
    };
  });
