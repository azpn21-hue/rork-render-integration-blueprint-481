# 🚀 How to Start the R3AL App Properly

## The Problem
You're seeing 404 errors because **the backend isn't running**. The app has two parts:
1. **Frontend** (React Native app) 
2. **Backend** (Node.js API server)

Both must be running for the app to work.

## Quick Start (2 Steps)

### Terminal 1: Start Backend
```bash
chmod +x BACKEND_STARTUP.sh
./BACKEND_STARTUP.sh
```

Wait until you see:
```
✅ Backend is running successfully!
📡 Backend URL: http://localhost:10000
```

### Terminal 2: Start Frontend
```bash
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
```

That's it! 🎉

## Alternative: Manual Start

If the script doesn't work, start manually:

### Terminal 1: Backend
```bash
PORT=10000 node server.js
```

### Terminal 2: Frontend  
```bash
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
```

## Verify Everything Works

Open a third terminal and run:
```bash
node check-backend-health.js
```

You should see:
```
✅ All checks passed (3/3)
Backend is healthy and ready!
```

## What Each Part Does

### Backend (Port 10000)
- Handles all API calls
- Provides tRPC routes for:
  - Feed system
  - Market data
  - AI insights  
  - Pulse chat
  - NFT operations
  - Profile management
  - And more...

### Frontend (Port 8081)
- The React Native app you see
- Connects to backend at `http://localhost:10000`
- Makes tRPC calls to backend

## Common Issues

### "Connection refused" or "404 Not Found"
**Solution:** Backend isn't running. Start it with `PORT=10000 node server.js`

### "Port already in use"
**Solution:** Kill the existing process:
```bash
lsof -i :10000
kill -9 <PID>
```

### Routes not showing up
**Solution:** Restart the backend:
```bash
pkill -f "node server.js"
PORT=10000 node server.js
```

## Development Workflow

Keep both terminals open while developing:

**Terminal 1 (Backend):**
```bash
PORT=10000 node server.js
```
Keep this running. Restart when you change backend code.

**Terminal 2 (Frontend):**
```bash
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
```
Keep this running. Hot reload works automatically.

## Quick Health Check

Run this anytime to check status:
```bash
# Check backend
curl http://localhost:10000/health

# Check routes
curl http://localhost:10000/api/routes | grep -o '"count":[0-9]*'

# Or use the script
node check-backend-health.js
```

## Need Help?

If you're still getting 404 errors after starting the backend:

1. **Check backend logs** - Look for errors when it starts
2. **Verify port** - Make sure backend is on port 10000
3. **Check routes** - Run `curl http://localhost:10000/api/routes`
4. **Restart both** - Kill everything and start fresh

## TL;DR

```bash
# Terminal 1: Backend
PORT=10000 node server.js

# Terminal 2: Frontend (wait for backend to be ready first)
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel

# Terminal 3: Verify (optional)
node check-backend-health.js
```

🎯 Both must be running. Backend first, then frontend.
