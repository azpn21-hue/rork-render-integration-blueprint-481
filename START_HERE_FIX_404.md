# 🚨 Quick Fix for 404 Errors

You're seeing 404 errors because the backend server needs to be restarted to load the new routes.

## 🔥 One-Command Fix

```bash
chmod +x fix-404.sh && ./fix-404.sh
```

That's it! This will:
1. Stop old backend processes
2. Clear caches  
3. Start the backend fresh
4. Test all routes
5. Confirm everything works

## ✅ What You Should See

```
✅ Backend is running successfully!
📡 Backend URL: http://localhost:10000
🚀 Now restart your Expo app to connect
```

## 🔧 Alternative: Manual Fix

If the script doesn't work, do this manually:

```bash
# 1. Stop backend
pkill -f "node.*server.js"

# 2. Start backend
node server.js
```

Leave that terminal window open (backend needs to stay running).

In another terminal:

```bash
# 3. Test it works
curl http://localhost:10000/health
# Should return: {"status":"healthy"...}

# 4. Restart Expo
npm start
```

## 🧪 Verify It's Fixed

Run this to check everything:

```bash
bash scripts/check-system-status.sh
```

Look for these ✅ checkmarks:
- ✅ Backend is healthy
- ✅ Feed routes
- ✅ Market routes  
- ✅ AI routes

## 🆘 Still Not Working?

### Check 1: Is the backend really running?

```bash
lsof -i :10000
```

If you see output, it's running. If not:

```bash
node server.js
```

### Check 2: Test routes directly

```bash
curl "http://localhost:10000/api/routes"
```

You should see a JSON response with lots of routes listed.

### Check 3: Check the frontend URL

Open `app/config/api.ts` and make sure it points to your backend:

```typescript
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:10000";
```

### Check 4: Clear everything and restart

```bash
# Clear all caches
rm -rf .expo
rm -rf node_modules/.cache

# Kill all processes
pkill -f "node.*server.js"

# Restart backend
node server.js &

# Restart frontend (in new terminal)
npm start -- --clear
```

## 📚 More Details

- Full guide: [BACKEND_404_QUICK_FIX.md](./BACKEND_404_QUICK_FIX.md)
- System check: `bash scripts/check-system-status.sh`
- Route test: `node scripts/test-backend-routes.js`

---

**TL;DR**: Run `chmod +x fix-404.sh && ./fix-404.sh` and restart your app!
