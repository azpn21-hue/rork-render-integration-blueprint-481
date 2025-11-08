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
import { History, Filter } from "lucide-react-native";
import { trpc } from "@/lib/trpc";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

type FilterType = "all" | "liked" | "connected" | "skipped";

export default function MatchHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");

  const historyQuery = trpc.r3al.match.history.useQuery({ filter });

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Liked", value: "liked" },
    { label: "Connected", value: "connected" },
    { label: "Skipped", value: "skipped" },
  ];

  const getResultColor = (result: string) => {
    switch (result) {
      case "connected":
        return "#10B981";
      case "liked":
        return tokens.colors.gold;
      case "skipped":
        return tokens.colors.textSecondary;
      default:
        return tokens.colors.text;
    }
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case "connected":
        return "Connected";
      case "liked":
        return "Liked";
      case "skipped":
        return "Skipped";
      default:
        return result;
    }
  };

  if (historyQuery.isLoading) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <Stack.Screen
          options={{
            title: "Match History",
            headerStyle: {
              backgroundColor: tokens.colors.surface,
            },
            headerTintColor: tokens.colors.gold,
          }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tokens.colors.gold} />
            <Text style={styles.loadingText}>Loading history...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const history = historyQuery.data?.history || [];

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title: "Match History",
          headerStyle: {
            backgroundColor: tokens.colors.surface,
          },
          headerTintColor: tokens.colors.gold,
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.filterBar}>
          <Filter size={20} color={tokens.colors.gold} strokeWidth={2} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterButton,
                  filter === option.value && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(option.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === option.value && styles.filterButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <History size={64} color={tokens.colors.gold} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No History Yet</Text>
              <Text style={styles.emptyDescription}>
                Start exploring matches to build your history
              </Text>
            </View>
          ) : (
            history.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.historyCard}
                onPress={() =>
                  router.push(`/r3al/match/compare?userId=${item.targetId}`)
                }
                activeOpacity={0.8}
              >
                {item.profile.avatarUrl && (
                  <Image
                    source={{ uri: item.profile.avatarUrl }}
                    style={styles.avatar}
                  />
                )}
                <View style={styles.historyInfo}>
                  <Text style={styles.displayName}>
                    {item.profile.displayName}
                  </Text>
                  <Text style={styles.handle}>@{item.profile.handle}</Text>
                  <Text style={styles.trustScore}>
                    Trust Score: {item.profile.trustScore}
                  </Text>
                </View>
                <View style={styles.historyMeta}>
                  <View
                    style={[
                      styles.resultBadge,
                      { borderColor: getResultColor(item.result) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.resultText,
                        { color: getResultColor(item.result) },
                      ]}
                    >
                      {getResultLabel(item.result)}
                    </Text>
                  </View>
                  <Text style={styles.matchScore}>
                    {Math.round(item.matchScore * 100)}% Match
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  filterBar: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  filterScroll: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
  },
  filterButtonActive: {
    backgroundColor: tokens.colors.gold,
    borderColor: tokens.colors.gold,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.text,
  },
  filterButtonTextActive: {
    color: tokens.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  historyCard: {
    flexDirection: "row" as const,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    padding: 16,
    gap: 16,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  historyInfo: {
    flex: 1,
    gap: 4,
  },
  displayName: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
  },
  handle: {
    fontSize: 14,
    color: tokens.colors.gold,
  },
  trustScore: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  historyMeta: {
    alignItems: "flex-end" as const,
    gap: 6,
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  resultText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  matchScore: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
  },
  timestamp: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 40,
    gap: 16,
    minHeight: 400,
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
