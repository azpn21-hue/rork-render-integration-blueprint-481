# Backend 404 Error Fix Guide

## Issue Summary
You're experiencing 404 errors when the app tries to connect to tRPC routes, specifically:
- `[tRPC] Response error: 404 Body: 404 Not Found`
- Failed to fetch: `https://a-aa9soweaz6m61esyzd2so.rorktest.dev/api/trpc/r3al.verification.getStatus`

## Root Cause
The backend URL is mismatched:
- **Your `.env` file has**: `https://optima-core-712497593637.us-central1.run.app`
- **The error shows**: `https://a-aa9soweaz6m61esyzd2so.rorktest.dev`

This suggests either:
1. The backend is not running/deployed at the correct URL
2. The Rork preview platform is overriding the env variable
3. The backend routes are not properly registered

## What I Fixed

### 1. **Push Notifications Error** ✅
- Modified `app/services/push-notifications.ts` to handle Expo Go SDK 53+ gracefully
- Push notifications now log a warning instead of crashing when unavailable

### 2. **Verification Context Error Handling** ✅
- Added retry logic to the verification status query
- Added proper error logging
- Cached verification status loads from AsyncStorage as fallback

### 3. **Verification Status Screen** ✅
- Added loading state with spinner
- Added refresh functionality with loading indicator
- Better error handling for network failures

## How to Test the Backend

### Option 1: Run the Health Check Script
```bash
bun run scripts/test-backend-health.ts
```

This will test:
- Root endpoint (`/`)
- Health endpoint (`/health`)
- Routes listing (`/api/routes`)
- tRPC health route
- tRPC verification status route

### Option 2: Manual Testing
Test these URLs in your browser or with curl:

```bash
# Test root endpoint
curl https://optima-core-712497593637.us-central1.run.app/

# Test health
curl https://optima-core-712497593637.us-central1.run.app/health

# Test routes
curl https://optima-core-712497593637.us-central1.run.app/api/routes

# Test tRPC health
curl "https://optima-core-712497593637.us-central1.run.app/api/trpc/health?input=%7B%22json%22%3Anull%7D"
```

## Next Steps

### If Backend is Not Running:
1. **Deploy the backend to Google Cloud Run**:
   ```bash
   cd backend
   gcloud run deploy optima-core \
     --source . \
     --region us-central1 \
     --platform managed \
     --allow-unauthenticated
   ```

2. **Update `.env` with the correct URL** from the deployment output

3. **Restart the app** to pick up the new environment variable

### If Backend is Running:
1. **Verify the backend URL** matches in `.env`
2. **Check Cloud Run logs** for any errors:
   ```bash
   gcloud run logs read optima-core --region us-central1 --limit 50
   ```

3. **Ensure CORS is properly configured** in `backend/hono.ts`:
   - Should allow `.rorktest.dev` domains
   - Should allow the specific URL from the error

## Backend Route Verification

Your backend has these routes registered:
- ✅ `r3al.verification.getStatus`
- ✅ `r3al.verification.sendEmail`
- ✅ `r3al.verification.confirmEmail`
- ✅ `r3al.verification.sendSms`
- ✅ `r3al.verification.confirmSms`
- ✅ `r3al.verification.verifyId`
- ✅ All other r3al routes (match, profile, pulseChat, etc.)

## Files Modified
1. ✅ `app/services/push-notifications.ts` - Fixed Expo SDK 53 compatibility
2. ✅ `app/contexts/VerificationContext.tsx` - Added error handling & retry logic
3. ✅ `app/r3al/verification/status.tsx` - Added loading states and refresh handling
4. ✅ `scripts/test-backend-health.ts` - Created backend testing script

## Current Status
- 🟢 Routes are properly registered in the backend
- 🟢 Error handling is improved in the frontend
- 🟢 Push notification error is fixed
- 🟡 Backend connectivity needs verification
- 🟡 Backend URL mismatch needs investigation

## Recommendations

### Immediate Actions:
1. Run `bun run scripts/test-backend-health.ts` to verify backend status
2. Check if the backend is actually deployed and running
3. Verify the `.env` file is being read correctly by the Rork platform

### Long-term Solutions:
1. Add backend health monitoring
2. Add automatic fallback to cached data when backend is unavailable
3. Add better user-facing error messages
4. Consider adding a "Backend Status" indicator in the UI

## Notes
- The verification system will now use cached status from AsyncStorage when the backend is unavailable
- Users can manually refresh to try reconnecting to the backend
- The app won't crash if the backend is unreachable, but verification features will be limited
