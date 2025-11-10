import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Sparkles, Send, Lightbulb, MessageCircle, Zap } from "lucide-react-native";
import { useState, useRef, useEffect } from "react";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import { generateText } from "@rork-ai/toolkit-sdk";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are Optima II™, the intelligent AI consultant embedded in R3AL - a revolutionary relationship trust and authentication platform.

Your role:
- Guide users through R3AL features (Pulse Chat™, Hive™, NFT marketplace, QOTD, Circles, Trust Scores)
- Answer questions about privacy, security, verification, and Trust-Tokens™
- Provide relationship advice grounded in authenticity and trust-building
- Help users understand their Truth Scores and how to improve them
- Explain the blockchain-backed NFT identity system
- Be warm, professional, and genuinely helpful

Key Platform Knowledge:
- Pulse Chat™: Encrypted, ephemeral messaging with optional biometric entertainment features
- Hive™: NFT marketplace for digital identity credentials
- Trust-Tokens™: In-app currency earned through authentic behavior and verification
- Truth Score: Multi-factor integrity rating based on verification, behavior, and community endorsements
- Realification™: Optional pulse-based connection verification (entertainment only)
- QOTD: Daily reflection questions that earn tokens

Privacy: R3AL is Privacy Act of 1974 compliant. All biometric entertainment features are local-only and never stored.

Be concise, authentic, and helpful. Guide users toward genuine connections and trust-building behaviors.`;

export default function OptimaAI() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm Optima II™, your R3AL AI consultant. I can help you:\n\n• Navigate platform features\n• Understand Trust-Tokens™ and Truth Scores\n• Learn about Pulse Chat™, Hive™, and more\n• Get relationship and trust-building advice\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await generateText({
        messages: [
          { role: "user", content: SYSTEM_PROMPT },
          ...conversationHistory,
          { role: "user", content: userInput },
        ],
      });

      const assistantMessage: Message = {
        id: Date.now().toString() + "-assistant",
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("[Optima AI] Error:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or check your connection.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { icon: Lightbulb, text: "How do I improve my Truth Score?", prompt: "How can I improve my Truth Score on R3AL?" },
    { icon: MessageCircle, text: "What is Pulse Chat?", prompt: "Tell me about Pulse Chat and how it works" },
    { icon: Zap, text: "How to earn Trust-Tokens?", prompt: "How can I earn more Trust-Tokens?" },
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <LinearGradient colors={[tokens.colors.background, tokens.colors.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Sparkles size={24} color={tokens.colors.gold} strokeWidth={2} />
            <Text style={styles.headerTitle}>Optima II™</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.chatContainer}
          keyboardVerticalOffset={90}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role === "user" ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {message.role === "assistant" && (
                  <View style={styles.assistantIcon}>
                    <Sparkles size={16} color={tokens.colors.gold} strokeWidth={2} />
                  </View>
                )}
                <View style={styles.messageContent}>
                  <Text
                    style={[
                      styles.messageText,
                      message.role === "user" ? styles.userText : styles.assistantText,
                    ]}
                  >
                    {message.content}
                  </Text>
                  <Text style={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
              </View>
            ))}

            {isLoading && (
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <View style={styles.assistantIcon}>
                  <Sparkles size={16} color={tokens.colors.gold} strokeWidth={2} />
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color={tokens.colors.gold} />
                    <Text style={styles.typingText}>Optima is thinking...</Text>
                  </View>
                </View>
              </View>
            )}

            {messages.length === 1 && (
              <View style={styles.quickPromptsContainer}>
                <Text style={styles.quickPromptsTitle}>Quick Questions:</Text>
                {quickPrompts.map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickPromptButton}
                    onPress={() => handleQuickPrompt(prompt.prompt)}
                    activeOpacity={0.7}
                  >
                    <prompt.icon size={20} color={tokens.colors.gold} strokeWidth={2} />
                    <Text style={styles.quickPromptText}>{prompt.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask Optima II anything..."
              placeholderTextColor={tokens.colors.textSecondary}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
              activeOpacity={0.7}
            >
              <Send size={20} color={tokens.colors.background} strokeWidth={2} />
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
  header: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  placeholder: {
    width: 32,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageBubble: {
    flexDirection: "row" as const,
    marginBottom: 16,
    gap: 12,
    maxWidth: "85%",
  },
  userBubble: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse" as const,
  },
  assistantBubble: {
    alignSelf: "flex-start",
  },
  assistantIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.gold + "20",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    backgroundColor: tokens.colors.gold,
    color: tokens.colors.background,
    padding: 12,
    borderRadius: 16,
    borderTopRightRadius: 4,
    overflow: "hidden",
  },
  assistantText: {
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.text,
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
  },
  messageTime: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 4,
    marginLeft: 12,
  },
  typingIndicator: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    backgroundColor: tokens.colors.surface,
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
  },
  typingText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    fontStyle: "italic" as const,
  },
  quickPromptsContainer: {
    marginTop: 20,
    gap: 12,
  },
  quickPromptsTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  quickPromptButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
  },
  quickPromptText: {
    flex: 1,
    fontSize: 14,
    color: tokens.colors.text,
    fontWeight: "600" as const,
  },
  inputContainer: {
    flexDirection: "row" as const,
    alignItems: "flex-end",
    gap: 12,
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "30",
    backgroundColor: tokens.colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: tokens.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
