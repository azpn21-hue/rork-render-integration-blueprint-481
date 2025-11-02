import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  ArrowLeft, Shield, Users,
  Zap, TrendingUp, Camera, CheckCircle, AlertTriangle
} from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import buildDrop from "@/schemas/r3al/build_drop_v1.json";
import archFlow from "@/schemas/r3al/architecture_flow_v1.json";
import React, { useState, useRef, useEffect } from "react";

export default function LearnMore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<"flow" | "architecture" | "features" | "dataflow">("flow");
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
  }, [pulseAnim]);

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
            label="System" 
            active={selectedTab === "architecture"} 
            onPress={() => setSelectedTab("architecture")}
          />
          <TabButton 
            label="Data Flow" 
            active={selectedTab === "dataflow"} 
            onPress={() => setSelectedTab("dataflow")}
          />
          <TabButton 
            label="Features" 
            active={selectedTab === "features"} 
            onPress={() => setSelectedTab("features")}
          />
        </View>

        {selectedTab === "flow" && <FlowSection />}
        {selectedTab === "architecture" && <ArchitectureSection />}
        {selectedTab === "dataflow" && <DataFlowSection />}
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
        From first login to verified member&mdash;here&apos;s how R3AL builds trust.
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
  const services = archFlow.nodes;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>System Services</Text>
      <Text style={styles.sectionDescription}>
        R3AL is powered by 9 specialized microservices working together.
      </Text>
      
      {services.map((service, index) => (
        <View key={index} style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceEmoji}>{service.label.split(" ")[0]}</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>{service.role}</Text>
            </View>
          </View>
          <Text style={styles.serviceTitle}>{service.label.split(" ").slice(1).join(" ")}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
        </View>
      ))}

      <View style={styles.techStack}>
        <Text style={styles.techStackTitle}>Security & Compliance</Text>
        <View style={styles.techBadges}>
          <TechBadge label="HTTPS + JWT" />
          <TechBadge label="AES-256 Encryption" />
          <TechBadge label="Role-Based ACL" />
          <TechBadge label="Rate Limiting" />
          <TechBadge label="Audit Logging" />
          <TechBadge label="GDPR Compliant" />
        </View>
      </View>

      <View style={styles.runtimeNotes}>
        <Text style={styles.runtimeTitle}>Runtime Architecture</Text>
        {archFlow.runtime_notes.map((note, idx) => (
          <View key={idx} style={styles.noteRow}>
            <View style={styles.noteDot} />
            <Text style={styles.noteText}>{note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function DataFlowSection() {
  const apiGroups = [
    { name: "Users", endpoints: archFlow.api_endpoints.users },
    { name: "Circles", endpoints: archFlow.api_endpoints.circles },
    { name: "Feed", endpoints: archFlow.api_endpoints.feed },
    { name: "Events", endpoints: archFlow.api_endpoints.events },
    { name: "Tokens", endpoints: archFlow.api_endpoints.tokens },
    { name: "Governance", endpoints: archFlow.api_endpoints.governance }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>API & Data Flow</Text>
      <Text style={styles.sectionDescription}>
        How data moves through the R3AL ecosystem&mdash;from user requests to backend services.
      </Text>

      <View style={styles.flowDiagram}>
        <Text style={styles.flowDiagramTitle}>Data Journey</Text>
        {archFlow.links.map((link, index) => (
          <View key={index} style={styles.flowLink}>
            <Text style={styles.flowFrom}>{link.from.replace("_", " ")}</Text>
            <View style={styles.flowArrow}>
              <View style={styles.arrowLine} />
              <Text style={styles.arrowLabel}>{link.label}</Text>
            </View>
            <Text style={styles.flowTo}>{link.to.replace("_", " ")}</Text>
          </View>
        ))}
      </View>

      <View style={styles.apiSection}>
        <Text style={styles.apiSectionTitle}>API Endpoints</Text>
        {apiGroups.map((group, idx) => (
          <View key={idx} style={styles.apiGroup}>
            <Text style={styles.apiGroupName}>{group.name}</Text>
            {group.endpoints.map((endpoint, endIdx) => (
              <View key={endIdx} style={styles.endpointCard}>
                <View style={styles.methodBadge}>
                  <Text style={[styles.methodText, { color: getMethodColor(endpoint.method) }]}>
                    {endpoint.method}
                  </Text>
                </View>
                <View style={styles.endpointInfo}>
                  <Text style={styles.endpointPath}>{endpoint.path}</Text>
                  <Text style={styles.endpointDesc}>{endpoint.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.metricsBox}>
        <Text style={styles.metricsTitle}>Derived Metrics</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Circle Health:</Text>
          <Text style={styles.metricFormula}>{archFlow.derived_metrics.circleHealth}</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Hive Integrity:</Text>
          <Text style={styles.metricFormula}>{archFlow.derived_metrics.hiveIntegrity}</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>User Influence:</Text>
          <Text style={styles.metricFormula}>{archFlow.derived_metrics.userInfluence}</Text>
        </View>
      </View>
    </View>
  );
}

function getMethodColor(method: string): string {
  switch(method) {
    case "GET": return "#5cb85c";
    case "POST": return "#d4af37";
    case "PUT": return "#f0ad4e";
    case "DELETE": return "#d9534f";
    default: return "#ffffff";
  }
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
  serviceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  serviceHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  serviceEmoji: {
    fontSize: 28,
  },
  roleTag: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 13,
    color: tokens.colors.textSecondary,
    lineHeight: 19,
  },
  runtimeNotes: {
    backgroundColor: "rgba(212, 175, 55, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  runtimeTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 12,
  },
  noteRow: {
    flexDirection: "row" as const,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  noteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.colors.gold,
    marginTop: 6,
    marginRight: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: tokens.colors.textSecondary,
    lineHeight: 19,
  },
  flowDiagram: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.15)",
  },
  flowDiagramTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 16,
  },
  flowLink: {
    marginBottom: 12,
  },
  flowFrom: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: tokens.colors.text,
    textTransform: "capitalize" as const,
    marginBottom: 4,
  },
  flowArrow: {
    marginLeft: 12,
    marginBottom: 4,
  },
  arrowLine: {
    width: 2,
    height: 12,
    backgroundColor: "rgba(212, 175, 55, 0.4)",
    marginBottom: 2,
  },
  arrowLabel: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    fontStyle: "italic" as const,
    marginBottom: 4,
  },
  flowTo: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    textTransform: "capitalize" as const,
    marginLeft: 12,
  },
  apiSection: {
    marginTop: 16,
  },
  apiSectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 16,
  },
  apiGroup: {
    marginBottom: 24,
  },
  apiGroupName: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  endpointCard: {
    flexDirection: "row" as const,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    gap: 12,
  },
  methodBadge: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 50,
  },
  methodText: {
    fontSize: 12,
    fontWeight: "bold" as const,
    letterSpacing: 0.5,
  },
  endpointInfo: {
    flex: 1,
  },
  endpointPath: {
    fontSize: 12,
    fontFamily: "monospace" as const,
    color: tokens.colors.text,
    marginBottom: 4,
  },
  endpointDesc: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    lineHeight: 16,
  },
  metricsBox: {
    backgroundColor: "rgba(212, 175, 55, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 12,
  },
  metricRow: {
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  metricFormula: {
    fontSize: 12,
    fontFamily: "monospace" as const,
    color: tokens.colors.textSecondary,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 8,
    borderRadius: 6,
  },
});
