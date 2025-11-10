#!/bin/bash

echo "🚨 BUNDLING ERROR FIX SCRIPT"
echo "===================================="
echo ""

# Step 1: Check package.json for invalid zod version
echo "🔍 Step 1: Checking package.json for invalid Zod version..."
if grep -q '"zod": "^4' package.json; then
    echo "❌ FOUND: Invalid Zod version 4.x (this version doesn't exist!)"
    echo "✏️  Fixing: Changing to Zod 3.23.8..."
    
    # Create backup
    cp package.json package.json.backup
    
    # Fix the version
    sed -i.bak 's/"zod": "\^4\.[0-9]*\.[0-9]*"/"zod": "^3.23.8"/g' package.json
    rm package.json.bak
    
    echo "✅ Fixed! package.json updated"
    echo "   📋 Backup saved as: package.json.backup"
else
    echo "✅ Zod version looks okay"
fi
echo ""

# Step 2: Kill running processes
echo "🛑 Step 2: Killing existing processes..."
pkill -f "metro" || true
pkill -f "expo start" || true
pkill -f "expo" || true
sleep 1
echo "✅ Processes killed"
echo ""

# Step 3: Clean everything
echo "🧹 Step 3: Cleaning all caches and dependencies..."
rm -rf node_modules
rm -rf .expo
rm -rf bun.lock
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
echo "✅ Everything cleaned"
echo ""

# Step 4: Clear watchman
if command -v watchman &> /dev/null; then
    echo "👀 Step 4: Clearing watchman..."
    watchman watch-del-all 2>/dev/null || true
    echo "✅ Watchman cleared"
else
    echo "⏭️  Step 4: Watchman not installed, skipping..."
fi
echo ""

# Step 5: Reinstall dependencies
echo "📦 Step 5: Reinstalling dependencies (this may take a minute)..."
bun install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    echo "   Try running: bun install manually"
    exit 1
fi
echo ""

# Step 6: Success message
echo "===================================="
echo "✨ FIX COMPLETE!"
echo "===================================="
echo ""
echo "Now try starting your app:"
echo "   bun start"
echo ""
echo "The bundling error should be fixed now!"
echo ""
