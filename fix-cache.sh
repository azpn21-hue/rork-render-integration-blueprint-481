#!/bin/bash

echo "🧹 Clearing Metro bundler cache..."

# Kill any running Metro processes
pkill -f "metro" || true
pkill -f "expo" || true

# Clear Metro cache
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

# Clear watchman if available
if command -v watchman &> /dev/null; then
    echo "🧹 Clearing watchman..."
    watchman watch-del-all 2>/dev/null || true
fi

echo "✅ Cache cleared!"
echo "🚀 Restarting dev server..."

# Start fresh
bun expo start --clear
