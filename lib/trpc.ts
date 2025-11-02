import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:10000";
    }
    return window.location.origin;
  }
  
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  return "http://localhost:10000";
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: (url, options) => {
        console.log("[tRPC] Request:", url);
        return fetch(url, {
          ...options,
          signal: options?.signal,
          headers: {
            ...options?.headers,
            "Content-Type": "application/json",
          },
        }).then(async (response) => {
          if (!response.ok) {
            const text = await response.text();
            console.error("[tRPC] Response error:", response.status, text);
            throw new Error(`HTTP ${response.status}: ${text.substring(0, 100)}`);
          }
          return response;
        }).catch((error) => {
          console.error("[tRPC] Fetch failed:", error.message);
          throw error;
        });
      },
    }),
  ],
});
