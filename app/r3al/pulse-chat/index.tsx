import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MessageCircle, Video, Heart, Brain, Send } from "lucide-react-native";
import { useState, useEffect } from "react";
import { usePulseChat } from "@/app/contexts/PulseChatContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function PulseChatIndex() {
  const router = useRouter();
  const { activeSessionId, getActiveSession, startChatSession, sendMessage, loadState, isLoading } = usePulseChat();
  const [participantName, setParticipantName] = useState("");
  const [messageText, setMessageText] = useState("");
  
  const activeSession = getActiveSession();

  useEffect(() => {
    loadState();
  }, []);

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

    Alert.alert(
      "🫀 Pulse Chat Disclaimer",
      "Pulse Check and Honesty Check are optional entertainment features. They use device sensors to create visual effects but do not record or transmit biometric data.\n\nMessages and attachments delete automatically after 7 days (media after 24 hours).\n\nDo you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "I Agree", 
          onPress: () => {
            const sessionId = startChatSession(participantName);
            console.log(`🫀 [PulseChat] Session started: ${sessionId}`);
          }
        },
      ]
    );
  };

  const handleSendMessage = () => {
    if (!activeSessionId || !messageText.trim()) return;
    
    sendMessage(activeSessionId, messageText.trim());
    setMessageText("");
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
            <Text style={styles.title}>🫀 Pulse Chat</Text>
            <Text style={styles.subtitle}>Secure • Encrypted • Ephemeral</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
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
                <Text style={styles.sessionLabel}>Active Session</Text>
                <Text style={styles.sessionParticipant}>
                  {activeSession.participantNames[activeSession.participants[1]]}
                </Text>
                <Text style={styles.sessionMeta}>
                  Started: {new Date(activeSession.startTime).toLocaleTimeString()}
                </Text>
                <Text style={styles.sessionMeta}>
                  Auto-delete: {new Date(activeSession.autoDeleteTime).toLocaleDateString()}
                </Text>
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
                <Text style={styles.messagesLabel}>Messages</Text>
                <ScrollView style={styles.messagesList}>
                  {activeSession.messages.length === 0 ? (
                    <Text style={styles.noMessages}>No messages yet. Start chatting!</Text>
                  ) : (
                    activeSession.messages.map((msg) => (
                      <View key={msg.id} style={styles.messageItem}>
                        <Text style={styles.messageSender}>{msg.senderName}</Text>
                        <Text style={styles.messageContent}>{msg.content}</Text>
                        <Text style={styles.messageTime}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </Text>
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
    paddingVertical: 40,
    alignItems: "center" as const,
  },
  loadingText: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    letterSpacing: 1,
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
  sessionLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  sessionParticipant: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 12,
  },
  sessionMeta: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    marginBottom: 4,
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
  },
  messagesLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  messagesList: {
    maxHeight: 200,
  },
  noMessages: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
    padding: 20,
  },
  messageItem: {
    backgroundColor: tokens.colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
    color: tokens.colors.text,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
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
