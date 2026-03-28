# 🚀 How to Run the R3AL App

## Quick Start (Recommended)

The easiest way to run the app with both backend and frontend:

```bash
chmod +x start-r3al.sh
./start-r3al.sh
```

This will:
1. ✅ Start the backend server on port 10000
2. ✅ Verify backend health and routes
3. ✅ Start the frontend Expo app with tunnel
4. ✅ Handle cleanup on exit (Ctrl+C)

## Alternative: Manual Start

If you prefer to run backend and frontend separately:

### Terminal 1 - Backend
```bash
chmod +x START_BACKEND.sh
./START_BACKEND.sh
```

Or manually:
```bash
PORT=10000 node server.js
```

### Terminal 2 - Frontend
```bash
bun start
```

## Troubleshooting

### Error: "JSON Parse error: Unexpected character: o"

**Cause:** Backend server is not running

**Fix:**
```bash
# Check if backend is running
ps aux | grep "node server.js"

# If not, start it
./START_BACKEND.sh

# Or use the combined script
./start-r3al.sh
```

### Error: "tRPC 404 errors"

**Cause:** Backend not responding or routes not registered

**Fix:**
```bash
# Test backend health
curl http://localhost:10000/health

# Check routes
curl http://localhost:10000/api/routes

# If backend is not responding, restart it
pkill -f "node server.js"
./START_BACKEND.sh
```

### Port Already in Use

```bash
# Free up ports
kill -9 $(lsof -t -i:10000)  # Backend
kill -9 $(lsof -t -i:8081)   # Metro bundler
kill -9 $(lsof -t -i:19006)  # Expo web
```

### Backend Logs

When using `start-r3al.sh`, backend logs are saved to `backend.log`:

```bash
# View logs in real-time
tail -f backend.log

# Search for errors
grep ERROR backend.log
grep -i "error" backend.log
```

## Verify Everything is Working

### 1. Backend Health
```bash
curl http://localhost:10000/health
# Should return: {"status":"healthy",...}
```

### 2. Available Routes
```bash
curl http://localhost:10000/api/routes | grep "r3al"
# Should show: r3al.feed.getTrending, r3al.market.getSummary, etc.
```

### 3. Test a Route
```bash
# Test market data (with live CoinGecko API)
curl "http://localhost:10000/api/trpc/r3al.market.getSummary?input=%7B%22json%22%3A%7B%7D%7D"

# Should return JSON with Bitcoin, Ethereum, Solana prices
```

### 4. Check App
- Open the app on your device
- Navigate to "Feed", "Market Pulse", or "AI Insights"
- Data should load without errors
- Check console for "[Feed]", "[Market]", "[AI]" log messages

## Features Available

Once backend is running, these features should work:

### 📰 Feed System
- **Trending Posts**: See community activity
- **Local Posts**: Location-based content
- **Create Posts**: Share thoughts and updates

### 💹 Market Pulse
- **Live Crypto Data**: Bitcoin, Ethereum, Solana (from CoinGecko API)
- **Market Indices**: S&P 500, Dow Jones, NASDAQ
- **Market Sentiment**: Bullish/Bearish analysis
- **Trending News**: Financial news updates

### 🧠 AI Insights
- **Personal Analytics**: Track your engagement patterns
- **Activity Trends**: See when you're most active
- **Recommendations**: Personalized suggestions
- **Growth Metrics**: Truth score, Pulse activity, Hive connections

### 📍 Local Discovery
- **Local News**: News from your area
- **Local Events**: Nearby happenings
- **Nearby Users**: Connect with locals

## Environment Check

The app expects these to be available:

| Component | Expected | Check Command |
|-----------|----------|---------------|
| Backend | Port 10000 | `curl http://localhost:10000/health` |
| Metro Bundler | Port 8081 | Auto-started by Expo |
| Expo Web | Port 19006 | Auto-started by Expo |
| Tunnel | rorktest.dev | Auto-created by Rork |

## Common Issues

### Backend starts but app shows 404

**Cause:** App is using tunneled URL, backend is on localhost

**Solution:** The tunnel automatically forwards requests. Ensure:
1. Backend is running on port 10000
2. CORS is configured (already done in `backend/hono.ts`)
3. No firewall blocking localhost connections

### Live market data not loading

**Cause:** CoinGecko API rate limit or network issue

**Solution:** Backend automatically falls back to mock data. Real data:
- Bitcoin, Ethereum, Solana prices
- 24h change and volume
- Updates on each request

### Routes work in curl but not in app

**Cause:** Authentication required

**Solution:** Most routes use `protectedProcedure` which requires auth. Check:
1. User is logged in
2. JWT token is valid
3. AuthContext is providing user data

## Development Tips

### Watch Backend Logs
```bash
# In one terminal
tail -f backend.log

# Then use app in another terminal/device
```

### Hot Reload Frontend
Frontend hot reloads automatically. Backend requires restart for changes:
```bash
pkill -f "node server.js"
./START_BACKEND.sh
```

### Debug Mode
```bash
# Backend with extra logging
DEBUG=* PORT=10000 node server.js

# Frontend with Expo debugging
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel --dev
```

## Ready to Start?

```bash
./start-r3al.sh
```

Then scan the QR code with your device or press `w` for web!

---

**Need help?** Check `BACKEND_ERROR_FIX.md` for detailed troubleshooting.
