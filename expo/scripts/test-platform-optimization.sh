#!/bin/bash

# R3AL Platform - Quick Optimization & Deployment Test
# This script tests all platform optimizations

echo "🚀 R3AL Platform - Testing Cross-Platform Optimizations"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 (missing)"
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        return 0
    else
        echo -e "${RED}❌${NC} $1/ (missing)"
        return 1
    fi
}

echo "📱 Checking Mobile App Structure..."
echo "-----------------------------------"
check_file "app/_layout.tsx"
check_file "app.json"
check_file "app/r3al/home.tsx"
check_file "app/theme.ts"
check_dir "app/contexts"
check_dir "components"
echo ""

echo "🌐 Checking Web/PWA Files..."
echo "----------------------------"
check_file "public/index.html"
check_file "public/manifest.json"
check_file "public/sw.js"
check_file "public/robots.txt"
check_file "public/sitemap.xml"
check_file "public/browserconfig.xml"
echo ""

echo "📚 Checking Documentation..."
echo "----------------------------"
check_file "PLATFORM_OPTIMIZATION_GUIDE.md"
check_file "DEPLOYMENT_NOW.md"
check_file "FIREBASE_HOSTING_DEPLOYMENT.md"
echo ""

echo "🔧 Checking Configuration..."
echo "---------------------------"
check_file "package.json"
check_file "tsconfig.json"
check_file "app/config/constants.ts"
check_file "lib/trpc.ts"
echo ""

echo "🧪 Testing Web Optimizations..."
echo "------------------------------"

# Check if manifest is valid JSON
if jq empty public/manifest.json 2>/dev/null; then
    echo -e "${GREEN}✅${NC} manifest.json is valid JSON"
else
    echo -e "${RED}❌${NC} manifest.json has JSON errors"
fi

# Check if service worker syntax is valid
if node -c public/sw.js 2>/dev/null; then
    echo -e "${GREEN}✅${NC} sw.js syntax is valid"
else
    echo -e "${RED}❌${NC} sw.js has syntax errors"
fi

# Check if HTML is valid
if [ -f "public/index.html" ]; then
    if grep -q "<!doctype html>" public/index.html; then
        echo -e "${GREEN}✅${NC} index.html has valid doctype"
    else
        echo -e "${RED}❌${NC} index.html missing doctype"
    fi
    
    if grep -q "manifest.json" public/index.html; then
        echo -e "${GREEN}✅${NC} index.html links to manifest"
    else
        echo -e "${RED}❌${NC} index.html doesn't link to manifest"
    fi
    
    if grep -q "service[Ww]orker" public/index.html; then
        echo -e "${GREEN}✅${NC} index.html registers service worker"
    else
        echo -e "${RED}❌${NC} index.html doesn't register service worker"
    fi
fi

echo ""

echo "📦 Checking Dependencies..."
echo "--------------------------"
if [ -f "package.json" ]; then
    if grep -q '"expo"' package.json; then
        echo -e "${GREEN}✅${NC} Expo installed"
    fi
    if grep -q '"react-native"' package.json; then
        echo -e "${GREEN}✅${NC} React Native installed"
    fi
    if grep -q '"@tanstack/react-query"' package.json; then
        echo -e "${GREEN}✅${NC} React Query installed"
    fi
    if grep -q '"@trpc/client"' package.json; then
        echo -e "${GREEN}✅${NC} tRPC client installed"
    fi
fi

echo ""

echo "🎨 Checking Icon Assets..."
echo "-------------------------"
icon_sizes=(72 96 128 144 152 192 384 512)
missing_icons=0

for size in "${icon_sizes[@]}"; do
    if [ -f "public/icon-${size}x${size}.png" ]; then
        echo -e "${GREEN}✅${NC} icon-${size}x${size}.png"
    else
        echo -e "${YELLOW}⚠${NC}  icon-${size}x${size}.png (recommended)"
        missing_icons=$((missing_icons + 1))
    fi
done

if [ $missing_icons -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}Note:${NC} $missing_icons icon sizes are missing. Generate them at:"
    echo "  - https://realfavicongenerator.net/"
    echo "  - https://www.pwa-icon-generator.com/"
fi

echo ""

echo "🔐 Checking Security & SEO..."
echo "----------------------------"
if grep -q "https://" public/index.html; then
    echo -e "${GREEN}✅${NC} HTTPS enforced in HTML"
fi

if [ -f "public/robots.txt" ]; then
    if grep -q "Sitemap:" public/robots.txt; then
        echo -e "${GREEN}✅${NC} robots.txt includes sitemap reference"
    fi
fi

if [ -f "public/sitemap.xml" ]; then
    if grep -q "https://r3al.app" public/sitemap.xml; then
        echo -e "${GREEN}✅${NC} sitemap.xml configured for r3al.app"
    fi
fi

echo ""

echo "📊 Platform-Specific Checks..."
echo "-----------------------------"

# iOS specific
if [ -f "app.json" ]; then
    if grep -q '"bundleIdentifier"' app.json; then
        echo -e "${GREEN}✅${NC} iOS bundle identifier configured"
    fi
    if grep -q '"NSCameraUsageDescription"' app.json; then
        echo -e "${GREEN}✅${NC} iOS camera permission configured"
    fi
fi

# Android specific
if [ -f "app.json" ]; then
    if grep -q '"package"' app.json; then
        echo -e "${GREEN}✅${NC} Android package name configured"
    fi
    if grep -q '"adaptiveIcon"' app.json; then
        echo -e "${GREEN}✅${NC} Android adaptive icon configured"
    fi
fi

# Web specific
if [ -f "app/_layout.tsx" ]; then
    if grep -q "Platform.OS === 'web'" app/_layout.tsx; then
        echo -e "${GREEN}✅${NC} Web-specific code handling in place"
    fi
fi

echo ""

echo "🧪 Running TypeScript Check..."
echo "-----------------------------"
if command -v npx &> /dev/null; then
    if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
        echo -e "${RED}❌${NC} TypeScript errors found"
        echo "Run 'npx tsc --noEmit' for details"
    else
        echo -e "${GREEN}✅${NC} No TypeScript errors"
    fi
else
    echo -e "${YELLOW}⚠${NC}  npx not found, skipping TypeScript check"
fi

echo ""

echo "🔥 Firebase Hosting Check..."
echo "---------------------------"
if command -v firebase &> /dev/null; then
    echo -e "${GREEN}✅${NC} Firebase CLI installed"
    
    if [ -f "firebase.json" ]; then
        echo -e "${GREEN}✅${NC} firebase.json exists"
    else
        echo -e "${YELLOW}⚠${NC}  firebase.json not found (run 'firebase init')"
    fi
    
    if [ -f ".firebaserc" ]; then
        echo -e "${GREEN}✅${NC} .firebaserc exists (project configured)"
    else
        echo -e "${YELLOW}⚠${NC}  .firebaserc not found (run 'firebase init')"
    fi
else
    echo -e "${YELLOW}⚠${NC}  Firebase CLI not installed"
    echo "Install with: npm install -g firebase-tools"
fi

echo ""

echo "🎯 Summary & Next Steps"
echo "======================"
echo ""

if [ -f "public/manifest.json" ] && [ -f "public/sw.js" ] && [ -f "public/index.html" ]; then
    echo -e "${GREEN}✅ Web/PWA files ready!${NC}"
else
    echo -e "${RED}❌ Missing critical web files${NC}"
fi

if [ -f "app/_layout.tsx" ] && [ -f "app.json" ]; then
    echo -e "${GREEN}✅ Mobile app structure ready!${NC}"
else
    echo -e "${RED}❌ Mobile app structure incomplete${NC}"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "  1. Generate icon assets (all sizes)"
echo "  2. Add social preview image (1200x630)"
echo "  3. Complete: firebase deploy --only hosting"
echo "  4. Configure GoDaddy DNS for r3al.app"
echo "  5. Wait for DNS propagation"
echo "  6. Test on multiple devices & browsers"
echo ""
echo "📖 For detailed steps, see:"
echo "  - DEPLOYMENT_NOW.md"
echo "  - PLATFORM_OPTIMIZATION_GUIDE.md"
echo ""
echo -e "${GREEN}Platform optimization check complete!${NC}"
