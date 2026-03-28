# Optima-Core Quick Start

## 🚀 Get Up and Running in 5 Minutes

This is the **fastest path** to get Optima-Core working with your R3AL app.

---

## ⚡ Super Quick Start

```bash
# 1. Run system health check
bash scripts/check-optima-system.sh

# 2. If tests fail, configure environment
cp env.example .env
# Edit .env with your settings

# 3. Run quick test
node scripts/quick-optima-test.js

# 4. Start your app
bun start
```

---

## 📝 Step-by-Step (5 Minutes)

### Step 1: Check Your System (30 seconds)

```bash
bash scripts/check-optima-system.sh
```

This checks:
- ✅ Environment variables
- ✅ Required files
- ✅ Backend connection
- ✅ Dependencies

### Step 2: Configure Environment (1 minute)

If `.env` doesn't exist or needs updates:

```bash
# Create/edit .env
cat > .env << EOF
# Optima-Core Configuration
EXPO_PUBLIC_OPTIMA_CORE_URL=https://optima-core-backend.onrender.com
EXPO_PUBLIC_OPTIMA_GCP_PROJECT_ID=civic-origin-476705-j8
EXPO_PUBLIC_OPTIMA_GCP_REGION=us-central1
EXPO_PUBLIC_RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
EOF
```

### Step 3: Test Connection (30 seconds)

```bash
node scripts/quick-optima-test.js
```

Expected output:
```
🚀 Quick Optima-Core Connection Test
✅ Health Check
✅ Root Endpoint
✅ Log Pulse
📊 Results: 3 passed, 0 failed
```

### Step 4: Start App (1 minute)

```bash
bun start
```

Navigate to `/optima-test` to test in-app.

---

## 🎯 What If Something Fails?

### "Backend not reachable"

```bash
# Check if URL is correct
echo $EXPO_PUBLIC_OPTIMA_CORE_URL

# Try production URL
curl https://optima-core-backend.onrender.com/health

# If that works, update .env
```

### ".env file not found"

```bash
# Copy example and edit
cp env.example .env
nano .env  # or use your favorite editor
```

### "service-account.json not found"

You need a Google Cloud service account key:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `civic-origin-476705-j8`
3. Navigate: IAM & Admin → Service Accounts
4. Create/download key as JSON
5. Save to `.secrets/service-account.json`

### "Tests fail"

```bash
# Check logs for details
node scripts/quick-optima-test.js 2>&1 | tee test-log.txt

# Check backend status
curl -I https://optima-core-backend.onrender.com/health

# Verify environment
cat .env
```

---

## 📚 Full Documentation

Once you're up and running, explore:

| Document | What's Inside |
|----------|---------------|
| [OPTIMA_SETUP_COMPLETE.md](./OPTIMA_SETUP_COMPLETE.md) | Complete overview |
| [OPTIMA_INTEGRATION_GUIDE.md](./OPTIMA_INTEGRATION_GUIDE.md) | Detailed integration |
| [OPTIMA_DEPLOYMENT_PACKAGE.md](./OPTIMA_DEPLOYMENT_PACKAGE.md) | Deployment guide |
| [OPTIMA_CONNECTION_TEST_GUIDE.md](./OPTIMA_CONNECTION_TEST_GUIDE.md) | Testing details |

---

## 🧪 Test Commands

```bash
# System health check
bash scripts/check-optima-system.sh

# Quick Node.js test
node scripts/quick-optima-test.js

# Full TypeScript test
bun run scripts/test-optima-connection.ts

# Manual cURL test
curl https://optima-core-backend.onrender.com/health
```

---

## 💻 Usage in Code

```typescript
// Import client
import { optimaCoreClient } from "@/lib/optima-core-client";

// Check health
const health = await optimaCoreClient.health();
console.log(health);

// Log pulse data
await optimaCoreClient.logPulse({
  userId: "user123",
  mood: "happy",
  activity: "testing",
});

// Submit hive data
await optimaCoreClient.submitHiveData({
  userId: "user123",
  connections: ["user456"],
});

// Create NFT
await optimaCoreClient.createNFT({
  userId: "user123",
  nftType: "credential",
  metadata: { verified: true },
});
```

---

## 🎉 Success Checklist

You're ready when:

- [x] System health check passes
- [x] Quick test shows all green
- [x] Backend returns 200 on `/health`
- [x] App connects to Optima-Core
- [x] No errors in console

---

## 🆘 Still Stuck?

1. **Run diagnostic**: `bash scripts/check-optima-system.sh`
2. **Check logs**: Look for error messages
3. **Verify URL**: Make sure backend URL is correct
4. **Read docs**: Check [OPTIMA_INTEGRATION_GUIDE.md](./OPTIMA_INTEGRATION_GUIDE.md)

---

**Quick Start Version**: 1.0.0  
**Estimated Time**: 5 minutes  
**Difficulty**: Easy
