#!/bin/bash

echo "🚀 Starting R3AL Backend Server..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
  echo "⚠️  Creating .env from env.example..."
  cp env.example .env
  echo "✅ .env created"
fi

# Check if port is already in use
if lsof -Pi :10000 -sTCP:LISTEN -t >/dev/null ; then
  echo "⚠️  Port 10000 is already in use. Stopping existing process..."
  lsof -ti:10000 | xargs kill -9
  sleep 1
fi

# Start backend
echo "🔧 Starting backend on port 10000..."
echo "📝 Logs will appear below (Ctrl+C to stop)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PORT=10000 bun backend/hono.ts
