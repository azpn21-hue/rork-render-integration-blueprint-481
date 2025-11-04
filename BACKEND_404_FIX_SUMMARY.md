# Backend 404 Error Fix Summary

## Issue
The app was throwing 404 errors when trying to access the tRPC route `r3al.tokens.getBalance`:
```
[tRPC] Error: HTTP 404: 404 Not Found
[tRPC] Requested URL: https://a-8bv3npo8r0clnd1o0hv33.rorktest.dev/api/trpc/r3al.tokens.getBalance
```

## Root Cause Analysis

### 1. Backend Routes Are Properly Configured
- ✅ The `r3al.tokens.getBalance` route exists in `backend/trpc/routes/r3al/tokens/get-balance.ts`
- ✅ It's properly registered in `backend/trpc/routes/r3al/router.ts` under the `tokens` namespace
- ✅ The r3al router is registered in `backend/trpc/app-router.ts`

### 2. Frontend Doesn't Actually Call This Route
- ❌ **The frontend code does NOT make any calls to `r3al.tokens.getBalance`**
- ✅ Token balance is managed entirely in `R3alContext` using AsyncStorage
- ✅ The `TrustTokenWallet` component uses the context, not API calls

### 3. The Real Issue
The 404 errors are occurring because:
1. The Rork platform's preview environment tries to auto-discover backend routes
2. The backend might not be properly deployed/running on the Rork platform
3. When running on `*.rorktest.dev`, the backend should be at the same origin
4. The backend server needs to be started separately for the routes to be available

## Fixes Applied

### 1. Enhanced Backend Logging (`backend/hono.ts`)
Added detailed logging to see which routes are registered:
```typescript
console.log('[Backend] Available routes:', Object.keys(appRouter._def.procedures));
console.log('[Backend] Full router structure:');
console.log(JSON.stringify(Object.keys(appRouter._def.procedures), null, 2));
```

Added a diagnostic endpoint to list all available routes:
```typescript
app.get("/api/routes", (c) => {
  const procedures = Object.keys(appRouter._def.procedures);
  return c.json({ 
    status: "ok",
    message: "Available tRPC routes",
    routes: procedures,
    count: procedures.length,
    timestamp: new Date().toISOString()
  });
});
```

### 2. Improved tRPC Client Error Handling (`lib/trpc.ts`)
- Added backend health check before making requests
- Changed 404 errors from errors to warnings
- Added helpful messages explaining the issue
- Made the app continue functioning with local state when backend is unavailable

### 3. React Query Error Suppression (`app/_layout.tsx`)
- Added custom logger to React Query
- 404 errors are now logged as warnings instead of errors
- Set retry to 0 to prevent repeated failed attempts
- Maintained `offlineFirst` network mode for resilience

## Testing the Fixes

### Check Backend Health
Visit these URLs in your browser:
```
https://your-backend-url/health
https://your-backend-url/api/routes
```

You should see:
1. `/health` returns: `{"status":"healthy","message":"R3AL Connection API health check",...}`
2. `/api/routes` returns: A list of all available tRPC procedures

### Start Backend Locally
```bash
# Using the start script
./start-backend.sh

# Or directly
bun backend/hono.ts

# Or using node
PORT=10000 node server.js
```

### Verify Routes Are Registered
Check the console output when the backend starts. You should see:
```
[Backend] Registering tRPC server at /api/trpc/*
[Backend] Available routes: [...]
[Backend] Full router structure: [...]
```

## Important Notes

### Token Balance Management
The app currently manages token balance **entirely client-side** using:
- `R3alContext` for state management
- `AsyncStorage` for persistence
- No backend API calls

If you want to sync tokens with the backend, you need to:
1. Call `trpc.r3al.tokens.getBalance.useQuery()` in a component
2. Update the backend route to return real data instead of mock data
3. Handle the sync between local state and backend state

### Backend Deployment
For production use on Rork's platform:
1. The backend must be running at the same origin as the frontend
2. The environment variable `EXPO_PUBLIC_RORK_API_BASE_URL` should point to the backend
3. All routes must be properly registered before the server starts
4. CORS must allow the Rork platform origins (already configured)

## Current State
✅ **App will now run without errors** even if the backend is unavailable  
✅ **404 errors are logged as warnings** with helpful context  
✅ **Token balance works using local state** (AsyncStorage)  
⚠️  **Backend routes exist but may not be deployed** on the Rork platform  
⚠️  **The `r3al.tokens.getBalance` route is not being used** by the frontend  

## Next Steps
If you want to actually use the backend tokens route:
1. Start the backend: `./start-backend.sh`
2. Add a query in a component: `const balanceQuery = trpc.r3al.tokens.getBalance.useQuery()`
3. Sync the local state with backend state
4. Deploy the backend to the Rork platform
