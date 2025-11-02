import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Shield, Lock, Eye } from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import manifest from "@/schemas/r3al/manifest.json";
import React from "react";

export default function PromoBeta() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const betaEndsAt = manifest.beta_promo?.ends_at;
  const isBetaActive = betaEndsAt && new Date() < new Date(betaEndsAt);

  if (!isBetaActive && !manifest.beta_promo?.enabled) {
    console.log("[PromoBeta] Beta expired, redirecting to welcome");
    router.replace("/r3al/onboarding/welcome");
    return null;
  }

  const handleContinue = () => {
    console.log("[PromoBeta] Continue pressed → /r3al/onboarding/welcome");
    router.replace("/r3al/onboarding/welcome");
  };

  const handleLearnMore = () => {
    console.log("[PromoBeta] Learn more pressed");
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.secondary]}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>R3AL</Text>
          </View>
          
          <View style={styles.betaBadge}>
            <Text style={styles.betaText}>BETA</Text>
          </View>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.headline}>
            Built by a Special Forces Operator
          </Text>
          
          <Text style={styles.subhead}>
            with security, intelligence, and unfiltered reality at its core.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <FeatureCard
            icon={<Shield color={tokens.colors.gold} size={32} />}
            title="Military-Grade Security"
            description="Your data is protected with the same principles used in Special Operations."
          />
          
          <FeatureCard
            icon={<Lock color={tokens.colors.gold} size={32} />}
            title="Privacy First"
            description="No tracking, no selling data. Your truth stays yours."
          />
          
          <FeatureCard
            icon={<Eye color={tokens.colors.gold} size={32} />}
            title="Unfiltered Reality"
            description="Designed to protect truth, privacy, and authenticity in modern relationships."
          />
        </View>

        <View style={styles.bodySection}>
          <Text style={styles.bodyText}>
            R3AL isn&apos;t just another app— It&apos;s designed to protect truth, privacy, 
            and authenticity in modern relationships.
          </Text>
          
          <Text style={styles.bodyText}>
            Built from real-world experience in intelligence, security operations, 
            and understanding what matters when trust is everything.
          </Text>
        </View>

        <View style={styles.ctaContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleLearnMore}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        {isBetaActive && betaEndsAt && (
          <View style={styles.betaInfo}>
            <Text style={styles.betaInfoText}>
              Beta access • Ends {new Date(betaEndsAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>
        <Text>{icon}</Text>
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
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
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: tokens.colors.gold,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: tokens.colors.goldLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.secondary,
    letterSpacing: 1,
  },
  betaBadge: {
    backgroundColor: tokens.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  betaText: {
    color: tokens.colors.text,
    fontSize: 12,
    fontWeight: "bold" as const,
    letterSpacing: 1,
  },
  heroSection: {
    marginBottom: 40,
  },
  headline: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    lineHeight: 40,
    marginBottom: 16,
  },
  subhead: {
    fontSize: 18,
    color: tokens.colors.gold,
    lineHeight: 26,
    fontWeight: "500" as const,
  },
  featuresContainer: {
    marginBottom: 40,
    gap: 20,
  },
  featureCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
  },
  bodySection: {
    marginBottom: 40,
    gap: 16,
  },
  bodyText: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    lineHeight: 24,
  },
  ctaContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: tokens.colors.gold,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: tokens.colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: tokens.colors.secondary,
    fontSize: 18,
    fontWeight: "bold" as const,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.colors.gold,
  },
  secondaryButtonText: {
    color: tokens.colors.gold,
    fontSize: 16,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  betaInfo: {
    alignItems: "center",
    paddingVertical: 12,
  },
  betaInfoText: {
    color: tokens.colors.textSecondary,
    fontSize: 12,
    fontStyle: "italic" as const,
  },
});
