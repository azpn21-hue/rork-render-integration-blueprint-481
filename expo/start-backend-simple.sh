#!/bin/bash

echo "🚀 Starting R3AL Backend Server..."
echo "=================================="

# Kill any existing backend process
echo "🔍 Checking for existing backend processes..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true
sleep 1

# Start the backend
echo "🚀 Starting backend on port 10000..."
PORT=10000 node server.js &
BACKEND_PID=$!

echo "✅ Backend started with PID: $BACKEND_PID"
echo ""
echo "Waiting for backend to be ready..."
sleep 3

# Check if backend is responding
echo "🧪 Testing backend connection..."
for i in {1..10}; do
  if curl -s http://localhost:10000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    echo ""
    echo "📡 Backend URL: http://localhost:10000"
    echo "🔧 Health Check: http://localhost:10000/health"
    echo "📋 Routes List: http://localhost:10000/api/routes"
    echo ""
    echo "Backend is running in the background (PID: $BACKEND_PID)"
    echo "To stop: kill $BACKEND_PID"
    exit 0
  fi
  echo "Waiting... ($i/10)"
  sleep 2
done

echo "❌ Backend failed to start"
exit 1
