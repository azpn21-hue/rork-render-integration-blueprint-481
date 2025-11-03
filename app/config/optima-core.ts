/**
 * Optima-Core Configuration
 * Central orchestration layer for Hive, Pulse, NFT Market, and Optima AI Assistant
 */

export const optimaCoreConfig = {
  system: {
    name: "Optima-Core",
    version: "1.0.0",
    maintainer: "R3AL Systems / Rork Integration Team",
    environment: process.env.EXPO_PUBLIC_OPTIMA_ENV || "production",
    description:
      "Unified backend for Optima's data intelligence, relationship AI, NFT credential registry, and real-time behavioral tracking systems.",
  },
  backend: {
    language: "Python 3.10.11",
    framework: "FastAPI + Uvicorn",
    entrypoint: "app:app",
    port: 8080,
  },
  gcp: {
    projectId: process.env.EXPO_PUBLIC_OPTIMA_GCP_PROJECT_ID || "civic-origin-476705-j8",
    projectName: "optima-core-dev",
    region: process.env.EXPO_PUBLIC_OPTIMA_GCP_REGION || "us-central1",
    services: [
      "vertex_ai",
      "cloud_storage",
      "firestore",
      "bigquery",
      "pubsub",
      "looker",
    ],
  },
  routes: {
    root: "/",
    health: "/health",
    pulse: "/pulse",
    auth: {
      register: "/auth/register",
      login: "/auth/login",
    },
    hive: "/hive",
    market: {
      nft: "/market/nft",
    },
  },
} as const;

/**
 * Get Optima-Core Base URL based on environment
 */
export const getOptimaCoreBaseUrl = (): string => {
  // Web environment detection
  if (typeof window !== "undefined") {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8080";
    }
  }

  // Environment variable override
  if (process.env.EXPO_PUBLIC_OPTIMA_CORE_URL) {
    return process.env.EXPO_PUBLIC_OPTIMA_CORE_URL;
  }

  // Default production URL (update when Render deployment is ready)
  return "https://optima-core-backend.onrender.com";
};

export const OPTIMA_CORE_BASE_URL = getOptimaCoreBaseUrl();

console.log("[Optima-Core] Backend URL:", OPTIMA_CORE_BASE_URL);
