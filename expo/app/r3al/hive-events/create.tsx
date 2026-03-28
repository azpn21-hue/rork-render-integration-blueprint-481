import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Clock, Users, Sparkles, Calendar } from "lucide-react-native";

const THEMES = [
  { value: "calm", label: "Calm", color: "#06b6d4", icon: "🌊" },
  { value: "focus", label: "Focus", color: "#8b5cf6", icon: "🎯" },
  { value: "gratitude", label: "Gratitude", color: "#10b981", icon: "🙏" },
  { value: "energy", label: "Energy", color: "#f59e0b", icon: "⚡" },
  { value: "empathy", label: "Empathy", color: "#ec4899", icon: "❤️" },
  { value: "mindful", label: "Mindful", color: "#6366f1", icon: "🧘" },
  { value: "celebration", label: "Celebration", color: "#f97316", icon: "🎉" },
] as const;

const DURATIONS = [15, 30, 45, 60, 90];

export default function CreateEventScreen() {
  const { circleId } = useLocalSearchParams<{ circleId: string }>();
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<typeof THEMES[number]["value"]>("calm");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [startTime, setStartTime] = useState(
    new Date(Date.now() + 60 * 60 * 1000).toISOString()
  );

  const createMutation = trpc.r3al.hiveEvents.create.useMutation({
    onSuccess: () => {
      Alert.alert("Success", "Event created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title");
      return;
    }

    if (!circleId) {
      Alert.alert("Error", "No circle selected");
      return;
    }

    createMutation.mutate({
      circleId,
      title: title.trim(),
      theme,
      description: description.trim() || undefined,
      startTime,
      duration,
    });
  };

  const selectedTheme = THEMES.find((t) => t.value === theme)!;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Hive Event",
          headerStyle: { backgroundColor: "#0a0a0a" },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Evening Calm Session"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Theme</Text>
          <View style={styles.themeGrid}>
            {THEMES.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.themeCard,
                  theme === t.value && {
                    backgroundColor: t.color + "20",
                    borderColor: t.color,
                  },
                ]}
                onPress={() => setTheme(t.value)}
              >
                <Text style={styles.themeIcon}>{t.icon}</Text>
                <Text
                  style={[
                    styles.themeLabel,
                    theme === t.value && { color: t.color },
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.durationButton,
                  duration === d && {
                    backgroundColor: selectedTheme.color,
                  },
                ]}
                onPress={() => setDuration(d)}
              >
                <Clock size={16} color={duration === d ? "#fff" : "#666"} />
                <Text
                  style={[
                    styles.durationText,
                    duration === d && { color: "#fff" },
                  ]}
                >
                  {d}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what participants can expect..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.aiPreview}>
          <View style={styles.aiHeader}>
            <Sparkles size={20} color={selectedTheme.color} />
            <Text style={styles.aiTitle}>AI Curator Preview</Text>
          </View>
          <Text style={styles.aiMood}>Mood: {selectedTheme.label}</Text>
          <Text style={styles.aiText}>
            Your event will be enhanced with AI-curated soundscapes, adaptive
            visuals, and real-time resonance tracking to create an immersive
            collective experience.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: selectedTheme.color },
            createMutation.isPending && styles.createButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Calendar size={20} color="#fff" />
              <Text style={styles.createButtonText}>Create Event</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Users size={18} color="#06b6d4" />
          <Text style={styles.infoText}>
            Circle members will be notified 15 minutes before the event starts
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
  },
  textArea: {
    minHeight: 100,
  },
  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  themeCard: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  themeIcon: {
    fontSize: 32,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  durationRow: {
    flexDirection: "row",
    gap: 12,
  },
  durationButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  aiPreview: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  aiMood: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  aiText: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#0a1a1f",
    borderWidth: 1,
    borderColor: "#06b6d420",
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#06b6d4",
    lineHeight: 20,
  },
});
