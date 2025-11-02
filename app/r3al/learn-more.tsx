import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  ArrowLeft, Shield, Users, Award, Lock, 
  Zap, TrendingUp, Camera, CheckCircle, AlertTriangle 
} from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import buildDrop from "@/schemas/r3al/build_drop_v1.json";
import React, { useState, useRef, useEffect } from "react";

export default function LearnMore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<"flow" | "architecture" | "features">("flow");
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleBack = () => {
    console.log("[LearnMore] Back pressed");
    router.back();
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.secondary]}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ArrowLeft color={tokens.colors.gold} size={24} />
          </TouchableOpacity>
          
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.logoText}>R3AL</Text>
          </Animated.View>
          
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>How R3AL Works</Text>
          <Text style={styles.subtitle}>
            {buildDrop.marketing.coreMessage}
          </Text>
        </View>

        <View style={styles.tabBar}>
          <TabButton 
            label="Flow" 
            active={selectedTab === "flow"} 
            onPress={() => setSelectedTab("flow")}
          />
          <TabButton 
            label="Architecture" 
            active={selectedTab === "architecture"} 
            onPress={() => setSelectedTab("architecture")}
          />
          <TabButton 
            label="Features" 
            active={selectedTab === "features"} 
            onPress={() => setSelectedTab("features")}
          />
        </View>

        {selectedTab === "flow" && <FlowSection />}
        {selectedTab === "architecture" && <ArchitectureSection />}
        {selectedTab === "features" && <FeaturesSection />}

        <View style={styles.footerCTA}>
          <Text style={styles.readyText}>Ready to join?</Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function TabButton({ 
  label, 
  active, 
  onPress 
}: { 
  label: string; 
  active: boolean; 
  onPress: () => void;
}) {
  return (
    <TouchableOpacity 
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function FlowSection() {
  const steps = [
    {
      icon: <Zap color={tokens.colors.gold} size={28} />,
      title: "Welcome Pulse",
      description: "Experience the R3AL heartbeat at 60 BPM—your introduction to authenticity.",
      stage: "Entry"
    },
    {
      icon: <Shield color={tokens.colors.gold} size={28} />,
      title: "Security Setup",
      description: "NDA consent, privacy agreement, and optional ID verification for trust.",
      stage: "Security"
    },
    {
      icon: <CheckCircle color={tokens.colors.gold} size={28} />,
      title: "Trust Vault Questionnaire",
      description: "Answer psych-eval grade questions to establish your baseline Integrity Index.",
      stage: "Verification"
    },
    {
      icon: <Camera color={tokens.colors.gold} size={28} />,
      title: "Profile Creation",
      description: "Upload authentic photos—no filters, no AI. Real you, verified.",
      stage: "Profile"
    },
    {
      icon: <Users color={tokens.colors.gold} size={28} />,
      title: "Join the Hive",
      description: "Enter Circles, connect with verified members, and build your reputation.",
      stage: "Community"
    },
    {
      icon: <TrendingUp color={tokens.colors.gold} size={28} />,
      title: "Earn Trust Tokens",
      description: "Engage authentically, earn tokens, and unlock premium features.",
      stage: "Growth"
    }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Journey</Text>
      <Text style={styles.sectionDescription}>
        From first login to verified member—here's how R3AL builds trust.
      </Text>
      
      {steps.map((step, index) => (
        <View key={index} style={styles.flowCard}>
          <View style={styles.flowCardHeader}>
            <View style={styles.flowIcon}>{step.icon}</View>
            <View style={styles.flowStage}>
              <Text style={styles.flowStageText}>{step.stage}</Text>
            </View>
          </View>
          <Text style={styles.flowTitle}>{step.title}</Text>
          <Text style={styles.flowDescription}>{step.description}</Text>
          {index < steps.length - 1 && <View style={styles.flowConnector} />}
        </View>
      ))}
    </View>
  );
}

function ArchitectureSection() {
  const components = [
    {
      icon: <Shield color={tokens.colors.gold} size={28} />,
      title: "Trust Vault",
      description: "Your encrypted truth repository. Questionnaire responses, verification status, and integrity metrics stored securely.",
      weight: "40% behavior • 30% community • 30% photo"
    },
    {
      icon: <Users color={tokens.colors.gold} size={28} />,
      title: "The Hive",
      description: "Community hub organized into Circles. Connect, share, and verify others' authenticity.",
      circles: "1-5 Circles based on tier"
    },
    {
      icon: <Award color={tokens.colors.gold} size={28} />,
      title: "Integrity Index",
      description: "Your public trust score. Updates weekly based on behavior, interactions, and community feedback.",
      range: "0-100 composite score"
    },
    {
      icon: <Lock color={tokens.colors.gold} size={28} />,
      title: "Privacy Shield",
      description: "Screenshot detection, capture alerts, and content protection. Your data is never sold.",
      strikes: "3-strike policy enforced"
    }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>System Architecture</Text>
      <Text style={styles.sectionDescription}>
        R3AL is built on four pillars of trust and security.
      </Text>
      
      {components.map((component, index) => (
        <View key={index} style={styles.archCard}>
          <View style={styles.archIcon}>{component.icon}</View>
          <View style={styles.archContent}>
            <Text style={styles.archTitle}>{component.title}</Text>
            <Text style={styles.archDescription}>{component.description}</Text>
            {component.weight && (
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{component.weight}</Text>
              </View>
            )}
            {component.circles && (
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{component.circles}</Text>
              </View>
            )}
            {component.range && (
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{component.range}</Text>
              </View>
            )}
            {component.strikes && (
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{component.strikes}</Text>
              </View>
            )}
          </View>
        </View>
      ))}

      <View style={styles.techStack}>
        <Text style={styles.techStackTitle}>Built For Security</Text>
        <View style={styles.techBadges}>
          <TechBadge label="AES-256 Encryption" />
          <TechBadge label="2FA Required" />
          <TechBadge label="Zero-Knowledge" />
          <TechBadge label="GDPR Compliant" />
        </View>
      </View>
    </View>
  );
}

function FeaturesSection() {
  const tiers = buildDrop.promoPolicy.pricingTiers;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Features & Tiers</Text>
      <Text style={styles.sectionDescription}>
        Choose the level that fits your needs. All tiers include core security.
      </Text>
      
      {tiers.map((tier, index) => (
        <View key={index} style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <Text style={styles.tierName}>{tier.name}</Text>
            <Text style={styles.tierPrice}>
              {typeof tier.price === "number" ? `$${tier.price}/mo` : tier.price}
            </Text>
          </View>
          <View style={styles.tierFeatures}>
            {tier.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <CheckCircle color={tokens.colors.gold} size={16} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.tokenInfo}>
        <Text style={styles.tokenTitle}>Trust Tokens</Text>
        <Text style={styles.tokenDescription}>
          Earn tokens by maintaining high integrity, participating in the Hive, and helping others.
          Tokens unlock features, events, and marketplace access.
        </Text>
        <View style={styles.tokenRewards}>
          <RewardBadge label="Verify Profile" amount={10} />
          <RewardBadge label="High Integrity" amount={25} />
          <RewardBadge label="Commendation" amount={15} />
          <RewardBadge label="Quarter Clean" amount={30} />
        </View>
        <View style={styles.tokenNote}>
          <AlertTriangle color={tokens.colors.goldLight} size={16} />
          <Text style={styles.tokenNoteText}>
            Token system activates at 100,000 users
          </Text>
        </View>
      </View>
    </View>
  );
}

function TechBadge({ label }: { label: string }) {
  return (
    <View style={styles.techBadge}>
      <Text style={styles.techBadgeText}>{label}</Text>
    </View>
  );
}

function RewardBadge({ label, amount }: { label: string; amount: number }) {
  return (
    <View style={styles.rewardBadge}>
      <Text style={styles.rewardLabel}>{label}</Text>
      <Text style={styles.rewardAmount}>+{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: tokens.colors.gold,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: tokens.colors.goldLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.secondary,
    letterSpacing: 1,
  },
  titleSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 12,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 18,
    color: tokens.colors.gold,
    fontWeight: "500" as const,
    lineHeight: 26,
  },
  tabBar: {
    flexDirection: "row" as const,
    gap: 8,
    marginBottom: 32,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: tokens.colors.gold,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  tabButtonTextActive: {
    color: tokens.colors.secondary,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    color: tokens.colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  flowCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    position: "relative" as const,
  },
  flowCardHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  flowIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  flowStage: {
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  flowStageText: {
    fontSize: 11,
    fontWeight: "bold" as const,
    color: tokens.colors.secondary,
    letterSpacing: 0.5,
  },
  flowTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 8,
  },
  flowDescription: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
  },
  flowConnector: {
    position: "absolute" as const,
    bottom: -16,
    left: 44,
    width: 2,
    height: 16,
    backgroundColor: "rgba(212, 175, 55, 0.3)",
  },
  archCard: {
    flexDirection: "row" as const,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    gap: 16,
  },
  archIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  archContent: {
    flex: 1,
  },
  archTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 6,
  },
  archDescription: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  metaBadge: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start" as const,
    marginTop: 4,
  },
  metaBadgeText: {
    fontSize: 11,
    color: tokens.colors.gold,
    fontWeight: "600" as const,
  },
  techStack: {
    backgroundColor: "rgba(212, 175, 55, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  techStackTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 12,
  },
  techBadges: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  techBadge: {
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  techBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: tokens.colors.secondary,
  },
  tierCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  tierHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.2)",
  },
  tierName: {
    fontSize: 22,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
  },
  tierPrice: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  tierFeatures: {
    gap: 12,
  },
  featureRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    flex: 1,
  },
  tokenInfo: {
    backgroundColor: "rgba(212, 175, 55, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  tokenTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  tokenDescription: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  tokenRewards: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
    marginBottom: 16,
  },
  rewardBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  rewardLabel: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginBottom: 2,
  },
  rewardAmount: {
    fontSize: 14,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  tokenNote: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
  tokenNoteText: {
    fontSize: 12,
    color: tokens.colors.goldLight,
    flex: 1,
  },
  footerCTA: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  readyText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: tokens.colors.text,
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: tokens.colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: tokens.colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: {
    color: tokens.colors.secondary,
    fontSize: 18,
    fontWeight: "bold" as const,
    letterSpacing: 0.5,
  },
});
