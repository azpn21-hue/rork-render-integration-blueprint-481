# Backend Testing Guide

## ✅ Your Backend is Deployed!

**Backend URL**: `https://optima-core-712497593637.us-central1.run.app`

## Quick Tests

### Option 1: Using curl (Simple)
```bash
# Test health endpoint
curl https://optima-core-712497593637.us-central1.run.app/health

# Test root endpoint
curl https://optima-core-712497593637.us-central1.run.app/

# List all available routes
curl https://optima-core-712497593637.us-central1.run.app/api/routes
```

### Option 2: Using bash script
```bash
chmod +x scripts/quick-backend-test.sh
./scripts/quick-backend-test.sh
```

### Option 3: Using Node.js (Detailed)
```bash
node scripts/test-deployed-backend.js
```

## Expected Responses

### Health Check (`/health`)
```json
{
  "status": "healthy",
  "message": "R3AL Connection API health check",
  "timestamp": "2025-11-07T..."
}
```

### Root Endpoint (`/`)
```json
{
  "status": "ok",
  "message": "R3AL Connection API is running",
  "timestamp": "2025-11-07T...",
  "version": "1.0.0"
}
```

### Routes Listing (`/api/routes`)
```json
{
  "status": "ok",
  "message": "Available tRPC routes",
  "routes": ["health", "example.hi", "auth.login", "r3al.verifyIdentity", ...],
  "count": 50+,
  "timestamp": "2025-11-07T..."
}
```

## Testing from Your App

Your `.env` file is already configured:
```
EXPO_PUBLIC_RORK_API_BASE_URL=https://optima-core-712497593637.us-central1.run.app
```

Now test from your React Native app:

```typescript
import { trpc } from '@/lib/trpc';

// In any component:
const healthQuery = trpc.health.useQuery();

console.log(healthQuery.data); // Should show { status: 'ok', ... }
```

## Available Endpoints

### HTTP Endpoints
- `GET /` - Root status
- `GET /health` - Health check
- `GET /api/routes` - List all tRPC routes
- `GET /probe/gateway` - AI Gateway probe
- `POST /ai/memory` - AI memory updates

### tRPC Routes
All tRPC routes are available at `/api/trpc/*`:
- `health` - Health check query
- `example.hi` - Example query
- `auth.login` - Login mutation
- `auth.register` - Register mutation
- `r3al.*` - All R3AL app routes (50+ routes)

## Troubleshooting

### If health check fails:
1. Check Cloud Run logs in Google Console
2. Verify the service is running: https://console.cloud.google.com/run
3. Check environment variables are set correctly

### If specific routes fail:
1. Check the route exists: `curl https://optima-core-712497593637.us-central1.run.app/api/routes`
2. Verify tRPC query syntax
3. Check CORS settings if testing from browser

## Next Steps

1. ✅ Backend is deployed and running
2. ✅ Environment variables are configured
3. 🔄 Test frontend connectivity
4. 🔄 Run comprehensive feature tests
5. 🔄 Test AI/ML endpoints
6. 🔄 Test database operations (when Cloud SQL is connected)

## Quick Status Check

Run this one-liner to verify everything:
```bash
curl -s https://optima-core-712497593637.us-central1.run.app/health && echo " ✅ Backend is healthy!"
```
