#!/bin/bash

# R3AL Complete Startup Script
# Starts both backend and frontend

set -e

echo "╔══════════════════════════════════════╗"
echo "║   🚀 R3AL App Complete Startup      ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_PORT=10000
MAX_WAIT=30

# Step 1: Kill any existing processes
echo -e "${BLUE}[1/4] Cleaning up existing processes...${NC}"
pkill -f "node server.js" 2>/dev/null || true
pkill -f "bunx rork start" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Step 2: Start Backend
echo -e "${BLUE}[2/4] Starting backend server...${NC}"
PORT=$BACKEND_PORT node server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo ""

# Step 3: Wait for Backend
echo -e "${BLUE}[3/4] Waiting for backend to be ready...${NC}"
WAIT_COUNT=0
while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
  if curl -s http://localhost:$BACKEND_PORT/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is ready!${NC}"
    
    # Verify routes
    ROUTES=$(curl -s http://localhost:$BACKEND_PORT/api/routes | grep -o '"count":[0-9]*' | grep -o '[0-9]*' || echo "0")
    echo -e "${GREEN}✅ $ROUTES routes registered${NC}"
    break
  fi
  
  WAIT_COUNT=$((WAIT_COUNT + 1))
  if [ $((WAIT_COUNT % 5)) -eq 0 ]; then
    echo "Still waiting... ($WAIT_COUNT/$MAX_WAIT seconds)"
  fi
  sleep 1
done

if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
  echo -e "${RED}❌ Backend failed to start${NC}"
  echo ""
  echo "Last 10 lines of backend.log:"
  tail -n 10 backend.log
  exit 1
fi
echo ""

# Step 4: Start Frontend
echo -e "${BLUE}[4/4] Starting frontend...${NC}"
echo -e "${YELLOW}Opening in new terminal window...${NC}"
echo ""

# Try to open in new terminal window based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel"'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux - try various terminal emulators
  if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd $(pwd) && bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel; exec bash"
  elif command -v xterm &> /dev/null; then
    xterm -e "cd $(pwd) && bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel" &
  else
    echo -e "${YELLOW}⚠️  Could not open new terminal window${NC}"
    echo "Please open a new terminal and run:"
    echo "  bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel"
  fi
else
  echo -e "${YELLOW}⚠️  Could not open new terminal window${NC}"
  echo "Please open a new terminal and run:"
  echo "  bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel"
fi

# Show status
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║           ✅ Backend is Running!                ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "📡 Backend URL: http://localhost:$BACKEND_PORT"
echo "🔧 Health: http://localhost:$BACKEND_PORT/health"
echo "📋 Routes: http://localhost:$BACKEND_PORT/api/routes"
echo "📝 Logs: tail -f backend.log"
echo ""
echo "Backend PID: $BACKEND_PID"
echo ""
echo "To stop backend: kill $BACKEND_PID"
echo "To stop all: pkill -f 'node server.js' && pkill -f 'bunx rork'"
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  📱 Start Frontend in the New Terminal Window   ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "If frontend didn't start automatically, run:"
echo "  bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel"
echo ""
echo "Press Ctrl+C to stop backend (frontend will continue)"
echo ""

# Keep backend running and show logs
tail -f backend.log

# Cleanup on exit
trap 'echo ""; echo "Stopping backend..."; kill $BACKEND_PID 2>/dev/null; exit 0' INT TERM
