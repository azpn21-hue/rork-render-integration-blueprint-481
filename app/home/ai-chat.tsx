import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Stack } from "expo-router";
import { Send } from "lucide-react-native";
import { streamChat, type ChatMessage } from "../services/ai";

export default function AIChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "You are Optima II, a precise and helpful AI assistant for R3AL Connection." }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const assistantMessage: ChatMessage = { role: "assistant", content: "" };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      for await (const chunk of streamChat([...messages, userMessage])) {
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === "assistant") {
            lastMsg.content += chunk;
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("[AI Chat] Error:", error);
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          lastMsg.content = "Sorry, I encountered an error. Please try again.";
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "AI Chat - Optima II",
          headerStyle: { backgroundColor: "#0a0f1c" },
          headerTintColor: "#fff",
        }}
      />

      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.slice(1).map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.messageBubble,
              msg.role === "user" ? styles.userBubble : styles.assistantBubble
            ]}
          >
            <Text style={styles.roleLabel}>
              {msg.role === "user" ? "You" : "Optima II"}
            </Text>
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
        {isStreaming && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#00d4ff" />
            <Text style={styles.loadingText}>Optima II is thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask Optima II anything..."
          placeholderTextColor="#666"
          multiline
          maxLength={1000}
          editable={!isStreaming}
        />
        <TouchableOpacity
          style={[styles.sendButton, (isStreaming || !input.trim()) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={isStreaming || !input.trim()}
        >
          {isStreaming ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1c",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#00d4ff",
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#1a2332",
    borderWidth: 1,
    borderColor: "#2a3542",
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#8a9aaa",
    marginBottom: 4,
    textTransform: "uppercase" as const,
  },
  messageText: {
    fontSize: 15,
    color: "#fff",
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#8a9aaa",
    fontStyle: "italic" as const,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#1a2332",
    backgroundColor: "#0f1420",
  },
  input: {
    flex: 1,
    backgroundColor: "#1a2332",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#2a3542",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#00d4ff",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
