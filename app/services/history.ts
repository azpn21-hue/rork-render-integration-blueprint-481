import { trpc } from "@/lib/trpc";

export type EventType =
  | "pulse_update"
  | "hive_connection"
  | "qotd_answer"
  | "nft_mint"
  | "chat_session"
  | "verification_step"
  | "profile_update"
  | "feed_interaction";

export interface HistoryEvent {
  eventId: string;
  eventType: EventType;
  timestamp: string;
  metadata?: Record<string, any>;
  duration?: number;
}

export interface HistorySummary {
  totalEvents: number;
  mostFrequentEvent: string;
  averageDailyActivity: number;
  streakDays: number;
}

export const useLogHistoryEvent = () => {
  return trpc.r3al.history.logEvent.useMutation();
};

export const useHistory = (options?: {
  limit?: number;
  offset?: number;
  eventType?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return trpc.r3al.history.getHistory.useQuery(options || {});
};

export const useDeleteHistory = () => {
  return trpc.r3al.history.deleteHistory.useMutation();
};

export const useHistorySummary = (period: "day" | "week" | "month" | "year" = "week") => {
  return trpc.r3al.history.getSummary.useQuery({ period });
};

export const getEventTypeLabel = (eventType: EventType): string => {
  const labelMap: Record<EventType, string> = {
    pulse_update: "Pulse Update",
    hive_connection: "Hive Connection",
    qotd_answer: "Question Answered",
    nft_mint: "NFT Minted",
    chat_session: "Chat Session",
    verification_step: "Verification",
    profile_update: "Profile Update",
    feed_interaction: "Feed Activity",
  };
  return labelMap[eventType];
};

export const getEventTypeIcon = (eventType: EventType): string => {
  const iconMap: Record<EventType, string> = {
    pulse_update: "activity",
    hive_connection: "users",
    qotd_answer: "message-circle",
    nft_mint: "image",
    chat_session: "message-square",
    verification_step: "shield-check",
    profile_update: "user",
    feed_interaction: "rss",
  };
  return iconMap[eventType];
};
