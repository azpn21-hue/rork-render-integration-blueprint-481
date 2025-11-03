import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, MessageSquare, Award, Crown, Shield } from "lucide-react-native";
import { useCircles } from "@/app/contexts/CirclesContext";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function CircleMembersPage() {
  const router = useRouter();
  const { circleId } = useLocalSearchParams();
  const { getCircleById, sendDirectMessage } = useCircles();
  const { userProfile } = useR3al();

  const circle = getCircleById(circleId as string);

  if (!circle) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Circle not found</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>← Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handleSendDM = (memberId: string, memberName: string) => {
    Alert.prompt(
      `Send DM to ${memberName}`,
      "Enter your message:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: (message) => {
            if (message?.trim()) {
              sendDirectMessage(
                userProfile?.name || "user",
                memberId,
                userProfile?.name || "User",
                memberName,
                message.trim()
              );
              Alert.alert("Sent!", `Your encrypted message was sent to ${memberName}`);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const getRoleIcon = (role: string) => {
    if (role === "owner") return <Crown size={16} color={tokens.colors.gold} strokeWidth={2} />;
    if (role === "admin") return <Shield size={16} color="#3B82F6" strokeWidth={2} />;
    return null;
  };

  const renderMember = ({ item }: { item: typeof circle.members[0] }) => {
    const isMe = item.userId === userProfile?.name;

    return (
      <View style={styles.memberCard}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberInitial}>
            {item.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.memberInfo}>
          <View style={styles.memberNameRow}>
            <Text style={styles.memberName}>{item.userName}</Text>
            {getRoleIcon(item.role)}
            {isMe && <Text style={styles.youBadge}>You</Text>}
          </View>
          <View style={styles.memberStats}>
            <Award size={14} color={tokens.colors.gold} strokeWidth={2} />
            <Text style={styles.memberTruthScore}>Truth Score: {item.truthScore}</Text>
          </View>
          <Text style={styles.memberJoinedAt}>
            Joined {new Date(item.joinedAt).toLocaleDateString()}
          </Text>
        </View>
        {!isMe && (
          <TouchableOpacity
            style={styles.dmButton}
            onPress={() => handleSendDM(item.userId, item.userName)}
          >
            <MessageSquare size={20} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Members</Text>
            <Text style={styles.headerSubtitle}>{circle.name}</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{circle.memberCount}</Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{circle.avgTruthScore}</Text>
            <Text style={styles.statLabel}>Avg Truth Score</Text>
          </View>
        </View>

        <FlatList
          data={circle.members}
          renderItem={renderMember}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={styles.membersList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No members yet</Text>
            </View>
          }
        />
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
  headerBackButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  headerSubtitle: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  placeholder: {
    width: 32,
  },
  statsCard: {
    flexDirection: "row" as const,
    backgroundColor: tokens.colors.surface,
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: tokens.colors.gold + "30",
  },
  membersList: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  memberCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  memberInitial: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
  memberInfo: {
    flex: 1,
    gap: 4,
  },
  memberNameRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: tokens.colors.text,
  },
  youBadge: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    backgroundColor: tokens.colors.gold + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  memberStats: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
  },
  memberTruthScore: {
    fontSize: 13,
    color: tokens.colors.textSecondary,
  },
  memberJoinedAt: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  dmButton: {
    backgroundColor: tokens.colors.background,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    padding: 10,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    color: tokens.colors.error,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: tokens.colors.gold,
  },
});
