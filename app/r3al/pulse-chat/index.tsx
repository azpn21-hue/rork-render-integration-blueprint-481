import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MessageCircle, Video, Heart, Brain, Send, X, Clock, Shield, Users } from "lucide-react-native";
import { useState, useEffect } from "react";
import { usePulseChat } from "@/app/contexts/PulseChatContext";
import PulseRing from "@/components/PulseRing";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import * as Haptics from "expo-haptics";

export default function PulseChatIndex() {
  const router = useRouter();
  const { activeSessionId, getActiveSession, startChatSession, sendMessage, loadState, isLoading, endChatSession } = usePulseChat();
  const [participantName, setParticipantName] = useState("");
  const [messageText, setMessageText] = useState("");
  
  const activeSession = getActiveSession();

  useEffect(() => {
    loadState();
  }, [loadState]);

  useEffect(() => {
    if (!isLoading && !activeSession && !activeSessionId) {
      console.log("🫀 [PulseChat] No active session found");
    }
  }, [activeSession, activeSessionId, isLoading]);

  const handleStartSession = () => {
    if (!participantName.trim()) {
      Alert.alert("Enter a name", "Please enter a participant name to start a session.");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      "🫀 Pulse Chat™ Disclaimer",
      "Pulse Check™ and Honesty Check™ are optional entertainment features. They use device sensors to create visual effects but do not record or transmit biometric data.\n\nMessages and attachments delete automatically after 7 days (media after 24 hours).\n\nDo you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "I Agree", 
          onPress: () => {
            const sessionId = startChatSession(participantName);
            console.log(`🫀 [PulseChat] Session started: ${sessionId}`);
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }
        },
      ]
    );
  };

  const handleSendMessage = () => {
    if (!activeSessionId || !messageText.trim()) return;
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    sendMessage(activeSessionId, messageText.trim());
    setMessageText("");
  };

  const handleEndSession = () => {
    if (!activeSessionId) return;
    
    Alert.alert(
      "End Session",
      "Are you sure you want to end this Pulse Chat™ session? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: () => {
            endChatSession(activeSessionId);
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
        },
      ]
    );
  };

  const handleStartVideo = () => {
    if (!activeSessionId) return;
    router.push("/r3al/pulse-chat/video");
  };

  const handleStartRealification = () => {
    if (!activeSessionId) return;
    router.push("/r3al/pulse-chat/realification");
  };

  const handleStartHonestyCheck = () => {
    if (!activeSessionId) return;
    router.push("/r3al/pulse-chat/honesty-check");
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>🫀 Pulse Chat</Text>
              <TouchableOpacity
                style={styles.dmListButton}
                onPress={() => router.push("/r3al/pulse-chat/dm-list")}
                activeOpacity={0.7}
              >
                <Users size={24} color={tokens.colors.gold} strokeWidth={2} />
                <Text style={styles.dmListButtonText}>My Chats</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>Secure • Encrypted • Ephemeral</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <PulseRing color="green" intensity={1} size={80} />
              <Text style={styles.loadingText}>Loading Pulse Chat™...</Text>
            </View>
          ) : !activeSession ? (
            <View style={styles.startSection}>
              <Text style={styles.label}>Start a New Session</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter participant name"
                placeholderTextColor={tokens.colors.textSecondary}
                value={participantName}
                onChangeText={setParticipantName}
                autoCapitalize="words"
              />
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartSession}
                activeOpacity={0.7}
              >
                <MessageCircle size={24} color={tokens.colors.background} strokeWidth={1.5} />
                <Text style={styles.startButtonText}>Start Chat Session</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.sessionInfo}>
                <View style={styles.sessionHeader}>
                  <View style={styles.pulseIndicator}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.sessionLabel}>Active Session</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.endSessionButton}
                    onPress={handleEndSession}
                    activeOpacity={0.7}
                  >
                    <X size={20} color={tokens.colors.error} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.sessionParticipant}>
                  {activeSession.participantNames[activeSession.participants[1]]}
                </Text>
                <View style={styles.sessionMetaContainer}>
                  <View style={styles.sessionMetaItem}>
                    <Clock size={14} color={tokens.colors.textSecondary} strokeWidth={2} />
                    <Text style={styles.sessionMeta}>
                      {new Date(activeSession.startTime).toLocaleTimeString()}
                    </Text>
                  </View>
                  <View style={styles.sessionMetaItem}>
                    <Shield size={14} color={tokens.colors.highlight} strokeWidth={2} />
                    <Text style={styles.sessionMeta}>
                      Encrypted • Auto-delete {new Date(activeSession.autoDeleteTime).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.featuresGrid}>
                <TouchableOpacity
                  style={styles.featureButton}
                  onPress={handleStartVideo}
                  activeOpacity={0.7}
                >
                  <Video size={32} color={tokens.colors.gold} strokeWidth={1.5} />
                  <Text style={styles.featureText}>Video Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.featureButton}
                  onPress={handleStartRealification}
                  activeOpacity={0.7}
                >
                  <Heart size={32} color={tokens.colors.accent} strokeWidth={1.5} />
                  <Text style={styles.featureText}>Realification</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.featureButton}
                  onPress={handleStartHonestyCheck}
                  activeOpacity={0.7}
                >
                  <Brain size={32} color={tokens.colors.highlight} strokeWidth={1.5} />
                  <Text style={styles.featureText}>Honesty Check</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.messagesSection}>
                <View style={styles.messagesHeader}>
                  <MessageCircle size={20} color={tokens.colors.gold} strokeWidth={2} />
                  <Text style={styles.messagesLabel}>Conversation</Text>
                  <View style={styles.messageCount}>
                    <Text style={styles.messageCountText}>{activeSession.messages.length}</Text>
                  </View>
                </View>
                <ScrollView 
                  style={styles.messagesList}
                  contentContainerStyle={styles.messagesListContent}
                  showsVerticalScrollIndicator={false}
                >
                  {activeSession.messages.length === 0 ? (
                    <View style={styles.emptyMessages}>
                      <MessageCircle size={48} color={tokens.colors.textSecondary} strokeWidth={1.5} />
                      <Text style={styles.noMessages}>No messages yet</Text>
                      <Text style={styles.noMessagesHint}>Start your secure conversation!</Text>
                    </View>
                  ) : (
                    activeSession.messages.map((msg, index) => (
                      <View 
                        key={msg.id} 
                        style={[
                          styles.messageItem,
                          msg.senderId === "user" && styles.messageItemSent
                        ]}
                      >
                        <View style={styles.messageHeader}>
                          <Text style={styles.messageSender}>{msg.senderName}</Text>
                          <Text style={styles.messageTime}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </Text>
                        </View>
                        <Text style={styles.messageContent}>{msg.content}</Text>
                        {msg.encrypted && (
                          <View style={styles.encryptedBadge}>
                            <Shield size={10} color={tokens.colors.highlight} strokeWidth={2} />
                            <Text style={styles.encryptedText}>Encrypted</Text>
                          </View>
                        )}
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>

              <View style={styles.inputSection}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type a message..."
                  placeholderTextColor={tokens.colors.textSecondary}
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  activeOpacity={0.7}
                >
                  <Send size={24} color={tokens.colors.gold} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center" as const,
    gap: 24,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  header: {
    marginBottom: 32,
  },
  titleContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  dmListButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  dmListButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    letterSpacing: 1,
    textAlign: "center" as const,
  },
  startSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  input: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    padding: 16,
    fontSize: 16,
    color: tokens.colors.text,
    marginBottom: 16,
  },
  startButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: tokens.colors.gold,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
  sessionInfo: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    marginBottom: 24,
  },
  sessionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pulseIndicator: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FF66",
  },
  sessionLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  endSessionButton: {
    padding: 8,
    backgroundColor: tokens.colors.error + "20",
    borderRadius: 8,
  },
  sessionParticipant: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 12,
  },
  sessionMetaContainer: {
    gap: 6,
  },
  sessionMetaItem: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
  },
  sessionMeta: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  featuresGrid: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 24,
  },
  featureButton: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: tokens.colors.text,
    textAlign: "center" as const,
  },
  messagesSection: {
    flex: 1,
    marginBottom: 16,
    minHeight: 300,
  },
  messagesHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  messagesLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  messageCount: {
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageCountText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    flexGrow: 1,
  },
  emptyMessages: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 60,
    gap: 12,
  },
  noMessages: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.text,
    textAlign: "center" as const,
  },
  noMessagesHint: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
  },
  messageItem: {
    backgroundColor: tokens.colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
  },
  messageItemSent: {
    backgroundColor: tokens.colors.gold + "15",
    borderColor: tokens.colors.gold,
  },
  messageHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
  },
  messageContent: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
  },
  encryptedBadge: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  encryptedText: {
    fontSize: 9,
    color: tokens.colors.highlight,
    fontWeight: "600" as const,
  },
  inputSection: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 24,
  },
  messageInput: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    padding: 12,
    fontSize: 14,
    color: tokens.colors.text,
    minHeight: 48,
  },
  sendButton: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    padding: 16,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: tokens.colors.gold,
  },
});
