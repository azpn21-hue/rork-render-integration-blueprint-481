import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  ArrowLeft, 
  Shield, 
  Award, 
  Users, 
  Hexagon, 
  Coins,
  Image as ImageIcon,
  TrendingUp,
  Heart,
  Lock
} from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function LearnMore() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>R3AL Architecture</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Complete Ecosystem Flow</Text>
            <Text style={styles.heroSubtitle}>
              A privacy-first platform where authenticity, community, and value creation intersect
            </Text>
          </View>

          <View style={styles.flowSection}>
            <Text style={styles.flowTitle}>🚀 User Journey</Text>
            
            <View style={styles.flowCard}>
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Shield size={20} color={tokens.colors.gold} strokeWidth={2} />
                    <Text style={styles.stepTitle}>Verification & Onboarding</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    • Multi-factor authentication{"\n"}
                    • Identity verification (2FA + optional biometrics){"\n"}
                    • Privacy agreement & NDA consent{"\n"}
                    • Guest mode available during beta
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.flowCard}>
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Award size={20} color={tokens.colors.gold} strokeWidth={2} />
                    <Text style={styles.stepTitle}>Truth Score Questionnaire</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    • Psychologically-validated questions{"\n"}
                    • Measures honesty, integrity, transparency{"\n"}
                    • Generates personalized Truth Score{"\n"}
                    • Score affects token earning rate{"\n"}
                    • Real-time progress tracking
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.flowCard}>
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Lock size={20} color={tokens.colors.gold} strokeWidth={2} />
                    <Text style={styles.stepTitle}>Privacy Protection System</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    • Screenshot & screen recording detection{"\n"}
                    • Three-strike policy with 24hr restrictions{"\n"}
                    • Content capture history tracking{"\n"}
                    • Appeal process for false positives{"\n"}
                    • Automatic escalation to supervisors
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.flowCard}>
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Coins size={20} color={tokens.colors.gold} strokeWidth={2} />
                    <Text style={styles.stepTitle}>Trust-Token Economy</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    • Earn tokens through verification & integrity{"\n"}
                    • Initial bonus: 100 tokens{"\n"}
                    • Token rewards scale with Truth Score{"\n"}
                    • Spend tokens on NFT creation & features{"\n"}
                    • Trade tokens in the marketplace{"\n"}
                    • Activates at 100K users
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.flowCard}>
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Hexagon size={20} color={tokens.colors.gold} strokeWidth={2} />
                    <Text style={styles.stepTitle}>NFT Hive Marketplace</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    • Create NFTs using Trust-Tokens (min 10 tokens){"\n"}
                    • Upload custom artwork with descriptions{"\n"}
                    • List NFTs for sale at custom prices{"\n"}
                    • Gift NFTs to other users{"\n"}
                    • Full transaction history{"\n"}
                    • Provenance tracking & authenticity
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.flowCard}>
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>6</Text>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Users size={20} color={tokens.colors.gold} strokeWidth={2} />
                    <Text style={styles.stepTitle}>Hive Circles & Community</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    • Join Circles based on tier level{"\n"}
                    • Free: 1 Circle | Plus: 3 | Pro: 5 | Elite: Unlimited{"\n"}
                    • Circle integrity scores affect visibility{"\n"}
                    • Host events (Pro & Elite tiers){"\n"}
                    • Mentorship programs with token rewards{"\n"}
                    • Governance voting for Council members
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.tierSection}>
            <Text style={styles.sectionTitle}>💎 Subscription Tiers</Text>
            
            <View style={styles.tierCard}>
              <Text style={styles.tierName}>Free</Text>
              <Text style={styles.tierPrice}>$0/month</Text>
              <Text style={styles.tierFeatures}>
                • 1 Circle join{"\n"}
                • Basic questionnaire{"\n"}
                • 3 photo slots{"\n"}
                • Standard token earning rate
              </Text>
            </View>

            <View style={[styles.tierCard, styles.tierCardFeatured]}>
              <Text style={styles.tierName}>Plus</Text>
              <Text style={styles.tierPrice}>$9.99/month</Text>
              <Text style={styles.tierFeatures}>
                • 3 Circles{"\n"}
                • Ad-free experience{"\n"}
                • Vault editing{"\n"}
                • 4 photo scans/month{"\n"}
                • 1.25x token earning multiplier
              </Text>
            </View>

            <View style={styles.tierCard}>
              <Text style={styles.tierName}>Pro</Text>
              <Text style={styles.tierPrice}>$19.99/month</Text>
              <Text style={styles.tierFeatures}>
                • 5 Circles{"\n"}
                • Advanced analytics{"\n"}
                • Integrity insights dashboard{"\n"}
                • Unlimited photo scans{"\n"}
                • Event hosting capability{"\n"}
                • 1.5x token earning multiplier
              </Text>
            </View>

            <View style={[styles.tierCard, styles.tierCardElite]}>
              <Text style={styles.tierName}>Elite</Text>
              <Text style={styles.tierPrice}>Invite Only</Text>
              <Text style={styles.tierFeatures}>
                • Unlimited Circles{"\n"}
                • Host premium events{"\n"}
                • Marketplace priority{"\n"}
                • Council voting rights{"\n"}
                • Exclusive features{"\n"}
                • 2x token earning multiplier
              </Text>
            </View>
          </View>

          <View style={styles.techSection}>
            <Text style={styles.sectionTitle}>⚙️ Technical Architecture</Text>
            
            <View style={styles.techCard}>
              <TrendingUp size={24} color={tokens.colors.gold} strokeWidth={2} />
              <View style={styles.techContent}>
                <Text style={styles.techTitle}>Data Flow</Text>
                <Text style={styles.techText}>
                  Client App → Auth Service → Hive API Gateway → Microservices (Integrity Engine, Token Engine, Media Service) → Database Cluster → Analytics Engine → Admin Dashboard
                </Text>
              </View>
            </View>

            <View style={styles.techCard}>
              <Shield size={24} color={tokens.colors.gold} strokeWidth={2} />
              <View style={styles.techContent}>
                <Text style={styles.techTitle}>Security Layers</Text>
                <Text style={styles.techText}>
                  • JWT/OAuth authentication{"\n"}
                  • Role-based access control{"\n"}
                  • SHA-256 user ID hashing{"\n"}
                  • AES-256 vault encryption{"\n"}
                  • Rate limiting (100 req/min){"\n"}
                  • Audit logs for all actions
                </Text>
              </View>
            </View>

            <View style={styles.techCard}>
              <Heart size={24} color={tokens.colors.gold} strokeWidth={2} />
              <View style={styles.techContent}>
                <Text style={styles.techTitle}>Core Values</Text>
                <Text style={styles.techText}>
                  • Privacy by design{"\n"}
                  • User data ownership{"\n"}
                  • Transparent algorithms{"\n"}
                  • Community governance{"\n"}
                  • Ethical AI integration{"\n"}
                  • 1974 Privacy Act compliant
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Join the R3AL Hive?</Text>
            <Text style={styles.ctaSubtitle}>
              Be part of a community where authenticity meets innovation
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.replace("/r3al/onboarding/welcome")}
              activeOpacity={0.7}
            >
              <Text style={styles.ctaButtonText}>Get Started</Text>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
    gap: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: tokens.colors.text,
    textAlign: "center",
    lineHeight: 24,
  },
  flowSection: {
    marginBottom: 32,
  },
  flowTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 16,
  },
  flowCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    padding: 20,
    marginBottom: 16,
  },
  flowStep: {
    flexDirection: "row" as const,
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
  stepContent: {
    flex: 1,
    gap: 12,
  },
  stepHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  stepDescription: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
  tierSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 16,
  },
  tierCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    padding: 20,
    marginBottom: 12,
  },
  tierCardFeatured: {
    borderColor: tokens.colors.gold,
    borderWidth: 3,
  },
  tierCardElite: {
    backgroundColor: tokens.colors.gold + "10",
    borderColor: tokens.colors.gold,
  },
  tierName: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  tierPrice: {
    fontSize: 16,
    color: tokens.colors.text,
    marginBottom: 12,
  },
  tierFeatures: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
  techSection: {
    marginBottom: 32,
  },
  techCard: {
    flexDirection: "row" as const,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "20",
    padding: 20,
    marginBottom: 12,
    gap: 16,
  },
  techContent: {
    flex: 1,
    gap: 8,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  techText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
  ctaSection: {
    alignItems: "center",
    backgroundColor: tokens.colors.surface,
    padding: 32,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    gap: 16,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: 16,
    color: tokens.colors.text,
    textAlign: "center",
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: tokens.dimensions.borderRadius,
    marginTop: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
});
