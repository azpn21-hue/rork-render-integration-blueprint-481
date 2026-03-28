import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const followUserProcedure = protectedProcedure
  .input(z.object({
    followerId: z.string(),
    followingId: z.string(),
  }))
  .mutation(async ({ input }) => {
    if (input.followerId === input.followingId) {
      throw new Error('Cannot follow yourself');
    }
    
    const followId = `follow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`[Follow] ${input.followerId} → ${input.followingId}`);
    
    return {
      success: true,
      followId,
      timestamp: new Date().toISOString(),
    };
  });

export const unfollowUserProcedure = protectedProcedure
  .input(z.object({
    followerId: z.string(),
    followingId: z.string(),
  }))
  .mutation(async ({ input }) => {
    console.log(`[Unfollow] ${input.followerId} ✗ ${input.followingId}`);
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  });

export const getFollowersProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    limit: z.number().default(50),
    offset: z.number().default(0),
  }))
  .query(async ({ input }) => {
    console.log(`[Follow] Getting followers for ${input.userId}`);
    
    const mockFollowers = [
      {
        userId: 'user_1',
        userName: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        truthScore: 87,
        verificationLevel: 3,
        bio: 'Tech enthusiast & truth seeker',
        followedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        mutualFollow: true,
      },
      {
        userId: 'user_2',
        userName: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=2',
        truthScore: 92,
        verificationLevel: 4,
        bio: 'Building authentic connections',
        followedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        mutualFollow: false,
      },
      {
        userId: 'user_3',
        userName: 'Emma Davis',
        avatar: 'https://i.pravatar.cc/150?img=3',
        truthScore: 78,
        verificationLevel: 2,
        bio: 'Fitness & wellness advocate',
        followedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
        mutualFollow: true,
      },
    ];
    
    const paginated = mockFollowers.slice(input.offset, input.offset + input.limit);
    
    return {
      followers: paginated,
      total: mockFollowers.length,
      hasMore: input.offset + input.limit < mockFollowers.length,
    };
  });

export const getFollowingProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    limit: z.number().default(50),
    offset: z.number().default(0),
  }))
  .query(async ({ input }) => {
    console.log(`[Follow] Getting following for ${input.userId}`);
    
    const mockFollowing = [
      {
        userId: 'user_4',
        userName: 'Alex Chen',
        avatar: 'https://i.pravatar.cc/150?img=4',
        truthScore: 85,
        verificationLevel: 3,
        bio: 'Creative thinker',
        followedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        mutualFollow: false,
      },
      {
        userId: 'user_1',
        userName: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        truthScore: 87,
        verificationLevel: 3,
        bio: 'Tech enthusiast & truth seeker',
        followedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        mutualFollow: true,
      },
      {
        userId: 'user_5',
        userName: 'Rachel Green',
        avatar: 'https://i.pravatar.cc/150?img=5',
        truthScore: 81,
        verificationLevel: 3,
        bio: 'Art & culture lover',
        followedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        mutualFollow: false,
      },
    ];
    
    const paginated = mockFollowing.slice(input.offset, input.offset + input.limit);
    
    return {
      following: paginated,
      total: mockFollowing.length,
      hasMore: input.offset + input.limit < mockFollowing.length,
    };
  });

export const isFollowingProcedure = protectedProcedure
  .input(z.object({
    followerId: z.string(),
    followingId: z.string(),
  }))
  .query(async ({ input }) => {
    const isFollowing = Math.random() > 0.5;
    
    return {
      isFollowing,
      timestamp: new Date().toISOString(),
    };
  });

export const getSuggestedUsersProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    limit: z.number().default(10),
  }))
  .query(async ({ input }) => {
    console.log(`[Follow] Getting suggested users for ${input.userId}`);
    
    const suggestions = [
      {
        userId: 'user_6',
        userName: 'David Kim',
        avatar: 'https://i.pravatar.cc/150?img=6',
        truthScore: 89,
        verificationLevel: 4,
        bio: 'Innovation & technology',
        mutualConnections: 5,
        reason: 'Shared interests in technology',
      },
      {
        userId: 'user_7',
        userName: 'Lisa Anderson',
        avatar: 'https://i.pravatar.cc/150?img=7',
        truthScore: 86,
        verificationLevel: 3,
        bio: 'Mindfulness & wellness',
        mutualConnections: 3,
        reason: 'Common circles',
      },
      {
        userId: 'user_8',
        userName: 'Tom Martinez',
        avatar: 'https://i.pravatar.cc/150?img=8',
        truthScore: 91,
        verificationLevel: 4,
        bio: 'Adventure & travel',
        mutualConnections: 7,
        reason: 'High compatibility score',
      },
    ];
    
    return {
      suggestions: suggestions.slice(0, input.limit),
      total: suggestions.length,
    };
  });
