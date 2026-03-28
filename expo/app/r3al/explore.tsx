import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Search, ArrowLeft, Users, Award, Hexagon, MessageCircle, TrendingUp } from "lucide-react-native";
import FilterBar from "@/components/FilterBar";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

type UserCard = {
  id: string;
  name: string;
  truthScore: number;
  level: string;
  bio: string;
  badges: string[];
  isVerified: boolean;
  isMentor: boolean;
  isActive: boolean;
  circles: string[];
  recentActivity: string;
};

const MOCK_USERS: UserCard[] = [
  {
    id: "1",
    name: "Alex Rivera",
    truthScore: 92,
    level: "Elite",
    bio: "Product designer passionate about authentic connections and ethical tech.",
    badges: ["verified_id", "top_contributor", "mentor"],
    isVerified: true,
    isMentor: true,
    isActive: true,
    circles: ["Tech Innovators", "Design Collective"],
    recentActivity: "Active in Pulse Chat",
  },
  {
    id: "2",
    name: "Jordan Chen",
    truthScore: 88,
    level: "High Integrity",
    bio: "Entrepreneur building communities that matter. Open for mentorship.",
    badges: ["verified_id", "early_adopter"],
    isVerified: true,
    isMentor: true,
    isActive: true,
    circles: ["Startup Founders", "Web3 Builders"],
    recentActivity: "Posted in discussions",
  },
  {
    id: "3",
    name: "Sam Taylor",
    truthScore: 75,
    level: "Good Standing",
    bio: "Writer, thinker, connector. Here to learn and grow with like-minded people.",
    badges: ["verified_id"],
    isVerified: true,
    isMentor: false,
    isActive: false,
    circles: ["Creative Minds"],
    recentActivity: "Completed verification",
  },
  {
    id: "4",
    name: "Morgan Lee",
    truthScore: 95,
    level: "Elite",
    bio: "Community organizer & trust advocate. Building bridges in the R3AL ecosystem.",
    badges: ["verified_id", "top_contributor", "founder"],
    isVerified: true,
    isMentor: true,
    isActive: true,
    circles: ["Community Leaders", "Trust Builders", "Hive Core"],
    recentActivity: "Hosting Circle event",
  },
];

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);

  const filteredUsers = useMemo(() => {
    let results = MOCK_USERS;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.bio.toLowerCase().includes(query) ||
          user.circles.some((circle) => circle.toLowerCase().includes(query))
      );
    }

    if (!selectedFilters.includes("all")) {
      results = results.filter((user) => {
        if (selectedFilters.includes("verified") && !user.isVerified) return false;
        if (selectedFilters.includes("mentors") && !user.isMentor) return false;
        if (selectedFilters.includes("pulse_active") && !user.isActive) return false;
        if (selectedFilters.includes("top_score") && user.truthScore < 85) return false;
        if (selectedFilters.includes("circles") && user.circles.length === 0) return false;
        return true;
      });
    }

    results.sort((a, b) => {
      if (selectedFilters.includes("top_score")) {
        return b.truthScore - a.truthScore;
      }
      if (selectedFilters.includes("trending")) {
        return b.circles.length - a.circles.length;
      }
      return 0;
    });

    return results;
  }, [searchQuery, selectedFilters]);

  const renderUserCard = (user: UserCard) => (
    <TouchableOpacity
      key={user.id}
      style={styles.userCard}
      activeOpacity={0.8}
      onPress={() => {
        console.log(`Navigate to profile: ${user.name}`);
        router.push("/r3al/profile/view");
      }}
    >
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <Users size={32} color={tokens.colors.gold} strokeWidth={2} />
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{user.name}</Text>
            {user.isVerified && (
              <View style={styles.verifiedBadge}>
                <Award size={16} color={tokens.colors.gold} strokeWidth={2} />
              </View>
            )}
          </View>
          <View style={styles.userMetrics}>
            <View style={styles.metric}>
              <Award size={14} color="#10B981" strokeWidth={2} />
              <Text style={styles.metricText}>{user.truthScore}</Text>
            </View>
            <Text style={styles.metricDivider}>•</Text>
            <Text style={styles.levelText}>{user.level}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.userBio} numberOfLines={2}>
        {user.bio}
      </Text>

      {user.circles.length > 0 && (
        <View style={styles.circlesRow}>
          <Hexagon size={14} color="#00FF66" strokeWidth={2} />
          <Text style={styles.circlesText} numberOfLines={1}>
            {user.circles.join(", ")}
          </Text>
        </View>
      )}

      <View style={styles.activityRow}>
        {user.isActive && (
          <>
            <View style={styles.activeDot} />
            <Text style={styles.activityText}>{user.recentActivity}</Text>
          </>
        )}
        {user.isMentor && (
          <View style={styles.mentorBadge}>
            <TrendingUp size={12} color="#10B981" strokeWidth={2} />
            <Text style={styles.mentorText}>Mentor</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionBtn} 
          activeOpacity={0.7}
          onPress={() => {
            console.log(`Message ${user.name}`);
            router.push("/r3al/pulse-chat");
          }}
        >
          <MessageCircle size={18} color={tokens.colors.gold} strokeWidth={2} />
          <Text style={styles.actionBtnText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.actionBtnSecondary]} 
          activeOpacity={0.7}
          onPress={() => {
            console.log(`View profile: ${user.name}`);
            router.push("/r3al/profile/view");
          }}
        >
          <Users size={18} color={tokens.colors.text} strokeWidth={2} />
          <Text style={styles.actionBtnText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[tokens.colors.background, tokens.colors.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explore</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={tokens.colors.textSecondary} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users, circles, topics..."
              placeholderTextColor={tokens.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <FilterBar selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredUsers.length} {filteredUsers.length === 1 ? "person" : "people"} found
            </Text>
          </View>

          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Search size={64} color={tokens.colors.textSecondary} strokeWidth={1} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your filters or search for different keywords
              </Text>
            </View>
          ) : (
            <View style={styles.usersList}>{filteredUsers.map(renderUserCard)}</View>
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
  header: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: tokens.colors.surface,
  },
  searchBar: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: tokens.colors.text,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  resultsHeader: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  usersList: {
    gap: 16,
  },
  userCard: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "20",
    gap: 12,
  },
  userHeader: {
    flexDirection: "row" as const,
    gap: 12,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  userNameRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: tokens.colors.gold,
  },
  userMetrics: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  metric: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#10B981",
  },
  metricDivider: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  userBio: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
  },
  circlesRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  circlesText: {
    fontSize: 13,
    color: "#00FF66",
    fontWeight: "500" as const,
  },
  activityRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap" as const,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FF66",
  },
  activityText: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  mentorBadge: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#10B981" + "20",
    borderRadius: 12,
    marginLeft: "auto" as const,
  },
  mentorText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#10B981",
  },
  cardActions: {
    flexDirection: "row" as const,
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "10",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    backgroundColor: tokens.colors.background,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  actionBtnSecondary: {
    borderColor: tokens.colors.gold + "40",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.text,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
