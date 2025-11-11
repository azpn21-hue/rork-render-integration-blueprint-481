import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback, useMemo } from "react";

export type ActivityType =
  | 'resonate'
  | 'amplify'
  | 'witness'
  | 'circle_join'
  | 'circle_leave'
  | 'dm_sent'
  | 'dm_received'
  | 'post_created'
  | 'post_viewed'
  | 'profile_view'
  | 'profile_edit'
  | 'nft_created'
  | 'nft_purchased'
  | 'tokens_earned'
  | 'tokens_spent'
  | 'questionnaire_completed'
  | 'verification_completed'
  | 'realification_completed'
  | 'honesty_check_completed'
  | 'qotd_answered'
  | 'endorsement_given'
  | 'endorsement_received'
  | 'photo_uploaded'
  | 'follow_user'
  | 'unfollow_user';

export interface Activity {
  id: string;
  userId: string;
  activityType: ActivityType;
  targetId?: string;
  targetType?: 'user' | 'post' | 'circle' | 'nft' | 'photo' | 'message';
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ActivityStats {
  period: 'day' | 'week' | 'month' | 'all';
  stats: {
    totalActivities: number;
    resonanceGiven: number;
    amplificationsGiven: number;
    witnessesGiven: number;
    circlesJoined: number;
    postsCreated: number;
    dmsExchanged: number;
    profileViews: number;
    nftsCreated: number;
    tokensEarned: number;
    tokensSpent: number;
    followersGained: number;
    usersFollowed: number;
    endorsementsReceived: number;
    endorsementsGiven: number;
    qotdAnswered: number;
    truthScoreChange: number;
  };
  topActivities: { type: string; count: number }[];
  timestamp: string;
}

export const ACTIVITY_DISPLAY_NAMES: Record<ActivityType, string> = {
  resonate: 'Resonated',
  amplify: 'Amplified',
  witness: 'Witnessed',
  circle_join: 'Joined Circle',
  circle_leave: 'Left Circle',
  dm_sent: 'Sent Message',
  dm_received: 'Received Message',
  post_created: 'Created Post',
  post_viewed: 'Viewed Post',
  profile_view: 'Viewed Profile',
  profile_edit: 'Updated Profile',
  nft_created: 'Created NFT',
  nft_purchased: 'Purchased NFT',
  tokens_earned: 'Earned Tokens',
  tokens_spent: 'Spent Tokens',
  questionnaire_completed: 'Completed Questionnaire',
  verification_completed: 'Completed Verification',
  realification_completed: 'Completed Realification',
  honesty_check_completed: 'Completed Honesty Check',
  qotd_answered: 'Answered Question',
  endorsement_given: 'Gave Endorsement',
  endorsement_received: 'Received Endorsement',
  photo_uploaded: 'Uploaded Photo',
  follow_user: 'Followed User',
  unfollow_user: 'Unfollowed User',
};

export const [TrailblazeContext, useTrailblaze] = createContextHook(() => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const trackActivity = useCallback(async (
    userId: string,
    activityType: ActivityType,
    targetId?: string,
    targetType?: 'user' | 'post' | 'circle' | 'nft' | 'photo' | 'message',
    metadata?: Record<string, any>
  ) => {
    if (!isTracking) return;

    try {
      console.log(`[Trailblaze] Tracked: ${activityType} (local only)`);

      const newActivity: Activity = {
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        activityType,
        targetId,
        targetType,
        metadata,
        timestamp: new Date().toISOString(),
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 100));
    } catch (error) {
      console.error('[Trailblaze] Error tracking activity:', error);
    }
  }, [isTracking]);

  const loadHistory = useCallback(async (
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      activityTypes?: string[];
      startDate?: string;
      endDate?: string;
    }
  ) => {
    setIsLoading(true);
    try {
      console.log(`[Trailblaze] Loading history for user: ${userId} (local only)`);
      setIsLoading(false);
    } catch (error) {
      console.error('[Trailblaze] Error loading history:', error);
      setIsLoading(false);
    }
  }, []);

  const loadStats = useCallback(async (
    userId: string,
    period: 'day' | 'week' | 'month' | 'all' = 'week'
  ) => {
    setIsLoading(true);
    try {
      const mockStats: ActivityStats = {
        period,
        stats: {
          totalActivities: activities.length,
          resonanceGiven: 0,
          amplificationsGiven: 0,
          witnessesGiven: 0,
          circlesJoined: 0,
          postsCreated: 0,
          dmsExchanged: 0,
          profileViews: 0,
          nftsCreated: 0,
          tokensEarned: 0,
          tokensSpent: 0,
          followersGained: 0,
          usersFollowed: 0,
          endorsementsReceived: 0,
          endorsementsGiven: 0,
          qotdAnswered: 0,
          truthScoreChange: 0,
        },
        topActivities: [],
        timestamp: new Date().toISOString(),
      };

      setStats(mockStats);
      console.log(`[Trailblaze] Loaded stats for ${period} (local only)`);
    } catch (error) {
      console.error('[Trailblaze] Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activities]);

  const enableTracking = useCallback(() => {
    setIsTracking(true);
    console.log('[Trailblaze] Tracking enabled');
  }, []);

  const disableTracking = useCallback(() => {
    setIsTracking(false);
    console.log('[Trailblaze] Tracking disabled');
  }, []);

  const clearHistory = useCallback(() => {
    setActivities([]);
    setStats(null);
    console.log('[Trailblaze] History cleared');
  }, []);

  return useMemo(() => ({
    isTracking,
    activities,
    stats,
    isLoading,
    trackActivity,
    loadHistory,
    loadStats,
    enableTracking,
    disableTracking,
    clearHistory,
    ACTIVITY_DISPLAY_NAMES,
  }), [
    isTracking,
    activities,
    stats,
    isLoading,
    trackActivity,
    loadHistory,
    loadStats,
    enableTracking,
    disableTracking,
    clearHistory,
  ]);
});
