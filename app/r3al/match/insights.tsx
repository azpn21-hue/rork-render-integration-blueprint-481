import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Brain, TrendingUp, Target, Award } from "lucide-react-native";
import { trpc } from "@/lib/trpc";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function MatchInsightsScreen() {
  const insightsQuery = trpc.r3al.match.insights.useQuery();

  if (insightsQuery.isLoading) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <Stack.Screen
          options={{
            title: "AI Match Insights",
            headerStyle: {
              backgroundColor: tokens.colors.surface,
            },
            headerTintColor: tokens.colors.gold,
          }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tokens.colors.gold} />
            <Text style={styles.loadingText}>Analyzing your patterns...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const insights = insightsQuery.data?.insights;

  if (!insights) {
    return null;
  }

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title: "AI Match Insights",
          headerStyle: {
            backgroundColor: tokens.colors.surface,
          },
          headerTintColor: tokens.colors.gold,
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Brain size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Your Personality Profile</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.profileRow}>
                <Text style={styles.label}>Primary Traits</Text>
                <View style={styles.traitsList}>
                  {insights.personalityProfile.primaryTraits.map((trait, i) => (
                    <View key={i} style={styles.traitChip}>
                      <Text style={styles.traitText}>{trait}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.label}>Connection Style</Text>
                <Text style={styles.value}>
                  {insights.personalityProfile.connectionStyle}
                </Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.label}>Energy Type</Text>
                <Text style={styles.value}>
                  {insights.personalityProfile.energyType}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={24} color="#10B981" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Matching Patterns</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Avg Match Score</Text>
                  <Text style={styles.statValue}>
                    {Math.round(insights.matchingPatterns.averageScore * 100)}%
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Connection Rate</Text>
                  <Text style={styles.statValue}>
                    {Math.round(insights.matchingPatterns.connectionRate * 100)}%
                  </Text>
                </View>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.label}>Most Successful Type</Text>
                <Text style={styles.highlightValue}>
                  {insights.matchingPatterns.mostSuccessful}
                </Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.label}>Preferred Traits</Text>
                <View style={styles.traitsList}>
                  {insights.matchingPatterns.preferredTraits.map((trait, i) => (
                    <View key={i} style={styles.traitChip}>
                      <Text style={styles.traitText}>{trait}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={24} color="#8B5CF6" strokeWidth={2} />
              <Text style={styles.sectionTitle}>AI Recommendations</Text>
            </View>
            {insights.recommendations.map((rec, index) => (
              <View key={index} style={styles.recCard}>
                <View style={styles.recHeader}>
                  <Award size={20} color={tokens.colors.gold} strokeWidth={2} />
                  <Text style={styles.recTitle}>{rec.title}</Text>
                </View>
                <Text style={styles.recDescription}>{rec.description}</Text>
                <Text style={styles.recAction}>→ {rec.action}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Weekly Stats</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Viewed</Text>
                  <Text style={styles.statValue}>
                    {insights.weeklyStats.suggestionsViewed}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Requested</Text>
                  <Text style={styles.statValue}>
                    {insights.weeklyStats.connectionsRequested}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Acceptance</Text>
                  <Text style={styles.statValue}>
                    {Math.round(insights.weeklyStats.acceptanceRate * 100)}%
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Avg Score</Text>
                  <Text style={styles.statValue}>
                    {Math.round(insights.weeklyStats.averageMatchScore * 100)}%
                  </Text>
                </View>
              </View>
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
  profileRow: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  value: {
    fontSize: 16,
    color: tokens.colors.text,
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
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
  statsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: tokens.colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
    alignItems: "center" as const,
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  recCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    padding: 16,
    gap: 12,
  },
  recHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
  },
  recDescription: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
  },
  recAction: {
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
