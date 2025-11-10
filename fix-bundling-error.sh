#!/bin/bash

echo "🔧 Fixing 'Bundling failed without error'..."
echo ""

# Kill any running Metro processes
echo "🛑 Killing existing Metro processes..."
pkill -f "metro" || true
pkill -f "expo start" || true
sleep 1
echo "✅ Processes killed"
echo ""

# Clear all caches
echo "🧹 Clearing all caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true
echo "✅ Caches cleared"
echo ""

# Clear watchman if available
if command -v watchman &> /dev/null; then
    echo "👀 Clearing watchman..."
    watchman watch-del-all 2>/dev/null || true
    echo "✅ Watchman cleared"
    echo ""
fi

echo "✨ Done! Now try:"
echo "   bun start"
echo ""
echo "If the error persists, run:"
echo "   rm -rf node_modules bun.lock && bun install"
