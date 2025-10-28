import { Platform } from "react-native";

export const theme = {
  colors: {
    background: "#0D0F1A",
    card: "#1F2937",
    accent: "#FFC845",
    sensor: "#2CE7E1",
    white: "#FFFFFF",
    muted: "#94A3B8",
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
      shadowColor: "#FFC845",
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
