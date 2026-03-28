import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Sparkles, Send, X, Minimize2 } from "lucide-react-native";
import { chatCompletion } from "@/app/services/ai";
import { useMutation } from "@tanstack/react-query";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_CONTEXT = `You are Optima, an AI assistant built into R3AL—a relationship trust and authentication platform created by a Special Forces operator. Your role is to:

1. Guide users through app features (Trust Vault, Hive, verification, scoring)
2. Answer questions about privacy, security, and how the platform works
3. Provide authentic, direct guidance with military-grade clarity
4. Respect user privacy—never ask for sensitive personal data
5. Encourage genuine interaction and authentic reputation-building

Be warm but professional. Be helpful but concise. Be smart but approachable.`;

interface OptimaAssistantProps {
  defaultOpen?: boolean;
}

export function OptimaAssistant({ defaultOpen = false }: OptimaAssistantProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Optima, your AI guide. I can help you navigate R3AL, explain features, or answer questions about trust, privacy, and safety. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(400)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false
        })
      ])
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, [glowAnim]);

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true
      }).start();
    }
  }, [isOpen, slideAnim]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const chatMessages = [
        { role: "system" as const, content: SYSTEM_CONTEXT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMessage }
      ];

      return await chatCompletion(chatMessages, {
        temperature: 0.7,
        max_tokens: 300
      });
    }
  });

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const response = await chatMutation.mutateAsync(input.trim());
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true
        })
      ]).start();
    }
    setIsOpen(!isOpen);
  };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.accent, theme.accentGlow]
  });

  return (
    <View style={styles.container}>
      {isOpen && (
        <Animated.View
          style={[
            styles.chatWindow,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <Sparkles size={20} color={theme.accent} strokeWidth={2} />
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Optima Assistant
              </Text>
              <View style={[styles.statusDot, { backgroundColor: "#16C784" }]} />
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={handleToggle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Minimize2 size={18} color={theme.textMuted} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.chatContent}
            keyboardVerticalOffset={100}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    msg.role === "user"
                      ? [styles.userBubble, { backgroundColor: theme.accent }]
                      : [styles.assistantBubble, { backgroundColor: theme.backgroundSecondary }]
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color: msg.role === "user" ? theme.background : theme.text
                      }
                    ]}
                  >
                    {msg.content}
                  </Text>
                </View>
              ))}
              {chatMutation.isPending && (
                <View style={[styles.messageBubble, styles.assistantBubble, { backgroundColor: theme.backgroundSecondary }]}>
                  <Text style={[styles.messageText, { color: theme.textMuted }]}>
                    Optima is typing...
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={[styles.inputContainer, { backgroundColor: theme.backgroundSecondary, borderTopColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ask Optima anything..."
                placeholderTextColor={theme.textMuted}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: input.trim() ? theme.accent : theme.border
                  }
                ]}
              >
                <Send size={18} color={theme.background} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.fabContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <TouchableOpacity
          onPress={handleToggle}
          style={[
            styles.fab,
            { backgroundColor: theme.accent }
          ]}
          activeOpacity={0.8}
        >
          {isOpen ? (
            <X size={24} color={theme.background} strokeWidth={2} />
          ) : (
            <Sparkles size={24} color={theme.background} strokeWidth={2} />
          )}
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.fabGlow,
            {
              backgroundColor: glowColor,
              opacity: 0.3
            }
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 1000
  },
  chatWindow: {
    position: "absolute",
    bottom: 80,
    right: 0,
    width: 340,
    height: 480,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700"
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  headerRight: {
    flexDirection: "row",
    gap: 12
  },
  chatContent: {
    flex: 1
  },
  messageList: {
    flex: 1
  },
  messageListContent: {
    padding: 16,
    gap: 12
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
    marginVertical: 4
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4
  },
  assistantBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    gap: 8,
    borderTopWidth: 1
  },
  input: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 8
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  fabContainer: {
    position: "relative"
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  fabGlow: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    zIndex: -1
  }
});
