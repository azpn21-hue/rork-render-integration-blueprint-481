// ============================================================
// OPTIMA BRIDGE — Optima-Core Connector (v1.0)
// Provides secure communication between R3AL front-end and Optima-Core
// ============================================================

const BASE_URL = process.env.EXPO_PUBLIC_OPTIMA_API_URL || "https://optima-core-backend.onrender.com";
const API_KEY = process.env.EXPO_PUBLIC_OPTIMA_API_KEY || "rnd_w0obVzrvycssNp2SbIA3q2sbZZW0";

async function apiRequest<T = any>(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body?: any
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`[Optima Bridge] Request failed for ${endpoint}:`, error?.message || error);
    throw error;
  }
}

// === AUTH ===
export const registerUser = async (username: string, password: string, email: string) => {
  return apiRequest("/auth/register", "POST", { username, password, email });
};

export const loginUser = async (username: string, password: string) => {
  return apiRequest("/auth/login", "POST", { username, password });
};

// === HEALTH & PULSE ===
export const getHealth = async () => {
  return apiRequest("/health");
};

export const sendPulse = async (user: string, mood: string, interaction: string) => {
  return apiRequest("/pulse", "POST", { user, mood, interaction });
};

// === HIVE & MARKET ===
export const sendHiveEvent = async (user: string, networkData: object) => {
  return apiRequest("/hive", "POST", { user, networkData });
};

export const createNFT = async (owner: string, tokenData: object) => {
  return apiRequest("/market/nft", "POST", { owner, tokenData });
};
