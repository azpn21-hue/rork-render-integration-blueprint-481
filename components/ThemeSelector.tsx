import React, { useMemo, useRef, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Animated, Platform } from "react-native";
import { ALL_THEMES, useTheme } from "@/app/contexts/ThemeContext";
import { Palette } from "lucide-react-native";

export default function ThemeSelector() {
  const { setThemeName, themeName, theme } = useTheme();
  const options = useMemo(() => ALL_THEMES, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]} testID="theme-selector">
      <View style={styles.header}>
        <Palette color={theme.accent} size={20} />
        <Text style={[styles.title, { color: theme.text }]}>Mood</Text>
      </View>
      <View style={styles.row}>
        {options.map((t) => {
          const isActive = themeName === t;
          return (
            <ThemePill
              key={t}
              themeName={t}
              isActive={isActive}
              onPress={() => setThemeName(t)}
              currentTheme={theme}
            />
          );
        })}
      </View>
    </View>
  );
}

interface ThemePillProps {
  themeName: string;
  isActive: boolean;
  onPress: () => void;
  currentTheme: any;
}

function ThemePill({ themeName, isActive, onPress, currentTheme }: ThemePillProps) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.95)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.95,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: isActive ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1 : 0.95,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.pillWrapper,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.pill,
          {
            backgroundColor: isActive ? currentTheme.accent : currentTheme.surfaceHover,
            borderColor: isActive ? currentTheme.accent : currentTheme.border,
          },
        ]}
        android_ripple={{ color: currentTheme.accentGlow + "40" }}
        testID={`theme-pill-${themeName}`}
      >
        <Text
          style={[
            styles.label,
            {
              color: isActive ? (themeName === "Ink" ? currentTheme.background : "#FFFFFF") : currentTheme.textSecondary,
              fontWeight: isActive ? "700" : "500",
            },
          ]}
        >
          {themeName}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "700" as const,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  pillWrapper: {
    flex: 1,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
});
