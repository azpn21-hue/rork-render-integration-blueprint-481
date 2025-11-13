#!/bin/bash

echo "🧹 Clearing all caches and temporary files..."

# Kill any running Metro bundler processes
echo "1. Stopping any running Metro processes..."
pkill -f "expo start" || true
pkill -f "metro" || true
sleep 2

# Clear Metro bundler cache
echo "2. Clearing Metro bundler cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

# Clear npm/bun cache
echo "3. Clearing package manager cache..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf .cache 2>/dev/null || true

# Clear React Native cache
echo "4. Clearing React Native cache..."
rm -rf $HOME/.expo
rm -rf $HOME/Library/Caches/Expo 2>/dev/null || true

# Clear watchman if available
echo "5. Clearing Watchman cache (if available)..."
watchman watch-del-all 2>/dev/null || echo "   Watchman not installed, skipping..."

echo ""
echo "✅ All caches cleared!"
echo ""
echo "🚀 Starting Expo with clean slate..."
echo ""

# Start Expo with cleared cache
bunx expo start --clear

