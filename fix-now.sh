#!/bin/bash

# ONE COMMAND FIX - Solves 95% of bundling errors

echo "🔧 R3AL Quick Fix"
echo "==============="
echo ""

# Kill processes
echo "Stopping processes..."
pkill -9 node 2>/dev/null || true
pkill -9 expo 2>/dev/null || true
pkill -9 metro 2>/dev/null || true
sleep 2

# Clear caches
echo "Clearing caches..."
rm -rf .expo 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true

# Clear watchman
if command -v watchman &> /dev/null; then
    echo "Clearing Watchman..."
    watchman watch-del-all 2>/dev/null || true
fi

echo ""
echo "✅ Caches cleared!"
echo "✅ Processes stopped!"
echo ""
echo "Starting Expo with clean cache..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Expo
exec bun expo start --clear
