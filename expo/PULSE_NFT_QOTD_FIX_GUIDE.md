# Pulse / NFT / QOTD Fix Guide

## Problem
The Pulse Chat, NFT Hive, and QOTD features are not working, showing 404 errors for backend routes.

## Root Cause
The backend server needs to be running separately from the frontend. The tRPC routes are correctly configured but the backend isn't started.

## Solution

### Step 1: Verify Route Configuration

Run the diagnostic script to confirm all routes are properly set up:

```bash
node scripts/check-backend-routes.js
```

**Expected output:**
```
📊 Total procedures: 50+
🎯 R3AL Routes Summary:
  Total R3AL routes: 40+
  • Token routes: 4 - r3al.tokens.getBalance, r3al.tokens.earnTokens, ...
  • NFT routes: 4+ - r3al.createNFT, r3al.listNFTForSale, ...
  • QOTD routes: 3 - r3al.qotd.getDaily, r3al.qotd.submitAnswer, ...
  • Pulse Chat routes: 7 - r3al.pulseChat.startSession, ...
✅ All expected route groups are present!
```

### Step 2: Start the Backend Server

**Option A: Using startup script (Recommended)**
```bash
chmod +x start-backend.sh
./start-backend.sh
```

**Option B: Manual start**
```bash
PORT=10000 node server.js
```

**Expected output:**
```
🚀 Starting R3AL Connection Backend...
📡 Port: 10000
[Backend] Found 50+ available routes
[Backend] R3AL routes: 40+ found
✅ Server is running!
📡 Listening on: http://localhost:10000
```

### Step 3: Verify Backend is Running

Test the backend endpoints:

```bash
# Health check
curl http://localhost:10000/health

# Should return: {"status":"healthy","message":"R3AL Connection API health check",...}

# List all routes
curl http://localhost:10000/api/routes

# Should return: {"routes":["health","example.hi","r3al.tokens.getBalance",...]}
```

### Step 4: Test in App

1. **Using Test Page:**
   - Navigate to `/backend-test` in your app
   - Click "Run All Tests"
   - All tests should show "SUCCESS" status
   - You should see actual data returned

2. **Test Individual Features:**
   - **QOTD:** Navigate to `/r3al/qotd` - should show daily question
   - **Token Balance:** Go to `/r3al/home` - should show your token balance
   - **Pulse Chat:** Go to `/r3al/pulse-chat` - should be able to start session
   - **NFT Hive:** Go to `/r3al/hive` - should show NFT gallery

## Common Issues & Fixes

### Issue 1: Port Already in Use
**Symptom:** `Error: listen EADDRINUSE: address already in use :::10000`

**Fix:**
```bash
# Kill process on port 10000
lsof -ti:10000 | xargs kill -9

# Then restart
./start-backend.sh
```

### Issue 2: Backend Not Found (404s)
**Symptom:** `[tRPC] 404 Error - Route not found`

**Fix:**
1. Ensure backend is running: `curl http://localhost:10000/health`
2. Check environment variable: `echo $EXPO_PUBLIC_RORK_API_BASE_URL`
3. For local dev, it should be: `http://localhost:10000`
4. Check frontend is pointing to correct URL in console logs

### Issue 3: CORS Errors
**Symptom:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Fix:**
The backend already has CORS configured for:
- `localhost:19006` (Expo web)
- `localhost:8081` (Metro)
- `.rork.live`, `.rork.app`, `.rorktest.dev` domains

If you need to add more origins, edit `backend/hono.ts` line 11-33.

### Issue 4: Rate Limiting (429)
**Symptom:** `[tRPC] ⚠️ 429 - Rate limited`

**This is expected on free hosting tiers** - the app will automatically retry. To reduce occurrences:
1. Increase `staleTime` in React Query configs
2. Set `refetchOnWindowFocus: false`
3. Use `enabled: false` for non-critical queries

### Issue 5: Routes Show as Missing
**Symptom:** Route diagnostic shows 0 routes or missing route groups

**Fix:**
1. Check for TypeScript compilation errors: `npm run lint`
2. Ensure all route files exist in `backend/trpc/routes/r3al/`
3. Verify imports in `backend/trpc/routes/r3al/router.ts`
4. Check that r3alRouter is imported in `backend/trpc/app-router.ts`

## Development Workflow

### Running Both Frontend and Backend

**Terminal 1 - Backend:**
```bash
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
bun start
```

Keep both terminals open and monitor logs from both.

### Quick Status Check

```bash
# Check if backend is running
curl http://localhost:10000/health

# Check routes are registered
curl http://localhost:10000/api/routes | grep "r3al"

# Test specific route
curl "http://localhost:10000/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D"
```

## Production Deployment

### Environment Variables Required

```bash
PORT=10000                                            # Auto-set by most hosts
NODE_ENV=production
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-api.com   # Your production backend URL
```

### For Render.com

1. **Build Command:** `npm install`
2. **Start Command:** `node server.js`
3. **Environment Variables:**
   - `NODE_ENV=production`
   - PORT is auto-set by Render
4. **Health Check Path:** `/health`

### For Other Hosts

Ensure:
1. Port can be configured via `PORT` environment variable
2. Node.js 18+ is available
3. Build process installs dependencies
4. Start command runs `node server.js`

## Testing Checklist

After starting backend, verify:

- [ ] Backend health endpoint responds: `curl http://localhost:10000/health`
- [ ] Routes are listed: `curl http://localhost:10000/api/routes`
- [ ] R3AL routes are present in routes list
- [ ] Frontend can connect: Check `/backend-test` page
- [ ] QOTD loads: Navigate to `/r3al/qotd`
- [ ] Token balance shows: Navigate to `/r3al/home`
- [ ] Pulse Chat works: Navigate to `/r3al/pulse-chat`
- [ ] NFT Hive loads: Navigate to `/r3al/hive`

## Quick Debug Commands

```bash
# Check what's running on port 10000
lsof -i:10000

# Test backend health
curl -v http://localhost:10000/health

# See all available routes
curl http://localhost:10000/api/routes | jq '.routes'

# Test token balance endpoint
curl "http://localhost:10000/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D" | jq

# Check backend logs in real-time
# (run this in backend terminal to see all requests)
```

## Still Not Working?

If you've followed all steps and it's still not working:

1. **Check logs:** Look at backend terminal for errors
2. **Check browser console:** Look for error messages
3. **Restart everything:**
   ```bash
   # Kill all processes
   lsof -ti:10000 | xargs kill -9
   lsof -ti:8081 | xargs kill -9
   
   # Start backend
   ./start-backend.sh
   
   # In new terminal, start frontend
   bun start
   ```
4. **Clear cache:**
   ```bash
   rm -rf node_modules/.cache
   bun start --reset-cache
   ```

## Summary

The core issue is that **backend and frontend are separate processes**:
- Backend runs on port 10000 (via `node server.js`)
- Frontend runs on port 8081/19006 (via `bun start`)
- Frontend connects to backend via tRPC

Both must be running simultaneously for full functionality.
