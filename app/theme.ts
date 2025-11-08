import { Platform } from "react-native";

export const cyberpunkTheme = {
  colors: {
    background: "#0B0B12",
    backgroundCard: "#13131C",
    backgroundElevated: "#1C1C28",
    backgroundOverlay: "rgba(11, 11, 18, 0.96)",
    
    primary: "#00E5CC",
    secondary: "#FF6B9D",
    tertiary: "#A855F7",
    accent: "#06B6D4",
    accentAlt: "#FBBF24",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    
    text: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textTertiary: "#94A3B8",
    textDisabled: "#475569",
    
    border: "rgba(0, 229, 204, 0.15)",
    borderActive: "#00E5CC",
    borderFocus: "#A855F7",
    
    glow: {
      cyan: "rgba(0, 229, 204, 0.4)",
      pink: "rgba(255, 107, 157, 0.4)",
      purple: "rgba(168, 85, 247, 0.4)",
      blue: "rgba(6, 182, 212, 0.4)",
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
      shadowColor: "#00E5CC",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 6,
    },
    pinkGlow: {
      shadowColor: "#FF6B9D",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 8,
    },
    purpleGlow: {
      shadowColor: "#A855F7",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 10,
    },
    subtle: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
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
