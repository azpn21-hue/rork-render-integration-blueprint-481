import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, Users, Sparkles, Play } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function EventLobbyScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const eventQuery = trpc.r3al.hiveEvents.getDetail.useQuery(
    { eventId: eventId! },
    { enabled: !!eventId, refetchInterval: 10000 }
  );

  const joinMutation = trpc.r3al.hiveEvents.join.useMutation({
    onSuccess: () => {
      router.push(`/r3al/hive-events/live?eventId=${eventId}`);
    },
  });

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

  const { event, participants, metrics } = eventQuery.data;
  const startTime = new Date(event.startTime);
  const now = new Date();
  const timeUntilStart = startTime.getTime() - now.getTime();
  const canJoin = timeUntilStart < 15 * 60 * 1000 && timeUntilStart > 0;
  const isActive = event.status === "active";

  const aiNotes =
    typeof event.aiCuratorNotes === "string"
      ? JSON.parse(event.aiCuratorNotes)
      : event.aiCuratorNotes;

  const colors = aiNotes?.colorScheme || ["#6366f1", "#8b5cf6"];

  return (
    <>
      <Stack.Screen
        options={{
          title: event.title,
          headerStyle: { backgroundColor: "#0a0a0a" },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[colors[0] + "40", colors[1] + "40", "#00000000"]}
          style={styles.headerGradient}
        >
          <View style={styles.themeContainer}>
            <View
              style={[
                styles.themeBadge,
                { backgroundColor: colors[0], borderColor: colors[1] },
              ]}
            >
              <Text style={styles.themeBadgeText}>{event.theme}</Text>
            </View>
          </View>

          <Text style={styles.title}>{event.title}</Text>

          {event.description && (
            <Text style={styles.description}>{event.description}</Text>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Calendar size={18} color="#06b6d4" />
              <Text style={styles.infoText}>
                {startTime.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={18} color="#06b6d4" />
              <Text style={styles.infoText}>{event.duration}m</Text>
            </View>
            <View style={styles.infoItem}>
              <Users size={18} color="#06b6d4" />
              <Text style={styles.infoText}>{participants.length}</Text>
            </View>
          </View>
        </LinearGradient>

        {event.status === "completed" && metrics && (
          <View style={styles.metricsCard}>
            <Text style={styles.sectionTitle}>Event Summary</Text>
            <Text style={styles.aiSummary}>{metrics.aiSummary}</Text>
            <View style={styles.metricRow}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  {metrics.coherenceScore?.toFixed(0) || 0}%
                </Text>
                <Text style={styles.metricLabel}>Coherence</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  {metrics.avgResonance
                    ? (metrics.avgResonance * 100).toFixed(0)
                    : 0}
                  %
                </Text>
                <Text style={styles.metricLabel}>Resonance</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  {metrics.participantCount}
                </Text>
                <Text style={styles.metricLabel}>Participants</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={20} color={colors[0]} />
            <Text style={styles.aiTitle}>AI Curator Notes</Text>
          </View>
          {aiNotes?.mood && (
            <Text style={styles.aiNote}>
              <Text style={styles.aiNoteLabel}>Mood:</Text> {aiNotes.mood}
            </Text>
          )}
          {aiNotes?.soundscape && (
            <Text style={styles.aiNote}>
              <Text style={styles.aiNoteLabel}>Soundscape:</Text>{" "}
              {aiNotes.soundscape}
            </Text>
          )}
          {aiNotes?.guidance && (
            <Text style={styles.aiGuidance}>"{aiNotes.guidance}"</Text>
          )}
        </View>

        {participants.length > 0 && (
          <View style={styles.participantsCard}>
            <Text style={styles.sectionTitle}>
              Participants ({participants.length})
            </Text>
            {participants.slice(0, 10).map((p) => (
              <View key={p.userId} style={styles.participantRow}>
                <View style={styles.participantAvatar}>
                  <Text style={styles.participantInitial}>
                    {(p.displayName || p.username || "?")[0].toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.participantName}>
                  {p.displayName || p.username}
                </Text>
              </View>
            ))}
          </View>
        )}

        {(canJoin || isActive) && (
          <TouchableOpacity
            style={[
              styles.joinButton,
              { backgroundColor: colors[0] },
              joinMutation.isPending && styles.joinButtonDisabled,
            ]}
            onPress={() => joinMutation.mutate({ eventId: eventId! })}
            disabled={joinMutation.isPending}
          >
            {joinMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Play size={20} color="#fff" fill="#fff" />
                <Text style={styles.joinButtonText}>
                  {isActive ? "Join Now" : "Join Early"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {!canJoin && !isActive && event.status !== "completed" && (
          <View style={styles.waitingCard}>
            <Clock size={24} color="#f59e0b" />
            <Text style={styles.waitingText}>
              Event opens {Math.floor(timeUntilStart / 60000)} minutes before
              start
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingBottom: 40,
  },
  headerGradient: {
    padding: 20,
    paddingTop: 24,
  },
  themeContainer: {
    marginBottom: 16,
  },
  themeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    lineHeight: 24,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#06b6d4",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  metricsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  aiSummary: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metric: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#06b6d4",
  },
  metricLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  aiCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  aiNote: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
    marginBottom: 8,
  },
  aiNoteLabel: {
    fontWeight: "600",
    color: "#fff",
  },
  aiGuidance: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#06b6d4",
    lineHeight: 24,
    marginTop: 8,
  },
  participantsCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  participantInitial: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  participantName: {
    fontSize: 14,
    color: "#ccc",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 20,
    marginTop: 0,
    padding: 18,
    borderRadius: 16,
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  waitingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    margin: 20,
    padding: 20,
    backgroundColor: "#1a0f00",
    borderWidth: 1,
    borderColor: "#f59e0b40",
    borderRadius: 16,
  },
  waitingText: {
    flex: 1,
    fontSize: 14,
    color: "#f59e0b",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },
});
