import axios from "axios";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:10000";
    }
  }
  
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }
  
  return "http://localhost:10000";
};

const getAIBaseUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:9000";
    }
  }
  
  if (process.env.EXPO_PUBLIC_AI_BASE_URL) {
    return process.env.EXPO_PUBLIC_AI_BASE_URL;
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
