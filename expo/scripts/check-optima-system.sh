#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 R3AL + Optima-Core System Diagnostics"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Check environment configuration
echo "━━━ 1️⃣  Environment Configuration ━━━"
if [ -f ".env" ]; then
  echo -e "${GREEN}✅ .env file found${NC}"
  echo "Backend URL: $(grep EXPO_PUBLIC_RORK_API_BASE_URL .env | cut -d '=' -f2)"
  echo "Optima URL: $(grep EXPO_PUBLIC_OPTIMA_CORE_URL .env | cut -d '=' -f2)"
  echo "AI Base URL: $(grep EXPO_PUBLIC_AI_BASE_URL .env | cut -d '=' -f2)"
else
  echo -e "${RED}❌ .env file NOT found${NC}"
  echo -e "${YELLOW}Creating .env from env.example...${NC}"
  if [ -f "env.example" ]; then
    cp env.example .env
    echo -e "${GREEN}✅ .env created${NC}"
  else
    echo -e "${RED}❌ env.example also missing${NC}"
  fi
fi
echo ""

# 2. Check if backend is running locally
echo "━━━ 2️⃣  Local Backend Check ━━━"
if curl -s http://localhost:10000/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Local backend is running on port 10000${NC}"
  curl -s http://localhost:10000/health | head -n 5
else
  echo -e "${YELLOW}⚠️  Local backend NOT running on port 10000${NC}"
  echo "To start backend: cd backend && bun run hono.ts"
fi
echo ""

# 3. Check production backend
echo "━━━ 3️⃣  Production Backend Check ━━━"
PROD_URL=$(grep EXPO_PUBLIC_RORK_API_BASE_URL .env 2>/dev/null | cut -d '=' -f2 | tr -d ' ')
if [ ! -z "$PROD_URL" ] && [ "$PROD_URL" != "http://localhost:10000" ]; then
  echo "Testing: $PROD_URL/health"
  if curl -s "${PROD_URL}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Production backend is reachable${NC}"
    curl -s "${PROD_URL}/health"
  else
    echo -e "${RED}❌ Production backend NOT reachable${NC}"
    echo "URL: $PROD_URL"
  fi
else
  echo -e "${YELLOW}⚠️  Using localhost - no production URL configured${NC}"
fi
echo ""

# 4. Check tRPC routes
echo "━━━ 4️⃣  tRPC Routes Check ━━━"
BASE_URL=${PROD_URL:-http://localhost:10000}
echo "Testing tRPC at: ${BASE_URL}/api/trpc"

# Test health route
if curl -s "${BASE_URL}/api/trpc/health" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ tRPC health route accessible${NC}"
else
  echo -e "${RED}❌ tRPC health route NOT accessible${NC}"
fi

# Test tokens.getBalance route
if curl -s "${BASE_URL}/api/trpc/r3al.tokens.getBalance" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ tRPC tokens.getBalance route accessible${NC}"
else
  echo -e "${RED}❌ tRPC tokens.getBalance route NOT accessible (404)${NC}"
  echo "This is the main issue causing the errors"
fi
echo ""

# 5. Check backend files
echo "━━━ 5️⃣  Backend Files Check ━━━"
files=(
  "backend/hono.ts"
  "backend/trpc/app-router.ts"
  "backend/trpc/routes/r3al/router.ts"
  "backend/trpc/routes/r3al/tokens/get-balance.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $file${NC}"
  else
    echo -e "${RED}❌ $file MISSING${NC}"
  fi
done
echo ""

# 6. Check key app features
echo "━━━ 6️⃣  App Features Check ━━━"
features=(
  "app/r3al/optima-ai.tsx:Optima AI Consultant"
  "app/r3al/qotd/index.tsx:Question of the Day"
  "app/r3al/hive/index.tsx:NFT Hive"
  "app/r3al/pulse-chat/index.tsx:Pulse Chat"
  "app/r3al/hive/token-wallet.tsx:Token Wallet"
)

for feature in "${features[@]}"; do
  file=$(echo $feature | cut -d ':' -f1)
  name=$(echo $feature | cut -d ':' -f2)
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $name${NC}"
  else
    echo -e "${RED}❌ $name MISSING${NC}"
  fi
done
echo ""

# 7. Check Node modules
echo "━━━ 7️⃣  Dependencies Check ━━━"
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✅ node_modules installed${NC}"
  
  # Check key packages
  if [ -d "node_modules/@trpc" ]; then
    echo -e "${GREEN}✅ tRPC installed${NC}"
  else
    echo -e "${RED}❌ tRPC NOT installed${NC}"
  fi
  
  if [ -d "node_modules/hono" ]; then
    echo -e "${GREEN}✅ Hono installed${NC}"
  else
    echo -e "${RED}❌ Hono NOT installed${NC}"
  fi
else
  echo -e "${RED}❌ node_modules NOT found${NC}"
  echo "Run: bun install"
fi
echo ""

# 8. Summary and recommendations
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary & Recommendations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Common Issues & Fixes:"
echo ""
echo "1️⃣  If backend is not running locally:"
echo "   → cd to project root"
echo "   → Run: PORT=10000 bun backend/hono.ts"
echo ""
echo "2️⃣  If getting 404 errors on tRPC routes:"
echo "   → Backend needs to be running"
echo "   → Check EXPO_PUBLIC_RORK_API_BASE_URL in .env"
echo "   → Verify backend is deployed (if using production URL)"
echo ""
echo "3️⃣  If Optima AI is not visible:"
echo "   → It's on the home screen (gold banner at top)"
echo "   → Route: /r3al/optima-ai"
echo "   → Also check /r3al/home.tsx for the banner"
echo ""
echo "4️⃣  If features not working:"
echo "   → Make sure backend is running"
echo "   → Check browser console for errors"
echo "   → Verify all dependencies: bun install"
echo ""
echo "5️⃣  Quick Start Backend:"
echo "   → Terminal 1: PORT=10000 bun backend/hono.ts"
echo "   → Terminal 2: bun start"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
