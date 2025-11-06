import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:10000";
    }

    if (hostname.includes('.rork.live') || hostname.includes('.rork.app') || hostname.includes('.rorktest.dev')) {
      const baseUrl = window.location.origin;
      console.log("[tRPC] Detected Rork platform, using origin:", baseUrl);
      return baseUrl;
    }

    console.log("[tRPC] Using window.location.origin:", window.location.origin);
    return window.location.origin;
  }

  const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0 && !envUrl.includes('localhost')) {
    console.log("[tRPC] Using EXPO_PUBLIC_RORK_API_BASE_URL:", envUrl);
    return envUrl.replace(/\/$/, "");
  }

  console.log("[tRPC] Defaulting to localhost:10000");
  return "http://localhost:10000";
};

let backendHealthChecked = false;
let backendIsHealthy = false;

const checkBackendHealth = async () => {
  if (backendHealthChecked) return backendIsHealthy;
  
  try {
    const baseUrl = getBaseUrl();
    console.log("[tRPC] Checking backend health at:", `${baseUrl}/health`);
    
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    backendIsHealthy = response.ok;
    backendHealthChecked = true;
    
    if (backendIsHealthy) {
      console.log("[tRPC] ✅ Backend is healthy");
      
      const routesResponse = await fetch(`${baseUrl}/api/routes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (routesResponse.ok) {
        const routesData = await routesResponse.json();
        console.log("[tRPC] Available routes:", routesData.routes);
      }
    } else {
      console.error("[tRPC] ❌ Backend health check failed:", response.status);
    }
  } catch (error: any) {
    console.error("[tRPC] ❌ Backend health check error:", error.message);
    backendIsHealthy = false;
    backendHealthChecked = true;
  }
  
  return backendIsHealthy;
};

const requestQueue: (() => Promise<Response>)[] = [];
let isProcessingQueue = false;
const MAX_CONCURRENT_REQUESTS = 1;
let activeRequests = 0;

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS) {
    const request = requestQueue.shift();
    if (request) {
      activeRequests++;
      request()
        .finally(() => {
          activeRequests--;
        });
      await new Promise(r => setTimeout(r, 500));
    }
  }

  isProcessingQueue = false;
}

const requestCache = new Map<string, { data: Response; timestamp: number }>();
const CACHE_DURATION = 5000;

async function fetchWithRetry(url: RequestInfo | URL, options: RequestInit | undefined, attempt = 1): Promise<Response> {
  const urlString = typeof url === 'string' ? url : url.toString();

  const cacheKey = `${urlString}_${options?.method || 'GET'}`;
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("[tRPC] Using cached response for:", urlString);
    return cached.data.clone();
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
  }

  await new Promise(resolve => {
    requestQueue.push(async () => {
      resolve(undefined);
      return new Response();
    });
    processQueue();
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
      },
    });

    if (response.status === 429 || response.status === 503) {
      const maxAttempts = 1;
      if (attempt < maxAttempts) {
        const baseDelay = 5000;
        const jitter = Math.floor(Math.random() * 2000);
        const delay = Math.min(15000, baseDelay * Math.pow(2, attempt - 1)) + jitter;
        console.warn(`[tRPC] ${response.status} received. Retrying attempt ${attempt}/${maxAttempts} in ${delay}ms →`, urlString);
        await new Promise((r) => setTimeout(r, delay));
        return fetchWithRetry(url, options, attempt + 1);
      }
      console.error(`[tRPC] Rate limited. Backing off for`, urlString);
      throw new Error(`HTTP ${response.status}: Too many requests. Please wait a moment and try again.`);
    }

    if (!response.ok) {
      const text = await response.text();
      console.error("[tRPC] Response error:", response.status, "Body:", text.substring(0, 200));
      throw new Error(`HTTP ${response.status}: ${response.statusText || text.substring(0, 100)}`);
    }

    requestCache.set(cacheKey, { data: response.clone(), timestamp: Date.now() });

    return response;
  } catch (error: any) {
    if (error.message?.includes('Too many requests')) {
      throw error;
    }
    console.error("[tRPC] ❌ Fetch failed for:", urlString);
    console.error("[tRPC] Error:", error.message);
    if (attempt === 1) {
      const delay = 2000 + Math.floor(Math.random() * 1000);
      console.warn(`[tRPC] Network error. Retrying in ${delay}ms (attempt ${attempt}/1) →`, urlString);
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw error;
  }
}

const client = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (url, options) => {
        const urlString = typeof url === 'string' ? url : url.toString();
        console.log("[tRPC] Request:", urlString, "Method:", options?.method || 'GET');
        console.log("[tRPC] Base URL:", getBaseUrl());
        
        await checkBackendHealth();
        
        if (!backendIsHealthy) {
          console.warn("[tRPC] ⚠️  Backend might not be available. Attempting request anyway...");
        }
        
        const res = await fetchWithRetry(url, options);
        console.log("[tRPC] ✅ Request successful:", urlString, "Status:", res.status);
        return res;
      },
    }),
  ],
});

export const trpcClient = client;
