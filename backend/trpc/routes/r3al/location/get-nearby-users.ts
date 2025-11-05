import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const getNearbyUsersProcedure = protectedProcedure
  .input(
    z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
      radius: z.number().min(1).max(50).default(10),
      limit: z.number().min(1).max(50).default(20),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log("[Location] Fetching nearby users for:", ctx.user.id);

    const mockNearbyUsers = [
      {
        id: "nearby_user_1",
        name: "Alex Rivera",
        avatar: "https://i.pravatar.cc/150?img=20",
        bio: "Tech enthusiast | Coffee lover | R3AL verified",
        truthScore: 89,
        verificationLevel: 2,
        distance: 0.8,
        commonInterests: ["tech", "coffee", "startups"],
        lastActive: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "nearby_user_2",
        name: "Jordan Smith",
        avatar: "https://i.pravatar.cc/150?img=21",
        bio: "Fitness coach | Outdoor adventures | Building connections",
        truthScore: 92,
        verificationLevel: 3,
        distance: 1.5,
        commonInterests: ["fitness", "outdoors"],
        lastActive: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "nearby_user_3",
        name: "Sam Park",
        avatar: "https://i.pravatar.cc/150?img=22",
        bio: "Creative professional | Music and arts | Authentic connections",
        truthScore: 85,
        verificationLevel: 2,
        distance: 2.3,
        commonInterests: ["music", "arts", "creativity"],
        lastActive: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "nearby_user_4",
        name: "Taylor Wong",
        avatar: "https://i.pravatar.cc/150?img=23",
        bio: "Entrepreneur | Community builder | Truth seeker",
        truthScore: 94,
        verificationLevel: 3,
        distance: 3.7,
        commonInterests: ["business", "community", "networking"],
        lastActive: new Date(Date.now() - 10800000).toISOString(),
      },
    ];

    const users = mockNearbyUsers
      .filter(u => u.distance <= input.radius)
      .slice(0, input.limit);

    console.log("[Location] Returning", users.length, "nearby users");

    return {
      success: true,
      users,
      location: {
        lat: input.lat,
        lon: input.lon,
      },
      radius: input.radius,
    };
  });
