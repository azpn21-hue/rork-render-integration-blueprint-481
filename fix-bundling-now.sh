#!/bin/bash

echo "🔧 Quick Fix for Bundling Error"
echo "================================"
echo ""

# Step 1: Kill any existing processes
echo "1️⃣  Stopping all Expo processes..."
pkill -9 -f "expo" || true
pkill -9 -f "metro" || true
pkill -9 -f "node.*8081" || true
sleep 2

# Step 2: Clear ALL caches
echo "2️⃣  Clearing all caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $HOME/.expo 2>/dev/null || true

# Step 3: Clear watchman
echo "3️⃣  Clearing watchman..."
watchman watch-del-all 2>/dev/null || echo "   (watchman not installed, skipping)"

# Step 4: Reset Metro config
echo "4️⃣  Resetting Metro bundler..."
rm -rf .metro-health-check* 2>/dev/null || true

echo ""
echo "✅ Caches cleared!"
echo ""
echo "🚀 Starting fresh..."
echo ""

# Start with clean slate
exec bunx expo start --clear
