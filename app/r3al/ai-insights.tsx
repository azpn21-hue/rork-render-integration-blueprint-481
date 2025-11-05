import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Brain, TrendingUp, TrendingDown, Lightbulb, Target } from "lucide-react-native";

export default function AIInsightsScreen() {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week");

  const insightsQuery = trpc.r3al.ai.getInsights.useQuery({ timeframe });
  const summaryQuery = trpc.r3al.ai.getPersonalizedSummary.useQuery({ dataType: "all" });

  const renderTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? (
      <TrendingUp size={16} color="#10B981" />
    ) : (
      <TrendingDown size={16} color="#EF4444" />
    );
  };

  const renderPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "#EF4444";
      case "medium": return "#F59E0B";
      case "low": return "#6C5DD3";
      default: return "#8E92BC";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "AI Insights",
          headerStyle: { backgroundColor: "#0A0E27" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <View style={styles.timeframeSelector}>
        {(["day", "week", "month"] as const).map((tf) => (
          <TouchableOpacity
            key={tf}
            style={[styles.timeframeButton, timeframe === tf && styles.timeframeButtonActive]}
            onPress={() => setTimeframe(tf)}
          >
            <Text style={[styles.timeframeText, timeframe === tf && styles.timeframeTextActive]}>
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={insightsQuery.isLoading}
            onRefresh={insightsQuery.refetch}
            tintColor="#6C5DD3"
          />
        }
      >
        {insightsQuery.isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C5DD3" />
          </View>
        )}

        {summaryQuery.data && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Brain size={24} color="#6C5DD3" />
              <Text style={styles.summaryTitle}>AI Summary</Text>
            </View>
            <Text style={styles.summaryText}>{summaryQuery.data.overallSummary}</Text>
          </View>
        )}

        {insightsQuery.data && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Metrics</Text>
              <View style={styles.metricsGrid}>
                {Object.entries(insightsQuery.data.insights.metrics).map(([key, metric]) => (
                  <View key={key} style={styles.metricCard}>
                    <Text style={styles.metricLabel}>
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Text>
                    <View style={styles.metricValue}>
                      <Text style={styles.metricNumber}>{metric.current}</Text>
                      {renderTrendIcon(metric.trend)}
                    </View>
                    <View style={styles.metricChange}>
                      <Text style={[styles.metricChangeText, 
                        metric.trend === "up" ? styles.positiveText : styles.negativeText]}>
                        {metric.trend === "up" ? "+" : ""}{metric.change}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Insights</Text>
              {insightsQuery.data.insights.insights.map((insight) => (
                <View key={insight.id} style={styles.insightCard}>
                  <View style={styles.insightHeader}>
                    <Lightbulb size={20} color={renderPriorityColor(insight.priority)} />
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                  </View>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                  <View style={styles.insightFooter}>
                    <View style={[styles.priorityBadge, { 
                      backgroundColor: `${renderPriorityColor(insight.priority)}20` 
                    }]}>
                      <Text style={[styles.priorityText, { 
                        color: renderPriorityColor(insight.priority) 
                      }]}>
                        {insight.priority.toUpperCase()}
                      </Text>
                    </View>
                    {insight.actionable && (
                      <View style={styles.actionableBadge}>
                        <Target size={12} color="#6C5DD3" />
                        <Text style={styles.actionableText}>Actionable</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {insightsQuery.data.insights.recommendations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                {insightsQuery.data.insights.recommendations.map((rec) => (
                  <View key={rec.id} style={styles.recommendationCard}>
                    <Text style={styles.recommendationTitle}>{rec.title}</Text>
                    <Text style={styles.recommendationDescription}>{rec.description}</Text>
                    <View style={styles.recommendationBadge}>
                      <Text style={styles.recommendationBadgeText}>{rec.type}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  timeframeSelector: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#1E2139",
    alignItems: "center",
  },
  timeframeButtonActive: {
    backgroundColor: "#6C5DD3",
  },
  timeframeText: {
    color: "#8E92BC",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  timeframeTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 32,
  },
  summaryCard: {
    backgroundColor: "#1E2139",
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700" as const,
  },
  summaryText: {
    color: "#8E92BC",
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700" as const,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#1E2139",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  metricLabel: {
    color: "#8E92BC",
    fontSize: 12,
    textTransform: "capitalize",
  },
  metricValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metricNumber: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700" as const,
  },
  metricChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricChangeText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  positiveText: {
    color: "#10B981",
  },
  negativeText: {
    color: "#EF4444",
  },
  insightCard: {
    backgroundColor: "#1E2139",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  insightTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    flex: 1,
  },
  insightDescription: {
    color: "#8E92BC",
    fontSize: 14,
    lineHeight: 20,
  },
  insightFooter: {
    flexDirection: "row",
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700" as const,
  },
  actionableBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(108, 93, 211, 0.2)",
  },
  actionableText: {
    color: "#6C5DD3",
    fontSize: 11,
    fontWeight: "600" as const,
  },
  recommendationCard: {
    backgroundColor: "#1E2139",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  recommendationTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  recommendationDescription: {
    color: "#8E92BC",
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#2A2F4F",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recommendationBadgeText: {
    color: "#6C5DD3",
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "capitalize",
  },
});
