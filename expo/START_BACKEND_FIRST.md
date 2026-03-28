# ⚠️ IMPORTANT: Start Backend First

## The Problem
You're seeing 404 errors for Pulse, NFT Hive, and QOTD features because **the backend server isn't running**.

## The Fix (3 Steps)

### 1️⃣ Check Routes Are Configured
```bash
node scripts/check-backend-routes.js
```
✅ Should show 40+ R3AL routes registered

### 2️⃣ Start Backend Server
```bash
chmod +x start-backend.sh
./start-backend.sh
```
✅ Should show: "Server is running on http://localhost:10000"

### 3️⃣ Start Frontend (New Terminal)
```bash
bun start
```
✅ Frontend connects to backend automatically

## Quick Test

After backend is running:
```bash
curl http://localhost:10000/health
```

Should return: `{"status":"healthy",...}`

## In-App Testing

Navigate to `/backend-test` in your app and click "Run All Tests"
- All tests should show ✅ SUCCESS
- If any show ❌ ERROR, backend isn't running correctly

## Full Documentation

- **Quick Start:** See `PULSE_NFT_QOTD_FIX_GUIDE.md`
- **Backend Details:** See `BACKEND_STARTUP_GUIDE.md`
- **Troubleshooting:** See both guides above

## TL;DR

**You need TWO terminal windows:**
1. Terminal 1: `./start-backend.sh` ← Backend on port 10000
2. Terminal 2: `bun start` ← Frontend on port 8081

Both must run simultaneously! 🎯
