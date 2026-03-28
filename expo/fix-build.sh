#!/bin/bash

echo "🔧 Fixing React Native bundling issues..."

# Stop any running Metro processes
echo "Stopping Metro bundler..."
pkill -f "metro" || true
pkill -f "expo" || true

# Clear all caches
echo "Clearing all caches..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Clear watchman
echo "Clearing watchman..."
watchman watch-del-all 2>/dev/null || echo "Watchman not installed (not required)"

# Clear Expo cache
echo "Clearing Expo cache..."
bunx expo start --clear 2>/dev/null &
EXPO_PID=$!
sleep 2
kill $EXPO_PID 2>/dev/null || true

echo "✅ Cache cleared successfully!"
echo ""
echo "Now you can run:"
echo "  bun start"
echo ""
