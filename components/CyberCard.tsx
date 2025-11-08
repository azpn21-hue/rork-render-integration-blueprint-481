import { View, StyleSheet, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { cyberpunkTheme } from "@/app/theme";

interface CyberCardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "neon" | "hologram";
  glowColor?: "cyan" | "pink" | "purple" | "blue";
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function CyberCard({
  children,
  variant = "default",
  glowColor = "cyan",
  style,
  noPadding = false,
}: CyberCardProps) {
  const getGlowColor = () => {
    switch (glowColor) {
      case "cyan":
        return cyberpunkTheme.colors.primary;
      case "pink":
        return cyberpunkTheme.colors.secondary;
      case "purple":
        return cyberpunkTheme.colors.tertiary;
      case "blue":
        return cyberpunkTheme.colors.accent;
      default:
        return cyberpunkTheme.colors.primary;
    }
  };

  const getVariantStyles = (): ViewStyle => {
    const baseGlow = getGlowColor();
    
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: cyberpunkTheme.colors.backgroundElevated,
          borderColor: cyberpunkTheme.colors.border,
          ...cyberpunkTheme.shadows.subtle,
        };
      case "neon":
        return {
          backgroundColor: cyberpunkTheme.colors.backgroundCard,
          borderColor: baseGlow,
          shadowColor: baseGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 12,
          elevation: 8,
        };
      case "hologram":
        return {
          backgroundColor: "transparent",
          borderColor: baseGlow + "80",
        };
      default:
        return {
          backgroundColor: cyberpunkTheme.colors.backgroundCard,
          borderColor: cyberpunkTheme.colors.border,
        };
    }
  };

  if (variant === "hologram") {
    return (
      <View style={[styles.container, getVariantStyles(), style]}>
        <LinearGradient
          colors={[
            cyberpunkTheme.colors.backgroundCard + "40",
            cyberpunkTheme.colors.backgroundCard + "10",
            cyberpunkTheme.colors.backgroundCard + "40",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hologramGradient}
        >
          <View style={noPadding ? undefined : styles.content}>
            {children}
          </View>
        </LinearGradient>
        <View style={[styles.scanlineOverlay, { borderColor: getGlowColor() + "30" }]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, getVariantStyles(), style]}>
      <View style={noPadding ? undefined : styles.content}>
        {children}
      </View>
      <View style={styles.cornerTopLeft} />
      <View style={styles.cornerTopRight} />
      <View style={styles.cornerBottomLeft} />
      <View style={styles.cornerBottomRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: cyberpunkTheme.borderRadius.lg,
    borderWidth: 2,
    overflow: "hidden" as const,
    position: "relative" as const,
  },
  content: {
    padding: cyberpunkTheme.spacing.md,
  },
  hologramGradient: {
    width: "100%",
    height: "100%",
  },
  scanlineOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: cyberpunkTheme.borderRadius.lg,
    pointerEvents: "none" as const,
  },
  cornerTopLeft: {
    position: "absolute" as const,
    top: -1,
    left: -1,
    width: 12,
    height: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: cyberpunkTheme.colors.primary,
    borderTopLeftRadius: cyberpunkTheme.borderRadius.md,
  },
  cornerTopRight: {
    position: "absolute" as const,
    top: -1,
    right: -1,
    width: 12,
    height: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: cyberpunkTheme.colors.primary,
    borderTopRightRadius: cyberpunkTheme.borderRadius.md,
  },
  cornerBottomLeft: {
    position: "absolute" as const,
    bottom: -1,
    left: -1,
    width: 12,
    height: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: cyberpunkTheme.colors.primary,
    borderBottomLeftRadius: cyberpunkTheme.borderRadius.md,
  },
  cornerBottomRight: {
    position: "absolute" as const,
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: cyberpunkTheme.colors.primary,
    borderBottomRightRadius: cyberpunkTheme.borderRadius.md,
  },
});
