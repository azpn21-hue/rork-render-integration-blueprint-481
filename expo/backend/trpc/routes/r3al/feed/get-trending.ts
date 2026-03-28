import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getTrendingProcedure = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(25),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input }) => {
    console.log("[Feed] Fetching trending posts, limit:", input.limit);

    const mockPosts = [
      {
        id: "post_1",
        userId: "user_1",
        userName: "Sarah Johnson",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        content: "Just completed my daily honesty check! My truth score is climbing 📈",
        mediaUrl: null,
        location: "Austin, TX",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 42,
        comments: [],
        tier: "premium" as const,
        tags: ["growth", "honesty"],
      },
      {
        id: "post_2",
        userId: "user_2",
        userName: "Mike Chen",
        userAvatar: "https://i.pravatar.cc/150?img=2",
        content: "The market is looking interesting today. Anyone else tracking crypto trends?",
        mediaUrl: null,
        location: "San Francisco, CA",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        likes: 38,
        comments: [],
        tier: "free" as const,
        tags: ["finance", "crypto"],
      },
      {
        id: "post_3",
        userId: "user_3",
        userName: "Emily Rodriguez",
        userAvatar: "https://i.pravatar.cc/150?img=3",
        content: "Loving the new pulse chat features! Real conversations matter 💬",
        mediaUrl: null,
        location: "New York, NY",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        likes: 56,
        comments: [],
        tier: "unlimited" as const,
        tags: ["relationships", "communication"],
      },
      {
        id: "post_4",
        userId: "user_4",
        userName: "David Kim",
        userAvatar: "https://i.pravatar.cc/150?img=4",
        content: "My truth score improved by 15 points this month! Consistency is key 🔑",
        mediaUrl: null,
        location: "Los Angeles, CA",
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        likes: 29,
        comments: [],
        tier: "free" as const,
        tags: ["growth", "progress"],
      },
      {
        id: "post_5",
        userId: "user_5",
        userName: "Jessica Thompson",
        userAvatar: "https://i.pravatar.cc/150?img=5",
        content: "Built my first NFT in the Hive! This platform is amazing ✨",
        mediaUrl: null,
        location: "Chicago, IL",
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        likes: 67,
        comments: [],
        tier: "premium" as const,
        tags: ["nft", "creativity"],
      },
    ];

    const posts = mockPosts.slice(input.offset, input.offset + input.limit);

    console.log("[Feed] Returning", posts.length, "trending posts");

    return {
      posts,
      hasMore: input.offset + input.limit < mockPosts.length,
      total: mockPosts.length,
    };
  });
