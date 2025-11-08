import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View, ActivityIndicator } from "react-native";
import { cyberpunkTheme } from "@/app/theme";
import { ReactNode } from "react";

interface CyberButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  glow?: boolean;
}

export default function CyberButton({
  onPress,
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  style,
  textStyle,
  glow = true,
}: CyberButtonProps) {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: cyberpunkTheme.colors.primary,
          borderColor: cyberpunkTheme.colors.primary,
          ...(glow && cyberpunkTheme.shadows.neonGlow),
        };
      case "secondary":
        return {
          backgroundColor: cyberpunkTheme.colors.secondary,
          borderColor: cyberpunkTheme.colors.secondary,
          ...(glow && cyberpunkTheme.shadows.pinkGlow),
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: cyberpunkTheme.colors.borderActive,
        };
      case "danger":
        return {
          backgroundColor: cyberpunkTheme.colors.danger,
          borderColor: cyberpunkTheme.colors.danger,
          ...(glow && cyberpunkTheme.shadows.pinkGlow),
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case "sm":
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case "md":
        return { paddingVertical: 14, paddingHorizontal: 24 };
      case "lg":
        return { paddingVertical: 18, paddingHorizontal: 32 };
      default:
        return {};
    }
  };

  const getTextColor = (): string => {
    if (disabled) return cyberpunkTheme.colors.textDisabled;
    if (variant === "outline" || variant === "ghost") return cyberpunkTheme.colors.primary;
    return cyberpunkTheme.colors.background;
  };

  const getTextSize = (): number => {
    switch (size) {
      case "sm":
        return 12;
      case "md":
        return 16;
      case "lg":
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={getTextColor()} />
        ) : (
          <>
            {icon && iconPosition === "left" && <View style={styles.iconLeft}><Text>{icon}</Text></View>}
            <Text
              style={[
                styles.text,
                { color: getTextColor(), fontSize: getTextSize() },
                textStyle,
              ]}
            >
              {children}
            </Text>
            {icon && iconPosition === "right" && <View style={styles.iconRight}><Text>{icon}</Text></View>}
          </>
        )}
      </View>
      <View style={styles.scanline} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: cyberpunkTheme.borderRadius.md,
    borderWidth: 2,
    overflow: "hidden" as const,
    position: "relative" as const,
  },
  content: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
  disabled: {
    opacity: 0.4,
  },
  scanline: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
