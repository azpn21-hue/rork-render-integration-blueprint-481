import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { User, Award, Settings, LogOut } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import { useTutorial } from "@/app/contexts/TutorialContext";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { OptimaAssistant } from "@/components/OptimaAssistant";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import { useEffect } from "react";

export default function R3alHome() {
  const router = useRouter();
  const { userProfile, truthScore, resetR3al } = useR3al();
  const { shouldAutoStart, startTutorial } = useTutorial();

  useEffect(() => {
    if (shouldAutoStart("home_tour")) {
      setTimeout(() => {
        startTutorial("home_tour");
      }, 500);
    }
  }, [shouldAutoStart, startTutorial]);


  const handleReset = () => {
    resetR3al();
    router.replace("/r3al/splash");
  };

  return (
    <>
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header} testID="home-header">
            <Text style={styles.greeting}>Welcome Back</Text>
            <Text style={styles.title}>{userProfile?.name || "User"}</Text>
          </View>

          {truthScore && (
            <View style={styles.scoreCard} testID="truth-score-card">
              <View style={styles.scoreHeader}>
                <Award size={32} color={tokens.colors.gold} strokeWidth={1.5} />
                <Text style={styles.scoreLabel}>Your Truth Score</Text>
              </View>
              <Text style={styles.scoreValue}>{truthScore.score}</Text>
              <Text style={styles.scoreLevel}>{truthScore.summary}</Text>
            </View>
          )}

          {userProfile?.bio && (
            <View style={styles.bioCard}>
              <Text style={styles.bioLabel}>About</Text>
              <Text style={styles.bioText}>{userProfile.bio}</Text>
            </View>
          )}

          <View style={styles.actions} testID="home-content">
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {}}
              activeOpacity={0.7}
              testID="edit-profile-btn"
            >
              <User size={24} color={tokens.colors.gold} strokeWidth={1.5} />
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {}}
              activeOpacity={0.7}
              testID="settings-btn"
            >
              <Settings size={24} color={tokens.colors.gold} strokeWidth={1.5} />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger]}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <LogOut size={24} color={tokens.colors.error} strokeWidth={1.5} />
              <Text style={[styles.actionText, styles.actionTextDanger]}>
                Start Over
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer} testID="home-footer">
            <Text style={styles.motto}>Reveal • Relate • Respect</Text>
            <Text style={styles.compliance}>Privacy Act of 1974 Compliant</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      </LinearGradient>
      
      <TutorialOverlay />
      <OptimaAssistant />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  scoreCard: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    marginBottom: 24,
  },
  scoreHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 18,
    color: tokens.colors.text,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  scoreLevel: {
    fontSize: 20,
    color: tokens.colors.goldLight,
  },
  bioCard: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    marginBottom: 24,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: tokens.colors.text,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  actionButtonDanger: {
    borderColor: tokens.colors.error,
  },
  actionText: {
    fontSize: 16,
    color: tokens.colors.text,
  },
  actionTextDanger: {
    color: tokens.colors.error,
  },
  footer: {
    marginTop: "auto" as const,
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
});
