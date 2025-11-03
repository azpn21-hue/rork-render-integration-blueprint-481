import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  ArrowLeft, 
  Hexagon, 
  Users, 
  TrendingUp, 
  Plus, 
  Lock, 
  Globe,
  MessageCircle,
  Award,
  Target
} from "lucide-react-native";
import { useCircles } from "@/app/contexts/CirclesContext";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

type Circle = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  isMember: boolean;
  activityLevel: "high" | "medium" | "low";
  avgTruthScore: number;
  icon: string;
  color: string;
};

const MOCK_CIRCLES: Circle[] = [
  {
    id: "1",
    name: "Tech Innovators",
    description: "Building the future of technology with integrity and transparency",
    memberCount: 1247,
    category: "Technology",
    isPrivate: false,
    isMember: true,
    activityLevel: "high",
    avgTruthScore: 87,
    icon: "💡",
    color: "#3B82F6",
  },
  {
    id: "2",
    name: "Trust Builders",
    description: "Core community focused on building authentic relationships",
    memberCount: 892,
    category: "Community",
    isPrivate: false,
    isMember: true,
    activityLevel: "high",
    avgTruthScore: 92,
    icon: "🤝",
    color: "#10B981",
  },
  {
    id: "3",
    name: "Startup Founders",
    description: "Entrepreneur circle for founders building with purpose",
    memberCount: 543,
    category: "Business",
    isPrivate: true,
    isMember: false,
    activityLevel: "medium",
    avgTruthScore: 85,
    icon: "🚀",
    color: "#F59E0B",
  },
  {
    id: "4",
    name: "Creative Minds",
    description: "Artists, designers, and creators sharing authentic work",
    memberCount: 2103,
    category: "Arts & Design",
    isPrivate: false,
    isMember: true,
    activityLevel: "high",
    avgTruthScore: 83,
    icon: "🎨",
    color: "#8B5CF6",
  },
  {
    id: "5",
    name: "Hive Core",
    description: "Inner circle of verified mentors and community leaders",
    memberCount: 127,
    category: "Leadership",
    isPrivate: true,
    isMember: false,
    activityLevel: "medium",
    avgTruthScore: 95,
    icon: "👑",
    color: tokens.colors.gold,
  },
  {
    id: "6",
    name: "Web3 Builders",
    description: "Decentralized tech enthusiasts building the new internet",
    memberCount: 1876,
    category: "Technology",
    isPrivate: false,
    isMember: false,
    activityLevel: "high",
    avgTruthScore: 81,
    icon: "⛓️",
    color: "#EC4899",
  },
];

export default function CirclesPage() {
  const router = useRouter();
  const { circles, myCircles, joinCircle } = useCircles();
  const { userProfile } = useR3al();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Technology", "Community", "Business", "Arts & Design", "Leadership"];

  const allCircles = circles.map(c => ({
    ...c,
    isMember: myCircles.includes(c.id)
  }));

  const filteredCircles = selectedCategory === "all" 
    ? allCircles 
    : allCircles.filter((c) => c.category === selectedCategory);

  const myCirclesList = allCircles.filter((c) => myCircles.includes(c.id));

  const getActivityColor = (level: string) => {
    if (level === "high") return "#00FF66";
    if (level === "medium") return "#F59E0B";
    return "#94A3B8";
  };

  const renderCircleCard = (circle: Circle) => (
    <TouchableOpacity
      key={circle.id}
      style={[styles.circleCard, { borderColor: circle.color + "40" }]}
      activeOpacity={0.8}
      onPress={() => {
        router.push(`/r3al/circles/${circle.id}`);
      }}
    >
      <View style={styles.circleHeader}>
        <View style={[styles.circleIcon, { backgroundColor: circle.color + "20" }]}>
          <Text style={styles.circleEmoji}>{circle.icon}</Text>
        </View>
        <View style={styles.circleHeaderInfo}>
          <View style={styles.circleNameRow}>
            <Text style={styles.circleName}>{circle.name}</Text>
            {circle.isPrivate ? (
              <Lock size={16} color={tokens.colors.textSecondary} strokeWidth={2} />
            ) : (
              <Globe size={16} color={tokens.colors.textSecondary} strokeWidth={2} />
            )}
          </View>
          <Text style={styles.circleCategory}>{circle.category}</Text>
        </View>
      </View>

      <Text style={styles.circleDescription} numberOfLines={2}>
        {circle.description}
      </Text>

      <View style={styles.circleStats}>
        <View style={styles.stat}>
          <Users size={16} color={tokens.colors.textSecondary} strokeWidth={2} />
          <Text style={styles.statText}>{circle.memberCount.toLocaleString()}</Text>
        </View>
        <View style={styles.stat}>
          <Award size={16} color={tokens.colors.gold} strokeWidth={2} />
          <Text style={styles.statText}>Avg {circle.avgTruthScore}</Text>
        </View>
        <View style={styles.stat}>
          <View style={[styles.activityDot, { backgroundColor: getActivityColor(circle.activityLevel) }]} />
          <Text style={styles.statText}>{circle.activityLevel}</Text>
        </View>
      </View>

      <View style={styles.circleActions}>
        {circle.isMember ? (
          <>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} activeOpacity={0.7}>
              <MessageCircle size={18} color={tokens.colors.text} strokeWidth={2} />
              <Text style={styles.actionBtnText}>View Circle</Text>
            </TouchableOpacity>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>✓ Member</Text>
            </View>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.actionBtnOutline]} 
            activeOpacity={0.7}
            onPress={() => {
              joinCircle(circle.id, userProfile?.name || "user", userProfile?.name || "User", userProfile?.truthScore?.score || 75);
            }}
          >
            <Plus size={18} color={tokens.colors.gold} strokeWidth={2} />
            <Text style={[styles.actionBtnText, { color: tokens.colors.gold }]}>
              {circle.isPrivate ? "Request to Join" : "Join Circle"}
            </Text>
          </TouchableOpacity>
        )}
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
          <Text style={styles.headerTitle}>Hive Circles</Text>
          <TouchableOpacity 
            style={styles.createButton} 
            activeOpacity={0.7}
            onPress={() => router.push("/r3al/circles/create")}
          >
            <Plus size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroCard}>
            <Hexagon size={48} color="#00FF66" strokeWidth={2} />
            <Text style={styles.heroTitle}>Community Circles</Text>
            <Text style={styles.heroSubtitle}>
              Join trusted communities, find mentors, and build authentic connections
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{myCirclesList.length}</Text>
                <Text style={styles.heroStatLabel}>Your Circles</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{circles.length}</Text>
                <Text style={styles.heroStatLabel}>Total Circles</Text>
              </View>
            </View>
          </View>

          {myCirclesList.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Target size={20} color={tokens.colors.gold} strokeWidth={2} />
                <Text style={styles.sectionTitle}>Your Circles</Text>
              </View>
              <View style={styles.circlesList}>
                {myCirclesList.map(renderCircleCard)}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Discover Circles</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat === "all" ? "All" : cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.circlesList}>
              {filteredCircles.map(renderCircleCard)}
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💫 Circle Benefits</Text>
            <Text style={styles.infoText}>
              • Connect with verified members who share your interests{"\n"}
              • Access exclusive discussions and events{"\n"}
              • Find mentors and build meaningful relationships{"\n"}
              • Earn Trust-Tokens through engagement{"\n"}
              • Private circles require approval from admins
            </Text>
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
  createButton: {
    padding: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: "#00FF66" + "40",
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginTop: 12,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  heroStats: {
    flexDirection: "row" as const,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "30",
    paddingTop: 16,
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroStatValue: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  heroDivider: {
    width: 1,
    backgroundColor: tokens.colors.gold + "30",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  categoryScroll: {
    gap: 10,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: tokens.colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
  },
  categoryChipActive: {
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.gold,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  categoryChipTextActive: {
    color: tokens.colors.gold,
    fontWeight: "700" as const,
  },
  circlesList: {
    gap: 16,
  },
  circleCard: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    gap: 12,
  },
  circleHeader: {
    flexDirection: "row" as const,
    gap: 12,
  },
  circleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  circleEmoji: {
    fontSize: 28,
  },
  circleHeaderInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  circleNameRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  circleName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
  },
  circleCategory: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  circleDescription: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
  },
  circleStats: {
    flexDirection: "row" as const,
    gap: 16,
  },
  stat: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: tokens.colors.textSecondary,
    fontWeight: "500" as const,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  circleActions: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
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
    borderRadius: 8,
  },
  actionBtnPrimary: {
    backgroundColor: tokens.colors.gold,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  actionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  memberBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#00FF66" + "20",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00FF66",
  },
  memberBadgeText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#00FF66",
  },
  infoCard: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "20",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
});
