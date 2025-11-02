import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const getProfileProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      viewerId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[Profile] Getting profile for user:", input.userId);
    
    const profile = {
      userId: input.userId,
      handle: `r3al_${input.userId.slice(0, 8)}`,
      displayName: "User Name",
      bio: "Building with R3AL",
      pronouns: "they/them",
      location: "US",
      avatarUrl: null,
      coverUrl: null,
      photos: [],
      verificationLevel: 1,
      badges: ["verified_id"],
      trustScore: 84.3,
      streaks: { qotd: 0, login: 0 },
      endorsements: { count: 0, by: [] },
      privacy: {
        profile: "circle",
        photos: "circle",
        watchlist: "public",
      },
      settings: {
        dm: "circle_only",
        mentions: true,
        alerts: { screenshots: true, new_endorsement: true },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      profile,
    };
  });
