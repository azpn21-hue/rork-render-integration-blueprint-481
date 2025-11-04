# Optima-Core Connection Testing Guide

This guide provides multiple ways to test your Optima-Core backend connection.

---

## 🎯 Quick Status Check

First, verify the backend is online:

```bash
curl https://optima-core-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Optima-Core",
  "timestamp": "2025-01-...",
  "gcp_connection": true
}
```

---

## 📋 Available Test Methods

### 1️⃣ **Mobile App Test Screen** (Recommended)
Interactive UI to test all endpoints from the mobile app.

**Access:** Navigate to `/optima-test` in your app

**Features:**
- ✅ Visual test results
- 📊 Success/failure summary
- 🔍 Detailed response inspection
- 📱 Works on iOS, Android, and Web

**Usage:**
```typescript
// Navigate from any screen
import { router } from "expo-router";
router.push("/optima-test");
```

---

### 2️⃣ **Quick Node.js Script**
Fast command-line test using pure Node.js (no dependencies).

**Run:**
```bash
node scripts/quick-optima-test.js
```

**Tests:**
- ✓ Root endpoint
- ✓ Health check
- ✓ Pulse logging
- ✓ Hive events
- ✓ NFT creation

---

### 3️⃣ **TypeScript Test Suite**
Full test suite with TypeScript support.

**Run:**
```bash
npx ts-node scripts/test-optima-connection.ts
```

**Features:**
- Uses both Axios and Fetch clients
- Comprehensive error reporting
- Validates all API endpoints

---

### 4️⃣ **Inline Code Test**
Quick test you can run anywhere in your app:

```typescript
import { getHealth, sendPulse } from "@/lib/optima-bridge";

(async () => {
  // Test 1: Health Check
  const health = await getHealth();
  console.log("Optima-Core Health:", health);

  // Test 2: Send Pulse
  const pulse = await sendPulse("tyrone", "focused", "inline_test");
  console.log("Pulse Response:", pulse);
})();
```

---

## 🔧 API Client Options

Your project has **two clients** for connecting to Optima-Core:

### Option A: Fetch Bridge (`optima-bridge.ts`)
Lightweight, no dependencies, works everywhere.

```typescript
import { getHealth, sendPulse, createNFT } from "@/lib/optima-bridge";

const health = await getHealth();
const pulse = await sendPulse("user123", "happy", "morning_check");
```

### Option B: Axios Client (`optima-core-client.ts`)
Full-featured client with interceptors, typed responses, and error handling.

```typescript
import { optimaCoreClient } from "@/lib/optima-core-client";

const health = await optimaCoreClient.health();
const pulse = await optimaCoreClient.logPulse({
  userId: "user123",
  mood: "happy",
  activity: "morning_check",
  timestamp: new Date().toISOString()
});
```

---

## 🌐 Environment Configuration

Your `.env` file should contain:

```env
# Optima-Core Backend URL
EXPO_PUBLIC_OPTIMA_CORE_URL=https://optima-core-backend.onrender.com

# Or for local development:
# EXPO_PUBLIC_OPTIMA_CORE_URL=http://localhost:8080

# API Key
EXPO_PUBLIC_RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0

# GCP Configuration (optional for frontend)
EXPO_PUBLIC_OPTIMA_GCP_PROJECT_ID=civic-origin-476705-j8
EXPO_PUBLIC_OPTIMA_GCP_REGION=us-central1
EXPO_PUBLIC_OPTIMA_ENV=production
```

---

## 📡 Available API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Root API heartbeat |
| `/health` | GET | Health check with GCP status |
| `/pulse` | POST | Log user activity/behavioral data |
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User authentication |
| `/hive` | POST | Submit social graph/network data |
| `/market/nft` | POST | Create NFT credential |

---

## 🐛 Troubleshooting

### Connection Refused / Timeout
```
❌ Error: connect ECONNREFUSED
```

**Solutions:**
1. Check backend is running: `curl https://optima-core-backend.onrender.com/health`
2. Verify URL in `.env` matches deployment URL
3. Check if Render service is sleeping (cold start takes 30-60 seconds)

### 404 Not Found
```
❌ HTTP 404: 404 Not Found
```

**Solutions:**
1. Verify endpoint path is correct
2. Check backend has route registered
3. Ensure backend deployment is up to date

### CORS Errors (Web only)
```
❌ CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution:** Backend must include CORS headers. Add to FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Authentication Errors
```
❌ HTTP 401: Unauthorized
```

**Solutions:**
1. Verify `EXPO_PUBLIC_RORK_API_KEY` is set in `.env`
2. Check `x-api-key` header is being sent
3. Confirm backend is validating the correct API key

---

## ✅ Expected Test Results

When all tests pass, you should see:

```
🎉 All tests passed! Optima-Core is fully connected.

✅ Health Check (Axios Client) - SUCCESS
✅ Health Check (Fetch Bridge) - SUCCESS  
✅ Pulse Logging - SUCCESS
✅ Hive Event Submission - SUCCESS
✅ NFT Creation - SUCCESS

📊 Test Summary: 5/5 passed
```

---

## 🚀 Next Steps

Once connection is verified:

1. **Integrate with Auth:** Connect `optimaCoreClient` to your `AuthContext`
2. **Add Token Storage:** Store JWT tokens from login responses
3. **Real Pulse Tracking:** Hook up pulse logging to user interactions
4. **Hive Social Graph:** Submit real connection data to `/hive`
5. **NFT Credentials:** Create actual credential NFTs after verification

---

## 📞 Support

If tests fail after following this guide:

1. Check backend logs in Render dashboard
2. Verify GCP credentials are properly configured
3. Review `OPTIMA_INTEGRATION_GUIDE.md` for deployment setup
4. Contact backend team with error messages from test output

---

**Last Updated:** January 2025  
**Optima-Core Version:** 1.0.0
