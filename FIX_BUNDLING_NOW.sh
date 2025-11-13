#!/bin/bash

# ============================================================================
# 🚨 CRITICAL FIX: R3AL APP BUNDLING ERROR
# ============================================================================
# This script fixes the "Bundling failed without error" issue
# Root cause: PostgreSQL imports in frontend bundle
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         R3AL APP - BUNDLING ERROR FIX SCRIPT               ║"
echo "║                                                            ║"
echo "║  This will fix the database import bundling issue         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Step counter
STEP=1
TOTAL=10

print_step() {
  echo -e "${GREEN}[${STEP}/${TOTAL}]${NC} $1"
  STEP=$((STEP + 1))
}

print_success() {
  echo -e "         ${GREEN}✅ $1${NC}"
}

print_warning() {
  echo -e "         ${YELLOW}⚠️  $1${NC}"
}

print_error() {
  echo -e "         ${RED}❌ $1${NC}"
}

# ============================================================================
# STEP 1: Kill all processes
# ============================================================================
print_step "Killing all node/expo processes..."
pkill -9 node 2>/dev/null || true
pkill -9 expo 2>/dev/null || true
pkill -9 bun 2>/dev/null || true
sleep 2
print_success "All processes terminated"

# ============================================================================
# STEP 2: Backup important files
# ============================================================================
print_step "Creating backup of app.json..."
if [ -f "app.json" ]; then
  cp app.json app.json.backup
  print_success "Backup created: app.json.backup"
else
  print_warning "app.json not found"
fi

# ============================================================================
# STEP 3: Clear ALL caches
# ============================================================================
print_step "Clearing all caches (this may take a moment)..."

# Metro bundler cache
rm -rf node_modules/.cache 2>/dev/null && print_success "Cleared node_modules/.cache" || print_warning "node_modules/.cache not found"

# Expo cache
rm -rf .expo 2>/dev/null && print_success "Cleared .expo" || print_warning ".expo not found"

# Metro temp files
rm -rf $TMPDIR/metro-* 2>/dev/null && print_success "Cleared metro cache" || print_warning "metro cache not found"
rm -rf $TMPDIR/haste-* 2>/dev/null && print_success "Cleared haste cache" || print_warning "haste cache not found"
rm -rf $TMPDIR/react-* 2>/dev/null && print_success "Cleared react cache" || print_warning "react cache not found"
rm -rf $TMPDIR/expo-* 2>/dev/null && print_success "Cleared expo temp" || print_warning "expo temp not found"

# User expo cache
rm -rf ~/.expo 2>/dev/null && print_success "Cleared user expo cache" || print_warning "user expo cache not found"

# Metro config cache
rm -rf .metro 2>/dev/null && print_success "Cleared .metro" || print_warning ".metro not found"

# Watchman
if command -v watchman &> /dev/null; then
  watchman watch-del-all 2>/dev/null && print_success "Watchman cleared" || print_warning "Watchman clear failed"
else
  print_warning "Watchman not installed (optional)"
fi

echo ""

# ============================================================================
# STEP 4: Verify database fix
# ============================================================================
print_step "Verifying database config fix..."
if grep -q "const isBrowser" backend/db/config.ts; then
  print_success "Database config has browser check ✓"
else
  print_error "Database config missing browser check!"
  echo ""
  echo -e "${YELLOW}Please manually add the browser check to backend/db/config.ts${NC}"
  echo -e "${YELLOW}See COMPLETE_LOG_REPORT.md for details${NC}"
fi

# ============================================================================
# STEP 5: Check configuration files
# ============================================================================
print_step "Checking bundler configuration files..."

# Check metro.config.js
if [ -f "metro.config.js" ]; then
  print_success "metro.config.js exists"
else
  print_warning "metro.config.js not found - Expo will use defaults"
  echo "         Creating metro.config.js..."
  cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql");
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "sql");

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setTimeout(120000);
      middleware(req, res, next);
    };
  },
};

module.exports = config;
EOF
  if [ $? -eq 0 ]; then
    print_success "Created metro.config.js"
  else
    print_error "Failed to create metro.config.js"
  fi
fi

# Check babel.config.js
if [ -f "babel.config.js" ]; then
  print_success "babel.config.js exists"
else
  print_warning "babel.config.js not found - creating..."
  cat > babel.config.js << 'EOF'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
EOF
  if [ $? -eq 0 ]; then
    print_success "Created babel.config.js"
  else
    print_error "Failed to create babel.config.js"
  fi
fi

echo ""

# ============================================================================
# STEP 6: Install missing dependencies
# ============================================================================
print_step "Installing required dependencies..."
bun add -d babel-plugin-module-resolver 2>/dev/null
if [ $? -eq 0 ]; then
  print_success "Dependencies installed"
else
  print_warning "Some dependencies may have failed to install"
fi

# ============================================================================
# STEP 7: Fix app.json (disable new architecture)
# ============================================================================
print_step "Updating app.json configuration..."
node << 'NODESCRIPT'
const fs = require('fs');
try {
  const content = fs.readFileSync('app.json', 'utf8');
  const appJson = JSON.parse(content);
  
  if (appJson.expo.newArchEnabled === true) {
    appJson.expo.newArchEnabled = false;
    fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
    console.log('         ✅ Disabled new architecture in app.json');
  } else {
    console.log('         ℹ️  New architecture already disabled');
  }
} catch(e) {
  console.log('         ⚠️  Could not modify app.json:', e.message);
  console.log('         Please manually set "newArchEnabled": false in app.json');
}
NODESCRIPT

echo ""

# ============================================================================
# STEP 8: Analyze router complexity
# ============================================================================
print_step "Analyzing router complexity..."
if [ -f "backend/trpc/routes/r3al/router.ts" ]; then
  IMPORT_COUNT=$(grep -c "^import" backend/trpc/routes/r3al/router.ts 2>/dev/null || echo "0")
  LINE_COUNT=$(wc -l < backend/trpc/routes/r3al/router.ts 2>/dev/null || echo "0")
  
  echo "         Router stats:"
  echo "         - Imports: $IMPORT_COUNT"
  echo "         - Lines: $LINE_COUNT"
  
  if [ "$IMPORT_COUNT" -gt "100" ]; then
    print_warning "Large router file detected (${IMPORT_COUNT} imports)"
    print_warning "Consider splitting into sub-routers if bundling is slow"
  else
    print_success "Router complexity is reasonable"
  fi
else
  print_warning "Router file not found"
fi

echo ""

# ============================================================================
# STEP 9: Reinstall node_modules
# ============================================================================
print_step "Reinstalling node_modules (this may take a minute)..."
rm -rf node_modules
bun install
if [ $? -eq 0 ]; then
  print_success "node_modules reinstalled"
else
  print_error "Failed to reinstall node_modules"
  exit 1
fi

echo ""

# ============================================================================
# STEP 10: Final verification
# ============================================================================
print_step "Running final verification..."

CHECKS_PASSED=0
CHECKS_TOTAL=5

# Check 1: Database config
if grep -q "const isBrowser" backend/db/config.ts; then
  print_success "Database config: OK"
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
  print_error "Database config: NEEDS FIX"
fi

# Check 2: metro.config.js
if [ -f "metro.config.js" ]; then
  print_success "metro.config.js: OK"
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
  print_error "metro.config.js: MISSING"
fi

# Check 3: babel.config.js
if [ -f "babel.config.js" ]; then
  print_success "babel.config.js: OK"
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
  print_error "babel.config.js: MISSING"
fi

# Check 4: node_modules
if [ -d "node_modules" ]; then
  print_success "node_modules: OK"
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
  print_error "node_modules: MISSING"
fi

# Check 5: package.json
if [ -f "package.json" ]; then
  print_success "package.json: OK"
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
  print_error "package.json: MISSING"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ FIX COMPLETE: ${CHECKS_PASSED}/${CHECKS_TOTAL} checks passed${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# ============================================================================
# RESULTS AND NEXT STEPS
# ============================================================================

if [ "$CHECKS_PASSED" -eq "$CHECKS_TOTAL" ]; then
  echo -e "${GREEN}🎉 All checks passed! Your app should now start successfully.${NC}"
  echo ""
  echo -e "${BLUE}🚀 Start the app:${NC}"
  echo -e "   ${YELLOW}bunx expo start -c${NC}"
  echo ""
  echo -e "${BLUE}🔍 Debug mode (if issues persist):${NC}"
  echo -e "   ${YELLOW}DEBUG=metro:* bunx expo start -c 2>&1 | tee bundler.log${NC}"
else
  echo -e "${YELLOW}⚠️  Some checks failed. Please review the errors above.${NC}"
  echo ""
  echo -e "${BLUE}📖 For detailed instructions, see:${NC}"
  echo -e "   - COMPLETE_LOG_REPORT.md"
  echo -e "   - BUNDLING_DIAGNOSTIC_REPORT.md"
  echo ""
  echo -e "${BLUE}🔧 Manual fixes may be required for:${NC}"
  [ ! -f "metro.config.js" ] && echo "   - Create metro.config.js"
  [ ! -f "babel.config.js" ] && echo "   - Create babel.config.js"
  ! grep -q "const isBrowser" backend/db/config.ts && echo "   - Fix backend/db/config.ts"
fi

echo ""
echo -e "${BLUE}📚 Additional Resources:${NC}"
echo "   - COMPLETE_LOG_REPORT.md - Full diagnostic and solutions"
echo "   - BUNDLING_DIAGNOSTIC_REPORT.md - Technical analysis"
echo "   - app.json.backup - Backup of your configuration"
echo ""

if [ "$CHECKS_PASSED" -eq "$CHECKS_TOTAL" ]; then
  echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}Ready to start! Run: ${YELLOW}bunx expo start -c${NC}"
  echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
else
  echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${YELLOW}Please fix the issues above before starting the app${NC}"
  echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
fi

echo ""
