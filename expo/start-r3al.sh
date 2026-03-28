#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║          🚀 R3AL App - Full Stack Startup 🚀            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    if [ ! -z "$BACKEND_PID" ]; then
        echo "  Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
    fi
    pkill -P $$ 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node server.js" 2>/dev/null
pkill -f "bun.*rork start" 2>/dev/null
sleep 2

# Free up ports
for port in 10000 8081 19006; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "  🔓 Freeing port $port..."
        kill -9 $(lsof -t -i:$port) 2>/dev/null
    fi
done
sleep 1

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  STEP 1: Starting Backend Server"
echo "═══════════════════════════════════════════════════════════"
echo ""

export PORT=10000
export NODE_ENV=development

# Start backend
node server.js > backend.log 2>&1 &
BACKEND_PID=$!

echo "✅ Backend started (PID: $BACKEND_PID)"
echo "📁 Backend logs: backend.log"
echo "📡 Backend URL: http://localhost:10000"

# Wait for backend to be ready
echo ""
echo "⏳ Waiting for backend to be ready..."
for i in {1..15}; do
    if curl -s http://localhost:10000/health > /dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        break
    fi
    echo "  Attempt $i/15..."
    sleep 1
done

# Verify backend
echo ""
echo "🔍 Backend verification:"
HEALTH_CHECK=$(curl -s http://localhost:10000/health)
if echo "$HEALTH_CHECK" | grep -q "healthy"; then
    echo "  ✅ Health check: PASSED"
else
    echo "  ❌ Health check: FAILED"
    echo "  Response: $HEALTH_CHECK"
    exit 1
fi

ROUTES_CHECK=$(curl -s http://localhost:10000/api/routes)
ROUTE_COUNT=$(echo "$ROUTES_CHECK" | grep -o "r3al\." | wc -l)
if [ "$ROUTE_COUNT" -gt 0 ]; then
    echo "  ✅ Routes registered: $ROUTE_COUNT r3al routes found"
else
    echo "  ⚠️  Warning: No r3al routes found"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  STEP 2: Starting Frontend App"
echo "═══════════════════════════════════════════════════════════"
echo ""

sleep 2

# Start frontend
echo "🎨 Starting Expo app with Rork..."
echo ""
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel

# This will keep running until Ctrl+C
