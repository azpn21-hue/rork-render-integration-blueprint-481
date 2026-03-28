# 🔧 Backend 404 Error - Quick Fix Guide

## Problem
You're seeing 404 errors for tRPC routes:
- `r3al.feed.getTrending` → 404
- `r3al.feed.getLocal` → 404  
- `r3al.ai.getInsights` → 404
- `r3al.market.getSummary` → 404

## Root Cause
The backend server needs to be restarted to pick up the newly added routes (Feed, Market, AI, Location).

## ✅ Quick Fix (2 minutes)

### Step 1: Start/Restart Backend

```bash
# Option A: Using the restart script
chmod +x scripts/restart-backend.sh
./scripts/restart-backend.sh
```

OR

```bash
# Option B: Manual restart
# Stop any existing backend
pkill -f "bun.*backend/hono.ts" || pkill -f "node.*server.js"

# Start the backend
node server.js
```

The backend should start on port 10000 by default.

### Step 2: Verify Backend is Running

Open a new terminal and run:

```bash
# Test basic health
curl http://localhost:10000/health

# Check available routes
curl http://localhost:10000/api/routes
```

You should see JSON responses with `status: "healthy"` and a list of available routes.

### Step 3: Test tRPC Routes

```bash
# Run the test script
node scripts/test-backend-routes.js
```

You should see ✅ checkmarks for all routes.

### Step 4: Verify in App

1. Make sure your frontend is pointing to the correct backend URL
2. Check `app/config/api.ts` - it should have the correct `EXPO_PUBLIC_API_BASE_URL`
3. Restart the Expo app if needed

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check if port 10000 is in use
lsof -i :10000

# Kill process using port 10000
kill -9 $(lsof -t -i:10000)

# Try starting again
node server.js
```

### Still getting 404s
1. **Check environment variables**: Make sure `EXPO_PUBLIC_API_BASE_URL` is set correctly
2. **Clear cache**: 
   ```bash
   # Clear Expo cache
   rm -rf .expo
   rm -rf node_modules/.cache
   ```
3. **Restart everything**:
   ```bash
   # Stop backend
   pkill -f "node.*server.js"
   
   # Restart backend
   node server.js
   
   # In another terminal, restart Expo
   npm start -- --clear
   ```

### Routes are registered but still 404
This usually means the backend restarted but the old router is cached:

```bash
# Full clean restart
pkill -f "node.*server.js"
rm -rf node_modules/.cache
rm -rf .expo
node server.js
```

## 📋 What Routes Should Work Now

After restarting, these routes should all work:

### Feed Routes
- `r3al.feed.getTrending` - Get trending posts
- `r3al.feed.getLocal` - Get local posts
- `r3al.feed.createPost` - Create a post
- `r3al.feed.likePost` - Like a post
- `r3al.feed.commentPost` - Comment on a post

### Market Routes
- `r3al.market.getSummary` - Market summary
- `r3al.market.getTrendingSymbols` - Trending stocks/crypto
- `r3al.market.getNews` - Market news

### AI Routes
- `r3al.ai.getInsights` - Get AI insights
- `r3al.ai.getPersonalizedSummary` - Get personalized summary
- `r3al.ai.analyzeTrends` - Analyze trends

### Location Routes
- `r3al.location.getLocalNews` - Get local news
- `r3al.location.getLocalEvents` - Get local events
- `r3al.location.getNearbyUsers` - Find nearby users

## 💡 Keep Backend Running

To keep the backend running in the background:

```bash
# Start in background
nohup node server.js > backend.log 2>&1 &

# View logs
tail -f backend.log

# Stop backend
pkill -f "node.*server.js"
```

## 🚀 Production Deployment

If you're deploying to production (Render, Railway, etc.):

1. Make sure the `server.js` file is included
2. Set the start command to: `node server.js`
3. Set environment variable: `PORT=10000` (or whatever port your platform uses)
4. After deployment, the new routes will be automatically available

## ✅ Success Indicators

You know it's working when:
1. `curl http://localhost:10000/health` returns `{"status":"healthy"}`
2. `curl http://localhost:10000/api/routes` shows all r3al routes including feed, market, ai, and location
3. The test script shows all ✅ checkmarks
4. The app loads data without 404 errors

---

**Next Steps**: Once the backend is running, the app should connect automatically and all features (Feed, Market Pulse, AI Insights, Local Discover) will work!
