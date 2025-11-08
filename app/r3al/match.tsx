import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Users,
  Heart,
  X,
  Sparkles,
  TrendingUp,
  MessageCircle,
  ChevronRight,
} from "lucide-react-native";
import { trpc } from "@/lib/trpc";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function MatchScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const suggestionsQuery = trpc.r3al.match.suggest.useQuery();
  const recordFeedback = trpc.r3al.match.learn.useMutation();

  const suggestions = suggestionsQuery.data?.suggestions || [];
  const currentMatch = suggestions[currentIndex];

  const handleLike = async () => {
    if (!currentMatch) return;

    await recordFeedback.mutateAsync({
      targetId: currentMatch.userId,
      result: "liked",
      matchScore: currentMatch.matchScore,
      contextTags: currentMatch.sharedTraits,
    });

    if (currentIndex < suggestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      suggestionsQuery.refetch();
      setCurrentIndex(0);
    }
  };

  const handleSkip = async () => {
    if (!currentMatch) return;

    await recordFeedback.mutateAsync({
      targetId: currentMatch.userId,
      result: "skipped",
      matchScore: currentMatch.matchScore,
    });

    if (currentIndex < suggestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      suggestionsQuery.refetch();
      setCurrentIndex(0);
    }
  };

  const handleConnect = async () => {
    if (!currentMatch) return;

    await recordFeedback.mutateAsync({
      targetId: currentMatch.userId,
      result: "connected",
      matchScore: currentMatch.matchScore,
      contextTags: currentMatch.sharedTraits,
    });

    router.push(`/r3al/pulse-chat/dm?userId=${currentMatch.userId}`);
  };

  if (suggestionsQuery.isLoading) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <Stack.Screen
          options={{
            title: "AI Match & Suggestion",
            headerStyle: {
              backgroundColor: tokens.colors.surface,
            },
            headerTintColor: tokens.colors.gold,
          }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tokens.colors.gold} />
            <Text style={styles.loadingText}>Finding your matches...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!currentMatch) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <Stack.Screen
          options={{
            title: "AI Match & Suggestion",
            headerStyle: {
              backgroundColor: tokens.colors.surface,
            },
            headerTintColor: tokens.colors.gold,
          }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.emptyContainer}>
            <Users size={64} color={tokens.colors.gold} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No More Suggestions</Text>
            <Text style={styles.emptyDescription}>
              Check back later for new matches based on your activity
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => suggestionsQuery.refetch()}
            >
              <Text style={styles.refreshButtonText}>Refresh Suggestions</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title: "AI Match & Suggestion",
          headerStyle: {
            backgroundColor: tokens.colors.surface,
          },
          headerTintColor: tokens.colors.gold,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/r3al/match/insights")}
              style={styles.headerButton}
            >
              <Sparkles size={24} color={tokens.colors.gold} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.progressBar}>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {suggestions.length}
            </Text>
          </View>

          <View style={styles.matchCard}>
            <View style={styles.scoreHeader}>
              <View style={styles.scoreContainer}>
                <TrendingUp size={20} color="#10B981" strokeWidth={2} />
                <Text style={styles.scoreText}>
                  {Math.round(currentMatch.matchScore * 100)}% Match
                </Text>
              </View>
              <View style={styles.compatibilityBadge}>
                <Text style={styles.compatibilityText}>
                  {currentMatch.compatibilityType}
                </Text>
              </View>
            </View>

            {currentMatch.profile.avatarUrl && (
              <Image
                source={{ uri: currentMatch.profile.avatarUrl }}
                style={styles.avatar}
              />
            )}

            <View style={styles.profileInfo}>
              <Text style={styles.displayName}>
                {currentMatch.profile.displayName}
              </Text>
              <Text style={styles.handle}>@{currentMatch.profile.handle}</Text>
              <Text style={styles.bio}>{currentMatch.profile.bio}</Text>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Trust Score</Text>
                  <Text style={styles.statValue}>
                    {currentMatch.profile.trustScore}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Verification</Text>
                  <Text style={styles.statValue}>
                    Level {currentMatch.profile.verificationLevel}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.insightSection}>
              <View style={styles.insightHeader}>
                <Sparkles size={20} color={tokens.colors.gold} strokeWidth={2} />
                <Text style={styles.insightTitle}>AI Insight</Text>
              </View>
              <Text style={styles.insightText}>{currentMatch.aiInsight}</Text>
            </View>

            <View style={styles.traitsSection}>
              <Text style={styles.sectionTitle}>Shared Traits</Text>
              <View style={styles.traitsList}>
                {currentMatch.sharedTraits.map((trait, index) => (
                  <View key={index} style={styles.traitChip}>
                    <Text style={styles.traitText}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.actionSection}>
              <Text style={styles.suggestedAction}>
                Suggested: {currentMatch.suggestedAction}
              </Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.skipButton]}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <X size={32} color={tokens.colors.error} strokeWidth={2} />
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.likeButton]}
              onPress={handleLike}
              activeOpacity={0.8}
            >
              <Heart size={32} color="#10B981" strokeWidth={2} />
              <Text style={styles.likeText}>Like</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.connectButton]}
              onPress={handleConnect}
              activeOpacity={0.8}
            >
              <MessageCircle size={32} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.viewHistoryButton}
            onPress={() => router.push("/r3al/match/history")}
            activeOpacity={0.7}
          >
            <Text style={styles.viewHistoryText}>View Match History</Text>
            <ChevronRight size={20} color={tokens.colors.gold} />
          </TouchableOpacity>
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
  progressBar: {
    alignItems: "center" as const,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  matchCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  scoreHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#10B981",
  },
  compatibilityBadge: {
    backgroundColor: tokens.colors.gold + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  compatibilityText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center" as const,
    borderWidth: 3,
    borderColor: tokens.colors.gold,
  },
  profileInfo: {
    alignItems: "center" as const,
    gap: 8,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
  },
  handle: {
    fontSize: 16,
    color: tokens.colors.gold,
  },
  bio: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row" as const,
    gap: 24,
    marginTop: 16,
  },
  statItem: {
    alignItems: "center" as const,
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  insightSection: {
    backgroundColor: tokens.colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
    gap: 8,
  },
  insightHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  insightText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
  },
  traitsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
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
  actionSection: {
    alignItems: "center" as const,
    paddingTop: 8,
  },
  suggestedAction: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  actionsRow: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    gap: 8,
  },
  skipButton: {
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.error,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.error,
  },
  likeButton: {
    backgroundColor: tokens.colors.surface,
    borderColor: "#10B981",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#10B981",
  },
  connectButton: {
    backgroundColor: tokens.colors.gold,
    borderColor: tokens.colors.gold,
  },
  connectText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  viewHistoryButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
  },
  viewHistoryText: {
    fontSize: 16,
    fontWeight: "700" as const,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    textAlign: "center" as const,
  },
  emptyDescription: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
    lineHeight: 22,
  },
  refreshButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  headerButton: {
    padding: 8,
  },
});
