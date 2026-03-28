#!/bin/bash

echo "🔍 R3AL System Status Check"
echo "============================="
echo ""

# Check Node/Bun
echo "📦 Runtime Environment:"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✅ Node.js: $NODE_VERSION"
else
    echo "   ❌ Node.js: Not found"
fi

if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun -v)
    echo "   ✅ Bun: $BUN_VERSION"
else
    echo "   ℹ️  Bun: Not found (optional)"
fi

echo ""

# Check if backend is running
echo "🖥️  Backend Status:"
if pgrep -f "node.*server.js" > /dev/null; then
    BACKEND_PID=$(pgrep -f "node.*server.js")
    echo "   ✅ Backend is running (PID: $BACKEND_PID)"
    
    # Test backend health
    HEALTH_RESPONSE=$(curl -s http://localhost:10000/health 2>&1)
    if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
        echo "   ✅ Backend is healthy"
    else
        echo "   ⚠️  Backend is running but not responding"
    fi
elif pgrep -f "bun.*backend/hono.ts" > /dev/null; then
    BACKEND_PID=$(pgrep -f "bun.*backend/hono.ts")
    echo "   ✅ Backend is running via Bun (PID: $BACKEND_PID)"
else
    echo "   ❌ Backend is not running"
    echo "   💡 Start with: node server.js"
fi

echo ""

# Check port availability
echo "🔌 Port Status:"
if lsof -i :10000 > /dev/null 2>&1; then
    PORT_USER=$(lsof -i :10000 | grep LISTEN | awk '{print $1}' | head -n 1)
    echo "   ✅ Port 10000 is in use by: $PORT_USER"
else
    echo "   ⚠️  Port 10000 is available (backend not listening)"
fi

echo ""

# Check environment variables
echo "🌍 Environment Variables:"
if [ -f .env ]; then
    echo "   ✅ .env file exists"
    
    if grep -q "EXPO_PUBLIC_API_BASE_URL" .env; then
        API_URL=$(grep "EXPO_PUBLIC_API_BASE_URL" .env | cut -d '=' -f2)
        echo "   ✅ EXPO_PUBLIC_API_BASE_URL: $API_URL"
    else
        echo "   ⚠️  EXPO_PUBLIC_API_BASE_URL not set"
    fi
else
    echo "   ⚠️  .env file not found"
fi

echo ""

# Test backend endpoints
echo "🧪 Backend Endpoints Test:"
if curl -s http://localhost:10000/health > /dev/null 2>&1; then
    echo "   ✅ GET /health - OK"
else
    echo "   ❌ GET /health - Failed"
fi

if curl -s http://localhost:10000/api/routes > /dev/null 2>&1; then
    ROUTES=$(curl -s http://localhost:10000/api/routes)
    ROUTE_COUNT=$(echo "$ROUTES" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    echo "   ✅ GET /api/routes - OK ($ROUTE_COUNT routes)"
    
    # Check for specific route groups
    if echo "$ROUTES" | grep -q "r3al.feed"; then
        FEED_COUNT=$(echo "$ROUTES" | grep -o "r3al.feed" | wc -l)
        echo "      ✅ Feed routes: $FEED_COUNT"
    else
        echo "      ❌ Feed routes: Missing"
    fi
    
    if echo "$ROUTES" | grep -q "r3al.market"; then
        MARKET_COUNT=$(echo "$ROUTES" | grep -o "r3al.market" | wc -l)
        echo "      ✅ Market routes: $MARKET_COUNT"
    else
        echo "      ❌ Market routes: Missing"
    fi
    
    if echo "$ROUTES" | grep -q "r3al.ai"; then
        AI_COUNT=$(echo "$ROUTES" | grep -o "r3al.ai" | wc -l)
        echo "      ✅ AI routes: $AI_COUNT"
    else
        echo "      ❌ AI routes: Missing"
    fi
else
    echo "   ❌ GET /api/routes - Failed"
fi

echo ""

# Test specific tRPC routes
echo "🔬 tRPC Routes Test:"

# Test health route
HEALTH_TRPC=$(curl -s "http://localhost:10000/api/trpc/health" 2>&1)
if echo "$HEALTH_TRPC" | grep -q "result"; then
    echo "   ✅ health - OK"
else
    echo "   ❌ health - Failed"
fi

# Test feed.getTrending
TRENDING_URL="http://localhost:10000/api/trpc/r3al.feed.getTrending?input=%7B%22json%22%3A%7B%22limit%22%3A25%2C%22offset%22%3A0%7D%7D"
TRENDING_RESPONSE=$(curl -s "$TRENDING_URL" 2>&1)
if echo "$TRENDING_RESPONSE" | grep -q "result"; then
    echo "   ✅ r3al.feed.getTrending - OK"
elif echo "$TRENDING_RESPONSE" | grep -q "404"; then
    echo "   ❌ r3al.feed.getTrending - 404 Not Found"
else
    echo "   ⚠️  r3al.feed.getTrending - Unknown error"
fi

# Test market.getSummary
MARKET_URL="http://localhost:10000/api/trpc/r3al.market.getSummary?input=%7B%22json%22%3A%7B%7D%7D"
MARKET_RESPONSE=$(curl -s "$MARKET_URL" 2>&1)
if echo "$MARKET_RESPONSE" | grep -q "result"; then
    echo "   ✅ r3al.market.getSummary - OK"
elif echo "$MARKET_RESPONSE" | grep -q "404"; then
    echo "   ❌ r3al.market.getSummary - 404 Not Found"
else
    echo "   ⚠️  r3al.market.getSummary - Unknown error"
fi

# Test ai.getInsights
AI_URL="http://localhost:10000/api/trpc/r3al.ai.getInsights?input=%7B%22json%22%3A%7B%22timeframe%22%3A%22day%22%7D%7D"
AI_RESPONSE=$(curl -s "$AI_URL" 2>&1)
if echo "$AI_RESPONSE" | grep -q "result"; then
    echo "   ✅ r3al.ai.getInsights - OK"
elif echo "$AI_RESPONSE" | grep -q "404"; then
    echo "   ❌ r3al.ai.getInsights - 404 Not Found"
else
    echo "   ⚠️  r3al.ai.getInsights - Unknown error"
fi

echo ""
echo "============================="
echo "✅ Status check complete!"
echo ""

# Summary and recommendations
if pgrep -f "node.*server.js" > /dev/null && curl -s http://localhost:10000/health | grep -q "healthy"; then
    echo "📊 System Status: ✅ HEALTHY"
    echo ""
    echo "Everything looks good! Your backend is running and responding."
    echo ""
    echo "If you're still seeing 404 errors in the app:"
    echo "  1. Make sure EXPO_PUBLIC_API_BASE_URL is set correctly"
    echo "  2. Restart your Expo development server"
    echo "  3. Clear app cache: rm -rf .expo && npm start -- --clear"
else
    echo "📊 System Status: ❌ NEEDS ATTENTION"
    echo ""
    echo "Recommended actions:"
    echo "  1. Start the backend: node server.js"
    echo "  2. Or use quick fix: chmod +x fix-404.sh && ./fix-404.sh"
    echo "  3. Check logs for errors"
fi

echo ""
