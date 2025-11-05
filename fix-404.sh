#!/bin/bash

echo "🔧 Fixing R3AL Backend 404 Errors"
echo "=================================="
echo ""

# Stop any running backend
echo "1️⃣ Stopping existing backend processes..."
pkill -f "node.*server.js" 2>/dev/null && echo "   ✅ Stopped old backend" || echo "   ℹ️  No backend was running"
pkill -f "bun.*backend/hono.ts" 2>/dev/null

sleep 1

# Clear caches
echo ""
echo "2️⃣ Clearing caches..."
rm -rf .expo 2>/dev/null && echo "   ✅ Cleared Expo cache" || echo "   ℹ️  No Expo cache to clear"
rm -rf node_modules/.cache 2>/dev/null && echo "   ✅ Cleared node_modules cache" || echo "   ℹ️  No node_modules cache to clear"

# Start backend
echo ""
echo "3️⃣ Starting backend server..."
echo ""

# Start backend in background and save PID
node server.js &
BACKEND_PID=$!

echo "   Backend starting with PID: $BACKEND_PID"
echo ""

# Wait for backend to start
echo "4️⃣ Waiting for backend to be ready..."
sleep 3

# Test backend
echo ""
echo "5️⃣ Testing backend..."

HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:10000/health 2>&1)
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Backend is healthy!"
    echo "   Response: $RESPONSE_BODY"
    echo ""
    
    # Test tRPC routes
    echo "6️⃣ Testing tRPC routes..."
    ROUTES_RESPONSE=$(curl -s http://localhost:10000/api/routes)
    ROUTE_COUNT=$(echo "$ROUTES_RESPONSE" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    
    if [ ! -z "$ROUTE_COUNT" ]; then
        echo "   ✅ Found $ROUTE_COUNT tRPC routes"
        
        # Check for specific routes
        if echo "$ROUTES_RESPONSE" | grep -q "r3al.feed.getTrending"; then
            echo "   ✅ Feed routes registered"
        fi
        if echo "$ROUTES_RESPONSE" | grep -q "r3al.market.getSummary"; then
            echo "   ✅ Market routes registered"
        fi
        if echo "$ROUTES_RESPONSE" | grep -q "r3al.ai.getInsights"; then
            echo "   ✅ AI routes registered"
        fi
    fi
    
    echo ""
    echo "=================================="
    echo "✅ Backend is running successfully!"
    echo "=================================="
    echo ""
    echo "📡 Backend URL: http://localhost:10000"
    echo "🔗 Health check: http://localhost:10000/health"
    echo "📋 Routes list: http://localhost:10000/api/routes"
    echo ""
    echo "💡 Backend is running in background"
    echo "   To stop: pkill -f 'node.*server.js'"
    echo "   To view logs: check backend.log"
    echo ""
    echo "🚀 Now restart your Expo app to connect"
    
else
    echo ""
    echo "=================================="
    echo "❌ Backend health check failed"
    echo "=================================="
    echo ""
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check if port 10000 is available: lsof -i :10000"
    echo "  2. View backend logs: tail -f backend.log"
    echo "  3. Try manual start: node server.js"
    echo ""
    
    # Kill the backend process since it's not healthy
    kill $BACKEND_PID 2>/dev/null
    
    exit 1
fi
