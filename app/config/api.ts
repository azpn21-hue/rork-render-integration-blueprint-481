import axios from "axios";

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  
  if (envUrl && envUrl.trim().length > 0) {
    const cleanUrl = envUrl.replace(/\/$/, "");
    if (!cleanUrl.includes('localhost') || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))) {
      return cleanUrl;
    }
  }
  
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:10000";
    }
  }
  
  return "http://localhost:10000";
};

const getAIBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_AI_BASE_URL;
  
  if (envUrl && envUrl.trim().length > 0) {
    const cleanUrl = envUrl.replace(/\/$/, "");
    if (!cleanUrl.includes('localhost') || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))) {
      return cleanUrl;
    }
  }
  
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:9000";
    }
  }
  
  return "http://localhost:9000";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const ai = axios.create({
  baseURL: getAIBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000,
});

console.log("[API] Backend Base URL:", api.defaults.baseURL);
console.log("[API] AI Gateway Base URL:", ai.defaults.baseURL);
