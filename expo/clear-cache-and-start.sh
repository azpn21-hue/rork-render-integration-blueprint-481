#!/bin/bash

echo "🧹 Clearing all caches and restarting..."
echo ""

# Stop all Metro/Expo processes
echo "1️⃣ Stopping all Metro/Expo processes..."
pkill -9 -f "metro" 2>/dev/null || true
pkill -9 -f "expo" 2>/dev/null || true
pkill -9 -f "node.*expo" 2>/dev/null || true
sleep 1

# Clear Expo cache
echo "2️⃣ Clearing Expo cache..."
rm -rf .expo 2>/dev/null || true

# Clear node_modules cache
echo "3️⃣ Clearing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || true

# Clear system temp directories
echo "4️⃣ Clearing system temp caches..."
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

# Clear watchman if available
if command -v watchman &> /dev/null; then
    echo "5️⃣ Clearing Watchman cache..."
    watchman watch-del-all 2>/dev/null || true
fi

# Clear Bun cache
echo "6️⃣ Clearing Bun cache..."
rm -rf node_modules/.cache/bun 2>/dev/null || true

# Clear any Metro configuration cache
echo "7️⃣ Clearing Metro config cache..."
rm -rf .metro 2>/dev/null || true

echo ""
echo "✅ All caches cleared!"
echo ""
echo "🚀 Starting Expo with --clear flag..."
echo ""

# Start with clear flag
bunx expo start --clear --tunnel
