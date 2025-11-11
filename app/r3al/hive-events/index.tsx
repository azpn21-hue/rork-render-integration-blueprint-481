import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Plus, Calendar, Clock, Users, Play } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function CircleEventsScreen() {
  const { circleId } = useLocalSearchParams<{ circleId: string }>();

  const eventsQuery = trpc.r3al.hiveEvents.getCircleEvents.useQuery(
    { circleId: circleId! },
    { enabled: !!circleId, refetchInterval: 30000 }
  );

  if (!circleId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No circle specified</Text>
      </View>
    );
  }

  const events = eventsQuery.data?.events || [];
  const upcomingEvents = events.filter(
    (e) => e.status === "scheduled" || e.status === "active"
  );
  const pastEvents = events.filter((e) => e.status === "completed");

  return (
    <>
      <Stack.Screen
        options={{
          title: "Hive Events",
          headerStyle: { backgroundColor: "#0a0a0a" },
          headerTintColor: "#fff",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push(`/r3al/hive-events/create?circleId=${circleId}`)
              }
              style={styles.headerButton}
            >
              <Plus size={24} color="#06b6d4" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {eventsQuery.isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#06b6d4" />
          </View>
        )}

        {!eventsQuery.isLoading && events.length === 0 && (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#666" />
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptyText}>
              Create your first Hive Event to begin collective experiences
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() =>
                router.push(`/r3al/hive-events/create?circleId=${circleId}`)
              }
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.createButtonText}>Create Event</Text>
            </TouchableOpacity>
          </View>
        )}

        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming & Live</Text>
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}

        {pastEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Events</Text>
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

function EventCard({ event }: { event: any }) {
  const startTime = new Date(event.startTime);
  const now = new Date();
  const isLive = event.status === "active";
  const isUpcoming =
    event.status === "scheduled" && startTime.getTime() > now.getTime();

  const getThemeColor = (theme: string): string => {
    const colors: Record<string, string> = {
      calm: "#06b6d4",
      focus: "#8b5cf6",
      gratitude: "#10b981",
      energy: "#f59e0b",
      empathy: "#ec4899",
      mindful: "#6366f1",
      celebration: "#f97316",
    };
    return colors[theme] || "#6366f1";
  };

  const themeColor = getThemeColor(event.theme);

  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => router.push(`/r3al/hive-events/lobby?eventId=${event.id}`)}
    >
      <LinearGradient
        colors={[themeColor + "20", "#00000000"]}
        style={styles.eventGradient}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventHeaderLeft}>
            {isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveIndicator} />
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
            {isUpcoming && (
              <View style={[styles.statusBadge, { backgroundColor: themeColor }]}>
                <Text style={styles.statusBadgeText}>Upcoming</Text>
              </View>
            )}
            {event.status === "completed" && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Completed</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>

        <View style={styles.eventInfo}>
          <View style={styles.infoItem}>
            <Calendar size={16} color={themeColor} />
            <Text style={styles.infoText}>
              {startTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={16} color={themeColor} />
            <Text style={styles.infoText}>{event.duration}m</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={16} color={themeColor} />
            <Text style={styles.infoText}>{event.participantCount}</Text>
          </View>
        </View>

        {isLive && (
          <View style={styles.joinNowButton}>
            <Play size={16} color="#fff" fill="#fff" />
            <Text style={styles.joinNowText}>Join Now</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
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
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#06b6d4",
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  eventGradient: {
    padding: 20,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventHeaderLeft: {
    flexDirection: "row",
    gap: 8,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ef4444",
    borderRadius: 12,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#333",
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  eventInfo: {
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
    color: "#ccc",
  },
  joinNowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#ef4444",
    borderRadius: 12,
  },
  joinNowText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },
  headerButton: {
    padding: 8,
  },
});
