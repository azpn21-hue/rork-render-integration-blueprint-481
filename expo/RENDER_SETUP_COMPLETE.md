# 🚀 RENDER DEPLOYMENT - COMPLETE CONFIGURATION

## ✅ Fixed Issues:
1. ✅ React 19 vs lucide-react-native dependency conflict
2. ✅ TRPC "Unexpected token '<'" error (HTML instead of JSON)
3. ✅ Missing backend server entry point
4. ✅ Incorrect build and start commands
5. ✅ Provider order in app layout
6. ✅ CORS configuration

---

## 📋 RENDER DASHBOARD CONFIGURATION

### 1. Build Command
```bash
npm install --legacy-peer-deps
```

### 2. Pre-Deploy Command
Leave **EMPTY** or use:
```bash
echo "Starting deployment..."
```

### 3. Start Command
```bash
npm run server
```

### 4. Environment Variables
Add these in Render's Environment section:

```env
NODE_ENV=production
PORT=10000
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-r3al-connection.onrender.com
RENDER_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
RENDER_SERVICE_NAME=rork-r3al-connection
RENDER_REGION=virginia
WHITELISTED_IPS=216.24.60.0/24,74.220.49.0/24,74.220.57.0/24
JWT_SECRET=UltraSecureKey123!
```

### 5. Other Settings
- **Runtime:** Node
- **Region:** Virginia (US East)
- **Health Check Path:** `/health`
- **Auto-Deploy:** On

---

## 📁 Files Created/Modified

### New Files:
1. **server.js** - Node.js entry point for Render
2. **RENDER_SETUP_COMPLETE.md** - This file

### Modified Files:
1. **render.yaml** - Simplified build and start commands
2. **backend/hono.ts** - Added proper CORS configuration
3. **app/_layout.tsx** - Fixed provider order (QueryClientProvider must wrap trpc.Provider)
4. **app/config/api.ts** - Improved base URL detection
5. **package.json** - Added "server" script and @hono/node-server dependency

---

## 🔧 How It Works

### Backend Server Flow:
```
server.js (Node.js)
  ↓
ts-node (transpiles TypeScript)
  ↓
backend/hono.ts (Hono server with tRPC)
  ↓
backend/trpc/app-router.ts (tRPC routes)
  ↓
backend/trpc/routes/* (individual route handlers)
```

### API Endpoints:
- `GET /` - API status check
- `GET /health` - Health check for Render
- `POST /api/trpc/auth.login` - Login endpoint
- `POST /api/trpc/auth.register` - Register endpoint

---

## 🎯 Deployment Steps

### Step 1: Commit Your Code
```bash
git add .
git commit -m "Fix: Complete Render backend configuration"
git push origin main
```

### Step 2: Configure Render Dashboard
1. Go to your Render dashboard
2. Select "rork-r3al-connection" service
3. Click "Settings"
4. Set **Build Command**: `npm install --legacy-peer-deps`
5. Set **Start Command**: `npm run server`
6. Set **Health Check Path**: `/health`
7. Add all environment variables listed above
8. Save changes

### Step 3: Deploy
1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait for build to complete (2-5 minutes)
3. Check logs for: `✅ Server started successfully on port 10000!`

### Step 4: Test
Once deployed, test these endpoints:
```bash
# Health check
curl https://rork-r3al-connection.onrender.com/health

# API status
curl https://rork-r3al-connection.onrender.com/

# tRPC endpoint (should return tRPC response)
curl -X POST https://rork-r3al-connection.onrender.com/api/trpc/health \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 🐛 Troubleshooting

### Issue: "ERESOLVE unable to resolve dependency tree"
**Solution:** Ensure build command includes `--legacy-peer-deps`

### Issue: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
**Cause:** Frontend trying to reach backend before it's ready
**Solution:** 
- Check backend is running: visit `/health` endpoint
- Verify `EXPO_PUBLIC_RORK_API_BASE_URL` is set correctly
- Check CORS settings in backend/hono.ts

### Issue: "process with pid XXX not found"
**Cause:** Using wrong start command
**Solution:** Use `npm run server` NOT `node index.js`

### Issue: Build succeeds but app crashes on start
**Check:**
1. Server logs in Render dashboard
2. Ensure ts-node is installed: `npm list ts-node`
3. Verify server.js exists and has correct syntax

---

## 📝 Local Testing

Test the backend locally before deploying:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the backend server
npm run server

# In another terminal, test the endpoints
curl http://localhost:10000/health
curl http://localhost:10000/
```

---

## 🎉 Success Indicators

Your deployment is successful when you see:

1. **Render Logs:**
   ```
   🚀 Starting R3AL Connection Backend...
   📡 Port: 10000
   📡 TRPC endpoint: /api/trpc
   💚 Health check: /health
   ✅ Server started successfully on port 10000!
   ```

2. **Health Check Returns:**
   ```json
   {
     "status": "healthy",
     "message": "R3AL Connection API health check",
     "timestamp": "2025-10-27T..."
   }
   ```

3. **App Login Works:**
   - Open the app
   - Try to log in with any email/password
   - Should redirect to NDA screen

---

## 🔐 Security Notes

- JWT_SECRET should be changed in production
- RENDER_API_KEY is sensitive - do not commit to git
- WHITELISTED_IPS restricts access to Render's IP ranges
- CORS is configured to allow localhost and Render domain

---

## 📞 Support

If you encounter issues:
1. Check Render logs (Dashboard → Service → Logs)
2. Review this document's Troubleshooting section
3. Verify all environment variables are set
4. Ensure latest code is pushed to repository

---

**Last Updated:** 2025-10-27
**Status:** Ready for Deployment ✅
