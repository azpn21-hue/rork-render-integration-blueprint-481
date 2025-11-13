#!/bin/bash

echo "🔧 R3AL Bundling Fix - Final Resolution"
echo "========================================"
echo ""

# Kill any running processes
echo "1️⃣ Stopping all Node/Expo processes..."
pkill -f "node" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 2

# Clear all caches
echo ""
echo "2️⃣ Clearing all caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .expo 2>/dev/null || true
rm -rf dist 2>/dev/null || true
rm -rf .next 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf ~/.expo/cache 2>/dev/null || true

# Clear watchman if available
if command -v watchman &> /dev/null; then
    echo "   → Clearing Watchman..."
    watchman watch-del-all 2>/dev/null || true
fi

echo ""
echo "3️⃣ Reinstalling dependencies..."
rm -rf node_modules
rm -f bun.lock
bun install

echo ""
echo "4️⃣ Starting clean build..."
echo ""
echo "   ⚠️  If this fails, check for:"
echo "      • Syntax errors in TypeScript files"
echo "      • Missing or incorrect imports"
echo "      • Circular dependencies"
echo ""

# Start with clean slate
NODE_ENV=development bun expo start --clear

