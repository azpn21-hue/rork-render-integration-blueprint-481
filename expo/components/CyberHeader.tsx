import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { cyberpunkTheme } from "@/app/theme";
import { ReactNode } from "react";

interface CyberHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: ReactNode;
  style?: ViewStyle;
  variant?: "default" | "minimal" | "accent";
}

export default function CyberHeader({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightElement,
  style,
  variant = "default",
}: CyberHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "minimal":
        return {
          borderBottomWidth: 0,
          backgroundColor: "transparent" as const,
        };
      case "accent":
        return {
          borderBottomColor: cyberpunkTheme.colors.primary,
          borderBottomWidth: 2,
        };
      default:
        return {
          borderBottomColor: cyberpunkTheme.colors.border,
          borderBottomWidth: 1,
        };
    }
  };

  return (
    <View style={[styles.container, getVariantStyles(), style]}>
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <View style={styles.backButtonInner}>
              <ArrowLeft
                size={22}
                color={cyberpunkTheme.colors.primary}
                strokeWidth={2.5}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <View style={styles.glowLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: cyberpunkTheme.colors.backgroundCard,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "relative" as const,
  },
  content: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  backButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: cyberpunkTheme.colors.background,
    borderWidth: 1.5,
    borderColor: cyberpunkTheme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 44,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: cyberpunkTheme.colors.text,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    textShadowColor: cyberpunkTheme.colors.glow.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: cyberpunkTheme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  rightElement: {
    minWidth: 44,
    alignItems: "flex-end",
  },
  glowLine: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: cyberpunkTheme.colors.primary,
    opacity: 0.3,
  },
});
