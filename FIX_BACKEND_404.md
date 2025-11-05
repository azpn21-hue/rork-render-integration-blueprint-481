# Fix Backend 404 Errors - Quick Guide

## Problem
You're getting 404 errors when the frontend tries to call backend routes:
- `[tRPC] ❌ Backend health check failed: 404`
- `[tRPC] Error: HTTP 404: 404 Not Found`

## Root Cause
**The backend server is not running.** All the routes are properly configured, but the server needs to be started separately.

## Solution

### Step 1: Start the Backend Server

Open a **new terminal window** and run:

```bash
PORT=10000 node server.js
```

Or use the startup script:

```bash
chmod +x start-backend-simple.sh
./start-backend-simple.sh
```

### Step 2: Verify Backend is Running

In another terminal, check the backend health:

```bash
node check-backend-health.js
```

Or manually:

```bash
curl http://localhost:10000/health
```

You should see:
```json
{
  "status": "healthy",
  "message": "R3AL Connection API health check",
  "timestamp": "2025-11-05T..."
}
```

### Step 3: Check Available Routes

```bash
curl http://localhost:10000/api/routes
```

This will list all available tRPC routes including:
- `r3al.feed.getTrending`
- `r3al.feed.getLocal`
- `r3al.market.getSummary`
- `r3al.market.getNews`
- `r3al.ai.getInsights`
- And many more...

### Step 4: Keep Backend Running

The backend must stay running while you use the app. You have two options:

**Option A: Run in Background**
```bash
PORT=10000 node server.js &
```

**Option B: Use a Separate Terminal Window**
Keep the terminal window open with the backend running.

## Quick Test Commands

### Test Backend Directly
```bash
# Health check
curl http://localhost:10000/health

# List routes
curl http://localhost:10000/api/routes

# Test a tRPC endpoint (requires auth token)
curl "http://localhost:10000/api/trpc/r3al.market.getSummary?input=%7B%22json%22%3A%7B%7D%7D"
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 10000
lsof -i :10000

# Kill the process
kill -9 <PID>

# Or kill all node processes (careful!)
pkill -f "node server.js"
```

### Backend Logs Not Showing Routes
If you see "⚠️ WARNING: No r3al routes found!", then there's a router configuration issue. Contact support.

### Backend Crashes Immediately
Check the error message. Common issues:
- Missing dependencies: Run `bun install`
- Port permission issues: Try a different port like `PORT=3000`
- TypeScript compilation errors: Check the error log

## Development Workflow

For active development, run these in separate terminals:

**Terminal 1: Backend**
```bash
PORT=10000 node server.js
```

**Terminal 2: Frontend**
```bash
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
```

**Terminal 3: Health Monitoring** (optional)
```bash
watch -n 5 'curl -s http://localhost:10000/health'
```

## Production Deployment

When deploying to production (Render, Railway, etc.), make sure:

1. The start command includes the backend server:
   ```
   PORT=$PORT node server.js
   ```

2. Environment variables are set correctly

3. The backend URL in the frontend matches the deployed URL

## Quick Verification Script

Run this to verify everything is working:

```bash
#!/bin/bash
echo "🔍 Verifying R3AL Backend Setup..."

# Check if backend is running
if curl -s http://localhost:10000/health > /dev/null 2>&1; then
  echo "✅ Backend is running"
  
  # Check routes
  ROUTES=$(curl -s http://localhost:10000/api/routes | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
  echo "✅ Found $ROUTES routes registered"
  
  echo ""
  echo "🎉 Backend is healthy and ready!"
  echo "📡 Backend URL: http://localhost:10000"
  
else
  echo "❌ Backend is NOT running"
  echo ""
  echo "Start it with: PORT=10000 node server.js"
  exit 1
fi
```

Save this as `verify-backend.sh`, make it executable, and run:
```bash
chmod +x verify-backend.sh
./verify-backend.sh
```
