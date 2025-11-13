#!/bin/bash

echo "🚨 CRITICAL BUNDLING FIX - R3AL APP"
echo "===================================="
echo ""
echo "⚠️  This script will fix the 'Bundling failed without error' issue"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

step=1

print_step() {
  echo ""
  echo "${GREEN}[$step/$total]${NC} $1"
  step=$((step+1))
}

total=8

print_step "🛑 Killing all node processes..."
pkill -9 node 2>/dev/null || true
pkill -9 expo 2>/dev/null || true
sleep 2
echo "   ✅ Processes killed"

print_step "🗑️  Removing ALL caches..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/expo-*
rm -rf ~/.expo
rm -rf .metro

if command -v watchman &> /dev/null; then
  watchman watch-del-all 2>/dev/null || true
  echo "   ✅ Watchman cleared"
fi
echo "   ✅ All caches removed"

print_step "📦 Installing missing dependencies..."
bun add -d babel-plugin-module-resolver
echo "   ✅ Dependencies installed"

print_step "⚙️  Checking configuration files..."

# Check if metro.config.js exists
if [ ! -f "metro.config.js" ]; then
  echo "${YELLOW}   ⚠️  metro.config.js not found - creating...${NC}"
  cat > metro.config.tmp << 'METROEOF'
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("sql");
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: { 
      experimentalImportSupport: false, 
      inlineRequires: true 
    },
  }),
};
module.exports = config;
METROEOF
  echo "${RED}   ❌ Cannot auto-create metro.config.js (protected)${NC}"
  echo "${YELLOW}   📋 Please create metro.config.js manually with content from metro.config.tmp${NC}"
else
  echo "   ✅ metro.config.js exists"
fi

# Check if babel.config.js exists
if [ ! -f "babel.config.js" ]; then
  echo "${YELLOW}   ⚠️  babel.config.js not found - creating template...${NC}"
  cat > babel.config.tmp << 'BABELEOF'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["module-resolver", {
        root: ["./"],
        alias: { "@": "./" },
      }],
      "react-native-reanimated/plugin",
    ],
  };
};
BABELEOF
  echo "${RED}   ❌ Cannot auto-create babel.config.js (protected)${NC}"
  echo "${YELLOW}   📋 Please create babel.config.js manually with content from babel.config.tmp${NC}"
else
  echo "   ✅ babel.config.js exists"
fi

print_step "🔧 Disabling new architecture (temporary fix)..."
node << 'NODESCRIPT'
const fs = require('fs');
try {
  const content = fs.readFileSync('app.json', 'utf8');
  const appJson = JSON.parse(content);
  if (appJson.expo.newArchEnabled === true) {
    appJson.expo.newArchEnabled = false;
    fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
    console.log('   ✅ New architecture disabled');
  } else {
    console.log('   ℹ️  New architecture already disabled');
  }
} catch(e) {
  console.log('   ❌ Failed:', e.message);
}
NODESCRIPT

print_step "🔍 Analyzing dependency tree..."
echo "   Checking backend/trpc/routes/r3al/router.ts..."
IMPORT_COUNT=$(grep -c "^import" backend/trpc/routes/r3al/router.ts 2>/dev/null || echo "0")
echo "   Found $IMPORT_COUNT imports in main router"
if [ "$IMPORT_COUNT" -gt "100" ]; then
  echo "${YELLOW}   ⚠️  WARNING: Very large router file (${IMPORT_COUNT} imports)${NC}"
  echo "${YELLOW}   This may cause bundling issues. Consider splitting into sub-routers.${NC}"
fi

print_step "🔄 Reinstalling node_modules..."
rm -rf node_modules
bun install
echo "   ✅ Reinstalled"

print_step "🎯 Starting app with clean slate..."
echo ""
echo "${GREEN}========================================${NC}"
echo "${GREEN}✅ FIX COMPLETE${NC}"
echo "${GREEN}========================================${NC}"
echo ""
echo "📋 ${YELLOW}Manual Steps Required:${NC}"
echo ""
if [ ! -f "metro.config.js" ]; then
  echo "   1️⃣  Create metro.config.js from metro.config.tmp"
fi
if [ ! -f "babel.config.js" ]; then
  echo "   2️⃣  Create babel.config.js from babel.config.tmp"
fi
echo ""
echo "🚀 ${GREEN}Start the app:${NC}"
echo "   ${YELLOW}bunx expo start -c${NC}"
echo ""
echo "🔍 ${GREEN}Debug mode:${NC}"
echo "   ${YELLOW}DEBUG=metro:* bunx expo start -c${NC}"
echo ""
echo "📖 ${GREEN}Read the full report:${NC}"
echo "   ${YELLOW}cat BUNDLING_DIAGNOSTIC_REPORT.md${NC}"
echo ""
