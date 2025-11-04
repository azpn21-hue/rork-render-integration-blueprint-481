# Optima-Core Deployment Package

## 📦 Package Contents

This deployment package contains everything needed to deploy Optima-Core:

1. **optima-core-manifest.yaml** - System configuration manifest
2. **lib/optima-bridge.ts** - Frontend API client for R3AL app
3. **Dockerfile.optima** - Docker containerization config
4. **OPTIMA_INTEGRATION_GUIDE.md** - Complete integration documentation

## 🚀 Quick Deploy Checklist

### Pre-Deployment
- [ ] Python 3.10.11 installed
- [ ] GCP project `civic-origin-476705-j8` accessible
- [ ] Service account JSON key obtained
- [ ] `.secrets/service-account.json` placed in project

### Local Testing
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set environment variables (create .env file)
# See OPTIMA_INTEGRATION_GUIDE.md for variables

# 3. Start server
uvicorn app:app --reload

# 4. Test health endpoint
curl http://127.0.0.1:8000/health

# 5. View API docs
open http://127.0.0.1:8000/docs
```

### Render Deployment
```bash
# 1. Connect GitHub/GitLab repo to Render

# 2. Configure in Render Dashboard:
Build Command: pip install -r requirements.txt
Start Command: uvicorn app:app --host 0.0.0.0 --port 8080

# 3. Add environment variables (see manifest file)

# 4. Upload service-account.json to .secrets folder

# 5. Deploy and verify
curl https://your-app.onrender.com/health
```

## 🔧 Current tRPC Integration Status

### Backend Routes
The R3AL backend (Hono + tRPC) is correctly configured with:
- ✅ `r3al.tokens.getBalance` - Token balance endpoint
- ✅ `r3al.tokens.earnTokens` - Earn tokens
- ✅ `r3al.tokens.spendTokens` - Spend tokens
- ✅ `r3al.tokens.getTransactions` - Transaction history

### Backend URL
Current deployment: `https://ze4u7tzq2o86bfslpee8b.rork.live`

### Issue Analysis
The 404 errors indicate:
1. ✅ Frontend is correctly calling the tRPC route
2. ✅ Backend routing is properly configured
3. ⚠️ Backend server may not be running or accessible

## 🔍 Troubleshooting 404 Errors

### Check Backend Health
```bash
# Test main backend
curl https://ze4u7tzq2o86bfslpee8b.rork.live/health

# Test Optima Core (when deployed)
curl https://optima-core-backend.onrender.com/health
```

### Verify tRPC Route
```bash
# Test tRPC endpoint directly
curl "https://ze4u7tzq2o86bfslpee8b.rork.live/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D"
```

### Common Fixes

#### 1. Backend Not Running
**Solution**: Restart the backend service
- For Render: Trigger manual deploy
- For local: Restart `bun run dev`

#### 2. CORS Issues
**Solution**: Verify CORS configuration in `backend/hono.ts`
- Check that `.rork.live` domains are allowed
- Verify `credentials: true` is set

#### 3. Route Registration
**Solution**: Verify route is registered in `backend/trpc/app-router.ts`
```typescript
export const appRouter = createTRPCRouter({
  r3al: r3alRouter,  // ✅ Must be present
});
```

#### 4. Environment Variables
**Solution**: Ensure all env vars are set:
```bash
# Check .env file contains:
EXPO_PUBLIC_API_URL=https://ze4u7tzq2o86bfslpee8b.rork.live
```

## 🏗️ Architecture

### Current Setup
```
┌──────────────────┐
│  R3AL Mobile App │
│  (React Native)  │
└────────┬─────────┘
         │
         │ tRPC over HTTPS
         ▼
┌──────────────────┐
│  Hono Backend    │
│  (Node.js/Bun)   │
│  + tRPC Router   │
└────────┬─────────┘
         │
         │ Local State
         ▼
┌──────────────────┐
│  R3alContext     │
│  (AsyncStorage)  │
└──────────────────┘
```

### With Optima-Core
```
┌──────────────────┐
│  R3AL Mobile App │
│  (React Native)  │
└───────┬──────────┘
        │
        ├─────► Hono Backend (tRPC)
        │       └─► Token balance sync
        │
        └─────► Optima-Core (FastAPI)
                ├─► Pulse analytics
                ├─► Hive mapping
                ├─► NFT registry
                └─► AI insights
```

## 📋 Next Steps

### Immediate (Fix 404)
1. Verify backend is running:
   ```bash
   curl https://ze4u7tzq2o86bfslpee8b.rork.live/health
   ```

2. Check logs for errors:
   - Render: View deployment logs
   - Local: Check terminal output

3. Test tRPC route manually:
   - Visit `/api/trpc/r3al.tokens.getBalance` in browser
   - Should return tRPC response (not 404)

### Short-term (Deploy Optima)
1. Set up GCP credentials
2. Deploy Optima-Core to Render
3. Update environment variables
4. Connect frontend to Optima endpoints

### Long-term (Full Integration)
1. Sync token balance between backends
2. Implement Pulse analytics pipeline
3. Connect Hive to Optima AI
4. Enable NFT credential registry

## 🆘 Support

### Backend Not Responding
```bash
# Check if service is up
curl -I https://ze4u7tzq2o86bfslpee8b.rork.live

# Check health endpoint
curl https://ze4u7tzq2o86bfslpee8b.rork.live/health

# Check tRPC endpoint
curl "https://ze4u7tzq2o86bfslpee8b.rork.live/api/trpc/health?input=%7B%7D"
```

### Deployment Logs
- **Render**: Dashboard → Service → Logs
- **Local**: Terminal output from `bun run dev`
- **Docker**: `docker logs optima-core`

### Contact
For deployment support, contact R3AL Systems team with:
- Error message screenshots
- Backend health check results
- Deployment logs
- Environment configuration

---

**Package Version**: 1.0.0  
**Created**: January 2025  
**Status**: Ready for deployment
