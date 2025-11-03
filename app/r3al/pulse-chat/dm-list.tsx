import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  MessageCircle,
  Search,
  Users,
  ArrowLeft,
  Shield,
  Clock,
} from "lucide-react-native";
import { useState, useMemo } from "react";
import { useCircles } from "@/app/contexts/CirclesContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import * as Haptics from "expo-haptics";

export default function DMListScreen() {
  const router = useRouter();
  const { directMessages, getUnreadMessageCount } = useCircles();
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserId = "user";

  const conversations = useMemo(() => {
    const conversationMap = new Map<string, any>();

    if (!directMessages || !Array.isArray(directMessages)) {
      console.warn('[DMList] directMessages is not an array:', directMessages);
      return [];
    }

    directMessages.forEach((msg) => {
      const otherUserId =
        msg.fromUserId === currentUserId ? msg.toUserId : msg.fromUserId;
      const otherUserName =
        msg.fromUserId === currentUserId ? msg.toUserName : msg.fromUserName;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg.content,
          lastMessageTime: msg.timestamp,
          unreadCount: msg.toUserId === currentUserId && !msg.read ? 1 : 0,
          encrypted: msg.encrypted,
        });
      } else {
        const existing = conversationMap.get(otherUserId);
        if (new Date(msg.timestamp) > new Date(existing.lastMessageTime)) {
          existing.lastMessage = msg.content;
          existing.lastMessageTime = msg.timestamp;
        }
        if (msg.toUserId === currentUserId && !msg.read) {
          existing.unreadCount += 1;
        }
      }
    });

    return Array.from(conversationMap.values()).sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
    );
  }, [directMessages, currentUserId]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    if (!conversations || !Array.isArray(conversations)) return [];
    return conversations.filter((conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const handleConversationPress = (userId: string, userName: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: "/r3al/pulse-chat/dm",
      params: { userId, userName },
    });
  };

  const totalUnread = useMemo(
    () => {
      if (!conversations || !Array.isArray(conversations)) return 0;
      return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    },
    [conversations]
  );

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <MessageCircle
              size={24}
              color={tokens.colors.gold}
              strokeWidth={2}
            />
            <Text style={styles.headerTitle}>Direct Messages</Text>
            {totalUnread > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{totalUnread}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => router.push("/r3al/circles")}
            activeOpacity={0.7}
          >
            <Users size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={tokens.colors.textSecondary}
            strokeWidth={2}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={tokens.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          style={styles.conversationsList}
          contentContainerStyle={styles.conversationsContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredConversations.length === 0 ? (
            <View style={styles.emptyState}>
              <MessageCircle
                size={64}
                color={tokens.colors.textSecondary}
                strokeWidth={1.5}
              />
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? "No results found"
                  : "Start chatting with members from your circles"}
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push("/r3al/circles")}
                activeOpacity={0.7}
              >
                <Users size={20} color={tokens.colors.background} />
                <Text style={styles.exploreButtonText}>Explore Circles</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredConversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.userId}
                style={[
                  styles.conversationItem,
                  conversation.unreadCount > 0 && styles.conversationUnread,
                ]}
                onPress={() =>
                  handleConversationPress(
                    conversation.userId,
                    conversation.userName
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {conversation.userName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  {conversation.unreadCount > 0 && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>

                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName}>
                      {conversation.userName}
                    </Text>
                    <View style={styles.conversationMeta}>
                      {conversation.encrypted && (
                        <Shield
                          size={12}
                          color={tokens.colors.highlight}
                          strokeWidth={2}
                        />
                      )}
                      <Clock
                        size={12}
                        color={tokens.colors.textSecondary}
                        strokeWidth={2}
                      />
                      <Text style={styles.conversationTime}>
                        {formatTime(conversation.lastMessageTime)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.messagePreviewContainer}>
                    <Text
                      style={[
                        styles.messagePreview,
                        conversation.unreadCount > 0 &&
                          styles.messagePreviewUnread,
                      ]}
                      numberOfLines={2}
                    >
                      {conversation.lastMessage}
                    </Text>
                    {conversation.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>
                          {conversation.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "20",
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
  },
  headerBadge: {
    backgroundColor: tokens.colors.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  newChatButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    borderRadius: tokens.dimensions.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: tokens.colors.text,
  },
  conversationsList: {
    flex: 1,
  },
  conversationsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 80,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: tokens.colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
    paddingHorizontal: 40,
  },
  exploreButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: tokens.dimensions.borderRadius,
    marginTop: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.background,
  },
  conversationItem: {
    flexDirection: "row" as const,
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "20",
    marginBottom: 12,
    gap: 12,
  },
  conversationUnread: {
    borderColor: tokens.colors.gold,
    backgroundColor: tokens.colors.gold + "10",
  },
  avatarContainer: {
    position: "relative" as const,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  onlineIndicator: {
    position: "absolute" as const,
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#00FF66",
    borderWidth: 2,
    borderColor: tokens.colors.surface,
  },
  conversationContent: {
    flex: 1,
    gap: 8,
  },
  conversationHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversationName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: tokens.colors.text,
    flex: 1,
  },
  conversationMeta: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
  },
  conversationTime: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  messagePreviewContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
  },
  messagePreviewUnread: {
    color: tokens.colors.text,
    fontWeight: "600" as const,
  },
  unreadBadge: {
    backgroundColor: tokens.colors.gold,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
});
