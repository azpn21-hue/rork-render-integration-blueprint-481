# R3AL Backend Startup Guide

## Quick Start

### 1. Check Backend Routes
First, verify all routes are properly configured:
```bash
node scripts/check-backend-routes.js
```

This will show you:
- All available tRPC routes
- Specifically which Token, NFT, QOTD, and Pulse Chat routes are registered
- Any missing route groups

### 2. Start the Backend Server

**Option A: Using the startup script (recommended)**
```bash
chmod +x start-backend.sh
./start-backend.sh
```

**Option B: Using Node directly**
```bash
PORT=10000 node server.js
```

**Option C: Using Bun**
```bash
PORT=10000 bun run server.js
```

### 3. Verify Backend is Running

Once started, you should see:
```
✅ Server is running!
📡 Listening on: http://localhost:10000
```

Test the endpoints:
```bash
# Health check
curl http://localhost:10000/health

# List all routes
curl http://localhost:10000/api/routes

# Root endpoint
curl http://localhost:10000/
```

### 4. Check for Route Registration

When the backend starts, it will log:
```
[Backend] Found XX available routes
[Backend] R3AL routes: XX found
```

If you see `R3AL routes: 0 found`, there's a problem with the router configuration.

## Common Issues

### Issue 1: 404 Not Found Errors
**Symptoms:** Frontend shows `[tRPC] 404 Error - Route not found`

**Solutions:**
1. Ensure backend is running on port 10000
2. Check `EXPO_PUBLIC_RORK_API_BASE_URL` environment variable
3. Run `node scripts/check-backend-routes.js` to verify routes exist
4. Check backend logs for route registration

### Issue 2: Rate Limiting (429 Errors)
**Symptoms:** `[tRPC] ⚠️ 429 - Rate limited`

**Solutions:**
1. This happens on free hosting tiers (like Render)
2. Reduce number of simultaneous requests
3. Implement request caching on frontend
4. Consider upgrading hosting plan

### Issue 3: Backend Won't Start
**Symptoms:** Port already in use or server crashes

**Solutions:**
```bash
# Kill process on port 10000
lsof -ti:10000 | xargs kill -9

# Or use the startup script which does this automatically
./start-backend.sh
```

### Issue 4: Routes Not Registering
**Symptoms:** Backend starts but routes are missing

**Check:**
1. All route files exist in `backend/trpc/routes/r3al/`
2. Routes are properly exported from each file
3. Routes are imported in `backend/trpc/routes/r3al/router.ts`
4. R3AL router is imported in `backend/trpc/app-router.ts`

## Environment Variables

Required environment variables:
```bash
PORT=10000                                    # Backend server port
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:10000  # For local development
```

## Testing Routes

### Test Token Balance
```bash
curl "http://localhost:10000/api/trpc/r3al.tokens.getBalance" \
  -H "Authorization: Bearer test-token"
```

### Test QOTD
```bash
curl "http://localhost:10000/api/trpc/r3al.qotd.getDaily"
```

### Test Health
```bash
curl "http://localhost:10000/api/trpc/health"
```

## Development Workflow

1. **Start backend:** `./start-backend.sh`
2. **Start frontend:** `bun start` (in another terminal)
3. **Check logs:** Watch both terminal windows for errors
4. **Verify routes:** Visit `/api/routes` endpoint

## Production Deployment

For Render.com or similar:
1. Set `PORT` environment variable (usually auto-set)
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add environment variable: `NODE_ENV=production`

## Debugging

Enable verbose logging:
```bash
DEBUG=* node server.js
```

Check specific route:
```bash
curl -v "http://localhost:10000/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D"
```

## Next Steps

After backend is running:
1. Open your app in browser/simulator
2. Navigate to features (Pulse, NFT Hive, QOTD)
3. Check browser console for any errors
4. Check backend terminal for request logs
