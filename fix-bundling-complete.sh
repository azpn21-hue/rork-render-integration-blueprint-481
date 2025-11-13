#!/bin/bash

echo "🔧 Comprehensive React Native Bundling Fix"
echo "==========================================="
echo ""

# Stop all running processes
echo "1️⃣ Stopping all running processes..."
pkill -f "metro" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true
pkill -f "react-native" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true
sleep 2

# Clear all caches
echo ""
echo "2️⃣ Clearing all caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .expo 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/metro-cache-* 2>/dev/null || true
rm -rf ~/.expo/metro-cache 2>/dev/null || true

# Clear watchman if available
echo ""
echo "3️⃣ Clearing watchman..."
if command -v watchman &> /dev/null; then
    watchman watch-del-all
    echo "   ✅ Watchman cleared"
else
    echo "   ⚠️  Watchman not installed (optional)"
fi

# Clear Expo cache
echo ""
echo "4️⃣ Clearing Expo internal cache..."
rm -rf ~/.expo/cache 2>/dev/null || true

# Reset iOS Simulator (if on Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo ""
    echo "5️⃣ Resetting iOS Simulator..."
    xcrun simctl erase all 2>/dev/null || echo "   ⚠️  Could not reset simulators (optional)"
fi

# Clear Bun cache
echo ""
echo "6️⃣ Clearing Bun cache..."
rm -rf ~/.bun/install/cache 2>/dev/null || true

echo ""
echo "✅ All caches cleared successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Now run one of these commands to start:"
echo ""
echo "  For mobile:"
echo "    bun start"
echo ""
echo "  For web:"
echo "    bun start-web"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
