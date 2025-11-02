import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, Vibration, Platform } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { User, Award, Settings, LogOut, ShieldAlert, Camera, AlertTriangle, Hexagon, MessageCircle } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import { useTutorial } from "@/app/contexts/TutorialContext";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { OptimaAssistant } from "@/components/OptimaAssistant";
import { useScreenshotDetection } from "@/hooks/useScreenshotDetection";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import { useEffect } from "react";

export default function R3alHome() {
  const router = useRouter();
  const { userProfile, truthScore, resetR3al, addCaptureEvent, security, isRestricted, clearStrikes } = useR3al();
  const { shouldAutoStart, startTutorial } = useTutorial();

  // Enable screenshot detection for this screen
  useScreenshotDetection({
    screenName: 'home',
    enabled: true,
    showAlert: true,
    preventCapture: false,
  });

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

  const handleTestScreenshot = () => {
    console.log('🎬 [Home] Simulating screenshot detection...');

    // Haptic feedback - strong warning pattern
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (Platform.OS === 'android') {
      Vibration.vibrate([0, 200, 100, 200]);
    }

    // Add capture event to history
    addCaptureEvent({
      screen: 'home',
      timestamp: new Date().toISOString(),
      status: 'recorded',
    });

    // Show enhanced alert
    Alert.alert(
      '🛡️ Privacy Shield Triggered (Test)',
      `Screenshot detected on home\n\nThis content is protected. The capture has been logged and the content owner has been notified.\n\nRepeated violations may result in account restrictions.\n\nCheck "Content Capture History" to see the logged event.`,
      [
        { 
          text: 'I Understand',
          style: 'cancel'
        },
        {
          text: 'View History',
          onPress: () => router.push('/r3al/security/capture-history')
        }
      ],
      { cancelable: false }
    );
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

          {security && security.captureStrikes > 0 && (
            <View style={[styles.warningCard, security.captureStrikes >= 3 && styles.warningCardDanger]} testID="security-warning">
              <View style={styles.warningHeader}>
                <AlertTriangle 
                  size={28} 
                  color={security.captureStrikes >= 3 ? tokens.colors.error : tokens.colors.warning} 
                  strokeWidth={2} 
                />
                <Text style={[styles.warningTitle, security.captureStrikes >= 3 && styles.warningTitleDanger]}>
                  {security.captureStrikes >= 3 ? 'Account Restricted' : 'Privacy Warning'}
                </Text>
              </View>
              <Text style={styles.warningText}>
                {security?.captureStrikes >= 3 && security?.restrictionUntil
                  ? `Your account has been restricted due to ${security.captureStrikes} screenshot violations. Restriction expires on ${new Date(security.restrictionUntil).toLocaleString()}.`
                  : `You have ${security?.captureStrikes || 0} of 3 screenshot strikes. Further violations will result in a 24-hour restriction.`
                }
              </Text>
              <View style={styles.strikeIndicator}>
                {[1, 2, 3].map((i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.strikeDot,
                      i <= security.captureStrikes && styles.strikeDotActive,
                      i <= security.captureStrikes && security.captureStrikes >= 3 && styles.strikeDotDanger
                    ]} 
                  />
                ))}
              </View>
            </View>
          )}

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
              onPress={() => router.push("/r3al/qotd/index")}
              activeOpacity={0.7}
              testID="qotd-btn"
            >
              <MessageCircle size={24} color={tokens.colors.gold} strokeWidth={1.5} />
              <Text style={styles.actionText}>Question of the Day</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/r3al/hive/index")}
              activeOpacity={0.7}
              testID="nft-hive-btn"
            >
              <Hexagon size={24} color={tokens.colors.gold} strokeWidth={1.5} />
              <Text style={styles.actionText}>NFT Hive - Create, Trade & Gift</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/r3al/profile/view")}
              activeOpacity={0.7}
              testID="edit-profile-btn"
            >
              <User size={24} color={tokens.colors.gold} strokeWidth={1.5} />
              <Text style={styles.actionText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/r3al/security/capture-history")}
              activeOpacity={0.7}
              testID="capture-history-btn"
            >
              <ShieldAlert size={24} color={tokens.colors.gold} strokeWidth={1.5} />
              <Text style={styles.actionText}>Content Capture History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonTest]}
              onPress={handleTestScreenshot}
              activeOpacity={0.7}
              testID="test-screenshot-btn"
            >
              <Camera size={24} color={tokens.colors.warning} strokeWidth={1.5} />
              <Text style={[styles.actionText, styles.actionTextTest]}>Test Screenshot Alarm</Text>
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
  actionButtonTest: {
    borderColor: tokens.colors.warning,
  },
  actionText: {
    fontSize: 16,
    color: tokens.colors.text,
  },
  actionTextDanger: {
    color: tokens.colors.error,
  },
  actionTextTest: {
    color: tokens.colors.warning,
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
  warningCard: {
    backgroundColor: tokens.colors.warning + '15',
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.warning,
    marginBottom: 24,
  },
  warningCardDanger: {
    backgroundColor: tokens.colors.error + '15',
    borderColor: tokens.colors.error,
  },
  warningHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.warning,
  },
  warningTitleDanger: {
    color: tokens.colors.error,
  },
  warningText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  strikeIndicator: {
    flexDirection: "row" as const,
    justifyContent: "center",
    gap: 12,
  },
  strikeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.textSecondary,
  },
  strikeDotActive: {
    backgroundColor: tokens.colors.warning,
    borderColor: tokens.colors.warning,
  },
  strikeDotDanger: {
    backgroundColor: tokens.colors.error,
    borderColor: tokens.colors.error,
  },
});
