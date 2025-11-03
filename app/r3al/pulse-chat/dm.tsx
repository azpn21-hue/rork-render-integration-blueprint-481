import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  Shield,
  MoreVertical,
  Check,
  CheckCheck,
} from "lucide-react-native";
import { useState, useEffect, useRef, useMemo } from "react";
import { useCircles } from "@/app/contexts/CirclesContext";
import { trpc } from "@/lib/trpc";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import * as Haptics from "expo-haptics";

export default function DMConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, userName } = params as { userId: string; userName: string };
  
  const {
    directMessages: localMessages,
    sendDirectMessage: sendLocalMessage,
    markMessageAsRead: markLocalRead,
    getDirectMessagesWithUser,
  } = useCircles();
  
  const currentUserId = "user";
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const messagesQuery = trpc.r3al.dm.getMessages.useQuery(
    { userId: currentUserId, otherUserId: userId },
    {
      refetchInterval: 3000,
      refetchOnMount: true,
    }
  );

  const sendMessageMutation = trpc.r3al.dm.sendMessage.useMutation({
    onSuccess: () => {
      messagesQuery.refetch();
    },
  });

  const markReadMutation = trpc.r3al.dm.markRead.useMutation();

  const conversation = useMemo(
    () => {
      if (messagesQuery.data?.messages) {
        return messagesQuery.data.messages;
      }
      return getDirectMessagesWithUser(userId, currentUserId);
    },
    [messagesQuery.data, userId, currentUserId, getDirectMessagesWithUser]
  );

  useEffect(() => {
    conversation.forEach((msg) => {
      if (msg.toUserId === currentUserId && !msg.read) {
        markReadMutation.mutate({ messageId: msg.id });
        markLocalRead(msg.id);
      }
    });
  }, [conversation, currentUserId]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [conversation.length]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    sendMessageMutation.mutate({
      fromUserId: currentUserId,
      toUserId: userId,
      fromUserName: "You",
      toUserName: userName,
      content: messageText.trim(),
    });

    sendLocalMessage(currentUserId, userId, "You", userName, messageText.trim());
    setMessageText("");
    setIsTyping(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleTextChange = (text: string) => {
    setMessageText(text);
    
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
    }

    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    typingTimer.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const insertEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const quickEmojis = ["👋", "😊", "😂", "❤️", "🔥", "👍", "🎉", "✨"];

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={0}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>{userName}</Text>
                <View style={styles.encryptionBadge}>
                  <Shield size={12} color={tokens.colors.highlight} strokeWidth={2} />
                  <Text style={styles.encryptionText}>End-to-End Encrypted</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
              <MoreVertical size={24} color={tokens.colors.gold} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {conversation.length === 0 ? (
              <View style={styles.emptyState}>
                <Shield size={48} color={tokens.colors.highlight} strokeWidth={1.5} />
                <Text style={styles.emptyTitle}>Start a secure conversation</Text>
                <Text style={styles.emptySubtitle}>
                  All messages are end-to-end encrypted
                </Text>
              </View>
            ) : (
              <>
                {conversation.map((msg, index) => {
                  const isMe = msg.fromUserId === currentUserId;
                  const showAvatar =
                    index === 0 ||
                    conversation[index - 1].fromUserId !== msg.fromUserId;
                  const isLastInGroup =
                    index === conversation.length - 1 ||
                    conversation[index + 1].fromUserId !== msg.fromUserId;

                  return (
                    <View
                      key={msg.id}
                      style={[styles.messageRow, isMe && styles.messageRowMe]}
                    >
                      {!isMe && showAvatar && (
                        <View style={styles.messageAvatar}>
                          <Text style={styles.messageAvatarText}>
                            {userName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                      {!isMe && !showAvatar && <View style={styles.messageAvatarSpacer} />}

                      <View
                        style={[
                          styles.messageBubble,
                          isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
                          !isLastInGroup && styles.messageBubbleGrouped,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            isMe && styles.messageTextMe,
                          ]}
                        >
                          {msg.content}
                        </Text>
                        <View style={styles.messageFooter}>
                          <Text
                            style={[
                              styles.messageTime,
                              isMe && styles.messageTimeMe,
                            ]}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                          {isMe && (
                            <View style={styles.messageStatus}>
                              {msg.read ? (
                                <CheckCheck
                                  size={14}
                                  color={tokens.colors.highlight}
                                  strokeWidth={2}
                                />
                              ) : (
                                <Check
                                  size={14}
                                  color={tokens.colors.textSecondary}
                                  strokeWidth={2}
                                />
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
                {isTyping && (
                  <View style={styles.typingIndicator}>
                    <View style={styles.messageAvatar}>
                      <Text style={styles.messageAvatarText}>
                        {userName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.typingBubble}>
                      <View style={styles.typingDots}>
                        <View style={styles.typingDot} />
                        <View style={styles.typingDot} />
                        <View style={styles.typingDot} />
                      </View>
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>

          {showEmojiPicker && (
            <View style={styles.emojiPicker}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.emojiPickerContent}
              >
                {quickEmojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.emojiButton}
                    onPress={() => insertEmoji(emoji)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() => setShowEmojiPicker(!showEmojiPicker)}
              activeOpacity={0.7}
            >
              <Smile size={24} color={tokens.colors.gold} strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                placeholderTextColor={tokens.colors.textSecondary}
                value={messageText}
                onChangeText={handleTextChange}
                multiline
                maxLength={2000}
              />
            </View>

            <TouchableOpacity
              style={styles.attachButton}
              activeOpacity={0.7}
            >
              <Paperclip size={24} color={tokens.colors.gold} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendButton,
                messageText.trim() && styles.sendButtonActive,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
              activeOpacity={0.7}
            >
              <Send
                size={20}
                color={
                  messageText.trim()
                    ? tokens.colors.background
                    : tokens.colors.textSecondary
                }
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    gap: 12,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: tokens.colors.text,
    marginBottom: 2,
  },
  encryptionBadge: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
  },
  encryptionText: {
    fontSize: 11,
    color: tokens.colors.highlight,
    fontWeight: "600" as const,
  },
  moreButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: tokens.colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
  },
  messageRow: {
    flexDirection: "row" as const,
    marginBottom: 4,
    alignItems: "flex-end",
  },
  messageRowMe: {
    justifyContent: "flex-end",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.gold + "80",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  messageAvatarText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  messageAvatarSpacer: {
    width: 40,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    gap: 4,
  },
  messageBubbleOther: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
    borderBottomLeftRadius: 4,
  },
  messageBubbleMe: {
    backgroundColor: tokens.colors.gold,
    borderBottomRightRadius: 4,
  },
  messageBubbleGrouped: {
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    color: tokens.colors.text,
    lineHeight: 20,
  },
  messageTextMe: {
    color: tokens.colors.background,
  },
  messageFooter: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  messageTime: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  messageTimeMe: {
    color: tokens.colors.background + "CC",
  },
  messageStatus: {
    marginLeft: 4,
  },
  typingIndicator: {
    flexDirection: "row" as const,
    alignItems: "flex-end",
    marginBottom: 4,
  },
  typingBubble: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: "row" as const,
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.textSecondary,
  },
  emojiPicker: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "20",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  emojiPickerContent: {
    gap: 12,
  },
  emojiButton: {
    padding: 8,
  },
  emojiText: {
    fontSize: 28,
  },
  inputContainer: {
    flexDirection: "row" as const,
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "20",
    gap: 8,
  },
  attachButton: {
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  messageInput: {
    fontSize: 15,
    color: tokens.colors.text,
    minHeight: 24,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: tokens.colors.gold,
    borderColor: tokens.colors.gold,
  },
});
