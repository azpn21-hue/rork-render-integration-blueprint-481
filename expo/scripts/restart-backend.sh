#!/bin/bash

echo "🔄 Restarting R3AL Backend..."
echo ""

# Check if backend process is running
if pgrep -f "bun.*backend/hono.ts" > /dev/null; then
    echo "✅ Found running backend process"
    echo "🛑 Stopping backend..."
    pkill -f "bun.*backend/hono.ts"
    sleep 2
else
    echo "⚠️  No running backend process found"
fi

# Start backend
echo "🚀 Starting backend server..."
echo ""

# Set environment variables
export NODE_ENV=development
export PORT=10000

# Start backend in background
bun backend/hono.ts &

BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Check if backend is responding
echo "🔍 Testing backend health..."
HEALTH_RESPONSE=$(curl -s http://localhost:10000/health)

if [ $? -eq 0 ]; then
    echo "✅ Backend is healthy!"
    echo "Response: $HEALTH_RESPONSE"
    echo ""
    
    # Check available routes
    echo "📋 Checking available routes..."
    ROUTES_RESPONSE=$(curl -s http://localhost:10000/api/routes)
    echo "$ROUTES_RESPONSE" | head -c 500
    echo ""
    echo ""
    
    echo "✅ Backend is running at http://localhost:10000"
    echo "📡 tRPC endpoint: http://localhost:10000/api/trpc"
    echo ""
    echo "To stop the backend, run:"
    echo "  pkill -f 'bun.*backend/hono.ts'"
else
    echo "❌ Backend health check failed"
    echo "Check the logs for errors"
    exit 1
fi
