// This file ONLY exports the type, not the implementation
// It avoids Metro bundler trying to load backend dependencies into the frontend
// Using import type ensures we only get the type, not the runtime code

import type { AppRouter as AppRouterImpl } from "./app-router";

export type AppRouter = AppRouterImpl;
