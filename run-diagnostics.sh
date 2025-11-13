#!/bin/bash

echo "🔍 R3AL Bundle Error Diagnostics"
echo "================================="
echo ""

# Run the diagnostic
node diagnose-bundle.js

echo ""
echo "🧪 Testing individual file imports..."
echo ""

# Test TypeScript compilation
echo "Testing TypeScript compilation..."
bunx tsc --noEmit --skipLibCheck 2>&1 | head -20

echo ""
echo "📦 Checking for common bundling issues..."
echo ""

# Check for circular dependencies
if command -v madge &> /dev/null; then
    echo "Checking circular dependencies..."
    madge --circular app 2>&1 | head -10
else
    echo "ℹ️  Install madge for circular dependency detection: bun add -d madge"
fi

echo ""
echo "🔍 Checking Metro cache..."
ls -la $TMPDIR/metro-* 2>/dev/null || echo "   ✅ No Metro cache found"

echo ""
echo "🔍 Checking Expo cache..."
ls -la .expo 2>/dev/null || echo "   ✅ No .expo cache found"

echo ""
echo "================================="
echo "Next steps:"
echo "1. Run: chmod +x BUNDLING_FIX_FINAL.sh"
echo "2. Run: ./BUNDLING_FIX_FINAL.sh"
echo ""
