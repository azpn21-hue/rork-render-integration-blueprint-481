import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { Stack } from "expo-router";
import { 
  useHistory, 
  useHistorySummary, 
  useDeleteHistory,
  getEventTypeLabel,
  getEventTypeIcon,
} from "@/services/history";

export default function HistoryScreen() {
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month" | "year">("week");

  const { data: history, isLoading: historyLoading } = useHistory({ limit: 20 });
  const { data: summary, isLoading: summaryLoading } = useHistorySummary(selectedPeriod);
  const deleteHistory = useDeleteHistory();

  const handleDeleteAll = async () => {
    try {
      await deleteHistory.mutateAsync({ deleteAll: true });
    } catch (error) {
      console.error("Failed to delete history:", error);
    }
  };

  const periods: Array<"day" | "week" | "month" | "year"> = ["day", "week", "month", "year"];

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Activity History" }} />

      <View style={styles.toggleContainer}>
        <View>
          <Text style={styles.toggleLabel}>Track My Activity</Text>
          <Text style={styles.toggleDescription}>
            Save your interactions for personalized insights
          </Text>
        </View>
        <Switch
          value={historyEnabled}
          onValueChange={setHistoryEnabled}
          trackColor={{ false: "#444", true: "#4FC3F7" }}
          thumbColor={historyEnabled ? "#FFF" : "#AAA"}
        />
      </View>

      {historyEnabled && (
        <>
          <View style={styles.periodSelector}>
            <Text style={styles.sectionTitle}>Summary Period</Text>
            <View style={styles.periodButtons}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period && styles.periodButtonTextActive,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {!summaryLoading && summary && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>AI Summary</Text>
              <Text style={styles.summaryText}>{summary.summary}</Text>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{summary.stats.totalEvents}</Text>
                  <Text style={styles.statLabel}>Total Events</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{summary.stats.pulseUpdates}</Text>
                  <Text style={styles.statLabel}>Pulse Updates</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{summary.stats.hiveConnections}</Text>
                  <Text style={styles.statLabel}>Connections</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{summary.stats.qotdAnswers}</Text>
                  <Text style={styles.statLabel}>QOTD Answers</Text>
                </View>
              </View>

              {summary.insights && summary.insights.length > 0 && (
                <View style={styles.insightsContainer}>
                  <Text style={styles.insightsTitle}>Key Insights</Text>
                  {summary.insights.map((insight, index) => (
                    <Text key={index} style={styles.insightText}>
                      • {insight}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {!historyLoading && history && history.events.length > 0 && (
            <View style={styles.eventsSection}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {history.events.map((event) => (
                <View key={event.eventId} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventType}>
                      {getEventTypeLabel(event.eventType)}
                    </Text>
                    <Text style={styles.eventTime}>
                      {new Date(event.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  {event.duration && (
                    <Text style={styles.eventDuration}>
                      Duration: {Math.floor(event.duration / 60)}m {event.duration % 60}s
                    </Text>
                  )}
                </View>
              ))}

              {history.hasMore && (
                <Text style={styles.moreText}>
                  {history.total - history.events.length} more events
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.deleteButton, deleteHistory.isPending && styles.deleteButtonDisabled]}
            onPress={handleDeleteAll}
            disabled={deleteHistory.isPending}
          >
            <Text style={styles.deleteButtonText}>
              {deleteHistory.isPending ? "Deleting..." : "Clear All History"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1A1A1A",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  toggleLabel: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  toggleDescription: {
    color: "#AAA",
    fontSize: 14,
  },
  periodSelector: {
    padding: 20,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  periodButtons: {
    flexDirection: "row",
    gap: 12,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
  },
  periodButtonActive: {
    backgroundColor: "#4FC3F7",
    borderColor: "#4FC3F7",
  },
  periodButtonText: {
    color: "#AAA",
    fontSize: 14,
    textTransform: "capitalize" as const,
  },
  periodButtonTextActive: {
    color: "#FFF",
    fontWeight: "600" as const,
  },
  summaryCard: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    color: "#4FC3F7",
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 12,
  },
  summaryText: {
    color: "#FFF",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    minWidth: "45%" as any,
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  statValue: {
    color: "#4FC3F7",
    fontSize: 28,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  statLabel: {
    color: "#AAA",
    fontSize: 12,
    textAlign: "center",
  },
  insightsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 16,
  },
  insightsTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 12,
  },
  insightText: {
    color: "#AAA",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  eventsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventType: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  eventTime: {
    color: "#AAA",
    fontSize: 14,
  },
  eventDuration: {
    color: "#AAA",
    fontSize: 14,
  },
  moreText: {
    color: "#AAA",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: "#FF3D00",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
