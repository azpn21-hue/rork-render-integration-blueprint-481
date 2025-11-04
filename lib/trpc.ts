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

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: (url, options) => {
        const urlString = typeof url === 'string' ? url : url.toString();
        console.log("[tRPC] Request:", urlString, "Method:", options?.method || 'GET');
        console.log("[tRPC] Base URL:", getBaseUrl());
        
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
            console.error("[tRPC] Response error:", response.status, "Body:", text.substring(0, 200));
            
            if (response.status === 404) {
              console.error("[tRPC] 404 Error - Route not found. Check if backend is running and route exists.");
              console.error("[tRPC] Requested URL:", urlString);
            }
            
            throw new Error(`HTTP ${response.status}: ${response.statusText || text.substring(0, 100)}`);
          }
          console.log("[tRPC] Request successful:", urlString);
          return response;
        }).catch((error) => {
          console.error("[tRPC] Fetch failed for:", urlString);
          console.error("[tRPC] Error:", error.message);
          console.error("[tRPC] Error stack:", error.stack);
          throw error;
        });
      },
    }),
  ],
});
