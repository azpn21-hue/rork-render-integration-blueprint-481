#!/bin/bash

# R3AL App Startup Script
# This script clears cache and starts the Expo development server

echo "🚀 Starting R3AL App..."
echo "Clearing cache..."

# Clear various caches
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

echo "✅ Cache cleared"
echo "Starting Expo..."

# Start Expo with cache clearing
npx expo start --clear

