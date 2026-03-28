# 🚀 How to Run Your R3AL App

## The Setup You Need

Your app has **TWO parts** that must run together:

```
┌─────────────────────────────────┐
│   BACKEND (Port 10000)          │
│   • Handles data                │
│   • Processes requests          │
│   • Stores tokens/NFTs/etc      │
└─────────────────────────────────┘
              ↕️
        tRPC Connection
              ↕️
┌─────────────────────────────────┐
│   FRONTEND (Port 8081/19006)    │
│   • React Native UI             │
│   • User interactions           │
│   • Display data                │
└─────────────────────────────────┘
```

## Step-by-Step Startup

### 📋 Before You Start

Check that routes are configured:
```bash
node scripts/check-backend-routes.js
```

Expected output:
```
✅ Backend router loaded successfully
📊 Total procedures: 50+
✅ All expected route groups are present!
```

### 1️⃣ Start Backend (Terminal 1)

Open a new terminal and run:
```bash
./start-backend.sh
```

**What you should see:**
```
🚀 Starting R3AL Connection Backend...
📡 Port: 10000
[Backend] Found 52 available routes
[Backend] R3AL routes: 42 found
✅ Server is running!
📡 Listening on: http://localhost:10000
```

**Keep this terminal open!** ← Backend must stay running

### 2️⃣ Start Frontend (Terminal 2)

Open a **NEW** terminal and run:
```bash
bun start
```

**What you should see:**
```
› Metro waiting on exp://...
› Opening on iOS...
› Opening on Android...
```

**Keep this terminal open too!** ← Frontend must stay running

### 3️⃣ Test It Works

#### Option A: Command Line Test
```bash
curl http://localhost:10000/health
```

Should return:
```json
{"status":"healthy","message":"R3AL Connection API health check",...}
```

#### Option B: In-App Test
1. Open your app (simulator/browser)
2. Navigate to `/backend-test`
3. Click "Run All Tests"
4. All should show ✅ SUCCESS

#### Option C: Test Real Features
- Navigate to `/r3al/qotd` → Should load daily question
- Navigate to `/r3al/home` → Should show token balance
- Navigate to `/r3al/pulse-chat` → Should work
- Navigate to `/r3al/hive` → Should show NFT gallery

## 🎯 You're Done!

If you see both terminals running and tests passing, you're all set!

## Common Scenarios

### First Time Setup
```bash
# Terminal 1
chmod +x start-backend.sh
./start-backend.sh

# Terminal 2  
bun start
```

### Daily Development
```bash
# Terminal 1 - Backend
./start-backend.sh

# Terminal 2 - Frontend
bun start
```

### Restart Everything
```bash
# Stop both terminals (Ctrl+C)

# Kill any stuck processes
lsof -ti:10000 | xargs kill -9
lsof -ti:8081 | xargs kill -9

# Start backend (Terminal 1)
./start-backend.sh

# Start frontend (Terminal 2)
bun start
```

## Visual Checklist

### ✅ Backend Running Correctly
- [ ] Terminal shows "Server is running!"
- [ ] Port 10000 is listening
- [ ] Routes count shows 40+ R3AL routes
- [ ] No error messages in terminal
- [ ] `curl http://localhost:10000/health` works

### ✅ Frontend Running Correctly
- [ ] Terminal shows "Metro waiting..."
- [ ] App opens in simulator/browser
- [ ] No tRPC 404 errors in console
- [ ] Backend test page shows SUCCESS
- [ ] Features load data correctly

## What If Something's Wrong?

### Backend Won't Start
```bash
# Check if port is in use
lsof -i:10000

# Kill the process
lsof -ti:10000 | xargs kill -9

# Try again
./start-backend.sh
```

### Getting 404 Errors
1. **Check backend is running:** `curl http://localhost:10000/health`
2. **Check routes exist:** `curl http://localhost:10000/api/routes`
3. **Check frontend sees backend:** Go to `/backend-test` in app
4. **Restart both:** Kill both processes and start again

### Rate Limiting (429 Errors)
This is **normal** on free hosting tiers. The app automatically retries.

To reduce frequency:
- Backend uses in-memory storage (fast)
- Frontend caches with React Query
- Automatic retry with exponential backoff

## Production Deployment

### For Render.com
1. Create new Web Service
2. Connect your repository
3. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Port:** Auto-detected
4. Environment variables:
   - `NODE_ENV=production`
5. Health check: `/health`

### For Other Platforms
Same settings work on:
- Railway.app
- Fly.io
- Heroku
- Any Node.js hosting

## Need Help?

### Quick References
- **Quick Start:** `START_BACKEND_FIRST.md`
- **Troubleshooting:** `PULSE_NFT_QOTD_FIX_GUIDE.md`
- **Backend Details:** `BACKEND_STARTUP_GUIDE.md`
- **This File:** Overview and workflow

### Diagnostic Tools
- `node scripts/check-backend-routes.js` - Check route config
- `/backend-test` in app - Test connections
- `curl http://localhost:10000/api/routes` - List all routes

## Remember

🔑 **KEY POINT:** You need **TWO terminals running at the same time**

1. Terminal 1: Backend (`./start-backend.sh`)
2. Terminal 2: Frontend (`bun start`)

That's it! Both must be running for Pulse, NFT, QOTD to work.

## Quick Commands Reference

```bash
# Check routes configured
node scripts/check-backend-routes.js

# Start backend
./start-backend.sh

# Start frontend (separate terminal)
bun start

# Test backend
curl http://localhost:10000/health

# Kill stuck processes
lsof -ti:10000 | xargs kill -9

# See what's using port
lsof -i:10000
```

---

**That's everything you need to know!** 🎉

Start both terminals, verify tests pass, and you're ready to develop!
