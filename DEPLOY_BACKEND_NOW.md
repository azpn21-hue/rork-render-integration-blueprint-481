# Deploy Backend to Cloud Run - FINAL FIX

## Problem Identified
The backend was trying to compile TypeScript files at runtime using `ts-node`, which was causing deployment failures on Cloud Run. The server would start but crash before it could respond to health checks.

## Solution
Use the simplified `server-simple.js` which uses pure JavaScript (no TypeScript compilation needed).

## Deployment Steps

### 1. Set Project ID (if not already set)
```bash
export PROJECT_ID=$(gcloud config get-value project)
echo "Project ID: $PROJECT_ID"
```

### 2. Navigate to Backend Directory
```bash
cd backend
```

### 3. Build and Push Container
```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/optima-core-backend .
```

### 4. Deploy to Cloud Run
```bash
gcloud run deploy optima-core \
  --image gcr.io/$PROJECT_ID/optima-core-backend \
  --region us-central1 \
  --platform managed \
  --set-env-vars NODE_ENV=production,AI_ENGINE_URL=https://optima-ai-engine-712497593637.us-central1.run.app \
  --allow-unauthenticated \
  --port 8080 \
  --timeout 300 \
  --memory 1Gi \
  --cpu 2
```

### 5. Test the Deployment
```bash
# Test health endpoint
curl https://optima-core-712497593637.us-central1.run.app/health

# Should return:
# {"status":"healthy","message":"R3AL Connection API health check","timestamp":"..."}

# Test root endpoint
curl https://optima-core-712497593637.us-central1.run.app/

# Should return:
# {"status":"ok","message":"R3AL Connection API is running","timestamp":"...","version":"1.0.0"}

# Test API health
curl https://optima-core-712497593637.us-central1.run.app/api/health
```

## What Changed

### backend/Dockerfile
- Now uses the root `package.json` which has all dependencies
- Copies backend code to `./backend/` subdirectory
- Starts `server-simple.js` instead of `server.js` (no TypeScript compilation)
- Increased memory to 1Gi and CPU to 2 for better stability

### Why This Works
1. **No TypeScript Compilation**: `server-simple.js` is pure JavaScript
2. **All Dependencies Available**: Uses root package.json
3. **Simple Startup**: No complex module resolution or path mapping
4. **Fast Start**: Server starts within seconds, well before Cloud Run timeout

## Troubleshooting

### If deployment still fails:
1. Check Cloud Run logs:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=optima-core" --limit 50 --format json
```

2. Verify the image was built:
```bash
gcloud container images list --repository=gcr.io/$PROJECT_ID
```

3. Test locally first:
```bash
cd backend
PORT=8080 node server-simple.js
# Then in another terminal:
curl http://localhost:8080/health
```

## Next Steps After Successful Deployment

1. **Update Frontend Config**: Update `app/config/api.ts` to use the deployed backend URL
2. **Test API Endpoints**: Use the test commands above
3. **Enable Cloud SQL**: Once basic deployment works, add Cloud SQL connection
4. **Add Authentication**: Configure authentication endpoints
5. **Monitor Logs**: Set up log monitoring in Cloud Console
