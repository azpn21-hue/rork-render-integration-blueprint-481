# Quick Fix Summary: Pulse / NFT / QOTD Features

## What's Wrong
Pulse Chat, NFT Hive, and QOTD features show 404 errors because **the backend server needs to be started separately**.

## Files Created to Help You

1. **`START_BACKEND_FIRST.md`** - Start here! Quick 3-step guide
2. **`PULSE_NFT_QOTD_FIX_GUIDE.md`** - Comprehensive troubleshooting guide
3. **`BACKEND_STARTUP_GUIDE.md`** - Detailed backend setup and testing
4. **`start-backend.sh`** - Script to easily start the backend
5. **`scripts/check-backend-routes.js`** - Verify all routes are configured
6. **`app/backend-test.tsx`** - In-app testing page at `/backend-test`

## Quick Fix (Copy & Paste)

### Terminal 1 - Start Backend:
```bash
chmod +x start-backend.sh
./start-backend.sh
```

### Terminal 2 - Start Frontend:
```bash
bun start
```

## Verify It's Working

### Option 1: Command Line
```bash
curl http://localhost:10000/health
curl http://localhost:10000/api/routes
```

### Option 2: In App
Navigate to `/backend-test` in your app and click "Run All Tests"

### Option 3: Test Features
- Go to `/r3al/qotd` - Should show daily question
- Go to `/r3al/home` - Should show token balance
- Go to `/r3al/pulse-chat` - Should work
- Go to `/r3al/hive` - Should show NFT gallery

## What Was Fixed

### 1. Enhanced Logging
- `backend/hono.ts` now logs:
  - Total number of routes registered
  - Specific R3AL routes count
  - Warning if R3AL routes are missing

### 2. Diagnostic Tools
- `scripts/check-backend-routes.js` - Checks route configuration
- `app/backend-test.tsx` - In-app connection testing

### 3. Startup Scripts
- `start-backend.sh` - One-command backend startup
- Auto-kills existing process on port 10000
- Works with both Node.js and Bun

### 4. Documentation
- Three comprehensive guides for different use cases
- Common issues and solutions documented
- Development workflow clearly explained

## Technical Details

### Architecture
- **Backend:** Hono + tRPC server on port 10000
- **Frontend:** Expo + React Native on port 8081
- **Connection:** Frontend calls backend via tRPC client

### Routes Structure
```
/api/trpc/
  ├─ r3al.tokens.getBalance
  ├─ r3al.tokens.earnTokens
  ├─ r3al.tokens.spendTokens
  ├─ r3al.qotd.getDaily
  ├─ r3al.qotd.submitAnswer
  ├─ r3al.pulseChat.startSession
  ├─ r3al.pulseChat.sendMessage
  ├─ r3al.createNFT
  ├─ r3al.listNFTForSale
  └─ ... (40+ total R3AL routes)
```

### Backend Files
- `backend/hono.ts` - Main server setup
- `backend/trpc/app-router.ts` - Root router
- `backend/trpc/routes/r3al/router.ts` - R3AL routes registry
- `backend/trpc/routes/r3al/*/` - Individual route implementations
- `server.js` - Server entry point

## Common Issues

### 404 Errors
**Cause:** Backend not running
**Fix:** Start backend with `./start-backend.sh`

### 429 Rate Limit
**Cause:** Free hosting tier limits (normal on Render.com)
**Fix:** App auto-retries; consider reducing query frequency

### Port in Use
**Cause:** Old backend process still running
**Fix:** Script auto-kills it, or manually: `lsof -ti:10000 | xargs kill -9`

## Production Deployment

For Render.com or similar platforms:
1. Set start command to: `node server.js`
2. Set build command to: `npm install`
3. Environment variable: `NODE_ENV=production`
4. Health check path: `/health`

The frontend will automatically detect it's running on a Rork domain and use the same origin for backend calls.

## Need More Help?

1. Read `START_BACKEND_FIRST.md` for quick start
2. Read `PULSE_NFT_QOTD_FIX_GUIDE.md` for troubleshooting
3. Run `node scripts/check-backend-routes.js` to diagnose
4. Check backend terminal for error messages
5. Use `/backend-test` page in app to test connections

## Summary

✅ **Backend routes are correctly configured**
✅ **All necessary files are in place**
✅ **Diagnostic tools are created**
✅ **Documentation is comprehensive**

🎯 **You just need to start the backend server!**

Run: `./start-backend.sh` in one terminal
Run: `bun start` in another terminal

Both must be running simultaneously for full functionality.
