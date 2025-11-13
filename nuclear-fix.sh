#!/bin/bash

# Nuclear Option - Complete Reset
# Use this only if all other fixes failed

echo "☢️  NUCLEAR OPTION - Complete Reset"
echo "===================================="
echo ""
echo "This will completely reset your development environment."
echo "Press Ctrl+C within 5 seconds to cancel..."
echo ""

# Countdown
for i in 5 4 3 2 1; do
    echo "   $i..."
    sleep 1
done

echo ""
echo "🚀 Starting complete reset..."
echo ""

# Stop ALL processes
echo "1️⃣ Stopping ALL processes..."
killall -9 node 2>/dev/null || true
killall -9 expo 2>/dev/null || true
killall -9 metro 2>/dev/null || true
killall -9 bun 2>/dev/null || true
killall -9 watchman 2>/dev/null || true
sleep 3

# Remove ALL build artifacts and caches
echo "2️⃣ Removing ALL caches and build artifacts..."
rm -rf node_modules
rm -rf .expo
rm -rf dist
rm -rf build
rm -rf .next
rm -rf node_modules/.cache
rm -f bun.lock
rm -f package-lock.json
rm -f yarn.lock

# Clear temp directories
echo "3️⃣ Clearing temporary directories..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/expo-* 2>/dev/null || true

# Clear user caches
echo "4️⃣ Clearing user caches..."
rm -rf ~/.expo/cache 2>/dev/null || true
rm -rf ~/.expo/metro-cache 2>/dev/null || true
rm -rf ~/Library/Caches/Expo 2>/dev/null || true

# Clear watchman
echo "5️⃣ Clearing Watchman..."
if command -v watchman &> /dev/null; then
    watchman watch-del-all 2>/dev/null || true
    rm -rf ~/.watchman 2>/dev/null || true
fi

# Reinstall from scratch
echo "6️⃣ Reinstalling dependencies..."
echo "   (This may take a few minutes...)"
bun install

# Verify installation
if [ ! -d "node_modules" ]; then
    echo ""
    echo "❌ Installation failed!"
    echo "   Try running: bun install"
    exit 1
fi

echo ""
echo "✅ Reset complete!"
echo ""
echo "7️⃣ Starting Expo with completely clean slate..."
echo ""
echo "═══════════════════════════════════════════"
echo "   If this still fails, check for:"
echo "   • Syntax errors in your TypeScript files"
echo "   • Missing files that are being imported"
echo "   • Circular dependencies"
echo ""
echo "   Run: bunx tsc --noEmit"
echo "   To check for TypeScript errors"
echo "═══════════════════════════════════════════"
echo ""

# Start with maximum cleanliness
exec bun expo start --clear --reset-cache

