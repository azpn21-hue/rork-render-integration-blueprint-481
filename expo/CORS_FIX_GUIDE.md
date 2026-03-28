# CORS Fix Guide - "Failed to fetch" Error

## Issue
The app is experiencing a "Failed to fetch" error when trying to connect to the backend from the Rork preview environment (`dev-9wjyl0e4hila7inz8ajca.rorktest.dev`).

### Error Message
```
[tRPC] ❌ Fetch failed for: https://dev-9wjyl0e4hila7inz8ajca.rorktest.dev/api/trpc/r3al.verification.getStatus
[tRPC] Error: Failed to fetch
```

## Root Cause
The "Failed to fetch" error typically occurs when:
1. **CORS Configuration**: The backend doesn't allow requests from the Rork preview domain
2. **Backend URL Mismatch**: The app is trying to connect to the wrong backend URL
3. **Backend Availability**: The backend is not running or not accessible

## Solution Applied

### 1. Updated CORS Configuration
Enhanced the CORS configuration in `backend/hono.ts` to:
- ✅ Allow all `.rorktest.dev` domains (including preview URLs)
- ✅ Added more CORS headers (`x-trpc-source`)
- ✅ Added logging to track CORS decisions
- ✅ Increased `maxAge` for better caching

```typescript
app.use("*", cors({
  origin: (origin) => {
    // ... existing allowed origins ...
    
    // Allow all Rork domains including preview environments
    if (origin.includes('.rork.live') || origin.includes('.rork.app') || origin.includes('.rorktest.dev')) {
      console.log('[Backend] ✅ CORS allowed for Rork domain:', origin);
      return origin;
    }
    
    console.log('[Backend] ⚠️  CORS blocked for origin:', origin);
    return false;
  },
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "x-trpc-source"],
  exposeHeaders: ["Content-Type"],
  maxAge: 86400, // 24 hours
}));
```

### 2. Enhanced Error Logging
Updated `lib/trpc.ts` to provide more detailed error information:

```typescript
if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
  console.error("[tRPC] ⚠️  Network error - this usually means:");
  console.error("[tRPC]    1. Backend is not running or not accessible");
  console.error("[tRPC]    2. CORS is blocking the request");
  console.error("[tRPC]    3. Backend URL is incorrect:", getBaseUrl());
  console.error("[tRPC]    4. SSL/TLS certificate issue (if using HTTPS)");
}
```

## Deployment Required

⚠️ **IMPORTANT**: The backend needs to be redeployed for the CORS changes to take effect.

### Deploy Backend to Cloud Run

Run the deployment script:

```bash
chmod +x scripts/deploy-backend-cloud-run.sh
./scripts/deploy-backend-cloud-run.sh
```

Or manually deploy using:

```bash
# Build and push Docker image
docker build -f backend/Dockerfile -t gcr.io/r3al-app-1/r3al-app:latest .
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
  --min-instances=0 \
  --max-instances=10
```

## Testing After Deployment

1. **Check Backend Health**:
   ```bash
   curl https://r3al-app-271493276620.us-central1.run.app/health
   ```

2. **Verify CORS Headers**:
   ```bash
   curl -H "Origin: https://dev-9wjyl0e4hila7inz8ajca.rorktest.dev" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        https://r3al-app-271493276620.us-central1.run.app/api/trpc/r3al.verification.getStatus
   ```

3. **Test from App**: Open the preview URL and check the console logs for:
   ```
   [Backend] ✅ CORS allowed for Rork domain: https://dev-9wjyl0e4hila7inz8ajca.rorktest.dev
   ```

## Configuration Reference

### Current Backend Configuration
- **Service**: `r3al-app`
- **URL**: `https://r3al-app-271493276620.us-central1.run.app`
- **Project**: `r3al-app-1`
- **Region**: `us-central1`

### Environment Variables
The backend URL is configured in `.env`:
```
EXPO_PUBLIC_RORK_API_BASE_URL=https://r3al-app-271493276620.us-central1.run.app
```

## Troubleshooting

### If error persists after deployment:

1. **Check Backend Logs**:
   ```bash
   gcloud run logs read r3al-app --project=r3al-app-1 --region=us-central1 --limit=50
   ```

2. **Verify Service is Running**:
   ```bash
   gcloud run services describe r3al-app --project=r3al-app-1 --region=us-central1
   ```

3. **Check for CORS Logs**: Look for the CORS decision logs in Cloud Run:
   ```
   [Backend] ✅ CORS allowed for Rork domain: ...
   or
   [Backend] ⚠️  CORS blocked for origin: ...
   ```

4. **Test Direct API Call**:
   ```bash
   curl -v https://r3al-app-271493276620.us-central1.run.app/api/routes
   ```

## Next Steps

1. ✅ **Deploy Backend** - Run the deployment script
2. ✅ **Verify Deployment** - Check health endpoint
3. ✅ **Test CORS** - Verify CORS headers are correct
4. ✅ **Test App** - Open preview URL and test functionality
5. ✅ **Monitor Logs** - Watch for any CORS-related errors

## Additional Notes

- The CORS configuration now supports all Rork domains (`.rork.live`, `.rork.app`, `.rorktest.dev`)
- Preview URLs are automatically allowed
- The backend logs will show which origins are allowed/blocked
- Better error messages help identify the exact issue

## Support

If issues persist, check:
1. Backend deployment status in Google Cloud Console
2. Cloud Run logs for CORS decisions
3. Network tab in browser dev tools for detailed error info
4. App console logs for detailed tRPC error messages
