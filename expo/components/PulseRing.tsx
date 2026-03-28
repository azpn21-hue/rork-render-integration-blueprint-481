import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { cyberpunkTheme } from "@/app/theme";

interface PulseRingProps {
  color: "green" | "blue" | "crimson" | "gold" | "orange" | "teal" | "cyan" | "pink" | "purple";
  intensity?: number;
  size?: number;
  variant?: "default" | "neon" | "cyber";
}

export default function PulseRing({ 
  color, 
  intensity = 1, 
  size = 200,
  variant = "neon" 
}: PulseRingProps) {
  const pulseAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800 * intensity,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.85,
            duration: 800 * intensity,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 800 * intensity,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800 * intensity,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800 * intensity,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 800 * intensity,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    );

    pulse.start();
    if (variant === "cyber") {
      rotation.start();
    }

    return () => {
      pulse.stop();
      rotation.stop();
    };
  }, [pulseAnim, opacityAnim, rotateAnim, glowAnim, intensity, variant]);

  const colorMap = {
    green: cyberpunkTheme.colors.success,
    blue: cyberpunkTheme.colors.accent,
    crimson: cyberpunkTheme.colors.danger,
    gold: cyberpunkTheme.colors.accentAlt,
    orange: "#FF6B3D",
    teal: "#20B2AA",
    cyan: cyberpunkTheme.colors.primary,
    pink: cyberpunkTheme.colors.secondary,
    purple: cyberpunkTheme.colors.tertiary,
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const mainColor = colorMap[color];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.outerGlow,
          {
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: (size * 1.3) / 2,
            backgroundColor: mainColor,
            opacity: glowAnim.interpolate({
              inputRange: [0.5, 1],
              outputRange: [0.1, 0.25],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: mainColor,
            transform: [{ scale: pulseAnim }, { rotate: rotation }],
            opacity: opacityAnim.interpolate({
              inputRange: [0.4, 1],
              outputRange: [0.6, 1],
            }),
          },
        ]}
      />
      {variant === "cyber" && (
        <>
          <Animated.View
            style={[
              styles.hexRing,
              {
                width: size * 0.85,
                height: size * 0.85,
                borderRadius: size * 0.1,
                borderColor: mainColor,
                opacity: opacityAnim.interpolate({
                  inputRange: [0.4, 1],
                  outputRange: [0.3, 0.7],
                }),
                transform: [{ rotate: rotation }],
              },
            ]}
          />
        </>
      )}
      <Animated.View
        style={[
          styles.innerRing,
          {
            width: size * 0.65,
            height: size * 0.65,
            borderRadius: (size * 0.65) / 2,
            borderColor: mainColor,
            opacity: opacityAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.core,
          {
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: (size * 0.35) / 2,
            backgroundColor: mainColor,
            opacity: glowAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.innerCore,
          {
            width: size * 0.15,
            height: size * 0.15,
            borderRadius: (size * 0.15) / 2,
            backgroundColor: "#FFFFFF",
            opacity: glowAnim.interpolate({
              inputRange: [0.5, 1],
              outputRange: [0.8, 1],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  outerGlow: {
    position: "absolute" as const,
  },
  ring: {
    position: "absolute" as const,
    borderWidth: 3,
  },
  hexRing: {
    position: "absolute" as const,
    borderWidth: 2,
  },
  innerRing: {
    position: "absolute" as const,
    borderWidth: 2,
  },
  core: {
    position: "absolute" as const,
  },
  innerCore: {
    position: "absolute" as const,
  },
});
