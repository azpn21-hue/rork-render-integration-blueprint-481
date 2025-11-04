# 🚀 R3AL Quick Start Guide

## The Issue You're Experiencing

You're seeing **404 errors** for tRPC routes like `r3al.tokens.getBalance` because the **backend server is not running**.

All the code is there and properly configured - you just need to start the backend!

## ✅ Quick Fix (2 Steps)

### Step 1: Start the Backend
```bash
chmod +x start-backend.sh
./start-backend.sh
```

### Step 2: Start the Frontend (in a new terminal)
```bash
bun start
```

That's it! Your app should now work without 404 errors.

---

## 🎯 What Each Feature Does

### ✨ Optima AI (Already Exists!)
**Location:** Home screen - gold banner at the top

**What it does:**
- AI consultant powered by Rork's toolkit
- Answers questions about R3AL features
- Provides relationship advice
- Explains Trust Scores, verification, etc.

**How to use:**
1. Go to R3AL home screen
2. Tap the "✨ Ask Optima II™" banner (top of screen)
3. Ask questions or use quick prompts

### 💬 Pulse Chat
**Location:** Home screen quick actions or `/r3al/pulse-chat`

**What it does:**
- Real-time messaging
- Optional biometric features (entertainment only)
- Realification™ pulse-based verification
- Honesty Check features
- Video chat capabilities

**Features:**
- Start chat sessions
- Send messages
- Video calls
- Realification verification
- Honesty checks

### 🏺 NFT Hive
**Location:** Home screen featured section or `/r3al/hive`

**What it does:**
- Create unique NFT identity credentials
- Marketplace for trading NFTs
- Gift NFTs to connections
- Mint digital assets

**Features:**
- NFT Creator
- NFT Gallery
- NFT Marketplace
- Token Wallet integration

### 💰 Trust-Token™ Wallet
**Location:** Home screen quick actions or `/r3al/hive/token-wallet`

**What it does:**
- Manage your Trust-Tokens™
- View balance and transaction history
- Earn tokens through authentic behavior
- Spend tokens on features

**How to earn tokens:**
- Complete daily questions (QOTD)
- Get verified
- Receive endorsements
- Authentic participation

### 💭 Question of the Day (QOTD)
**Location:** Home screen featured section or `/r3al/qotd`

**What it does:**
- Daily reflection questions
- Earn tokens for participating
- Share perspectives
- Build authenticity score

**Features:**
- New question each day
- Multiple question types
- Token rewards
- View community stats

---

## 🔍 System Diagnostics

### Check Everything
```bash
chmod +x scripts/check-optima-system.sh
./scripts/check-optima-system.sh
```

This will show you:
- ✅ What's working
- ❌ What's not working  
- 💡 How to fix issues

### Test Backend Health
```bash
# Test if backend is running
curl http://localhost:10000/health

# Should return:
# {"status":"healthy","message":"R3AL Connection API health check",...}
```

### Test tRPC Routes
```bash
# Test tRPC endpoint
curl http://localhost:10000/api/trpc/health

# Test tokens route (requires backend running)
curl "http://localhost:10000/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D"
```

---

## 🐛 Troubleshooting

### Issue: "404 Not Found" on tRPC routes

**Cause:** Backend is not running

**Fix:**
```bash
# Start backend
./start-backend.sh

# OR manually:
PORT=10000 bun backend/hono.ts
```

### Issue: "Optima AI not visible"

**Status:** It IS visible! Look for it on home screen.

**Where to find it:**
1. Navigate to `/r3al/home`
2. Look at the TOP of the screen
3. You'll see a gold-bordered banner: **"✨ Ask Optima II™"**
4. Tap it to open the AI chat

**Troubleshooting:**
- Make sure you're on the R3AL home screen, not the main app home
- Look for the Sparkles ✨ icon
- Check if you completed onboarding

### Issue: Features not loading

**Fix:**
```bash
# 1. Check if backend is running
curl http://localhost:10000/health

# 2. If not, start it
./start-backend.sh

# 3. Restart frontend
bun start
```

### Issue: "Empty URIs" or images not loading

**Cause:** Photo URIs may be placeholders or backend not providing data

**Fix:**
1. Ensure backend is running
2. Check if profile has photos uploaded
3. Verify upload endpoints are working
4. Check browser console for specific errors

### Issue: Hydration timeout

**Cause:** Backend too slow to respond or not running

**Fix:**
1. Start backend first
2. Then start frontend
3. Use the full-stack script:
```bash
chmod +x scripts/start-full-stack.sh
./scripts/start-full-stack.sh
```

---

## 📱 Feature Navigation Map

```
R3AL Home (/r3al/home)
│
├── 🌟 Optima AI Banner (top)
│   └── /r3al/optima-ai
│
├── 🎯 Quick Actions
│   ├── Explore → /r3al/explore
│   ├── Circles → /r3al/circles
│   ├── Pulse → /r3al/pulse-chat/index
│   └── Tokens → /r3al/hive/token-wallet
│
├── 💰 Trust-Token Wallet Preview
│   └── View All → /r3al/hive/token-wallet
│
├── 🏆 Truth Score Card
│   └── View Details → /r3al/truth-score-detail
│
└── 🎨 Featured Section
    ├── Question of the Day → /r3al/qotd/index
    ├── NFT Hive → /r3al/hive/index
    ├── Join Circles → /r3al/circles
    └── Your Profile → /r3al/profile/view
```

---

## 🔧 Development Commands

### Start Backend Only
```bash
# Simple start
./start-backend.sh

# With auto-reload (for development)
PORT=10000 bun --watch backend/hono.ts
```

### Start Frontend Only
```bash
bun start
```

### Start Everything
```bash
# Starts both backend and frontend
chmod +x scripts/start-full-stack.sh
./scripts/start-full-stack.sh
```

### Check System Status
```bash
chmod +x scripts/check-optima-system.sh
./scripts/check-optima-system.sh
```

---

## 🎯 Testing Checklist

Use this to verify everything works:

### Backend
- [ ] Backend starts: `./start-backend.sh`
- [ ] Health check works: `curl http://localhost:10000/health`
- [ ] tRPC responds: `curl http://localhost:10000/api/trpc/health`
- [ ] No errors in terminal

### Frontend
- [ ] App loads successfully
- [ ] No 404 errors in console
- [ ] Can navigate to R3AL home

### Features
- [ ] **Optima AI:** Banner visible, chat works
- [ ] **Pulse Chat:** Can access, loads correctly
- [ ] **NFT Hive:** Opens, shows interface
- [ ] **Token Wallet:** Displays balance
- [ ] **QOTD:** Shows daily question
- [ ] **Profile:** Loads user data
- [ ] **Circles:** Shows available circles
- [ ] **Explore:** Displays explore interface

---

## 📚 File Reference

### Key Backend Files
- `backend/hono.ts` - Main server file
- `backend/trpc/app-router.ts` - Route definitions
- `backend/trpc/routes/r3al/router.ts` - R3AL routes
- `backend/trpc/routes/r3al/tokens/` - Token operations
- `backend/trpc/routes/r3al/qotd/` - QOTD operations
- `backend/trpc/routes/r3al/pulse-chat/` - Pulse chat operations

### Key Frontend Files
- `app/r3al/home.tsx` - Main home screen (Optima AI banner here!)
- `app/r3al/optima-ai.tsx` - AI consultant interface
- `app/r3al/pulse-chat/index.tsx` - Pulse chat main
- `app/r3al/hive/index.tsx` - NFT Hive hub
- `app/r3al/hive/token-wallet.tsx` - Token wallet
- `app/r3al/qotd/index.tsx` - Question of the Day

### Configuration
- `.env` - Environment variables
- `lib/trpc.ts` - tRPC client setup
- `app/contexts/R3alContext.tsx` - R3AL state management

---

## 🆘 Still Having Issues?

1. **Run full diagnostics:**
   ```bash
   ./scripts/check-optima-system.sh
   ```

2. **Check logs:**
   ```bash
   # Backend logs
   tail -f backend.log
   
   # Or if running in terminal, check the output
   ```

3. **Verify environment:**
   ```bash
   # Check .env exists
   ls -la .env
   
   # View backend URL
   grep EXPO_PUBLIC_RORK_API_BASE_URL .env
   ```

4. **Clean install:**
   ```bash
   rm -rf node_modules
   bun install
   ./start-backend.sh
   ```

---

## ✨ Summary

**Your app has ALL features working!**

The main issue is just that the **backend needs to be running**. Start it with:

```bash
./start-backend.sh
```

Then in another terminal:
```bash
bun start
```

**Optima AI is already visible** on the home screen as a prominent gold banner at the top. Just make sure you:
1. Complete onboarding
2. Navigate to R3AL home (`/r3al/home`)
3. Look for the sparkle icon (✨) banner at the top

All other features (Pulse, Hive, QOTD, Tokens) are fully implemented and accessible from the home screen!

---

**Need more help?** Check `SYSTEM_STATUS.md` for detailed status and troubleshooting.
