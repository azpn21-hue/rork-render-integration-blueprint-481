#!/bin/bash

echo "=========================================="
echo "🚀 Starting R3AL Backend Server"
echo "=========================================="

# Kill any existing backend processes
echo "🧹 Cleaning up existing backend processes..."
pkill -f "node server.js" 2>/dev/null
pkill -f "bun server.js" 2>/dev/null
sleep 2

# Check if port 10000 is in use
if lsof -Pi :10000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 10000 is in use. Freeing it..."
    kill -9 $(lsof -t -i:10000) 2>/dev/null
    sleep 2
fi

# Start the backend server
echo "🚀 Starting backend server on port 10000..."
export PORT=10000
export NODE_ENV=development

# Start server with node
node server.js &
SERVER_PID=$!

echo "✅ Backend server started with PID: $SERVER_PID"
echo "📡 Backend URL: http://localhost:10000"
echo "🧪 Health check: http://localhost:10000/health"
echo "📋 Routes list: http://localhost:10000/api/routes"
echo ""
echo "⏳ Waiting for server to be ready..."
sleep 3

# Health check
echo "🔍 Running health check..."
curl -s http://localhost:10000/health | grep -q "healthy" && echo "✅ Backend is healthy!" || echo "❌ Backend health check failed"

echo ""
echo "=========================================="
echo "✅ Backend is ready!"
echo "=========================================="
echo ""
echo "💡 To stop the backend, run:"
echo "   kill $SERVER_PID"
echo ""
