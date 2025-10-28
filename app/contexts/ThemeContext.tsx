import createContextHook from "@nkzw/create-context-hook";
import React, { useEffect, useMemo, useState } from "react";
import { Animated, Appearance, Easing, Platform, View } from "react-native";

export type ThemeName = "R3AL" | "Sovereign" | "Phantom" | "Royal" | "Midnight";

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
  R3AL: {
    name: "R3AL",
    background: "#000000",
    backgroundSecondary: "#0A0A0A",
    surface: "#121212",
    surfaceHover: "#1A1A1A",
    accent: "#D4891F",
    accentGlow: "#F5A842",
    text: "#FFFFFF",
    textSecondary: "#E8E8E8",
    textMuted: "#8A8A8A",
    border: "#2A2A2A",
    borderLight: "#1A1A1A",
    overlay: "rgba(0, 0, 0, 0.96)",
    gradient: ["#000000", "#1A1206"],
    photoOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(212,137,31,0.1) 100%)",
  },
  Sovereign: {
    name: "Sovereign",
    background: "#0D0D0D",
    backgroundSecondary: "#141414",
    surface: "#1C1C1C",
    surfaceHover: "#252525",
    accent: "#E5C558",
    accentGlow: "#F4D982",
    text: "#F8F8F8",
    textSecondary: "#E0E0E0",
    textMuted: "#999999",
    border: "#333333",
    borderLight: "#242424",
    overlay: "rgba(13, 13, 13, 0.95)",
    gradient: ["#0D0D0D", "#1C1810"],
    photoOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(229,197,88,0.08) 100%)",
  },
  Phantom: {
    name: "Phantom",
    background: "#050505",
    backgroundSecondary: "#0F0F0F",
    surface: "#161616",
    surfaceHover: "#1F1F1F",
    accent: "#00C1D4",
    accentGlow: "#3DE0F0",
    text: "#FAFAFA",
    textSecondary: "#E5E5E5",
    textMuted: "#7A7A7A",
    border: "#282828",
    borderLight: "#1A1A1A",
    overlay: "rgba(5, 5, 5, 0.97)",
    gradient: ["#050505", "#0A1214"],
    photoOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,193,212,0.06) 100%)",
  },
  Royal: {
    name: "Royal",
    background: "#08080A",
    backgroundSecondary: "#11111A",
    surface: "#1A1A24",
    surfaceHover: "#24242E",
    accent: "#B8860B",
    accentGlow: "#DAA520",
    text: "#FFFFFF",
    textSecondary: "#EBEBEB",
    textMuted: "#8F8F8F",
    border: "#2D2D37",
    borderLight: "#1E1E28",
    overlay: "rgba(8, 8, 10, 0.96)",
    gradient: ["#08080A", "#141408"],
    photoOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(184,134,11,0.1) 100%)",
  },
  Midnight: {
    name: "Midnight",
    background: "#000000",
    backgroundSecondary: "#0C0C10",
    surface: "#151519",
    surfaceHover: "#1E1E22",
    accent: "#FF6B35",
    accentGlow: "#FF8F66",
    text: "#FFFFFF",
    textSecondary: "#E6E6E6",
    textMuted: "#8C8C8C",
    border: "#2B2B2F",
    borderLight: "#1C1C20",
    overlay: "rgba(0, 0, 0, 0.95)",
    gradient: ["#000000", "#1A0C06"],
    photoOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255,107,53,0.08) 100%)",
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
  const initial: ThemeName = "R3AL";
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
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
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

export const ALL_THEMES: ThemeName[] = ["R3AL", "Sovereign", "Phantom", "Royal", "Midnight"];