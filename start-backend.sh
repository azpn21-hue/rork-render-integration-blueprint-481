#!/bin/bash

echo "================================="
echo "🚀 Starting R3AL Backend Server"
echo "================================="

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if bun is installed
if command -v bun &> /dev/null; then
    echo "✅ Bun version: $(bun --version)"
    USE_BUN=true
else
    echo "ℹ️  Bun not found, using Node.js"
    USE_BUN=false
fi

# Set PORT if not already set
export PORT=${PORT:-10000}
echo "📡 Port: $PORT"

# Check if port is in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port $PORT is already in use"
    echo "🔄 Attempting to kill process on port $PORT..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo "================================="
echo "🔧 Starting backend server..."
echo "================================="

# Start the server
if [ "$USE_BUN" = true ]; then
    echo "Using Bun runtime..."
    bun run server.js
else
    echo "Using Node.js runtime..."
    node server.js
fi
