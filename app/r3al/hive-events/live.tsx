import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { trpc } from "@/lib/trpc";
import { X, Heart } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import ResonanceVisualizer from "@/components/ResonanceVisualizer";

export default function LiveEventScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [isActive, setIsActive] = useState(true);

  const eventQuery = trpc.r3al.hiveEvents.getDetail.useQuery(
    { eventId: eventId! },
    { enabled: !!eventId, refetchInterval: 5000 }
  );

  const liveQuery = trpc.r3al.hiveEvents.getLiveStream.useQuery(
    { eventId: eventId! },
    { enabled: !!eventId && isActive, refetchInterval: 2000 }
  );

  const submitDataMutation = trpc.r3al.hiveEvents.submitLiveData.useMutation();
  const leaveMutation = trpc.r3al.hiveEvents.leave.useMutation({
    onSuccess: () => {
      setIsActive(false);
      router.back();
    },
  });

  useEffect(() => {
    if (!isActive || !eventId) return;

    const interval = setInterval(() => {
      const resonance = 0.6 + Math.random() * 0.3;
      const bpm = 60 + Math.random() * 20;

      submitDataMutation.mutate({
        eventId: eventId!,
        bpm,
        resonance,
        emotionTone: "calm",
        emotionValue: resonance,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isActive, eventId]);

  const handleLeave = () => {
    Alert.alert("Leave Event", "Are you sure you want to leave?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: () => leaveMutation.mutate({ eventId: eventId! }),
      },
    ]);
  };

  if (!eventId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No event specified</Text>
      </View>
    );
  }

  if (eventQuery.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  if (eventQuery.error || !eventQuery.data?.event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load event</Text>
      </View>
    );
  }

  const { event } = eventQuery.data;
  const liveData = liveQuery.data;
  const resonance = liveData?.avgResonance || 0;
  const activeParticipants = liveData?.activeParticipants || 0;

  const aiNotes =
    typeof event.aiCuratorNotes === "string"
      ? JSON.parse(event.aiCuratorNotes)
      : event.aiCuratorNotes;

  const colors = aiNotes?.colorScheme || ["#6366f1", "#8b5cf6"];

  const endTime = new Date(event.endTime);
  const now = new Date();
  const timeRemaining = Math.max(0, endTime.getTime() - now.getTime());
  const minutesRemaining = Math.floor(timeRemaining / 60000);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LinearGradient colors={[colors[0], colors[1], "#000"]} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: event.status === "active" ? "#10b981" : "#f59e0b" },
              ]}
            />
            <Text style={styles.headerText}>
              {event.status === "active" ? "Live" : event.status}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleLeave}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.theme}>{event.theme.toUpperCase()}</Text>

          {aiNotes?.guidance && (
            <View style={styles.guidanceCard}>
              <Heart size={18} color={colors[0]} />
              <Text style={styles.guidanceText}>{aiNotes.guidance}</Text>
            </View>
          )}

          <View style={styles.visualizerContainer}>
            <ResonanceVisualizer
              resonance={resonance}
              activeParticipants={activeParticipants}
              animated
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {(resonance * 100).toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Resonance</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{activeParticipants}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{minutesRemaining}m</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
          </View>

          <View style={styles.breathingGuide}>
            <Text style={styles.breathingText}>
              Breathe slowly and deeply
            </Text>
            <Text style={styles.breathingSubtext}>
              Sync with the collective rhythm
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your presence contributes to the collective energy
          </Text>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  theme: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 24,
  },
  guidanceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    marginBottom: 40,
  },
  guidanceText: {
    flex: 1,
    fontSize: 16,
    fontStyle: "italic",
    color: "#fff",
    lineHeight: 24,
  },
  visualizerContainer: {
    marginVertical: 40,
    minHeight: 300,
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  breathingGuide: {
    marginTop: 40,
    alignItems: "center",
  },
  breathingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  breathingSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 8,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },
});
