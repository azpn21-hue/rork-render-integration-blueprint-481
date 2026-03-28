#!/bin/bash

echo "🔧 Fixing bundling error..."
echo ""

# Step 1: Clear Metro bundler cache
echo "📦 Step 1: Clearing Metro bundler cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
echo "✅ Metro cache cleared"
echo ""

# Step 2: Clear watchman (if installed)
echo "👀 Step 2: Clearing watchman..."
if command -v watchman &> /dev/null; then
    watchman watch-del-all 2>/dev/null || true
    echo "✅ Watchman cleared"
else
    echo "⏭️  Watchman not installed, skipping..."
fi
echo ""

# Step 3: Reinstall node_modules
echo "📚 Step 3: Reinstalling dependencies..."
rm -rf node_modules
rm -f bun.lock
bun install
echo "✅ Dependencies reinstalled"
echo ""

# Step 4: Clear Expo cache
echo "🧹 Step 4: Clearing Expo cache..."
npx expo start --clear 2>/dev/null &
EXPO_PID=$!
sleep 2
kill $EXPO_PID 2>/dev/null || true
echo "✅ Expo cache cleared"
echo ""

echo "✨ All done! Try starting the app again with:"
echo "   bun start"
