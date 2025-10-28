import createContextHook from "@nkzw/create-context-hook";
import React, { useEffect, useMemo, useState } from "react";
import { Animated, Appearance, Easing, Platform, View } from "react-native";

export type ThemeName = "Faith" | "Fire" | "Logic" | "Shadow" | "Ascend";

export interface PulseTheme {
  name: ThemeName;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  card: string;
}

const THEMES: Record<ThemeName, PulseTheme> = {
  Faith: {
    name: "Faith",
    primary: "#F7F8FA",
    accent: "#61DBFB",
    text: "#0B0B0D",
    muted: "#6B7280",
    card: "#EAECEF",
  },
  Fire: {
    name: "Fire",
    primary: "#0B0B0D",
    accent: "#FF3B3B",
    text: "#FFFFFF",
    muted: "#9CA3AF",
    card: "#16171B",
  },
  Logic: {
    name: "Logic",
    primary: "#0E1013",
    accent: "#00C1D4",
    text: "#E5E7EB",
    muted: "#9CA3AF",
    card: "#15181D",
  },
  Shadow: {
    name: "Shadow",
    primary: "#050505",
    accent: "#B884F6",
    text: "#E5E7EB",
    muted: "#9CA3AF",
    card: "#0C0C0E",
  },
  Ascend: {
    name: "Ascend",
    primary: "#111216",
    accent: "#E5C558",
    text: "#F9FAFB",
    muted: "#A3A3A3",
    card: "#181A1F",
  },
};

interface ThemeContextValue {
  theme: PulseTheme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  glow: Animated.Value;
}

export const [ThemeProvider, useTheme] = createContextHook<ThemeContextValue>(() => {
  const colorScheme = Appearance.getColorScheme();
  const initial: ThemeName = colorScheme === "dark" ? "Fire" : "Faith";
  const [themeName, setThemeName] = useState<ThemeName>(initial);
  const theme = useMemo(() => THEMES[themeName], [themeName]);

  const [glow] = useState<Animated.Value>(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== "web",
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);

  return { theme, themeName, setThemeName, glow };
});

export function ThemedRoot({ children }: { children: React.ReactNode }) {
  const { theme, glow } = useTheme();
  const shadowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.45] });
  const shadowRadius = glow.interpolate({ inputRange: [0, 1], outputRange: [6, 18] });

  return (
    <Animated.View
      testID="themed-root"
      style={{ flex: 1, backgroundColor: theme.primary, shadowColor: theme.accent, shadowOpacity, shadowRadius }}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </Animated.View>
  );
}

export const ALL_THEMES: ThemeName[] = ["Faith", "Fire", "Logic", "Shadow", "Ascend"];