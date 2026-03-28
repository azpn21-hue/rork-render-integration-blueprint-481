# ⚡ Quick Start - R3AL App

## 🔴 Getting 404 Errors? Backend Not Running!

---

## 🚀 Start App (Choose One)

### Option A: Automatic
```bash
chmod +x start-all.sh && ./start-all.sh
```

### Option B: Manual
```bash
# Terminal 1
PORT=10000 node server.js

# Terminal 2  
bunx rork start -p 9wjyl0e4hila7inz8ajca --tunnel
```

---

## ✅ Test It

```bash
curl http://localhost:10000/health
# Should return: {"status":"healthy",...}
```

Or:
```bash
node check-backend-health.js
# Should show: ✅ All checks passed
```

---

## 🛑 Stop App

```bash
# Stop all processes
pkill -f "node server.js"
pkill -f "bunx rork"
```

---

## 🔧 Troubleshooting

### Port in use?
```bash
lsof -i :10000
kill -9 <PID>
```

### Still broken?
```bash
pkill -f "node server.js"
PORT=10000 node server.js
```

### Check logs
```bash
tail -f backend.log
```

---

## 📚 Full Docs

- **Complete Guide:** [COMPLETE_FIX_GUIDE.md](COMPLETE_FIX_GUIDE.md)
- **Detailed Start:** [START_APP_PROPERLY.md](START_APP_PROPERLY.md)
- **404 Fix:** [FIX_BACKEND_404.md](FIX_BACKEND_404.md)

---

## 💡 Remember

**Backend (10000) → Frontend (8081)**

Both must run. Backend first.

---

That's it! 🎉
