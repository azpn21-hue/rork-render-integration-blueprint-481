// Frontend type definitions for tRPC router
// Imports the actual router type from backend

import type { appRouter } from "@/backend/trpc/app-router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type AppRouter = typeof appRouter;

// Helper types for usage in frontend
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
