import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Users,
  Shield,
  Award,
} from "lucide-react-native";
import { useState, useMemo } from "react";
import { useCircles } from "@/app/contexts/CirclesContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import * as Haptics from "expo-haptics";

interface User {
  id: string;
  name: string;
  truthScore: number;
  isVerified: boolean;
  circles: string[];
}

const SAMPLE_USERS: User[] = [
  { id: "alice", name: "Alice Smith", truthScore: 92, isVerified: true, circles: ["Tech Innovators", "Trust Builders"] },
  { id: "bob", name: "Bob Johnson", truthScore: 88, isVerified: true, circles: ["Trust Builders"] },
  { id: "charlie", name: "Charlie Davis", truthScore: 85, isVerified: true, circles: ["Startup Founders", "Tech Innovators"] },
  { id: "diana", name: "Diana Martinez", truthScore: 94, isVerified: true, circles: ["Trust Builders", "Startup Founders"] },
  { id: "evan", name: "Evan Lee", truthScore: 87, isVerified: false, circles: ["Tech Innovators"] },
  { id: "fiona", name: "Fiona Brown", truthScore: 91, isVerified: true, circles: ["Trust Builders"] },
  { id: "george", name: "George Wilson", truthScore: 83, isVerified: false, circles: ["Startup Founders"] },
  { id: "hannah", name: "Hannah Taylor", truthScore: 95, isVerified: true, circles: ["Trust Builders", "Tech Innovators"] },
];

export default function ContactsScreen() {
  const router = useRouter();
  const { circles, myCircles } = useCircles();
  const [searchQuery, setSearchQuery] = useState("");

  const myCircleMembers = useMemo(() => {
    const members = new Set<User>();
    
    circles.forEach((circle) => {
      if (myCircles.includes(circle.id)) {
        circle.members.forEach((member) => {
          if (member.userId !== "user") {
            const user: User = {
              id: member.userId,
              name: member.userName,
              truthScore: member.truthScore,
              isVerified: member.truthScore >= 80,
              circles: [circle.name],
            };
            members.add(user);
          }
        });
      }
    });

    SAMPLE_USERS.forEach((user) => members.add(user));
    
    return Array.from(members);
  }, [circles, myCircles]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return myCircleMembers;
    return myCircleMembers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [myCircleMembers, searchQuery]);

  const handleStartConversation = (user: User) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: "/r3al/pulse-chat/dm",
      params: { userId: user.id, userName: user.name },
    });
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Users size={24} color={tokens.colors.gold} strokeWidth={2} />
            <Text style={styles.headerTitle}>Start Chat</Text>
          </View>
          <View style={styles.backButton} />
        </View>

        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={tokens.colors.textSecondary}
            strokeWidth={2}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={tokens.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          style={styles.usersList}
          contentContainerStyle={styles.usersContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <Users size={18} color={tokens.colors.gold} strokeWidth={2} />
            <Text style={styles.sectionTitle}>
              Available Contacts ({filteredUsers.length})
            </Text>
          </View>

          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Users
                size={64}
                color={tokens.colors.textSecondary}
                strokeWidth={1.5}
              />
              <Text style={styles.emptyTitle}>
                {searchQuery ? "No users found" : "No contacts yet"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? "Try a different search term"
                  : "Join circles to connect with verified members"}
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push("/r3al/circles")}
                activeOpacity={0.7}
              >
                <Text style={styles.exploreButtonText}>Explore Circles</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.userItem}
                onPress={() => handleStartConversation(user)}
                activeOpacity={0.7}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <View style={styles.userHeader}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {user.isVerified && (
                      <Shield
                        size={16}
                        color={tokens.colors.highlight}
                        strokeWidth={2}
                      />
                    )}
                  </View>

                  <View style={styles.userMeta}>
                    <View style={styles.scoreContainer}>
                      <Award
                        size={14}
                        color={tokens.colors.gold}
                        strokeWidth={2}
                      />
                      <Text style={styles.scoreText}>
                        Trust Score: {user.truthScore}
                      </Text>
                    </View>
                  </View>

                  {user.circles.length > 0 && (
                    <View style={styles.circlesContainer}>
                      {user.circles.slice(0, 2).map((circle, index) => (
                        <View key={index} style={styles.circleBadge}>
                          <Text style={styles.circleBadgeText}>{circle}</Text>
                        </View>
                      ))}
                      {user.circles.length > 2 && (
                        <Text style={styles.moreCircles}>
                          +{user.circles.length - 2}
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                <View style={styles.actionButton}>
                  <MessageCircle
                    size={24}
                    color={tokens.colors.gold}
                    strokeWidth={2}
                  />
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
  header: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "20",
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
  },
  searchContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    borderRadius: tokens.dimensions.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: tokens.colors.text,
  },
  usersList: {
    flex: 1,
  },
  usersContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  emptyState: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 80,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: tokens.colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
    paddingHorizontal: 40,
  },
  exploreButton: {
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: tokens.dimensions.borderRadius,
    marginTop: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.background,
  },
  userItem: {
    flexDirection: "row" as const,
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "20",
    marginBottom: 12,
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  userHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: tokens.colors.text,
  },
  userMeta: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  scoreContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
  },
  scoreText: {
    fontSize: 13,
    color: tokens.colors.textSecondary,
    fontWeight: "600" as const,
  },
  circlesContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 6,
    marginTop: 2,
  },
  circleBadge: {
    backgroundColor: tokens.colors.gold + "20",
    borderWidth: 1,
    borderColor: tokens.colors.gold + "40",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  circleBadgeText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  moreCircles: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
    paddingVertical: 4,
  },
  actionButton: {
    padding: 8,
  },
});
