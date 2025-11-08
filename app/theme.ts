import { Platform } from "react-native";

export const cyberpunkTheme = {
  colors: {
    background: "#0A0E1A",
    backgroundCard: "#121827",
    backgroundElevated: "#1A2332",
    backgroundOverlay: "rgba(10, 14, 26, 0.98)",
    
    primary: "#00D9FF",
    secondary: "#FF2E97",
    tertiary: "#B794F6",
    accent: "#7C3AED",
    accentAlt: "#FFB800",
    success: "#00FF88",
    danger: "#FF3B5C",
    warning: "#FFB800",
    
    text: "#FFFFFF",
    textSecondary: "#A5B4C7",
    textTertiary: "#6B7C93",
    textDisabled: "#4A5568",
    
    border: "rgba(0, 217, 255, 0.12)",
    borderActive: "#00D9FF",
    borderFocus: "#7C3AED",
    
    glow: {
      cyan: "rgba(0, 217, 255, 0.5)",
      pink: "rgba(255, 46, 151, 0.5)",
      purple: "rgba(124, 58, 237, 0.5)",
      green: "rgba(0, 255, 136, 0.5)",
    },
  },
  fonts: {
    heading: Platform.select({ 
      default: "System", 
      web: "'Rajdhani', 'Orbitron', 'Exo 2', monospace" 
    }) as string,
    body: Platform.select({ 
      default: "System", 
      web: "'Roboto', 'Inter', system-ui" 
    }) as string,
    mono: Platform.select({ 
      default: "Courier", 
      web: "'Roboto Mono', 'Fira Code', monospace" 
    }) as string,
  },
  shadows: {
    neonGlow: {
      shadowColor: "#00D9FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 12,
      elevation: 8,
    },
    pinkGlow: {
      shadowColor: "#FF2E97",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 14,
      elevation: 10,
    },
    purpleGlow: {
      shadowColor: "#7C3AED",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 14,
      elevation: 10,
    },
    greenGlow: {
      shadowColor: "#00FF88",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 12,
      elevation: 8,
    },
    subtle: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  animations: {
    fast: 200,
    normal: 400,
    slow: 600,
    pulse: 1000,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  borderWidth: {
    thin: 1,
    normal: 2,
    thick: 3,
  },
} as const;

export type Theme = typeof cyberpunkTheme;
export const theme = cyberpunkTheme;
