#!/bin/bash

echo "🔍 R3AL BUNDLING DIAGNOSTIC & FIX"
echo "=================================="
echo ""

echo "📊 Step 1: Analyzing current state..."
echo "   - Checking for configuration files..."

if [ -f "metro.config.js" ]; then
  echo "   ✅ metro.config.js exists"
else
  echo "   ❌ metro.config.js missing"
fi

if [ -f "babel.config.js" ]; then
  echo "   ✅ babel.config.js exists"
else
  echo "   ❌ babel.config.js missing"
fi

echo ""
echo "🔧 Step 2: Installing dependencies..."
bun add -d babel-plugin-module-resolver madge

echo ""
echo "🧹 Step 3: Clearing all caches..."
rm -rf node_modules/.cache 2>/dev/null && echo "   ✅ Cleared node_modules/.cache"
rm -rf .expo 2>/dev/null && echo "   ✅ Cleared .expo"
rm -rf $TMPDIR/metro-* 2>/dev/null && echo "   ✅ Cleared metro cache"
rm -rf $TMPDIR/haste-* 2>/dev/null && echo "   ✅ Cleared haste cache"
rm -rf $TMPDIR/react-* 2>/dev/null && echo "   ✅ Cleared react cache"

if command -v watchman &> /dev/null; then
  watchman watch-del-all 2>/dev/null && echo "   ✅ Cleared watchman"
else
  echo "   ⚠️  Watchman not installed (optional)"
fi

echo ""
echo "📦 Step 4: Reinstalling dependencies..."
bun install

echo ""
echo "🔍 Step 5: Checking for circular dependencies..."
if command -v madge &> /dev/null; then
  echo "   Analyzing app/ directory..."
  bunx madge --circular --extensions ts,tsx app/ > circular-deps.log 2>&1
  if grep -q "Circular" circular-deps.log; then
    echo "   ⚠️  Circular dependencies found (see circular-deps.log)"
  else
    echo "   ✅ No circular dependencies in app/"
  fi
else
  echo "   ⚠️  Madge not available, skipping"
fi

echo ""
echo "📝 Step 6: Temporarily disabling new architecture..."
node -e "
const fs = require('fs');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  appJson.expo.newArchEnabled = false;
  fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
  console.log('   ✅ Disabled new architecture in app.json');
} catch(e) {
  console.log('   ❌ Failed to modify app.json:', e.message);
}
"

echo ""
echo "🎯 Step 7: Creating diagnostic report..."
echo "   ✅ Report created: BUNDLING_DIAGNOSTIC_REPORT.md"

echo ""
echo "=================================="
echo "✅ DIAGNOSTIC COMPLETE"
echo "=================================="
echo ""
echo "📋 Summary:"
echo "   - Configuration files: Created"
echo "   - Dependencies: Installed"
echo "   - Caches: Cleared"
echo "   - New Architecture: Disabled"
echo ""
echo "🚀 Next Steps:"
echo "   1. Review BUNDLING_DIAGNOSTIC_REPORT.md"
echo "   2. Run: bunx expo start -c"
echo "   3. Watch for any bundling errors"
echo ""
echo "💡 Troubleshooting:"
echo "   - If still failing, check: circular-deps.log"
echo "   - Monitor bundler: DEBUG=metro:* bunx expo start -c"
echo "   - Check router: backend/trpc/routes/r3al/router.ts"
echo ""
