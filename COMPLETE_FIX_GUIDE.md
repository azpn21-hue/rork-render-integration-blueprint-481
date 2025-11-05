# 🔧 Complete Fix Guide for 404 Backend Errors

## 📋 Quick Diagnosis

You're seeing these errors:
```
[tRPC] ❌ Backend health check failed: 404
[tRPC] Response error: 404 Body: 404 Not Found
[tRPC] ❌ Fetch failed for: .../api/trpc/r3al.market.getSummary
```

### Root Cause
**The backend server is not running.** The frontend app is trying to connect to `http://localhost:10000` but nothing is listening.

## 🚀 Solution: Start the Backend

### Option 1: Automatic (Recommended)
```bash
chmod +x start-all.sh
./start-all.sh
```

This will:
1. Kill any existing processes
2. Start the backend server
3. Wait for it to be ready
4. Open frontend in new terminal
5. Show you the backend logs

### Option 2: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
PORT=10000 node server.js
```

Wait for:
```
✅ Server is running!
📡 Listening on: http://localhost:10000
```

**Terminal 2 - Frontend:**
```bash
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
```

### Option 3: Simple Script
```bash
chmod +x BACKEND_STARTUP.sh
./BACKEND_STARTUP.sh
```

Then in another terminal:
```bash
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
```

## ✅ Verify It's Working

### Quick Test
```bash
curl http://localhost:10000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "R3AL Connection API health check",
  "timestamp": "2025-11-05T..."
}
```

### Full Health Check
```bash
node check-backend-health.js
```

Expected output:
```
✅ All checks passed (3/3)
Backend is healthy and ready!
```

### Check Routes
```bash
curl http://localhost:10000/api/routes
```

You should see 50+ routes including:
- `r3al.feed.getTrending`
- `r3al.feed.getLocal`
- `r3al.market.getSummary`
- `r3al.market.getNews`
- `r3al.ai.getInsights`
- And many more...

## 🐛 Troubleshooting

### Problem: Port Already in Use
```bash
# Find what's using port 10000
lsof -i :10000

# Kill it
kill -9 <PID>

# Or kill all node processes
pkill -f "node server.js"
```

### Problem: Backend Starts Then Crashes
Check the logs:
```bash
# If using start-all.sh or BACKEND_STARTUP.sh
tail -f backend.log

# Or run directly to see errors
PORT=10000 node server.js
```

Common issues:
- **Missing dependencies:** Run `bun install`
- **TypeScript errors:** Check the error message
- **Port permission:** Try different port: `PORT=3000 node server.js`

### Problem: 404 Still Happening After Starting Backend

1. **Check if backend is actually running:**
   ```bash
   curl http://localhost:10000/health
   ```

2. **Check if routes are registered:**
   ```bash
   curl http://localhost:10000/api/routes | grep "r3al"
   ```

3. **Check backend logs for errors:**
   ```bash
   tail -f backend.log
   ```

4. **Restart everything:**
   ```bash
   pkill -f "node server.js"
   pkill -f "bunx rork"
   ./start-all.sh
   ```

### Problem: Backend URL Mismatch

Check your frontend is pointing to the right URL. The backend URL should be:
- Local development: `http://localhost:10000`
- Production: Your deployed backend URL

### Problem: No Routes Showing Up

If `curl http://localhost:10000/api/routes` shows 0 routes or doesn't include r3al routes:

1. **Check router configuration:**
   ```bash
   # Make sure app-router.ts includes r3alRouter
   grep "r3alRouter" backend/trpc/app-router.ts
   ```

2. **Check r3al router:**
   ```bash
   # Verify router exports
   grep "export const r3alRouter" backend/trpc/routes/r3al/router.ts
   ```

3. **Restart with fresh install:**
   ```bash
   rm -rf node_modules bun.lock
   bun install
   PORT=10000 node server.js
   ```

## 📊 What Should Be Running

When everything is working, you should have:

### Process 1: Backend Server
```
Process: node server.js
Port: 10000
Status: Running
Health: http://localhost:10000/health returns 200
```

### Process 2: Frontend App  
```
Process: bunx rork start
Port: 8081 (metro bundler)
Status: Running
Connected to: http://localhost:10000 (backend)
```

### Process 3: Expo App (Optional)
```
Platform: iOS/Android/Web
Running on: Device or simulator
Connected to: Frontend (8081) → Backend (10000)
```

## 🎯 Success Checklist

- [ ] Backend started: `PORT=10000 node server.js`
- [ ] Backend healthy: `curl http://localhost:10000/health` returns 200
- [ ] Routes registered: `curl http://localhost:10000/api/routes` shows 50+ routes
- [ ] R3AL routes present: Response includes `r3al.feed`, `r3al.market`, etc.
- [ ] Frontend started: `bunx rork start` is running
- [ ] Frontend connects: No 404 errors in console
- [ ] App works: Can see feed, market data, etc.

## 🔄 Daily Startup Routine

Every time you want to work on the app:

1. **Start Backend** (Terminal 1):
   ```bash
   ./start-all.sh
   ```
   OR manually:
   ```bash
   PORT=10000 node server.js
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
   ```

3. **Verify** (Terminal 3):
   ```bash
   node check-backend-health.js
   ```

Keep both terminals open while developing.

## 📝 Development Tips

### Backend Changes
When you modify backend code:
```bash
# Stop backend (Ctrl+C)
# Restart
PORT=10000 node server.js
```

### Frontend Changes
Frontend has hot reload, so changes appear automatically. If something breaks:
```bash
# Press 'r' in the metro bundler terminal to reload
# Or restart the frontend
```

### Full Reset
If everything is broken:
```bash
# Kill all processes
pkill -f "node server.js"
pkill -f "bunx rork"

# Clear caches
rm -rf node_modules/.cache
rm -rf .expo

# Restart
./start-all.sh
```

## 🆘 Still Having Issues?

If you've tried everything and still getting 404s:

1. **Share backend logs:**
   ```bash
   tail -n 50 backend.log
   ```

2. **Share route check:**
   ```bash
   curl http://localhost:10000/api/routes
   ```

3. **Share error details:**
   - Exact error message
   - Which route is failing
   - Browser console logs

## 📚 Related Files

- `FIX_BACKEND_404.md` - Quick fix guide
- `START_APP_PROPERLY.md` - Simple startup instructions
- `start-all.sh` - Automated startup script
- `BACKEND_STARTUP.sh` - Backend-only startup
- `check-backend-health.js` - Health check script

## 🎉 Summary

**The fix is simple:** Start the backend server!

```bash
# One command solution
./start-all.sh

# Or two commands
PORT=10000 node server.js  # Terminal 1
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel  # Terminal 2
```

That's it! The 404 errors happen because the backend isn't running. Once it's running, all the routes will work perfectly.
