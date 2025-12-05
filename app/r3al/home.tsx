import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Award, 
  Hexagon, 
  MessageCircle, 
  Heart,
  Compass,
  Settings,
  LogOut,
  Coins,
  Users,
  TrendingUp,
  Zap,
  Sparkles,
  UserPlus
} from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import { trpc } from "@/lib/trpc";

export default function R3alHome() {
  const router = useRouter();
  const { userProfile, truthScore, resetR3al, tokenBalance: localBalance, isLoading } = useR3al();
  
  const balanceQuery = trpc.r3al.tokens.getBalance.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 0,
    retryDelay: 1000,
    staleTime: 60000,
    enabled: false,
  });
  
  const tokenBalance = balanceQuery.data?.balance || localBalance;

  const handleReset = () => {
    resetR3al();
    router.replace("/r3al/splash");
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tokens.colors.gold} />
            <Text style={styles.loadingText}>Loading...</Text>
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Welcome Back</Text>
            <Text style={styles.title}>{userProfile?.name || "User"}</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsBtn} 
            onPress={() => router.push("/r3al/settings")}
            activeOpacity={0.7}
          >
            <Settings size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity
            style={styles.optimaAiBanner}
            onPress={() => router.push("/r3al/optima-ai")}
            activeOpacity={0.85}
          >
            <View style={styles.optimaAiIconContainer}>
              <Sparkles size={32} color={tokens.colors.gold} strokeWidth={2} />
            </View>
            <View style={styles.optimaAiContent}>
              <Text style={styles.optimaAiTitle}>✨ Ask Optima II™</Text>
              <Text style={styles.optimaAiSubtitle}>
                Your AI consultant for R3AL features, Trust Scores, and relationship guidance
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.quickAction, styles.quickActionPrimary]}
              onPress={() => router.push("/r3al/explore")}
              activeOpacity={0.8}
            >
              <Compass size={28} color={tokens.colors.background} strokeWidth={2} />
              <Text style={styles.quickActionText} numberOfLines={1}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/r3al/circles")}
              activeOpacity={0.8}
            >
              <Hexagon size={28} color="#00FF66" strokeWidth={2} />
              <Text style={styles.quickActionText} numberOfLines={1}>Circles</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/r3al/pulse-chat")}
              activeOpacity={0.8}
            >
              <Heart size={28} color="#EF4444" strokeWidth={2} />
              <Text style={styles.quickActionText} numberOfLines={1}>Pulse</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/r3al/hive/token-wallet")}
              activeOpacity={0.8}
            >
              <Coins size={28} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.quickActionText} numberOfLines={1}>Tokens</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Coins size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Trust-Token Wallet</Text>
              <TouchableOpacity 
                onPress={() => router.push("/r3al/hive/token-wallet")}
                style={styles.viewAllBtn}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tokenPreview}>
              <View style={styles.tokenBalance}>
                <Text style={styles.tokenLabel}>Available Balance</Text>
                <Text style={styles.tokenValue}>{tokenBalance?.available?.toLocaleString() || '0'}</Text>
              </View>
              <View style={styles.tokenStats}>
                <View style={styles.tokenStat}>
                  <TrendingUp size={16} color="#10B981" strokeWidth={2} />
                  <Text style={styles.tokenStatText}>+{tokenBalance?.earned || 0}</Text>
                </View>
                <View style={styles.tokenStat}>
                  <Zap size={16} color="#EF4444" strokeWidth={2} />
                  <Text style={styles.tokenStatText}>-{tokenBalance?.spent || 0}</Text>
                </View>
              </View>
            </View>
          </View>

          {truthScore && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Award size={24} color={tokens.colors.gold} strokeWidth={2} />
                <Text style={styles.sectionTitle}>Your Truth Score</Text>
              </View>
              
              <View style={styles.scorePreview}>
                <TouchableOpacity
                  style={styles.scoreCard}
                  onPress={() => router.push("/r3al/truth-score-detail")}
                  activeOpacity={0.8}
                >
                  <View style={styles.scoreIcon}>
                    <Award size={32} color={tokens.colors.gold} strokeWidth={2} />
                  </View>
                  <View style={styles.scoreInfo}>
                    <Text style={styles.scoreValue}>{truthScore.score}</Text>
                    <Text style={styles.scoreLevel}>{truthScore.summary}</Text>
                  </View>
                  <Text style={styles.viewDetails}>View Details →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Hexagon size={24} color="#00FF66" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Featured</Text>
            </View>

            <View style={styles.featuredGrid}>
              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/r3al/qotd")}
                activeOpacity={0.8}
              >
                <MessageCircle size={32} color="#8B5CF6" strokeWidth={2} />
                <Text style={styles.featureTitle}>Question of the Day</Text>
                <Text style={styles.featureDescription}>
                  Share your perspective and earn tokens
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/r3al/hive")}
                activeOpacity={0.8}
              >
                <Hexagon size={32} color={tokens.colors.gold} strokeWidth={2} />
                <Text style={styles.featureTitle}>NFT Hive</Text>
                <Text style={styles.featureDescription}>
                  Create, trade, and gift unique assets
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/r3al/circles")}
                activeOpacity={0.8}
              >
                <Users size={32} color="#10B981" strokeWidth={2} />
                <Text style={styles.featureTitle}>Join Circles</Text>
                <Text style={styles.featureDescription}>
                  Connect with verified communities
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/r3al/profile/view")}
                activeOpacity={0.8}
              >
                <Award size={32} color="#F59E0B" strokeWidth={2} />
                <Text style={styles.featureTitle}>Your Profile</Text>
                <Text style={styles.featureDescription}>
                  Manage photos and endorsements
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/r3al/feed")}
                activeOpacity={0.8}
              >
                <MessageCircle size={32} color="#6C5DD3" strokeWidth={2} />
                <Text style={styles.featureTitle}>R3AL Feed</Text>
                <Text style={styles.featureDescription}>
                  Share and discover community posts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/r3al/market-pulse")}
                activeOpacity={0.8}
              >
                <TrendingUp size={32} color="#10B981" strokeWidth={2} />
                <Text style={styles.featureTitle}>Market Pulse</Text>
                <Text style={styles.featureDescription}>
                  Live market data and insights
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/r3al/ai-insights")}
                activeOpacity={0.8}
              >
                <Sparkles size={32} color="#8B5CF6" strokeWidth={2} />
                <Text style={styles.featureTitle}>AI Insights</Text>
                <Text style={styles.featureDescription}>
                  Personalized growth analysis
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/r3al/local-discover")}
                activeOpacity={0.8}
              >
                <Compass size={32} color="#F59E0B" strokeWidth={2} />
                <Text style={styles.featureTitle}>Local Discovery</Text>
                <Text style={styles.featureDescription}>
                  Explore nearby news and events
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/r3al/match")}
                activeOpacity={0.8}
              >
                <UserPlus size={32} color="#EC4899" strokeWidth={2} />
                <Text style={styles.featureTitle}>AI Match</Text>
                <Text style={styles.featureDescription}>
                  Discover compatible connections
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <LogOut size={20} color={tokens.colors.error} strokeWidth={2} />
              <Text style={styles.resetButtonText}>Reset & Start Over</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.motto}>Reveal • Relate • Respect</Text>
            <Text style={styles.brandName}>R3AL™</Text>
            <Text style={styles.compliance}>Privacy Act of 1974 Compliant</Text>
            <Text style={styles.copyright}>© 2025 R3AL Technologies. All Rights Reserved.</Text>
            <Text style={styles.trademarks}>R3AL™, Hive™, Pulse Chat™, Trust-Tokens™, Realification™, Optima II™, Question of the Day™ are trademarks of R3AL Technologies.</Text>
            <TouchableOpacity onPress={() => router.push("/r3al/legal")} style={styles.legalLink}>
              <Text style={styles.legalLinkText}>View Trademarks & Legal Information</Text>
            </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  headerLeft: {
    gap: 4,
  },
  greeting: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  settingsBtn: {
    padding: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  quickActions: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    alignItems: "center",
    gap: 8,
  },
  quickActionPrimary: {
    backgroundColor: tokens.colors.gold,
    borderColor: tokens.colors.gold,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: tokens.colors.text,
    textAlign: "center" as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  viewAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  tokenPreview: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    gap: 12,
  },
  tokenBalance: {
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
    marginBottom: 6,
  },
  tokenValue: {
    fontSize: 36,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  tokenStats: {
    flexDirection: "row" as const,
    justifyContent: "space-around",
  },
  tokenStat: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
  },
  tokenStatText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: tokens.colors.text,
  },
  scorePreview: {
    marginBottom: 0,
  },
  scoreCard: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 16,
  },
  scoreIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  scoreInfo: {
    flex: 1,
    gap: 4,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  scoreLevel: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  viewDetails: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  featuredGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    gap: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.text,
  },
  featureDescription: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    lineHeight: 16,
  },
  resetButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.error,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: tokens.colors.error,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    gap: 8,
  },
  motto: {
    fontSize: 16,
    color: tokens.colors.gold,
    letterSpacing: 1,
  },
  compliance: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  brandName: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginVertical: 8,
  },
  copyright: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 8,
  },
  trademarks: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
    maxWidth: 320,
    lineHeight: 14,
    marginTop: 4,
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
  legalLink: {
    marginTop: 12,
    padding: 8,
  },
  legalLinkText: {
    fontSize: 12,
    color: tokens.colors.gold,
    textDecorationLine: "underline" as const,
  },
  optimaAiBanner: {
    flexDirection: "row" as const,
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    marginBottom: 24,
    gap: 16,
    alignItems: "center",
  },
  optimaAiIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  optimaAiContent: {
    flex: 1,
    gap: 4,
  },
  optimaAiTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  optimaAiSubtitle: {
    fontSize: 13,
    color: tokens.colors.textSecondary,
    lineHeight: 18,
  },
});
