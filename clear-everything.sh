#!/bin/bash

# Complete Cache Clear Script for R3AL App

echo "🧹 Clearing all caches and temporary files..."

# Kill any running Metro processes
echo "Stopping Metro bundler..."
pkill -f metro 2>/dev/null
pkill -f "node.*expo" 2>/dev/null

# Clear Metro bundler cache
echo "Clearing Metro cache..."
rm -rf $TMPDIR/metro-* 2>/dev/null
rm -rf $TMPDIR/haste-* 2>/dev/null
rm -rf $TMPDIR/react-* 2>/dev/null

# Clear node_modules cache
echo "Clearing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null

# Clear Expo cache
echo "Clearing Expo cache..."
rm -rf .expo 2>/dev/null

# Clear watchman if available
if command -v watchman &> /dev/null; then
    echo "Clearing watchman..."
    watchman watch-del-all 2>/dev/null
fi

# Clear Yarn/npm cache (optional)
if [ "$1" == "--deep" ]; then
    echo "Deep clean: Removing node_modules..."
    rm -rf node_modules
    echo "Clearing npm cache..."
    npm cache clean --force 2>/dev/null
    echo "Reinstalling dependencies..."
    npm install
fi

echo "✅ Cache cleared successfully!"
echo ""
echo "Now you can start the app with:"
echo "  npx expo start --clear"
echo ""
echo "Or run: ./start-app.sh"
