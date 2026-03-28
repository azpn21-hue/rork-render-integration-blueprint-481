# 🚀 Quick Deploy to Render

## Prerequisites
- GitHub account with repository pushed
- Render account (free tier works)

## Steps (5 minutes)

### 1. Create Service on Render
Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**

### 2. Connect Repository
Select your GitHub repository from the list

### 3. Configure Service

**Name**: `rork-r3al-connection`  
**Region**: `Virginia (US East)`  
**Branch**: `main`  
**Runtime**: `Node`

**Build Command**:
```bash
npm install --legacy-peer-deps
```

**Start Command**:
```bash
bunx rork start -p 9wjyl0e4hila7inz8ajca --web --tunnel
```

### 4. Add Environment Variables

Click **Advanced** → **Add Environment Variable**

Add these one by one:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `EXPO_PUBLIC_RORK_API_BASE_URL` | `https://rork-r3al-connection.onrender.com` |
| `JWT_SECRET` | `UltraSecureKey123!` |
| `RENDER_API_KEY` | `rnd_w0obVzrvycssNp2SbIA3q2sbZZW0` |
| `RENDER_SERVICE_NAME` | `rork-r3al-connection` |
| `RENDER_REGION` | `virginia` |
| `WHITELISTED_IPS` | `216.24.60.0/24,74.220.49.0/24,74.220.57.0/24` |

### 5. Deploy
Click **Create Web Service**

Wait 5-10 minutes for first deployment.

### 6. Verify

Once deployed, test:

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

### 7. Access Your App

Open in browser:
```
https://rork-r3al-connection.onrender.com
```

You should see the R3AL Connection login screen.

## ✅ Success Checklist
- [ ] Service shows "Live" status in Render
- [ ] Health endpoint returns 200 OK
- [ ] Frontend loads in browser
- [ ] Can navigate to login/register screens
- [ ] Login/register buttons are active
- [ ] Guest mode button works
- [ ] No console errors

## 🐛 If Something Goes Wrong

### Deployment Failed
1. Check Render logs in dashboard
2. Look for dependency errors
3. Verify build command is correct

### 404 Not Found
1. Check Start Command is exactly as shown
2. Verify environment variables are set
3. Restart service

### Can't Log In
1. Check browser console for errors
2. Verify `EXPO_PUBLIC_RORK_API_BASE_URL` matches your service URL
3. Test `/health` endpoint

### Build Takes Too Long
- First build: 5-10 minutes (normal)
- Subsequent builds: 2-3 minutes
- Free tier can be slower during peak times

## 📞 Need Help?
1. Check `RENDER_DEPLOYMENT_GUIDE.md` for detailed troubleshooting
2. Check `BACKEND_SETUP.md` for backend issues
3. Check Render logs for error messages

## 🔄 Updating Your App
1. Push changes to GitHub
2. Render auto-deploys (if enabled)
3. Or click "Manual Deploy" → "Deploy latest commit"

---

**Time to Deploy**: ~5 minutes  
**First Build Time**: ~8 minutes  
**Cost**: Free tier available
