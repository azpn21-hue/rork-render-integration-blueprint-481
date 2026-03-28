# R3AL Connection - Render Deployment Guide

## 🎯 Overview
This guide provides complete instructions for deploying the R3AL Connection app to Render with backend enabled.

## 🏗️ Architecture
- **Frontend**: Expo (React Native) with React Native Web support
- **Backend**: Hono + tRPC for API endpoints
- **Deployment**: Single service deployment on Render
- **Region**: Virginia (US East)

## 📋 Prerequisites
1. Render account
2. GitHub repository connected to Render
3. Environment variables configured

## 🚀 Quick Start Deployment

### Step 1: Repository Setup
Push your code to GitHub and connect it to Render.

### Step 2: Create Web Service on Render
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Use the following configuration:

**Basic Settings:**
- **Name**: `rork-r3al-connection`
- **Region**: `Virginia (US East)`
- **Branch**: `main` (or your default branch)
- **Runtime**: `Node`
- **Build Command**: `npm install --legacy-peer-deps`
- **Start Command**: `bunx rork start -p 9wjyl0e4hila7inz8ajca --web --tunnel`

### Step 3: Environment Variables
Add these environment variables in Render Dashboard:

```bash
NODE_ENV=production
PORT=10000
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-r3al-connection.onrender.com
RENDER_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
RENDER_SERVICE_NAME=rork-r3al-connection
RENDER_REGION=virginia
WHITELISTED_IPS=216.24.60.0/24,74.220.49.0/24,74.220.57.0/24
JWT_SECRET=UltraSecureKey123!
```

### Step 4: Deploy
Click "Create Web Service" and wait for deployment to complete.

## 🔍 Health Checks
Render will automatically check these endpoints:
- **Health Check Path**: `/` or `/health`
- **Expected Response**: `{ "status": "ok" }` or `{ "status": "healthy" }`

## 🧪 Testing Your Deployment

### Test Backend Health
```bash
curl https://rork-r3al-connection.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "R3AL Connection API health check",
  "timestamp": "2025-10-27T..."
}
```

### Test tRPC Endpoint
```bash
curl https://rork-r3al-connection.onrender.com/api/trpc/health
```

### Test Frontend
Open in browser:
```
https://rork-r3al-connection.onrender.com
```

## 🐛 Troubleshooting

### Issue: "URI empty error" or "Can't log in"
**Cause**: `EXPO_PUBLIC_RORK_API_BASE_URL` not set correctly

**Fix**:
1. Check environment variables in Render dashboard
2. Ensure `EXPO_PUBLIC_RORK_API_BASE_URL` is set to your Render service URL
3. Redeploy the service

### Issue: "[not_found] process with pid 552 not found"
**Cause**: Build process trying to reference non-existent process

**Fix**:
1. Check your `package.json` scripts
2. Ensure `startCommand` in `render.yaml` is correct
3. Use the start command: `bunx rork start -p 9wjyl0e4hila7inz8ajca --web --tunnel`

### Issue: "Module not found" errors
**Cause**: Dependencies not installed correctly

**Fix**:
1. Add `--legacy-peer-deps` flag to build command
2. Clear Render build cache and redeploy
3. Check all dependencies are in `package.json`

### Issue: Backend endpoints not responding
**Cause**: tRPC routes not properly configured

**Fix**:
1. Check `backend/hono.ts` is exporting the app
2. Verify `backend/trpc/app-router.ts` includes all routes
3. Check logs in Render dashboard for errors

## 📊 Backend API Endpoints

### Available Routes
- `GET /` - Root health check
- `GET /health` - Detailed health check
- `POST /api/trpc/auth.login` - User login
- `POST /api/trpc/auth.register` - User registration
- `GET /api/trpc/health` - tRPC health check
- `GET /api/trpc/example.hi` - Example endpoint

## 🔒 Security Notes
1. Change `JWT_SECRET` to a secure random string in production
2. Update `WHITELISTED_IPS` to your actual allowed IP ranges
3. Use environment variables for all secrets
4. Never commit `.env` file to version control

## 📝 Local Development

### Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm start

# Or start with web support
npm run start-web
```

### Test Backend Locally
The backend runs on port 10000 by default.
```bash
curl http://localhost:10000/health
```

## 🔄 Continuous Deployment
Render automatically deploys when you push to your connected branch.

To disable auto-deploy:
1. Go to Settings in Render dashboard
2. Disable "Auto-Deploy"

## 📞 Support
If you encounter issues:
1. Check Render logs in dashboard
2. Review this troubleshooting guide
3. Check environment variables are set correctly
4. Verify build and start commands

## ✅ Deployment Checklist
- [ ] Repository connected to Render
- [ ] Environment variables configured
- [ ] Build command set correctly
- [ ] Start command set correctly
- [ ] Health check path configured
- [ ] Service deployed successfully
- [ ] Health endpoints responding
- [ ] Frontend accessible in browser
- [ ] Login/registration working
- [ ] Backend API responding to requests

---

**Last Updated**: 2025-10-27
**Version**: 1.0.0
