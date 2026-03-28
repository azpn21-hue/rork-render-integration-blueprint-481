#!/bin/bash

# Quick fix script for bundling errors
echo "🚀 Quick Fix: Clearing caches and restarting..."
echo ""

# Kill all processes
pkill -f metro 2>/dev/null
pkill -f expo 2>/dev/null

# Clear caches
rm -rf .expo node_modules/.cache $TMPDIR/react-* $TMPDIR/metro-* 2>/dev/null

# Clear watchman if exists
watchman watch-del-all 2>/dev/null || true

echo "✅ Done! Now run: bun start --clear"
