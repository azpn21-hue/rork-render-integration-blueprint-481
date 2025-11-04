# Quick Reference Card

## 🚀 Start Everything

```bash
# Terminal 1 - Backend
./start-backend.sh

# Terminal 2 - Frontend  
bun start
```

## ✅ Verify Working

```bash
# Backend health
curl http://localhost:10000/health

# List routes
curl http://localhost:10000/api/routes

# In app: go to /backend-test
```

## 🔧 Troubleshooting

```bash
# Port stuck?
lsof -ti:10000 | xargs kill -9

# Check routes?
node scripts/check-backend-routes.js

# Can't start?
chmod +x start-backend.sh
```

## 📋 Features to Test

- `/r3al/qotd` - Daily question
- `/r3al/home` - Token balance  
- `/r3al/pulse-chat` - Messaging
- `/r3al/hive` - NFT gallery
- `/backend-test` - Connection tests

## 📚 Full Docs

- `START_BACKEND_FIRST.md` - Quick start
- `HOW_TO_RUN.md` - Visual guide
- `PULSE_NFT_QOTD_FIX_GUIDE.md` - Troubleshooting

## 🎯 Remember

**You need BOTH terminals running!**
- Backend = Port 10000
- Frontend = Port 8081

Both must run at the same time ✨
