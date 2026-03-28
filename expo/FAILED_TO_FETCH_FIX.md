# QUICK FIX: "Failed to fetch" Error

## The Problem
Your app is getting a "Failed to fetch" error when trying to connect to the backend from the preview environment.

## The Fix (3 Steps)

### Step 1: Deploy Updated Backend
The CORS configuration has been updated to allow requests from your preview URLs. Deploy the changes:

```bash
# Make scripts executable (run once)
chmod +x scripts/*.sh

# Deploy backend with updated CORS
./scripts/deploy-backend-cloud-run.sh
```

**Wait 2-3 minutes for deployment to complete.**

### Step 2: Verify Backend
After deployment, verify the backend is working:

```bash
./scripts/quick-backend-status.sh
```

Expected output:
```
✅ Backend is healthy (200)
✅ Total routes: 80+
✅ R3AL routes: 70+
✅ Backend is fully configured and ready
```

### Step 3: Test CORS
Verify CORS is working for your preview domain:

```bash
./scripts/test-backend-cors.sh
```

Look for:
```
✅ CORS allowed (200)
```

## What Changed?

### Backend CORS (`backend/hono.ts`)
- ✅ Now allows all `.rorktest.dev` domains (preview URLs)
- ✅ Added better CORS headers
- ✅ Added logging to track CORS decisions

### Error Handling (`lib/trpc.ts`)
- ✅ Better error messages to identify the issue
- ✅ Detailed network error diagnostics

## After Deployment

1. **Refresh your preview app** - The app should now connect successfully
2. **Check console logs** - Look for:
   ```
   [tRPC] ✅ Backend is healthy
   [tRPC] ✅ R3AL routes available: 70+
   ```
3. **Test verification flow** - The verification.getStatus endpoint should work

## Still Having Issues?

### Check Backend Logs
```bash
gcloud run logs read r3al-app --project=r3al-app-1 --limit=50 | grep CORS
```

### Manually Test Backend
```bash
curl https://r3al-app-271493276620.us-central1.run.app/health
```

### Check Cloud Run Status
```bash
gcloud run services describe r3al-app --project=r3al-app-1 --region=us-central1
```

## Files Modified
- ✅ `backend/hono.ts` - Enhanced CORS configuration
- ✅ `lib/trpc.ts` - Better error handling
- ✅ `scripts/test-backend-cors.sh` - New CORS test script
- ✅ `scripts/quick-backend-status.sh` - New status check script
- ✅ `CORS_FIX_GUIDE.md` - Detailed documentation

## Expected Timeline
- **Deploy**: 2-3 minutes
- **Verification**: 30 seconds
- **Testing**: 1 minute
- **Total**: ~5 minutes

## Success Indicators
✅ Backend deployment succeeds
✅ Health check returns 200
✅ CORS test shows "allowed"
✅ App connects without "Failed to fetch" error
✅ Verification endpoints work in the app

---

**Need Help?** Check `CORS_FIX_GUIDE.md` for detailed troubleshooting.
