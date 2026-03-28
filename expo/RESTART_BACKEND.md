# Backend Restart Guide

## Issue
The following routes are returning 404 errors:
- `r3al.ai.getInsights`
- `r3al.market.getSummary`
- `r3al.market.getNews`
- `r3al.feed.getTrending`
- `r3al.location.*`

## Cause
The routes are properly configured in the code but the backend server needs to be restarted to pick them up.

## Solution

### Option 1: Use the start script (Recommended)
```bash
bash start-backend.sh
```

### Option 2: Manual start
```bash
bun run backend/hono.ts
```

### Option 3: Kill existing process and restart
```bash
# Find the backend process
lsof -i :10000

# Kill it (replace PID with the actual process ID)
kill -9 <PID>

# Restart
bun run backend/hono.ts
```

## Verification
After restarting, check these endpoints in your browser or with curl:

1. **Health Check:**
   ```
   https://a-0tdbje4pxpous1z5u1td3.rorktest.dev/health
   ```

2. **Routes List:**
   ```
   https://a-0tdbje4pxpous1z5u1td3.rorktest.dev/api/routes
   ```
   
   This should show all available routes including:
   - `r3al.ai.getInsights`
   - `r3al.market.getSummary`
   - `r3al.market.getNews`
   - `r3al.feed.getTrending`
   - And all other r3al routes

3. **Test a specific route:**
   The app should now work without 404 errors.

## What the backend logs should show:
```
[Backend] Initializing Hono application...
[Backend] Setting up CORS...
[Backend] Registering tRPC server at /api/trpc/*
[Backend] Found XX available routes
[Backend] Routes: example.hi, auth.login, auth.register...
[Backend] R3AL routes: XX found
[Backend] R3AL route examples: r3al.ai.getInsights, r3al.market.getSummary...
```

If you see "WARNING: No r3al routes found!" then there's a configuration issue.
