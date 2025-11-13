// Frontend type definitions for tRPC router
// NOTE: This file should only contain TYPE imports, never runtime imports
// The actual router is only used on the backend

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// Create a placeholder type that matches the backend router structure
// This avoids importing the actual backend code into the frontend bundle
export type AppRouter = any;

// Helper types for usage in frontend
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
