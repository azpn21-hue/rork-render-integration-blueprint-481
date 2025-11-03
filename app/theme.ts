import { Platform } from "react-native";

export const theme = {
  colors: {
    background: "#000000",
    card: "#121212",
    accent: "#FF6B3D",
    sensor: "#20B2AA",
    white: "#FFFFFF",
    muted: "#8A8A8A",
  },
  fonts: {
    heading: Platform.select({ default: "System", web: "system-ui" }) as string,
    body: Platform.select({ default: "System", web: "system-ui" }) as string,
    micro: Platform.select({ default: "System", web: "system-ui" }) as string,
  },
  shadows: {
    card: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    button: {
      shadowColor: "#FF6B3D",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 12,
    },
  },
  animations: {
    pulse: 400,
    ripple: 600,
  },
} as const;

export type Theme = typeof theme;
