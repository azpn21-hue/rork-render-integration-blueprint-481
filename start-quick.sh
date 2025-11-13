#!/bin/bash

# Quick Start Script - No bunx required

echo "🚀 R3AL App - Quick Start"
echo "=========================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    if command -v bun &> /dev/null; then
        echo "Using bun..."
        bun install
    else
        echo "Using npm..."
        npm install
    fi
fi

# Quick cache clear
echo "Clearing caches..."
rm -rf node_modules/.cache 2>/dev/null
rm -rf .expo 2>/dev/null
pkill -f metro 2>/dev/null

echo ""
echo "✅ Ready to start!"
echo ""

# Start with npx (works everywhere, no bunx needed)
echo "Starting Expo with npx..."
npx expo start --clear
