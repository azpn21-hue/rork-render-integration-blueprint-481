#!/bin/bash

# R3AL Full Stack Startup Script
# Starts both backend and frontend together

echo "🚀 Starting R3AL Full Stack..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
  echo "⚠️  .env not found, creating from env.example..."
  if [ -f "env.example" ]; then
    cp env.example .env
    echo "✅ .env created"
  else
    echo "❌ env.example not found!"
    exit 1
  fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  bun install
fi

# Kill any existing processes on ports 10000 and 8081
echo "🧹 Cleaning up existing processes..."
lsof -ti:10000 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend in background
echo "🔧 Starting backend on port 10000..."
PORT=10000 bun backend/hono.ts > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
for i in {1..30}; do
  if curl -s http://localhost:10000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Backend failed to start after 30 seconds"
    echo "Check backend.log for errors"
    exit 1
  fi
  sleep 1
done

# Show backend health
echo ""
echo "Backend Health:"
curl -s http://localhost:10000/health | head -n 3
echo ""
echo ""

# Start frontend
echo "🎨 Starting frontend..."
echo "Backend logs are in: backend.log"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Full Stack Running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Backend:  http://localhost:10000"
echo "Frontend: Starting now..."
echo ""
echo "Press Ctrl+C to stop both services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start frontend (this will block)
bun start

# Cleanup when frontend exits
echo ""
echo "🛑 Stopping backend..."
kill $BACKEND_PID 2>/dev/null || true
echo "✅ Shutdown complete"
