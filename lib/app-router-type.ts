// Frontend-safe type definitions for tRPC router
// This file defines the router type structure without importing backend code
// It will be kept in sync with the actual backend router manually or via codegen

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// Placeholder type that matches the structure of the backend router
// The actual implementation is in backend/trpc/app-router.ts
// This is a workaround to prevent Metro from bundling backend dependencies
export type AppRouter = {
  _def: {
    _config: {
      transformer: true;
      errorShape: any;
      allowOutsideOfServer: boolean;
      isServer: boolean;
      isDev: boolean;
    };
    router: true;
    procedures: Record<string, any>;
    record: Record<string, any>;
    queries: Record<string, any>;
    mutations: Record<string, any>;
    subscriptions: Record<string, any>;
  };
};

// Helper types for usage in frontend
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
