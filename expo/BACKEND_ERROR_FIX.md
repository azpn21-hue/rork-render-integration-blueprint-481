# Backend 404 Error Fix Guide

## The Problem
You're getting "JSON Parse error: Unexpected character: o" which happens when the backend returns HTML (like "404 Not Found") instead of JSON. This means **the backend server is not running**.

## Quick Fix

### Step 1: Start the Backend Server

```bash
chmod +x START_BACKEND.sh
./START_BACKEND.sh
```

Or manually:

```bash
# Kill any existing backend
pkill -f "node server.js"

# Start the backend
PORT=10000 node server.js
```

### Step 2: Verify Backend is Running

Open these URLs in your browser or use curl:

```bash
# Health check
curl http://localhost:10000/health

# Should return:
# {"status":"healthy","message":"R3AL Connection API health check","timestamp":"..."}

# Check available routes
curl http://localhost:10000/api/routes
```

### Step 3: Test tRPC Routes

```bash
# Test feed route
curl "http://localhost:10000/api/trpc/r3al.feed.getTrending?input=%7B%22json%22%3A%7B%22limit%22%3A5%2C%22offset%22%3A0%7D%7D"

# Test market route
curl "http://localhost:10000/api/trpc/r3al.market.getSummary?input=%7B%22json%22%3A%7B%7D%7D"

# Test AI insights route
curl "http://localhost:10000/api/trpc/r3al.ai.getInsights?input=%7B%22json%22%3A%7B%22timeframe%22%3A%22week%22%7D%7D"
```

## Why This Happens

The app is trying to connect to:
```
https://a-xxx.rorktest.dev/api/trpc/...
```

But this is a tunneled URL that forwards to `localhost:10000`. If nothing is running on port 10000, you get a 404 page (HTML), which causes the "Unexpected character: o" error when trying to parse it as JSON.

## Permanent Solution

### Option 1: Run Backend in Separate Terminal

```bash
# Terminal 1 - Backend
node server.js

# Terminal 2 - Frontend
bun start
```

### Option 2: Use Process Manager

Install pm2:
```bash
bun install -g pm2
```

Create ecosystem file `ecosystem.config.js`:
```js
module.exports = {
  apps: [{
    name: 'r3al-backend',
    script: 'server.js',
    watch: false,
    env: {
      PORT: 10000,
      NODE_ENV: 'development'
    }
  }]
}
```

Start:
```bash
pm2 start ecosystem.config.js
pm2 logs r3al-backend
```

### Option 3: Combined Startup Script

Create `start-all.sh`:
```bash
#!/bin/bash
# Start backend in background
PORT=10000 node server.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to be ready
sleep 3

# Start frontend
bun start
```

## Troubleshooting

### Backend won't start
```bash
# Check if port is in use
lsof -i :10000

# Kill process using port
kill -9 $(lsof -t -i:10000)
```

### Routes not found
```bash
# Check routes are registered
curl http://localhost:10000/api/routes | json_pp
```

### CORS errors
Backend already has CORS configured for `.rorktest.dev` domains. No changes needed.

## Verification Checklist

- [ ] Backend server is running (`ps aux | grep "node server.js"`)
- [ ] Health check returns 200 (`curl http://localhost:10000/health`)
- [ ] Routes list shows r3al.* routes (`curl http://localhost:10000/api/routes`)
- [ ] Test query returns JSON, not 404
- [ ] App no longer shows "JSON Parse error"

## Next Steps After Fix

Once backend is running:
1. Reload your app
2. Navigate to Feed, Market Pulse, or AI Insights
3. You should see data loading properly
4. Check console logs for "[Feed]", "[Market]", "[AI Insights]" messages

---

**Remember:** The backend MUST be running before starting the frontend app, or keep it running in a separate terminal/process.
