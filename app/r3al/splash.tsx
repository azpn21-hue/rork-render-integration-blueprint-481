import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function R3alSplash() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const pulseDuration = tokens.animations.pulse_duration_ms;
    const pulseScale = tokens.animations.pulse_scale;
    
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: pulseScale,
          duration: pulseDuration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: pulseDuration / 2,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    const navigationTimer = setTimeout(() => {
      router.replace("/r3al/onboarding/welcome");
    }, 3000);

    return () => {
      pulseAnimation.stop();
      clearTimeout(navigationTimer);
    };
  }, [pulseAnim, fadeAnim, router]);

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.secondary]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>R3AL</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.mottoContainer, { opacity: fadeAnim }]}>
        <Text style={styles.motto}>Reveal • Relate • Respect</Text>
        <View style={styles.pulseIndicator}>
          <Animated.View
            style={[
              styles.pulseDot,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Text style={styles.bpmText}>60 BPM</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: tokens.colors.gold,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: tokens.colors.goldLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold" as const,
    color: tokens.colors.secondary,
    letterSpacing: 2,
  },
  mottoContainer: {
    position: "absolute" as const,
    bottom: 100,
    alignItems: "center",
  },
  motto: {
    fontSize: 18,
    color: tokens.colors.gold,
    letterSpacing: 1,
    marginBottom: 20,
  },
  pulseIndicator: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: tokens.colors.accent,
  },
  bpmText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
});
