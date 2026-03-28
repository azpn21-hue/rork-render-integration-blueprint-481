// CRITICAL: This file uses type-only import to prevent bundling backend code
// Metro bundler will strip this import at build time since it's type-only
// Do NOT change "import type" to "import" or it will break the build

export type { AppRouter } from "./app-router";
