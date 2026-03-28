# Backend Troubleshooting Guide

## Issue: tRPC 404 Errors on Rork Platform

### Symptoms
```
[tRPC] Response error: 404 Body: 404 Not Found
[tRPC] 404 Error - Route not found. Check if backend is running and route exists.
[tRPC] Requested URL: https://xxx.rork.live/api/trpc/r3al.tokens.getBalance
```

### Root Cause
The backend (`server.js`) is not running or not accessible on the Rork platform deployment.

### How Rork Platform Works
1. **Automatic Backend Detection**: Rork platform automatically detects `server.js` in your project root
2. **Same-Origin Serving**: Both frontend and backend are served from the same domain (e.g., `https://xxx.rork.live`)
3. **API Routes**: Backend API is accessible at `https://xxx.rork.live/api/trpc/*`

### Verification Steps

#### 1. Check if Backend is Running Locally

```bash
# Start the backend locally
node server.js
```

Expected output:
```
============================================================
🚀 Starting R3AL Connection Backend...
📡 Port: 10000
🌍 Environment: development
============================================================
📦 Loading backend application...
[Backend] Initializing Hono application...
[Backend] Setting up CORS...
[Backend] Registering tRPC server at /api/trpc/*
[Backend] tRPC server registered successfully
✅ Backend application loaded successfully

📍 Available endpoints:
  • GET  /           - Root endpoint
  • GET  /health     - Health check
  • POST /api/trpc/* - tRPC API
============================================================
✅ Server is running!
📡 Listening on: http://localhost:10000
🧪 Try: http://localhost:10000/health
============================================================
```

#### 2. Test Endpoints Locally

```bash
# Test health endpoint
curl http://localhost:10000/health

# Expected response:
{
  "status": "healthy",
  "message": "R3AL Connection API health check",
  "timestamp": "2025-01-XX..."
}

# Test root endpoint
curl http://localhost:10000/

# Expected response:
{
  "status": "ok",
  "message": "R3AL Connection API is running",
  "timestamp": "2025-01-XX...",
  "version": "1.0.0"
}
```

#### 3. Test tRPC Routes Locally

Open browser and navigate to:
- `http://localhost:10000/api/trpc/example.hi` (should return tRPC response)
- Use the API test page: Navigate to `/api-test` in your app

#### 4. Check Rork Platform Logs

When deployed on Rork platform:
1. Check the Rork console for backend startup logs
2. Look for the initialization messages from `server.js`
3. Verify no errors during backend loading

### Common Issues & Solutions

#### Issue 1: Dependencies Not Installed
**Symptom**: `Cannot find module 'hono'` or similar errors

**Solution**:
```bash
npm install --legacy-peer-deps
# or
bun install
```

#### Issue 2: TypeScript Compilation Errors
**Symptom**: Backend crashes on startup with TS errors

**Solution**: Check `tsconfig.json` and ensure `ts-node` is properly configured

#### Issue 3: Port Conflicts
**Symptom**: `Error: listen EADDRINUSE: address already in use :::10000`

**Solution**:
```bash
# Find and kill process on port 10000
lsof -ti:10000 | xargs kill -9
# or use a different port
PORT=10001 node server.js
```

#### Issue 4: CORS Issues
**Symptom**: CORS errors in browser console

**Solution**: The backend already includes `.rork.live` and `.rork.app` in allowed origins (see `backend/hono.ts` lines 24-26)

### Testing on Rork Platform

Once deployed, you can:

1. **Use the API Test Page**: 
   - Navigate to `/api-test` in your deployed app
   - This will test all endpoints and show detailed results

2. **Check Direct Endpoints**:
   ```bash
   # Replace xxx with your actual subdomain
   curl https://xxx.rork.live/health
   curl https://xxx.rork.live/api/trpc/health
   ```

3. **Check Browser Console**:
   - Open browser DevTools
   - Look for `[Backend]` and `[tRPC]` logs
   - Verify the base URL is correct

### Manual Backend Start (Development)

For local development, you can start the backend separately:

```bash
# Terminal 1: Start backend
node server.js

# Terminal 2: Start Expo (frontend only)
npm start
```

### File Structure Check

Ensure these files exist and are correct:

```
project/
├── server.js                    ✓ Entry point
├── backend/
│   ├── hono.ts                 ✓ Main backend app
│   └── trpc/
│       ├── app-router.ts       ✓ Main router
│       ├── create-context.ts   ✓ Context
│       └── routes/
│           └── r3al/
│               ├── router.ts   ✓ R3AL router
│               └── tokens/
│                   ├── get-balance.ts      ✓
│                   ├── earn-tokens.ts      ✓
│                   ├── spend-tokens.ts     ✓
│                   └── get-transactions.ts ✓
└── lib/
    └── trpc.ts                 ✓ Client config
```

### Environment Variables

Check `.env` file has:

```bash
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:10000  # for local dev
API_PORT=10000
```

For production on Rork platform, these are automatically handled.

### Still Having Issues?

1. **Clear cache and rebuild**:
   ```bash
   rm -rf node_modules
   npm install --legacy-peer-deps
   ```

2. **Check Rork platform status**: The platform might be experiencing issues

3. **Verify all dependencies are installed**: Check `package.json` includes all required packages

4. **Test with minimal setup**: Try accessing just `/health` endpoint first

### Debug Mode

Enable verbose logging by adding to your `.env`:
```bash
DEBUG=*
NODE_ENV=development
```

Then restart the backend and check logs for detailed information.
