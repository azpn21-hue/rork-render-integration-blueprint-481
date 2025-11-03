import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CircleMember {
  userId: string;
  userName: string;
  avatar?: string;
  truthScore: number;
  joinedAt: string;
  role: "owner" | "admin" | "member";
}

export interface CirclePost {
  id: string;
  circleId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  type: "text" | "photo" | "photo_drop";
  photoUrl?: string;
  photoCaption?: string;
  timestamp: string;
  likes: string[];
  comments: CircleComment[];
  isPhotoDrop?: boolean;
  dropAnimation?: "fade" | "slide" | "bounce" | "pulse";
}

export interface CircleComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
}

export interface DirectMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  content: string;
  timestamp: string;
  read: boolean;
  encrypted: boolean;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  isPrivate: boolean;
  requiresApproval: boolean;
  memberCount: number;
  avgTruthScore: number;
  activityLevel: "high" | "medium" | "low";
  members: CircleMember[];
  posts: CirclePost[];
  createdAt: string;
  createdBy: string;
}

export interface CircleInvite {
  id: string;
  circleId: string;
  circleName: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
  timestamp: string;
}

export interface CirclesState {
  circles: Circle[];
  myCircles: string[];
  directMessages: DirectMessage[];
  pendingInvites: CircleInvite[];
  isLoading: boolean;
}

const STORAGE_KEY = "@circles_state";

const INITIAL_CIRCLES: Circle[] = [
  {
    id: "1",
    name: "Tech Innovators",
    description: "Building the future of technology with integrity and transparency",
    memberCount: 1247,
    category: "Technology",
    isPrivate: false,
    requiresApproval: false,
    avgTruthScore: 87,
    activityLevel: "high",
    icon: "💡",
    color: "#3B82F6",
    members: [],
    posts: [],
    createdAt: new Date().toISOString(),
    createdBy: "system",
  },
  {
    id: "2",
    name: "Trust Builders",
    description: "Core community focused on building authentic relationships",
    memberCount: 892,
    category: "Community",
    isPrivate: false,
    requiresApproval: false,
    avgTruthScore: 92,
    activityLevel: "high",
    icon: "🤝",
    color: "#10B981",
    members: [],
    posts: [],
    createdAt: new Date().toISOString(),
    createdBy: "system",
  },
  {
    id: "3",
    name: "Startup Founders",
    description: "Entrepreneur circle for founders building with purpose",
    memberCount: 543,
    category: "Business",
    isPrivate: true,
    requiresApproval: true,
    avgTruthScore: 85,
    activityLevel: "medium",
    icon: "🚀",
    color: "#F59E0B",
    members: [],
    posts: [],
    createdAt: new Date().toISOString(),
    createdBy: "system",
  },
];

export const [CirclesContext, useCircles] = createContextHook(() => {
  const [state, setState] = useState<CirclesState>({
    circles: INITIAL_CIRCLES,
    myCircles: [],
    directMessages: [],
    pendingInvites: [],
    isLoading: true,
  });

  useEffect(() => {
    loadState();
  }, []);

  const loadState = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        if (typeof stored !== 'string' || stored.trim().length === 0) {
          console.error("[Circles] Invalid stored data");
          await AsyncStorage.removeItem(STORAGE_KEY);
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }
        
        try {
          const parsedState = JSON.parse(stored);
          setState({ ...parsedState, isLoading: false });
        } catch (parseError: any) {
          console.error("[Circles] JSON parse error:", parseError?.message || parseError);
          console.error("[Circles] Invalid data:", stored?.substring(0, 100));
          await AsyncStorage.removeItem(STORAGE_KEY);
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error: any) {
      console.error("[Circles] Failed to load state:", error?.message || error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const saveState = useCallback(
    async (newState: Partial<CirclesState>) => {
      try {
        const updated = { ...state, ...newState };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setState(updated);
      } catch (error) {
        console.error("[Circles] Failed to save state:", error);
      }
    },
    [state]
  );

  const createCircle = useCallback(
    (circle: Omit<Circle, "id" | "createdAt" | "members" | "posts" | "memberCount">) => {
      const newCircle: Circle = {
        ...circle,
        id: `circle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        members: [
          {
            userId: circle.createdBy,
            userName: circle.createdBy,
            truthScore: 85,
            joinedAt: new Date().toISOString(),
            role: "owner",
          },
        ],
        posts: [],
        memberCount: 1,
      };

      console.log(`🔷 [Circles] Created: ${newCircle.name}`);
      saveState({
        circles: [...state.circles, newCircle],
        myCircles: [...state.myCircles, newCircle.id],
      });
      return newCircle;
    },
    [saveState, state.circles, state.myCircles]
  );

  const joinCircle = useCallback(
    (circleId: string, userId: string, userName: string, truthScore: number = 75) => {
      const updatedCircles = state.circles.map((circle) => {
        if (circle.id === circleId) {
          const newMember: CircleMember = {
            userId,
            userName,
            truthScore,
            joinedAt: new Date().toISOString(),
            role: "member",
          };
          return {
            ...circle,
            members: [...circle.members, newMember],
            memberCount: circle.memberCount + 1,
          };
        }
        return circle;
      });

      console.log(`✅ [Circles] ${userName} joined circle ${circleId}`);
      saveState({
        circles: updatedCircles,
        myCircles: [...state.myCircles, circleId],
      });
    },
    [saveState, state.circles, state.myCircles]
  );

  const leaveCircle = useCallback(
    (circleId: string, userId: string) => {
      const updatedCircles = state.circles.map((circle) => {
        if (circle.id === circleId) {
          return {
            ...circle,
            members: circle.members.filter((m) => m.userId !== userId),
            memberCount: Math.max(0, circle.memberCount - 1),
          };
        }
        return circle;
      });

      console.log(`👋 [Circles] User ${userId} left circle ${circleId}`);
      saveState({
        circles: updatedCircles,
        myCircles: state.myCircles.filter((id) => id !== circleId),
      });
    },
    [saveState, state.circles, state.myCircles]
  );

  const postToCircle = useCallback(
    (
      circleId: string,
      authorId: string,
      authorName: string,
      content: string,
      type: "text" | "photo" | "photo_drop" = "text",
      photoUrl?: string,
      photoCaption?: string,
      isPhotoDrop?: boolean,
      dropAnimation?: "fade" | "slide" | "bounce" | "pulse"
    ) => {
      const newPost: CirclePost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        circleId,
        authorId,
        authorName,
        content,
        type,
        photoUrl,
        photoCaption,
        timestamp: new Date().toISOString(),
        likes: [],
        comments: [],
        isPhotoDrop: isPhotoDrop || false,
        dropAnimation: dropAnimation || "fade",
      };

      const updatedCircles = state.circles.map((circle) => {
        if (circle.id === circleId) {
          return {
            ...circle,
            posts: [newPost, ...circle.posts],
          };
        }
        return circle;
      });

      console.log(`📝 [Circles] ${authorName} posted to ${circleId}`);
      saveState({ circles: updatedCircles });
      return newPost;
    },
    [saveState, state.circles]
  );

  const likePost = useCallback(
    (postId: string, userId: string) => {
      const updatedCircles = state.circles.map((circle) => ({
        ...circle,
        posts: circle.posts.map((post) => {
          if (post.id === postId) {
            const hasLiked = post.likes.includes(userId);
            return {
              ...post,
              likes: hasLiked
                ? post.likes.filter((id) => id !== userId)
                : [...post.likes, userId],
            };
          }
          return post;
        }),
      }));

      saveState({ circles: updatedCircles });
    },
    [saveState, state.circles]
  );

  const commentOnPost = useCallback(
    (postId: string, authorId: string, authorName: string, content: string) => {
      const newComment: CircleComment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        authorId,
        authorName,
        content,
        timestamp: new Date().toISOString(),
      };

      const updatedCircles = state.circles.map((circle) => ({
        ...circle,
        posts: circle.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment],
            };
          }
          return post;
        }),
      }));

      console.log(`💬 [Circles] ${authorName} commented on post ${postId}`);
      saveState({ circles: updatedCircles });
      return newComment;
    },
    [saveState, state.circles]
  );

  const sendDirectMessage = useCallback(
    (
      fromUserId: string,
      toUserId: string,
      fromUserName: string,
      toUserName: string,
      content: string
    ) => {
      const newMessage: DirectMessage = {
        id: `dm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId,
        toUserId,
        fromUserName,
        toUserName,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        encrypted: true,
      };

      console.log(`✉️ [Circles] DM sent from ${fromUserName} to ${toUserName}`);
      saveState({ directMessages: [...state.directMessages, newMessage] });
      return newMessage;
    },
    [saveState, state.directMessages]
  );

  const markMessageAsRead = useCallback(
    (messageId: string) => {
      const updatedMessages = state.directMessages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      );
      saveState({ directMessages: updatedMessages });
    },
    [saveState, state.directMessages]
  );

  const getCircleById = useCallback(
    (circleId: string) => {
      return state.circles.find((c) => c.id === circleId);
    },
    [state.circles]
  );

  const getMyCircles = useCallback(() => {
    return state.circles.filter((c) => state.myCircles.includes(c.id));
  }, [state.circles, state.myCircles]);

  const getDirectMessagesWithUser = useCallback(
    (userId: string, myUserId: string) => {
      return state.directMessages.filter(
        (msg) =>
          (msg.fromUserId === userId && msg.toUserId === myUserId) ||
          (msg.fromUserId === myUserId && msg.toUserId === userId)
      );
    },
    [state.directMessages]
  );

  const getUnreadMessageCount = useCallback(
    (userId: string) => {
      return state.directMessages.filter((msg) => msg.toUserId === userId && !msg.read)
        .length;
    },
    [state.directMessages]
  );

  const resetCircles = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState({
      circles: INITIAL_CIRCLES,
      myCircles: [],
      directMessages: [],
      pendingInvites: [],
      isLoading: false,
    });
  }, []);

  return useMemo(
    () => ({
      ...state,
      createCircle,
      joinCircle,
      leaveCircle,
      postToCircle,
      likePost,
      commentOnPost,
      sendDirectMessage,
      markMessageAsRead,
      getCircleById,
      getMyCircles,
      getDirectMessagesWithUser,
      getUnreadMessageCount,
      resetCircles,
    }),
    [
      state,
      createCircle,
      joinCircle,
      leaveCircle,
      postToCircle,
      likePost,
      commentOnPost,
      sendDirectMessage,
      markMessageAsRead,
      getCircleById,
      getMyCircles,
      getDirectMessagesWithUser,
      getUnreadMessageCount,
      resetCircles,
    ]
  );
});
