# ⚡ Fix 404 Errors RIGHT NOW

## The Problem
```
[tRPC] ❌ Backend health check failed: 404
[tRPC] Error: HTTP 404: 404 Not Found
```

## The Solution (30 seconds)

### Step 1: Make scripts executable
```bash
chmod +x setup-scripts.sh && ./setup-scripts.sh
```

### Step 2: Start backend
```bash
./start-all.sh
```

**Done!** ✅

---

## Alternative (Manual - 2 commands)

### Terminal 1: Backend
```bash
PORT=10000 node server.js
```
Wait for: `✅ Server is running!`

### Terminal 2: Frontend
```bash
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
```

**Done!** ✅

---

## Verify It Worked

```bash
curl http://localhost:10000/health
```

Should return:
```json
{"status":"healthy","message":"R3AL Connection API health check",...}
```

---

## Why This Happens

Your app has two parts:
1. **Frontend** (React Native) - The UI you see
2. **Backend** (Node.js API) - Handles data and logic

The 404 errors mean **the backend isn't running**.

When you start the backend, all routes become available:
- Feed system
- Market data  
- AI insights
- Pulse chat
- NFT operations
- Profile management
- Everything else

---

## If It's Still Not Working

### Check if backend is actually running:
```bash
lsof -i :10000
```
Should show a node process. If not, backend isn't running.

### Check routes are registered:
```bash
curl http://localhost:10000/api/routes
```
Should show 50+ routes including r3al.feed, r3al.market, etc.

### Check for errors:
```bash
tail -f backend.log
```
Look for error messages.

### Restart everything:
```bash
pkill -f "node server.js"
pkill -f "bunx rork"
./start-all.sh
```

---

## Quick Reference

| Command | What It Does |
|---------|-------------|
| `./start-all.sh` | Start backend + frontend |
| `PORT=10000 node server.js` | Start backend only |
| `curl http://localhost:10000/health` | Test backend |
| `node check-backend-health.js` | Full health check |
| `pkill -f "node server.js"` | Stop backend |

---

## Need More Help?

Read these in order:
1. **[QUICK_START.md](QUICK_START.md)** - Quick reference
2. **[START_APP_PROPERLY.md](START_APP_PROPERLY.md)** - Detailed startup guide
3. **[COMPLETE_FIX_GUIDE.md](COMPLETE_FIX_GUIDE.md)** - Full troubleshooting

---

## TL;DR

```bash
chmod +x setup-scripts.sh && ./setup-scripts.sh
./start-all.sh
```

**That's it.** Your 404 errors are fixed. 🎉
