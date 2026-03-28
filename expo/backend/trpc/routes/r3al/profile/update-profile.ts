import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const updateProfileProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      displayName: z.string().optional(),
      bio: z.string().max(500).optional(),
      pronouns: z.string().optional(),
      location: z.string().optional(),
      privacy: z.object({
        profile: z.enum(["public", "circle", "private"]).optional(),
        photos: z.enum(["public", "circle", "private"]).optional(),
        watchlist: z.enum(["public", "circle", "private"]).optional(),
      }).optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Profile] Updating profile for user:", input.userId);
    
    return {
      success: true,
      profile: {
        userId: input.userId,
        displayName: input.displayName,
        bio: input.bio,
        pronouns: input.pronouns,
        location: input.location,
        privacy: input.privacy || {
          profile: "circle",
          photos: "circle",
          watchlist: "public",
        },
        updatedAt: new Date().toISOString(),
      },
    };
  });
