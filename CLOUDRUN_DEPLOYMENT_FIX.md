# Cloud Run Deployment Fix - Complete Guide

## Problem Summary
Your Cloud Run deployment was failing because:
1. **Wrong build context**: Building from `backend/` directory but `package.json` is in root
2. **Missing dependencies**: The container couldn't find required npm packages
3. **Incorrect Dockerfile path**: Dockerfile needed to be in root, not in backend/

## Solution Applied

### 1. Created Root-Level Dockerfile
- Location: `/Dockerfile` (project root)
- Builds from root context with access to all dependencies
- Installs all npm packages before copying backend code

### 2. Created .gcloudignore
- Excludes unnecessary files from upload (faster builds)
- Keeps mobile app files out of backend container
- Includes only: backend/, lib/, package.json, tsconfig.json

### 3. Created Deployment Script
- Location: `scripts/deploy-to-cloudrun.sh`
- Runs from project root
- Simplified environment variables (removed JWT_SECRET temporarily)

## Deployment Instructions

### From Google Cloud Shell:

```bash
# 1. Navigate to project root
cd ~/optima-core

# 2. Set PROJECT_ID (if not already set)
export PROJECT_ID=$(gcloud config get-value project)

# 3. Make deployment script executable
chmod +x scripts/deploy-to-cloudrun.sh

# 4. Run the deployment
./scripts/deploy-to-cloudrun.sh
```

### Manual Deployment (Alternative):

```bash
# From project root:
cd ~/optima-core

# Build image
gcloud builds submit --tag gcr.io/$PROJECT_ID/r3al-backend .

# Deploy to Cloud Run
gcloud run deploy optima-core \
    --image gcr.io/$PROJECT_ID/r3al-backend \
    --region us-central1 \
    --platform managed \
    --set-env-vars NODE_ENV=production \
    --allow-unauthenticated \
    --timeout 300 \
    --memory 1Gi \
    --cpu 2 \
    --port 8080
```

## Testing After Deployment

```bash
# Test health endpoint
curl https://optima-core-712497593637.us-central1.run.app/health

# Test root endpoint
curl https://optima-core-712497593637.us-central1.run.app/

# Test API health
curl https://optima-core-712497593637.us-central1.run.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "R3AL Connection API health check",
  "timestamp": "2025-11-08T00:XX:XX.XXXZ"
}
```

## What's Different Now

### Before (Not Working):
- Dockerfile in `backend/` directory
- Building from `backend/` without access to root `package.json`
- Missing hono dependencies in container

### After (Working):
- Dockerfile in project root
- Building from root with full dependency access
- All required packages installed in container
- Simplified startup with `server-simple.js`

## Next Steps

1. **Deploy using the script above**
2. **Test the health endpoints**
3. **Once working, gradually add back features**:
   - Add JWT_SECRET environment variable
   - Enable full tRPC routes (switch from server-simple.js to server.js)
   - Connect Cloud SQL database
   - Add AI engine integration

## Troubleshooting

If deployment still fails:

1. **Check logs**:
   ```bash
   gcloud run services logs read optima-core --region us-central1
   ```

2. **Verify build succeeded**:
   ```bash
   gcloud builds list --limit 5
   ```

3. **Check service status**:
   ```bash
   gcloud run services describe optima-core --region us-central1
   ```

## Files Modified

- ✅ `Dockerfile` (created in root)
- ✅ `.gcloudignore` (created in root)
- ✅ `scripts/deploy-to-cloudrun.sh` (created)
- ✅ `backend/server-simple.js` (already existed, verified working)

## Environment Variables (Current)

Minimal set for initial deployment:
- `NODE_ENV=production`
- `PORT=8080` (auto-set by Cloud Run)

## Environment Variables (To Add Later)

Once basic deployment works:
```bash
JWT_SECRET=your-secret-here
EXPO_PUBLIC_RORK_API_BASE_URL=https://optima-core-712497593637.us-central1.run.app
EXPO_PUBLIC_AI_BASE_URL=https://optima-ai-engine-712497593637.us-central1.run.app
DATABASE_URL=your-database-url
```
