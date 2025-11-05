import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const getLocalProcedure = protectedProcedure
  .input(
    z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
      radius: z.number().min(1).max(100).default(25),
      limit: z.number().min(1).max(100).default(25),
    })
  )
  .query(async ({ input }) => {
    console.log("[Feed] Fetching local posts near:", input.lat, input.lon);

    const mockLocalPosts = [
      {
        id: "local_post_1",
        userId: "user_local_1",
        userName: "Local User 1",
        userAvatar: "https://i.pravatar.cc/150?img=10",
        content: "Great coffee shop downtown! Anyone want to meet up?",
        mediaUrl: null,
        location: "Downtown",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        likes: 12,
        comments: [],
        tier: "free" as const,
        tags: ["local", "meetup"],
        distance: 2.3,
      },
      {
        id: "local_post_2",
        userId: "user_local_2",
        userName: "Local User 2",
        userAvatar: "https://i.pravatar.cc/150?img=11",
        content: "Community event this weekend at the park!",
        mediaUrl: null,
        location: "City Park",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 23,
        comments: [],
        tier: "premium" as const,
        tags: ["local", "events"],
        distance: 5.7,
      },
    ];

    console.log("[Feed] Returning", mockLocalPosts.length, "local posts");

    return {
      posts: mockLocalPosts,
      hasMore: false,
      total: mockLocalPosts.length,
    };
  });
