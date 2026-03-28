# Backend Start Guide

## Quick Start

### Option 1: Using the Start Script (Recommended)
```bash
chmod +x start-backend.sh
./start-backend.sh
```

### Option 2: Using Bun Directly
```bash
PORT=10000 bun backend/hono.ts
```

### Option 3: Using Node.js
```bash
PORT=10000 node server.js
```

## Verify Backend is Running

### 1. Check Health Endpoint
```bash
curl http://localhost:10000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "R3AL Connection API health check",
  "timestamp": "2025-01-04T..."
}
```

### 2. Check Available Routes
```bash
curl http://localhost:10000/api/routes
```

Expected response:
```json
{
  "status": "ok",
  "message": "Available tRPC routes",
  "routes": ["example.hi", "auth.login", "auth.register", "r3al.tokens.getBalance", ...],
  "count": 30+,
  "timestamp": "2025-01-04T..."
}
```

### 3. Test a tRPC Route
```bash
curl "http://localhost:10000/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D"
```

Expected response (example):
```json
{
  "result": {
    "data": {
      "json": {
        "success": true,
        "balance": {
          "available": 100,
          "earned": 100,
          "spent": 0,
          "lastUpdated": "2025-01-04T..."
        }
      }
    }
  }
}
```

## Troubleshooting

### Port Already in Use
If you see "Port 10000 is already in use":
```bash
# Find the process using port 10000
lsof -ti:10000

# Kill the process
lsof -ti:10000 | xargs kill -9

# Or use the start script which handles this automatically
./start-backend.sh
```

### Backend Not Starting
1. Check if dependencies are installed:
```bash
bun install
# or
npm install
```

2. Check if TypeScript is configured correctly:
```bash
cat tsconfig.json
```

3. Look for errors in the console output

### Routes Not Found (404)
1. Check that the backend is actually running
2. Verify the route is registered in `backend/trpc/app-router.ts`
3. Check the console output for "Available routes" when backend starts
4. Visit `http://localhost:10000/api/routes` to see all registered routes

### CORS Issues
If you see CORS errors:
1. Check that `backend/hono.ts` includes the origin in CORS configuration
2. The default config allows:
   - `localhost:19006`, `localhost:8081`, `localhost:10000`
   - Any `*.rork.live`, `*.rork.app`, `*.rorktest.dev` domain

## Environment Variables

The backend uses these environment variables:

```bash
# Required
PORT=10000                                      # Backend port

# Optional
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:10000  # API base URL
EXPO_PUBLIC_AI_BASE_URL=http://localhost:9000         # AI Gateway URL
NODE_ENV=development                                   # Environment
```

## Running Both Frontend and Backend

### Terminal 1: Start Backend
```bash
./start-backend.sh
```

### Terminal 2: Start Frontend
```bash
bun start
```

The frontend will automatically connect to the backend at `http://localhost:10000`.

## Production Deployment

For production on Rork's platform:
1. Ensure the backend is deployed at the same origin as the frontend
2. Update `.env` with the production backend URL
3. The backend will automatically allow requests from `*.rorktest.dev` domains
4. Check the Rork platform logs to ensure the backend container is running

## Console Output

When the backend starts successfully, you should see:
```
============================================================
🚀 Starting R3AL Connection Backend...
📡 Port: 10000
🌍 Environment: development
⏰ Started at: 2025-01-04T...
============================================================
📦 Loading backend application...
[Backend] Initializing Hono application...
[Backend] Setting up CORS...
[Backend] Registering tRPC server at /api/trpc/*
[Backend] Available routes: [...]
[Backend] tRPC server registered successfully
✅ Backend application loaded successfully

📍 Available endpoints:
  • GET  /           - Root endpoint
  • GET  /health     - Health check
  • POST /api/trpc/* - tRPC API
  • GET  /probe/gateway - AI Gateway probe
  • POST /ai/memory  - AI memory update

🚀 Starting server on port 10000...
============================================================
✅ Server is running!
📡 Listening on: http://localhost:10000
🌐 Access from network: http://<your-ip>:10000
🧪 Try: http://localhost:10000/health
============================================================
```
