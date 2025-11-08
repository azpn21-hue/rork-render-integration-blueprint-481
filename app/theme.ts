import { Platform } from "react-native";

export const cyberpunkTheme = {
  colors: {
    background: "#0A0A0F",
    backgroundCard: "#121218",
    backgroundElevated: "#1A1A24",
    backgroundOverlay: "rgba(10, 10, 15, 0.95)",
    
    primary: "#00FFF0",
    secondary: "#FF2E97",
    tertiary: "#BD00FF",
    accent: "#00D4FF",
    accentAlt: "#FFE900",
    success: "#00FF66",
    danger: "#FF2E97",
    warning: "#FFE900",
    
    text: "#FFFFFF",
    textSecondary: "#A0A0B0",
    textTertiary: "#606070",
    textDisabled: "#404050",
    
    border: "rgba(0, 255, 240, 0.2)",
    borderActive: "#00FFF0",
    borderFocus: "#FF2E97",
    
    glow: {
      cyan: "rgba(0, 255, 240, 0.5)",
      pink: "rgba(255, 46, 151, 0.5)",
      purple: "rgba(189, 0, 255, 0.5)",
      blue: "rgba(0, 212, 255, 0.5)",
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
      shadowColor: "#00FFF0",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 8,
    },
    pinkGlow: {
      shadowColor: "#FF2E97",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 12,
      elevation: 10,
    },
    purpleGlow: {
      shadowColor: "#BD00FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 15,
      elevation: 12,
    },
    subtle: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
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
