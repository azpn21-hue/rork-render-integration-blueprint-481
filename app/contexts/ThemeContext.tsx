import createContextHook from "@nkzw/create-context-hook";
import React, { useEffect, useMemo, useState } from "react";
import { Animated, Appearance, Easing, Platform, View } from "react-native";

export type ThemeName = "Midnight" | "Carbon" | "Obsidian" | "Velvet" | "Ink";

export interface PrivateTheme {
  name: ThemeName;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceHover: string;
  accent: string;
  accentGlow: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  overlay: string;
  gradient: [string, string];
  photoOverlay: string;
}

const THEMES: Record<ThemeName, PrivateTheme> = {
  Midnight: {
    name: "Midnight",
    background: "#0A0B0F",
    backgroundSecondary: "#12141A",
    surface: "#1A1C24",
    surfaceHover: "#22252F",
    accent: "#FF4757",
    accentGlow: "#FF6B7A",
    text: "#FFFFFF",
    textSecondary: "#E0E2E8",
    textMuted: "#8B8E98",
    border: "#2A2D37",
    borderLight: "#1F2129",
    overlay: "rgba(10, 11, 15, 0.92)",
    gradient: ["#0A0B0F", "#1A1C24"],
    photoOverlay: "rgba(0, 0, 0, 0.15)",
  },
  Carbon: {
    name: "Carbon",
    background: "#0D0D0D",
    backgroundSecondary: "#161616",
    surface: "#1F1F1F",
    surfaceHover: "#2A2A2A",
    accent: "#00D4FF",
    accentGlow: "#3DE0FF",
    text: "#F5F5F5",
    textSecondary: "#D4D4D4",
    textMuted: "#8C8C8C",
    border: "#2E2E2E",
    borderLight: "#1F1F1F",
    overlay: "rgba(13, 13, 13, 0.94)",
    gradient: ["#0D0D0D", "#1F1F1F"],
    photoOverlay: "rgba(0, 0, 0, 0.2)",
  },
  Obsidian: {
    name: "Obsidian",
    background: "#080A12",
    backgroundSecondary: "#0F1219",
    surface: "#171B26",
    surfaceHover: "#1F2433",
    accent: "#A78BFA",
    accentGlow: "#C4B5FD",
    text: "#FAFAFA",
    textSecondary: "#E2E4EA",
    textMuted: "#898C95",
    border: "#262C3C",
    borderLight: "#1A1F2D",
    overlay: "rgba(8, 10, 18, 0.93)",
    gradient: ["#080A12", "#171B26"],
    photoOverlay: "rgba(0, 0, 0, 0.18)",
  },
  Velvet: {
    name: "Velvet",
    background: "#0F0811",
    backgroundSecondary: "#1A0F1F",
    surface: "#251A2D",
    surfaceHover: "#31243A",
    accent: "#F472B6",
    accentGlow: "#FBCFE8",
    text: "#FAF5FF",
    textSecondary: "#E9DFF5",
    textMuted: "#9D8AAA",
    border: "#3A2847",
    borderLight: "#2B1F37",
    overlay: "rgba(15, 8, 17, 0.94)",
    gradient: ["#0F0811", "#251A2D"],
    photoOverlay: "rgba(15, 8, 25, 0.15)",
  },
  Ink: {
    name: "Ink",
    background: "#050A14",
    backgroundSecondary: "#0A1220",
    surface: "#111C2E",
    surfaceHover: "#19263A",
    accent: "#FCD34D",
    accentGlow: "#FDE68A",
    text: "#F8FAFC",
    textSecondary: "#DDE3EA",
    textMuted: "#7B8594",
    border: "#1F2B3D",
    borderLight: "#14202F",
    overlay: "rgba(5, 10, 20, 0.95)",
    gradient: ["#050A14", "#111C2E"],
    photoOverlay: "rgba(0, 10, 25, 0.12)",
  },
};

interface ThemeContextValue {
  theme: PrivateTheme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  glow: Animated.Value;
  pulse: Animated.Value;
  springValue: Animated.Value;
}

export const [ThemeProvider, useTheme] = createContextHook<ThemeContextValue>(() => {
  const colorScheme = Appearance.getColorScheme();
  const initial: ThemeName = "Midnight";
  const [themeName, setThemeName] = useState<ThemeName>(initial);
  const theme = useMemo(() => THEMES[themeName], [themeName]);

  const [glow] = useState<Animated.Value>(() => new Animated.Value(0));
  const [pulse] = useState<Animated.Value>(() => new Animated.Value(1));
  const [springValue] = useState<Animated.Value>(() => new Animated.Value(0));

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
      ])
    );
    glowLoop.start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      glowLoop.stop();
      pulseLoop.stop();
    };
  }, [glow, pulse]);

  useEffect(() => {
    Animated.spring(springValue, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [themeName]);

  return { theme, themeName, setThemeName, glow, pulse, springValue };
});

export function ThemedRoot({ children }: { children: React.ReactNode }) {
  const { theme, glow } = useTheme();
  const shadowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.3] });
  const shadowRadius = glow.interpolate({ inputRange: [0, 1], outputRange: [10, 24] });

  return (
    <Animated.View
      testID="themed-root"
      style={{
        flex: 1,
        backgroundColor: theme.background,
        shadowColor: theme.accentGlow,
        shadowOpacity,
        shadowRadius,
      }}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </Animated.View>
  );
}

export const ALL_THEMES: ThemeName[] = ["Midnight", "Carbon", "Obsidian", "Velvet", "Ink"];