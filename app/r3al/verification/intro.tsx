import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Shield, Camera, User, CheckCircle, Lock, LogIn } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import locales from "@/schemas/r3al/locale_tokens.json";
import { AUTH_STORAGE_KEYS } from "@/app/config/constants";

export default function VerificationIntro() {
  const router = useRouter();
  const t = locales.en;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const checkDevMode = async () => {
      const devMode = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.devMode);
      setIsDevMode(devMode === "true");
    };
    checkDevMode();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [fadeAnim, scaleAnim, pulseAnim]);

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View 
            style={[
              styles.iconContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.shieldBg}>
              <Shield size={80} color={tokens.colors.gold} strokeWidth={1.5} />
            </View>
          </Animated.View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{t.verify_id_title}</Text>
            <Text style={styles.instructions}>{t.verify_id_instructions}</Text>
          </View>

          <View style={styles.steps}>
            <View style={styles.step}>
              <View style={styles.stepIconContainer}>
                <Camera size={24} color={tokens.colors.gold} strokeWidth={2} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t.document_capture_title}</Text>
                <Text style={styles.stepDescription}>Capture your government-issued ID</Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.step}>
              <View style={styles.stepIconContainer}>
                <User size={24} color={tokens.colors.gold} strokeWidth={2} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t.biometric_capture_title}</Text>
                <Text style={styles.stepDescription}>Take a selfie for biometric match</Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.step}>
              <View style={styles.stepIconContainer}>
                <CheckCircle size={24} color={tokens.colors.gold} strokeWidth={2} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Verify & Secure</Text>
                <Text style={styles.stepDescription}>AI-powered identity verification</Text>
              </View>
            </View>
          </View>

          <View style={styles.securityNote}>
            <Lock size={16} color={tokens.colors.textSecondary} strokeWidth={2} />
            <Text style={styles.securityText}>
              Your data is encrypted and never shared without consent
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log("[VerificationIntro] Begin verification → /r3al/verification");
                router.push("/r3al/verification");
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t.begin_verification}</Text>
            </TouchableOpacity>

            {isDevMode && (
              <TouchableOpacity
                style={styles.devButton}
                onPress={() => {
                  console.log("[VerificationIntro] Dev mode → /login");
                  router.push("/login");
                }}
                activeOpacity={0.8}
              >
                <LogIn size={20} color={tokens.colors.text} strokeWidth={2} />
                <Text style={styles.devButtonText}>Dev Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  shieldBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,215,0,0.1)",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
    textAlign: "center",
  },
  instructions: {
    fontSize: 15,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  steps: {
    gap: 8,
    paddingHorizontal: 8,
  },
  step: {
    flexDirection: "row" as const,
    alignItems: "flex-start",
    gap: 16,
    paddingVertical: 8,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,215,0,0.1)",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.text,
  },
  stepDescription: {
    fontSize: 13,
    color: tokens.colors.textSecondary,
    lineHeight: 18,
  },
  stepDivider: {
    height: 20,
    width: 2,
    backgroundColor: "rgba(255,215,0,0.3)",
    marginLeft: 23,
  },
  securityNote: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,215,0,0.05)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.2)",
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: tokens.colors.textSecondary,
    lineHeight: 16,
  },
  button: {
    backgroundColor: tokens.colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
    shadowColor: tokens.colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: tokens.colors.secondary,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    gap: 12,
  },
  devButton: {
    backgroundColor: "rgba(255,215,0,0.1)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  devButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.text,
  },
});
