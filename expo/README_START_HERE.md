# 🚀 R3AL App - Start Here

## 🔴 Are You Getting 404 Errors?

If you see errors like:
```
[tRPC] ❌ Backend health check failed: 404
[tRPC] Error: HTTP 404: 404 Not Found
```

**→ The backend is not running. See [Quick Fix](#quick-fix) below.**

---

## 🎯 Quick Fix

### One-Command Solution
```bash
chmod +x start-all.sh
./start-all.sh
```

This starts both backend and frontend automatically.

### Two-Command Solution

**Terminal 1 (Backend):**
```bash
PORT=10000 node server.js
```

**Terminal 2 (Frontend):**
```bash
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
```

---

## ✅ Verify It's Working

```bash
node check-backend-health.js
```

You should see:
```
✅ All checks passed (3/3)
Backend is healthy and ready!
```

Or test manually:
```bash
curl http://localhost:10000/health
```

---

## 📚 Documentation

- **[COMPLETE_FIX_GUIDE.md](COMPLETE_FIX_GUIDE.md)** - Complete troubleshooting guide
- **[START_APP_PROPERLY.md](START_APP_PROPERLY.md)** - How to start the app
- **[FIX_BACKEND_404.md](FIX_BACKEND_404.md)** - Quick 404 fix reference

---

## 🛠️ Helpful Scripts

### Start Everything
```bash
./start-all.sh
```
Starts backend and opens frontend in new terminal.

### Start Backend Only
```bash
./BACKEND_STARTUP.sh
```
Starts backend with health checks and monitoring.

### Check Health
```bash
node check-backend-health.js
```
Verifies backend is running and routes are registered.

### Check Routes
```bash
curl http://localhost:10000/api/routes
```
Lists all available tRPC routes.

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   React Native  │
│   Port: 8081    │
└────────┬────────┘
         │
         │ HTTP/tRPC
         │
┌────────▼────────┐
│   Backend       │
│   Node + Hono   │
│   Port: 10000   │
└─────────────────┘
```

**Both must be running** for the app to work.

---

## 🔧 Common Issues

### Backend not starting
```bash
# Check if port is in use
lsof -i :10000

# Kill existing process
kill -9 <PID>

# Try again
PORT=10000 node server.js
```

### Still getting 404s
```bash
# Restart everything
pkill -f "node server.js"
pkill -f "bunx rork"
./start-all.sh
```

### Routes not showing
```bash
# Verify routes are registered
curl http://localhost:10000/api/routes | grep -o '"count":[0-9]*'

# Should show 50+ routes
```

---

## 📱 Features

The app includes:
- **Feed System** - Post updates and see trending content
- **Market Data** - Live crypto and stock market info
- **AI Insights** - Personalized analytics and recommendations
- **Pulse Chat** - Real-time messaging with honesty checks
- **NFT Hive** - Create and trade NFTs
- **Profile System** - Photo galleries and endorsements
- **Token Wallet** - Earn and spend trust tokens
- **QOTD** - Daily questions and community engagement
- **Circles** - Private groups and communities

All powered by tRPC API routes in the backend.

---

## 🎯 TL;DR

```bash
# Make scripts executable (one time)
chmod +x start-all.sh BACKEND_STARTUP.sh start-backend-simple.sh

# Start everything (every time)
./start-all.sh

# Or manually (two terminals)
PORT=10000 node server.js                              # Terminal 1
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel      # Terminal 2

# Verify it's working
node check-backend-health.js
```

---

## 🆘 Need Help?

1. Read [COMPLETE_FIX_GUIDE.md](COMPLETE_FIX_GUIDE.md)
2. Check backend logs: `tail -f backend.log`
3. Verify routes: `curl http://localhost:10000/api/routes`
4. Test health: `curl http://localhost:10000/health`

---

## 📊 Status Check

Run this to see what's running:

```bash
# Check backend
curl -s http://localhost:10000/health && echo "Backend: ✅" || echo "Backend: ❌"

# Check frontend
lsof -i :8081 > /dev/null && echo "Frontend: ✅" || echo "Frontend: ❌"

# Check routes
ROUTES=$(curl -s http://localhost:10000/api/routes | grep -o '"count":[0-9]*' | grep -o '[0-9]*' || echo "0")
echo "Routes: $ROUTES"
```

---

**That's it! Start the backend, then the frontend, and everything works. 🎉**
