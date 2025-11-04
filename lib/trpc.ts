import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    console.log("[tRPC] Using EXPO_PUBLIC_RORK_API_BASE_URL:", envUrl);
    return envUrl.replace(/\/$/, "");
  }

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

export const trpcClient = trpc.createClient({
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
        
        return fetch(url, {
          ...options,
          signal: options?.signal,
          headers: {
            ...options?.headers,
            "Content-Type": "application/json",
          },
        }).then(async (response) => {
          console.log("[tRPC] Response status:", response.status, "for", urlString);
          if (!response.ok) {
            const text = await response.text();
            
            if (response.status === 404) {
              console.warn("[tRPC] ⚠️  404 - Route not found:", urlString);
              console.warn("[tRPC] Backend URL:", getBaseUrl());
              console.warn("[tRPC] This is expected if the backend is not deployed or route is missing.");
              console.warn("[tRPC] App will continue with local state only.");
            } else {
              console.error("[tRPC] Response error:", response.status, "Body:", text.substring(0, 200));
            }
            
            throw new Error(`HTTP ${response.status}: ${response.statusText || text.substring(0, 100)}`);
          }
          console.log("[tRPC] ✅ Request successful:", urlString);
          return response;
        }).catch((error) => {
          if (error.message && error.message.includes('404')) {
            console.warn("[tRPC] ⚠️  Backend route unavailable - using local state");
          } else {
            console.error("[tRPC] ❌ Fetch failed for:", urlString);
            console.error("[tRPC] Error:", error.message);
          }
          throw error;
        });
      },
    }),
  ],
});
