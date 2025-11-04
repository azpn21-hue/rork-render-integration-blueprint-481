# R3AL System Status & Troubleshooting

## 🔍 Current Issues

### 1. tRPC 404 Errors
**Error:** `[tRPC] 404 Error - Route not found`
**Route:** `r3al.tokens.getBalance`

**Root Cause:** Backend server is not running or not accessible at the configured URL.

**Solution:**
```bash
# Option 1: Start backend locally
PORT=10000 bun backend/hono.ts

# Option 2: Use full stack script
chmod +x scripts/start-full-stack.sh
./scripts/start-full-stack.sh

# Option 3: Check system status
chmod +x scripts/check-optima-system.sh
./scripts/check-optima-system.sh
```

### 2. Backend Not Responding
**Symptoms:**
- HTTP 404 on tRPC routes
- "Backend not running" errors
- Features not loading

**Diagnosis:**
```bash
# Check if backend is running
curl http://localhost:10000/health

# Check production backend (if deployed)
curl https://rork-r3al-backend.onrender.com/health

# View backend logs
tail -f backend.log
```

**Fix:**
1. Ensure `.env` file exists (copy from `env.example`)
2. Start backend: `PORT=10000 bun backend/hono.ts`
3. Verify it's running: `curl http://localhost:10000/health`
4. Check the logs for errors

### 3. Optima AI Not Visible
**Status:** ✅ Optima AI feature EXISTS and is functional

**Location:**
- **Home Screen:** Gold banner at the top with sparkle icon
- **Route:** `/r3al/optima-ai`
- **File:** `app/r3al/optima-ai.tsx`

**Features:**
- AI consultant powered by `@rork/toolkit-sdk`
- Answers questions about R3AL features
- Provides relationship advice
- Explains Trust Scores, Pulse Chat, Hive, QOTD

**To Test:**
1. Navigate to R3AL home screen
2. Look for "✨ Ask Optima II™" banner (gold border)
3. Tap to open AI chat interface
4. Try quick prompts or ask custom questions

## 📋 Feature Status Check

### Core Features Status

| Feature | File | Status | Notes |
|---------|------|--------|-------|
| **Optima AI** | `app/r3al/optima-ai.tsx` | ✅ Exists | AI consultant using @rork/toolkit-sdk |
| **Pulse Chat** | `app/r3al/pulse-chat/index.tsx` | ✅ Exists | Real-time messaging with biometric features |
| **NFT Hive** | `app/r3al/hive/index.tsx` | ✅ Exists | NFT marketplace for identity credentials |
| **Token Wallet** | `app/r3al/hive/token-wallet.tsx` | ✅ Exists | Trust-Token™ management |
| **QOTD** | `app/r3al/qotd/index.tsx` | ✅ Exists | Daily questions earning tokens |
| **Profile** | `app/r3al/profile/view.tsx` | ✅ Exists | Photo gallery, endorsements |
| **Circles** | `app/r3al/circles.tsx` | ✅ Exists | Community groups |
| **Explore** | `app/r3al/explore.tsx` | ✅ Exists | Discover users and content |

### Backend Routes Status

| Route | File | Status | Purpose |
|-------|------|--------|---------|
| `r3al.tokens.getBalance` | `backend/trpc/routes/r3al/tokens/get-balance.ts` | ✅ Defined | Get user token balance |
| `r3al.tokens.earnTokens` | `backend/trpc/routes/r3al/tokens/earn-tokens.ts` | ✅ Defined | Award tokens to user |
| `r3al.tokens.spendTokens` | `backend/trpc/routes/r3al/tokens/spend-tokens.ts` | ✅ Defined | Deduct tokens |
| `r3al.qotd.getDaily` | `backend/trpc/routes/r3al/qotd/get-daily.ts` | ✅ Defined | Get daily question |
| `r3al.qotd.submitAnswer` | `backend/trpc/routes/r3al/qotd/submit-answer.ts` | ✅ Defined | Submit answer |
| `r3al.pulseChat.*` | `backend/trpc/routes/r3al/pulse-chat/` | ✅ Defined | Pulse chat operations |
| `r3al.profile.*` | `backend/trpc/routes/r3al/profile/` | ✅ Defined | Profile management |

**Note:** All routes are properly defined in code. The 404 errors occur when backend server is not running.

## 🔧 Quick Fixes

### Fix 1: Start Everything
```bash
# Make scripts executable
chmod +x scripts/start-full-stack.sh
chmod +x scripts/check-optima-system.sh

# Start full stack
./scripts/start-full-stack.sh
```

### Fix 2: Verify Backend
```bash
# Check system status
./scripts/check-optima-system.sh

# Manual backend start
PORT=10000 bun backend/hono.ts
```

### Fix 3: Test Specific Features
```bash
# Test backend health
curl http://localhost:10000/health

# Test tRPC routes
curl http://localhost:10000/api/trpc/health

# Test tokens route (requires running backend)
curl "http://localhost:10000/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D"
```

### Fix 4: Environment Configuration
```bash
# Ensure .env exists
cp env.example .env

# Edit .env to set backend URL
# For local: EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:10000
# For prod: EXPO_PUBLIC_RORK_API_BASE_URL=https://your-backend.onrender.com
```

## 🎯 Testing Checklist

### Backend Tests
- [ ] Backend starts without errors
- [ ] `/health` endpoint responds
- [ ] `/api/trpc/health` responds
- [ ] tRPC routes are accessible
- [ ] No 404 errors in console

### Frontend Tests
- [ ] App loads successfully
- [ ] Optima AI banner visible on home screen
- [ ] Optima AI chat works
- [ ] Token balance displays
- [ ] QOTD loads
- [ ] Pulse Chat accessible
- [ ] NFT Hive accessible
- [ ] Profile page works

### Integration Tests
- [ ] Frontend connects to backend
- [ ] tRPC calls succeed
- [ ] No CORS errors
- [ ] Authentication works
- [ ] Token operations work

## 🚀 Deployment Notes

### Local Development
```bash
# Terminal 1: Backend
PORT=10000 bun backend/hono.ts

# Terminal 2: Frontend
bun start
```

### Production Deployment
1. Deploy backend to Render/Cloud Run
2. Update `.env`:
   ```
   EXPO_PUBLIC_RORK_API_BASE_URL=https://your-backend-url.com
   ```
3. Restart frontend

### Environment Variables
Required in `.env`:
- `EXPO_PUBLIC_RORK_API_BASE_URL` - Backend API URL
- `EXPO_PUBLIC_RORK_API_KEY` - API authentication key
- `EXPO_PUBLIC_AI_BASE_URL` - AI Gateway URL (optional)
- `EXPO_PUBLIC_OPTIMA_CORE_URL` - Optima Core URL (optional)

## 📚 Additional Resources

- **Backend Code:** `backend/hono.ts`, `backend/trpc/`
- **Frontend Code:** `app/r3al/`
- **Documentation:** All `*.md` files in project root
- **Schemas:** `schemas/r3al/`

## 🆘 Getting Help

If issues persist:
1. Run diagnostic: `./scripts/check-optima-system.sh`
2. Check backend logs: `tail -f backend.log`
3. Check browser console for frontend errors
4. Verify all dependencies: `bun install`
5. Clear cache: `rm -rf node_modules && bun install`

## ✅ Expected State

When everything is working:
- ✅ Backend running on port 10000
- ✅ Frontend accessible via Expo
- ✅ No 404 errors in console
- ✅ Optima AI visible and functional
- ✅ All features (Pulse, Hive, QOTD, etc.) accessible
- ✅ Token balance loads successfully
- ✅ tRPC calls succeed

---

**Last Updated:** $(date)
**Status:** Backend routes exist, need to ensure backend server is running
