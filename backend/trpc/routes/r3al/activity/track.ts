import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const trackActivityProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    activityType: z.enum([
      'resonate',
      'amplify',
      'witness',
      'circle_join',
      'circle_leave',
      'dm_sent',
      'dm_received',
      'post_created',
      'post_viewed',
      'profile_view',
      'profile_edit',
      'nft_created',
      'nft_purchased',
      'tokens_earned',
      'tokens_spent',
      'questionnaire_completed',
      'verification_completed',
      'realification_completed',
      'honesty_check_completed',
      'qotd_answered',
      'endorsement_given',
      'endorsement_received',
      'photo_uploaded',
      'follow_user',
      'unfollow_user',
    ]),
    targetId: z.string().optional(),
    targetType: z.enum(['user', 'post', 'circle', 'nft', 'photo', 'message']).optional(),
    metadata: z.record(z.any()).optional(),
  }))
  .mutation(async ({ input }) => {
    const timestamp = new Date().toISOString();
    
    const activityRecord = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: input.userId,
      activityType: input.activityType,
      targetId: input.targetId,
      targetType: input.targetType,
      metadata: input.metadata || {},
      timestamp,
      processed: false,
    };
    
    console.log(`[Activity] Tracked: ${input.activityType} by ${input.userId}`);
    
    return {
      success: true,
      activityId: activityRecord.id,
      timestamp: activityRecord.timestamp,
    };
  });

export const getActivityHistoryProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    limit: z.number().default(50),
    offset: z.number().default(0),
    activityTypes: z.array(z.string()).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }))
  .query(async ({ input }) => {
    console.log(`[Activity] Fetching history for ${input.userId}`);
    
    const mockActivities = [
      {
        id: 'activity_1',
        userId: input.userId,
        activityType: 'resonate',
        targetId: 'post_1',
        targetType: 'post' as const,
        metadata: { postTitle: 'Amazing insights on truth', authorName: 'Jane Doe' },
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'activity_2',
        userId: input.userId,
        activityType: 'circle_join',
        targetId: 'circle_tech',
        targetType: 'circle' as const,
        metadata: { circleName: 'Tech Enthusiasts', memberCount: 1523 },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: 'activity_3',
        userId: input.userId,
        activityType: 'follow_user',
        targetId: 'user_42',
        targetType: 'user' as const,
        metadata: { userName: 'Sarah Wilson', truthScore: 87 },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: 'activity_4',
        userId: input.userId,
        activityType: 'qotd_answered',
        targetId: 'qotd_20251107',
        targetType: 'post' as const,
        metadata: { question: 'What truth have you discovered today?', tokensEarned: 10 },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: 'activity_5',
        userId: input.userId,
        activityType: 'nft_created',
        targetId: 'nft_789',
        targetType: 'nft' as const,
        metadata: { nftTitle: 'My First Truth Moment', tokensCost: 50 },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];
    
    let filtered = mockActivities;
    
    if (input.activityTypes && input.activityTypes.length > 0) {
      filtered = filtered.filter(a => input.activityTypes!.includes(a.activityType));
    }
    
    if (input.startDate) {
      filtered = filtered.filter(a => a.timestamp >= input.startDate!);
    }
    
    if (input.endDate) {
      filtered = filtered.filter(a => a.timestamp <= input.endDate!);
    }
    
    const paginated = filtered.slice(input.offset, input.offset + input.limit);
    
    return {
      activities: paginated,
      total: filtered.length,
      hasMore: input.offset + input.limit < filtered.length,
    };
  });

export const getActivityStatsProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    period: z.enum(['day', 'week', 'month', 'all']).default('week'),
  }))
  .query(async ({ input }) => {
    console.log(`[Activity] Computing stats for ${input.userId} (${input.period})`);
    
    return {
      period: input.period,
      stats: {
        totalActivities: 247,
        resonanceGiven: 45,
        amplificationsGiven: 12,
        witnessesGiven: 8,
        circlesJoined: 7,
        postsCreated: 15,
        dmsExchanged: 89,
        profileViews: 234,
        nftsCreated: 3,
        tokensEarned: 450,
        tokensSpent: 150,
        followersGained: 23,
        usersFollowed: 31,
        endorsementsReceived: 9,
        endorsementsGiven: 14,
        qotdAnswered: 18,
        truthScoreChange: +5,
      },
      topActivities: [
        { type: 'dm_sent', count: 45 },
        { type: 'resonate', count: 45 },
        { type: 'post_viewed', count: 89 },
        { type: 'profile_view', count: 23 },
        { type: 'qotd_answered', count: 18 },
      ],
      timestamp: new Date().toISOString(),
    };
  });
