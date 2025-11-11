#!/bin/bash

echo "🔧 Fixing Metro bundling error..."
echo ""

# Kill any existing Metro bundler processes
echo "1️⃣  Killing existing Metro processes..."
pkill -f "metro" || true
pkill -f "expo" || true

# Clear Metro cache
echo "2️⃣  Clearing Metro cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true

# Clear watchman if available
if command -v watchman &> /dev/null; then
    echo "3️⃣  Clearing Watchman cache..."
    watchman watch-del-all 2>/dev/null || true
fi

# Clear bun cache
echo "4️⃣  Clearing Bun cache..."
rm -rf node_modules/.cache/bun

echo ""
echo "✅ Cache cleared successfully!"
echo ""
echo "📱 Starting Expo with clean cache..."
echo ""

# Start Expo with --clear flag
bunx expo start --clear --tunnel

