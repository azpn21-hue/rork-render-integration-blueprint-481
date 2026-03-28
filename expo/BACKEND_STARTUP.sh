#!/bin/bash

# R3AL Backend Startup Script
# This script starts the backend server and verifies it's working

set -e

echo "=================================="
echo "🚀 R3AL Backend Startup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PORT=${PORT:-10000}
MAX_RETRIES=10
RETRY_DELAY=2

# Function to check if port is in use
check_port() {
  if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

# Function to kill existing backend
kill_existing() {
  echo "🔍 Checking for existing backend processes..."
  
  if check_port; then
    echo "⚠️  Port $PORT is already in use"
    PID=$(lsof -ti:$PORT)
    echo "Found process PID: $PID"
    echo "Killing existing process..."
    kill -9 $PID 2>/dev/null || true
    sleep 2
    echo "✅ Killed existing process"
  else
    echo "✅ Port $PORT is available"
  fi
}

# Function to start backend
start_backend() {
  echo ""
  echo "🚀 Starting backend server on port $PORT..."
  PORT=$PORT node server.js > backend.log 2>&1 &
  BACKEND_PID=$!
  echo "Backend started with PID: $BACKEND_PID"
  echo "Logs are being written to: backend.log"
}

# Function to wait for backend
wait_for_backend() {
  echo ""
  echo "⏳ Waiting for backend to be ready..."
  
  for i in $(seq 1 $MAX_RETRIES); do
    if curl -s http://localhost:$PORT/health > /dev/null 2>&1; then
      echo -e "${GREEN}✅ Backend is ready!${NC}"
      return 0
    fi
    echo "Attempt $i/$MAX_RETRIES..."
    sleep $RETRY_DELAY
  done
  
  echo -e "${RED}❌ Backend failed to start after $MAX_RETRIES attempts${NC}"
  echo ""
  echo "Last 20 lines of backend.log:"
  tail -n 20 backend.log
  return 1
}

# Function to verify routes
verify_routes() {
  echo ""
  echo "🔍 Verifying routes..."
  
  RESPONSE=$(curl -s http://localhost:$PORT/api/routes)
  ROUTE_COUNT=$(echo $RESPONSE | grep -o '"count":[0-9]*' | grep -o '[0-9]*' || echo "0")
  
  if [ "$ROUTE_COUNT" -gt "0" ]; then
    echo -e "${GREEN}✅ Found $ROUTE_COUNT routes registered${NC}"
    
    # Check for r3al routes specifically
    if echo $RESPONSE | grep -q "r3al"; then
      R3AL_COUNT=$(echo $RESPONSE | grep -o '"r3al\.[^"]*"' | wc -l)
      echo -e "${GREEN}✅ Found $R3AL_COUNT r3al routes${NC}"
    else
      echo -e "${YELLOW}⚠️  No r3al routes found${NC}"
    fi
  else
    echo -e "${RED}❌ No routes registered${NC}"
    return 1
  fi
}

# Function to show status
show_status() {
  echo ""
  echo "=================================="
  echo "✅ Backend is running successfully!"
  echo "=================================="
  echo ""
  echo "📡 Backend URL: http://localhost:$PORT"
  echo "🔧 Health Check: http://localhost:$PORT/health"
  echo "📋 Routes List: http://localhost:$PORT/api/routes"
  echo "📝 Logs: tail -f backend.log"
  echo "🛑 Stop: kill $BACKEND_PID"
  echo ""
  echo "PID: $BACKEND_PID"
  echo ""
}

# Main execution
main() {
  kill_existing
  start_backend
  
  if wait_for_backend; then
    verify_routes
    show_status
    
    echo "Press Ctrl+C to stop the backend..."
    echo "Or run: kill $BACKEND_PID"
    echo ""
    
    # Keep script running and show logs
    tail -f backend.log
  else
    echo -e "${RED}Failed to start backend${NC}"
    exit 1
  fi
}

# Handle Ctrl+C
trap 'echo ""; echo "Stopping backend..."; kill $BACKEND_PID 2>/dev/null; exit 0' INT TERM

# Run main function
main
