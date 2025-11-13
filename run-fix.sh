#!/bin/bash

# ============================================================================
# 🎯 BUNDLING ERROR - ONE-LINE FIX
# ============================================================================

echo ""
echo "🚨 FIXING BUNDLING ERROR..."
echo ""

# Make scripts executable
chmod +x FIX_BUNDLING_NOW.sh 2>/dev/null
chmod +x CRITICAL_BUNDLING_FIX.sh 2>/dev/null

# Run the comprehensive fix
if [ -f "FIX_BUNDLING_NOW.sh" ]; then
  echo "✅ Running FIX_BUNDLING_NOW.sh..."
  ./FIX_BUNDLING_NOW.sh
else
  echo "❌ FIX_BUNDLING_NOW.sh not found!"
  echo "Please run the fix manually. See FIX_SUMMARY.md"
  exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ FIX COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Start your app now:"
echo ""
echo "   bunx expo start -c"
echo ""
echo "📖 For more info, see: FIX_SUMMARY.md"
echo ""
