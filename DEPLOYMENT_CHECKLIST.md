# ✅ PRE-DEPLOYMENT CHECKLIST

Complete this checklist before deploying to Render:

## 📦 Code Ready

- [ ] All changes committed to git
- [ ] `server.js` exists in project root
- [ ] `render.yaml` has correct build and start commands
- [ ] `package.json` includes `"server": "node server.js"` script
- [ ] Dependencies include: @hono/node-server, ts-node

## 🔧 Render Dashboard Settings

### Build & Deploy
- [ ] Build Command: `npm install --legacy-peer-deps`
- [ ] Start Command: `npm run server`
- [ ] Pre-Deploy Command: (leave empty)
- [ ] Health Check Path: `/health`
- [ ] Auto-Deploy: Enabled
- [ ] Runtime: Node
- [ ] Region: Virginia (US East)

### Environment Variables
All of these must be set:
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `EXPO_PUBLIC_RORK_API_BASE_URL` = `https://rork-r3al-connection.onrender.com`
- [ ] `RENDER_API_KEY` = `rnd_w0obVzrvycssNp2SbIA3q2sbZZW0`
- [ ] `RENDER_SERVICE_NAME` = `rork-r3al-connection`
- [ ] `RENDER_REGION` = `virginia`
- [ ] `WHITELISTED_IPS` = `216.24.60.0/24,74.220.49.0/24,74.220.57.0/24`
- [ ] `JWT_SECRET` = `UltraSecureKey123!`

## 🧪 Pre-Deployment Testing

Run these tests locally:

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```
- [ ] Installation completes without errors

### 2. Start Server Locally
```bash
npm run server
```
Expected output:
```
🚀 Starting R3AL Connection Backend...
📡 Port: 10000
📡 TRPC endpoint: /api/trpc
💚 Health check: /health
✅ Server started successfully on port 10000!
```
- [ ] Server starts without errors
- [ ] You see all the above log messages

### 3. Test Health Endpoint
```bash
curl http://localhost:10000/health
```
Expected response:
```json
{"status":"healthy","message":"R3AL Connection API health check","timestamp":"..."}
```
- [ ] Returns 200 status
- [ ] Returns JSON with "healthy" status

### 4. Test Root Endpoint
```bash
curl http://localhost:10000/
```
Expected response:
```json
{"status":"ok","message":"R3AL Connection API is running","timestamp":"...","version":"1.0.0"}
```
- [ ] Returns 200 status
- [ ] Returns JSON with "ok" status

### 5. Test tRPC Endpoint
```bash
curl -X POST http://localhost:10000/api/trpc/health \
  -H "Content-Type: application/json" \
  -d '{}'
```
- [ ] Returns response (not 404)
- [ ] Does not return HTML

## 📤 Deployment

### Push Code
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```
- [ ] All files committed
- [ ] Pushed to main branch
- [ ] No uncommitted changes

### Deploy on Render
- [ ] Triggered manual deploy OR auto-deploy activated
- [ ] Build logs show: "Dependencies installed"
- [ ] Build completes successfully
- [ ] Start logs show: "Server started successfully"
- [ ] Service shows as "Live" in dashboard
- [ ] Health check shows green checkmark

## 🌐 Post-Deployment Testing

### Test Production Endpoints

#### Health Check
```bash
curl https://rork-r3al-connection.onrender.com/health
```
- [ ] Returns 200 status
- [ ] Returns healthy status JSON

#### API Status
```bash
curl https://rork-r3al-connection.onrender.com/
```
- [ ] Returns 200 status
- [ ] Returns API running message

#### tRPC Health
```bash
curl -X POST https://rork-r3al-connection.onrender.com/api/trpc/health \
  -H "Content-Type: application/json"
```
- [ ] Returns valid response
- [ ] No HTML errors

### Test From Mobile App
- [ ] Open app on device/simulator
- [ ] Navigate to login screen
- [ ] Enter test email and password
- [ ] Login button works (no "Unexpected token" error)
- [ ] Successfully redirects to NDA or Home screen
- [ ] Guest login works
- [ ] Registration works

## 🔍 Monitoring

After deployment, monitor for:
- [ ] No 502/503 errors in Render logs
- [ ] Response times < 2 seconds
- [ ] No memory leaks (check Render metrics)
- [ ] Health check consistently returns 200

## ❌ Rollback Plan

If deployment fails:

1. **Immediate Rollback:**
   - Render Dashboard → Rollback to previous deploy

2. **Debug:**
   - Check Render logs for error messages
   - Verify environment variables
   - Test locally with production env vars

3. **Re-deploy:**
   - Fix issues locally
   - Test with checklist again
   - Re-deploy

## 📊 Success Criteria

Deployment is successful when ALL of these are true:
- [ ] Render shows service as "Live"
- [ ] Health endpoint returns 200
- [ ] App can login successfully
- [ ] No console errors in app
- [ ] tRPC calls complete without errors
- [ ] Guest login works
- [ ] Navigation flows correctly

---

**Date Completed:** _______________
**Deployed By:** _______________
**Deployment Time:** _______________
**Render Service URL:** https://rork-r3al-connection.onrender.com

---

## 🎉 Deployment Complete!

Once all items are checked, your R3AL Connection app is live on Render!
