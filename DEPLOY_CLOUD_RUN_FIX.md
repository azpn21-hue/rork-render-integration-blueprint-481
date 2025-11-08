# 🚀 Cloud Run Deployment Fix

## Problem
The backend is experiencing 408 "Server did not start" errors, likely due to database connection issues.

## Solution Applied

### 1. Fixed Database Connection
- Added timeout (3 seconds) to database connection attempts
- Made database initialization non-blocking
- Server now starts even if database is unavailable

### 2. Deploy Commands

```bash
# Make scripts executable
chmod +x scripts/deploy-backend-cloud-run.sh
chmod +x scripts/test-cloud-run.sh

# Deploy to Cloud Run
./scripts/deploy-backend-cloud-run.sh

# Test the deployment
./scripts/test-cloud-run.sh
```

### 3. Manual Deployment (Alternative)

```bash
# Build the image
docker build -f backend/Dockerfile -t gcr.io/r3al-app-1/r3al-app:latest .

# Push to GCR
docker push gcr.io/r3al-app-1/r3al-app:latest

# Deploy to Cloud Run
gcloud run deploy r3al-app \
  --image=gcr.io/r3al-app-1/r3al-app:latest \
  --platform=managed \
  --region=us-central1 \
  --project=r3al-app-1 \
  --allow-unauthenticated \
  --port=8080 \
  --memory=2Gi \
  --cpu=2 \
  --timeout=300 \
  --set-env-vars="NODE_ENV=production,PORT=8080" \
  --no-use-http2
```

### 4. Set Database Password (If Needed)

If you want to enable database connectivity:

```bash
# Update the service with database password
gcloud run services update r3al-app \
  --region=us-central1 \
  --project=r3al-app-1 \
  --update-env-vars="DB_PASSWORD=your-actual-password"
```

### 5. Verify Deployment

```bash
# Check service status
gcloud run services describe r3al-app \
  --region=us-central1 \
  --project=r3al-app-1

# View logs
gcloud run services logs read r3al-app \
  --region=us-central1 \
  --project=r3al-app-1 \
  --limit=50
```

## What Changed

### backend/hono.ts
- Added 5-second timeout for database initialization
- Database failure no longer blocks server startup

### backend/db/config.ts
- Added 3-second timeout for connection attempts
- Skips database if `DB_PASSWORD` is not set
- Better error logging

## Expected Behavior

1. **Without Database Password**: Server starts immediately, runs without persistent storage
2. **With Database Password**: Server starts, then attempts database connection in background

## Testing

Test the endpoints:
- Health: `https://r3al-app-271493276620.us-central1.run.app/health`
- Routes: `https://r3al-app-271493276620.us-central1.run.app/api/routes`
- tRPC: `https://r3al-app-271493276620.us-central1.run.app/api/trpc/r3al.verification.getStatus`
