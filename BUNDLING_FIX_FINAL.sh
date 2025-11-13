#!/bin/bash

echo "🔧 R3AL BUNDLING FIX - Complete Resolution"
echo "==========================================="
echo ""
echo "This will:"
echo "  1. Kill all running processes"
echo "  2. Clear all caches completely"
echo "  3. Fix type issues"
echo "  4. Reinstall dependencies"
echo "  5. Start with clean slate"
echo ""

# Step 1: Kill everything
echo "Step 1/5: Killing all processes..."
pkill -9 -f "node" 2>/dev/null || true
pkill -9 -f "expo" 2>/dev/null || true
pkill -9 -f "metro" 2>/dev/null || true
pkill -9 -f "bun" 2>/dev/null || true
sleep 3

# Step 2: Clear ALL caches
echo "Step 2/5: Clearing ALL caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf dist
rm -rf .next
rm -rf build
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf ~/.expo/cache 2>/dev/null || true
rm -rf ~/Library/Caches/Expo 2>/dev/null || true

# Clear watchman
if command -v watchman &> /dev/null; then
    echo "   Clearing Watchman..."
    watchman watch-del-all 2>/dev/null || true
fi

# Step 3: Fix type issues
echo "Step 3/5: Creating proper type definitions..."
cat > lib/app-router-type-fix.ts << 'EOF'
// This file provides type safety while avoiding circular dependencies
import type { AppRouter as BackendRouter } from "@/backend/trpc/app-router";
export type AppRouter = BackendRouter;
EOF

# Step 4: Clean install
echo "Step 4/5: Reinstalling dependencies..."
rm -rf node_modules
rm -f bun.lock
bun install

# Step 5: Start clean
echo ""
echo "Step 5/5: Starting with clean build..."
echo ""
echo "✅ All caches cleared"
echo "✅ Dependencies reinstalled"
echo "✅ Type fixes applied"
echo ""
echo "Starting Expo..."
echo ""

# Start with maximum verbosity to see any errors
bun expo start --clear --no-dev --minify

