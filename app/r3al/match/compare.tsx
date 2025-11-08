import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, Heart, Brain, Zap, AlertCircle, Award } from "lucide-react-native";
import { trpc } from "@/lib/trpc";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function CompareUsersScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const compareQuery = trpc.r3al.match.compare.useQuery({
    targetId: userId || "",
  });

  if (compareQuery.isLoading) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <Stack.Screen
          options={{
            title: "Compatibility Analysis",
            headerStyle: {
              backgroundColor: tokens.colors.surface,
            },
            headerTintColor: tokens.colors.gold,
          }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tokens.colors.gold} />
            <Text style={styles.loadingText}>Analyzing compatibility...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const comparison = compareQuery.data?.comparison;

  if (!comparison) {
    return null;
  }

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title: "Compatibility Analysis",
          headerStyle: {
            backgroundColor: tokens.colors.surface,
          },
          headerTintColor: tokens.colors.gold,
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.scoreCard}>
            <TrendingUp size={32} color={tokens.colors.gold} strokeWidth={2} />
            <Text style={styles.scoreValue}>
              {Math.round(comparison.matchScore * 100)}%
            </Text>
            <Text style={styles.scoreLabel}>Overall Match Score</Text>
            <View style={styles.compatibilityBadge}>
              <Text style={styles.compatibilityText}>
                {comparison.compatibilityType}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={24} color="#EF4444" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Shared Traits</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.traitsList}>
                {comparison.sharedTraits.map((trait, i) => (
                  <View key={i} style={styles.traitChip}>
                    <Text style={styles.traitText}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Brain size={24} color="#8B5CF6" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Personality Alignment</Text>
            </View>
            <View style={styles.card}>
              {Object.entries(comparison.personalityAlignment).map(
                ([key, value]) => (
                  <View key={key} style={styles.alignmentRow}>
                    <Text style={styles.alignmentLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${(value as number) * 100}%`,
                            backgroundColor:
                              (value as number) > 0.8
                                ? "#10B981"
                                : (value as number) > 0.6
                                  ? tokens.colors.gold
                                  : "#EF4444",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.alignmentValue}>
                      {Math.round((value as number) * 100)}%
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={24} color="#EF4444" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Pulse Compatibility</Text>
            </View>
            <View style={styles.card}>
              {Object.entries(comparison.pulseCompatibility).map(
                ([key, value]) => (
                  <View key={key} style={styles.alignmentRow}>
                    <Text style={styles.alignmentLabel}>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .split(" ")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${(value as number) * 100}%`,
                            backgroundColor:
                              (value as number) > 0.8
                                ? "#10B981"
                                : (value as number) > 0.6
                                  ? tokens.colors.gold
                                  : "#EF4444",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.alignmentValue}>
                      {Math.round((value as number) * 100)}%
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Zap size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>AI Insight</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightText}>{comparison.aiInsight}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={24} color="#10B981" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Strength Areas</Text>
            </View>
            <View style={styles.card}>
              {comparison.strengthAreas.map((strength, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={styles.bulletSuccess} />
                  <Text style={styles.listText}>{strength}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertCircle size={24} color="#F59E0B" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Growth Opportunities</Text>
            </View>
            <View style={styles.card}>
              {comparison.potentialChallenges.map((challenge, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={styles.bulletWarning} />
                  <Text style={styles.listText}>{challenge}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Suggested Activities</Text>
            </View>
            <View style={styles.card}>
              {comparison.suggestedActivities.map((activity, i) => (
                <View key={i} style={styles.activityChip}>
                  <Text style={styles.activityText}>{activity}</Text>
                </View>
              ))}
            </View>
          </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  scoreCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    padding: 32,
    alignItems: "center" as const,
    gap: 12,
    marginBottom: 24,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  scoreLabel: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
  },
  compatibilityBadge: {
    backgroundColor: tokens.colors.gold + "20",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  compatibilityText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    padding: 20,
    gap: 16,
  },
  traitsList: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  traitChip: {
    backgroundColor: tokens.colors.gold + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "50",
  },
  traitText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  alignmentRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  alignmentLabel: {
    fontSize: 14,
    color: tokens.colors.text,
    width: 100,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: tokens.colors.background,
    borderRadius: 4,
    overflow: "hidden" as const,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  alignmentValue: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
    width: 50,
    textAlign: "right" as const,
  },
  insightCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    padding: 20,
  },
  insightText: {
    fontSize: 16,
    color: tokens.colors.text,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: "row" as const,
    alignItems: "flex-start",
    gap: 12,
  },
  bulletSuccess: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginTop: 6,
  },
  bulletWarning: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
    marginTop: 6,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
  },
  activityChip: {
    backgroundColor: tokens.colors.gold + "20",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "50",
  },
  activityText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: tokens.colors.gold,
  },
});
