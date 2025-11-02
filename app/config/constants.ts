export const APP_CONFIG = {
  name: "R3AL Connection",
  version: "1.0.0",
  optimaMode: "prod",
  optimaName: "Optima II",
} as const;

export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "https://rork-gateway.onrender.com",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const RENDER_CONFIG = {
  serviceName: "rork-gateway",
  region: "virginia",
  healthCheckPath: "/health",
} as const;

export const AUTH_STORAGE_KEYS = {
  user: "@r3al_user",
  token: "@r3al_token",
  ndaAccepted: "@r3al_nda_accepted",
  devMode: "@r3al_dev_mode",
  verificationSkipped: "@r3al_verification_skipped",
} as const;

export const DEV_CREDENTIALS = {
  adminEmail: "admin@r3al.app",
  adminPassword: "R3alDev2025!",
} as const;
