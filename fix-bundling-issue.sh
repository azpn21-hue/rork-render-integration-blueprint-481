#!/bin/bash

echo "🛠️  Fixing bundling issue - comprehensive cleanup"
echo ""

# Kill all running processes
echo "🛑 Stopping all running processes..."
pkill -f "metro" || true
pkill -f "expo" || true
pkill -f "node" || true
sleep 2

# Clear all cache directories
echo "🧹 Clearing all caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true

# Clear Metro bundler cache
echo "🧹 Clearing Metro bundler cache..."
rm -rf /tmp/metro-bundler-cache-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

# Clear watchman if available
if command -v watchman &> /dev/null; then
    echo "🧹 Clearing watchman..."
    watchman watch-del-all 2>/dev/null || true
fi

# Clear Expo cache
echo "🧹 Clearing Expo cache..."
rm -rf ~/.expo/cache 2>/dev/null || true

echo ""
echo "✅ All caches cleared successfully!"
echo ""
echo "🚀 Starting dev server with clean slate..."
echo ""

# Start fresh with cache clear flag
bun expo start --clear --reset-cache
