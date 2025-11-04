# Optima-Core Connection Test Guide

## 🧪 Complete Testing Suite for Optima-Core Integration

This guide provides step-by-step instructions for testing the connection between Rork's R3AL app and the Optima-Core backend.

---

## 📋 Test Overview

### Test Levels

1. **Basic Connectivity** - Can we reach the backend?
2. **API Endpoints** - Do all routes respond correctly?
3. **GCP Integration** - Is Google Cloud connected?
4. **Data Flow** - Does data move correctly between app and backend?
5. **Error Handling** - Are errors handled gracefully?

---

## 🚀 Quick Start Testing

### Option 1: Quick Node.js Test (Fastest)

No dependencies, runs anywhere:

```bash
node scripts/quick-optima-test.js
```

**What it tests**:
- Health endpoint
- Root endpoint
- Pulse logging

**Expected output**:
```
🚀 Quick Optima-Core Connection Test

Target URL: https://optima-core-backend.onrender.com
============================================================

✅ Health Check
   Status: 200
   Response: {
     "status": "healthy",
     "service": "Optima-Core",
     "timestamp": "2024-01-..."
   }

✅ Root Endpoint
   Status: 200

✅ Log Pulse
   Status: 200

============================================================

📊 Results: 3 passed, 0 failed
Success Rate: 100.0%

🎉 All tests passed!
```

### Option 2: Full TypeScript Test Suite

Comprehensive testing with TypeScript:

```bash
bun run scripts/test-optima-connection.ts
```

**What it tests**:
- Health check
- Root endpoint
- Pulse logging
- Hive data submission
- NFT creation

**Expected output**:
```
🧪 Starting Optima-Core Connection Test...

============================================================

✅ Test 1: Health Check
   Response: {
     "status": "healthy",
     "service": "Optima-Core",
     ...
   }

✅ Test 2: Root Endpoint
   Response: {
     "message": "Optima-Core API",
     "service": "optima-core"
   }

✅ Test 3: Log Pulse Data
   Response: {
     "success": true,
     "message": "Pulse logged",
     ...
   }

✅ Test 4: Submit Hive Data
   Response: {
     "success": true,
     ...
   }

✅ Test 5: Create NFT
   Response: {
     "success": true,
     ...
   }

============================================================

📊 Test Results:
   ✅ Passed: 5
   ❌ Failed: 0
   📈 Success Rate: 100.0%

============================================================

🎉 All tests passed! Optima-Core connection is working.
```

### Option 3: In-App Testing

Test directly in the mobile app:

```bash
# 1. Start the app
bun start

# 2. Navigate to test page
# Open /optima-test in the app

# 3. Run tests
# Tap "Run All Tests" button

# 4. View results
# See live results for each endpoint
```

**Benefits**:
- Tests actual app environment
- Visual feedback
- Real device/simulator testing
- Complete integration test

---

## 🔍 Detailed Test Scenarios

### Test 1: Basic Health Check

**Purpose**: Verify backend is running and accessible

**cURL Command**:
```bash
curl -X GET https://optima-core-backend.onrender.com/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "service": "Optima-Core",
  "timestamp": "2024-01-XX...",
  "gcp_connection": true,
  "vertex_ai": true
}
```

**Success Criteria**:
- HTTP 200 status
- `status: "healthy"`
- Recent timestamp
- `gcp_connection: true`

### Test 2: Root Endpoint

**Purpose**: Verify API is responsive

**cURL Command**:
```bash
curl -X GET https://optima-core-backend.onrender.com/
```

**Expected Response**:
```json
{
  "message": "Optima-Core API",
  "service": "optima-core",
  "version": "1.0.0"
}
```

### Test 3: Pulse Logging

**Purpose**: Test behavioral data logging

**cURL Command**:
```bash
curl -X POST https://optima-core-backend.onrender.com/pulse \
  -H "Content-Type: application/json" \
  -H "x-api-key: rnd_w0obVzrvycssNp2SbIA3q2sbZZW0" \
  -d '{
    "user": "test_user",
    "mood": "focused",
    "interaction": "connection_test"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Pulse logged successfully",
  "pulseId": "pulse_xxx...",
  "timestamp": "2024-01-..."
}
```

**TypeScript Example**:
```typescript
import { optimaCoreClient } from "@/lib/optima-core-client";

const result = await optimaCoreClient.logPulse({
  userId: "user123",
  mood: "happy",
  activity: "testing",
  timestamp: new Date().toISOString(),
});

console.log("Pulse logged:", result);
```

### Test 4: Hive Data Submission

**Purpose**: Test network graph data submission

**cURL Command**:
```bash
curl -X POST https://optima-core-backend.onrender.com/hive \
  -H "Content-Type: application/json" \
  -H "x-api-key: rnd_w0obVzrvycssNp2SbIA3q2sbZZW0" \
  -d '{
    "user": "test_user",
    "networkData": {
      "connections": ["user1", "user2"],
      "graphType": "social"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Hive data submitted",
  "hiveId": "hive_xxx..."
}
```

**TypeScript Example**:
```typescript
import { optimaCoreClient } from "@/lib/optima-core-client";

const result = await optimaCoreClient.submitHiveData({
  userId: "user123",
  connections: ["user456", "user789"],
  timestamp: new Date().toISOString(),
  graphData: {
    type: "social",
    strength: 0.8,
  },
});
```

### Test 5: NFT Creation

**Purpose**: Test credential NFT minting

**cURL Command**:
```bash
curl -X POST https://optima-core-backend.onrender.com/market/nft \
  -H "Content-Type: application/json" \
  -H "x-api-key: rnd_w0obVzrvycssNp2SbIA3q2sbZZW0" \
  -d '{
    "owner": "test_user",
    "tokenData": {
      "type": "credential",
      "name": "Test NFT"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "NFT created",
  "nftId": "nft_xxx...",
  "tokenUri": "ipfs://..."
}
```

**TypeScript Example**:
```typescript
import { optimaCoreClient } from "@/lib/optima-core-client";

const result = await optimaCoreClient.createNFT({
  userId: "user123",
  nftType: "credential",
  metadata: {
    credentialType: "identity_verification",
    verified: true,
    timestamp: new Date().toISOString(),
  },
});
```

### Test 6: Authentication

**Purpose**: Test user registration and login

**Register**:
```bash
curl -X POST https://optima-core-backend.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Login**:
```bash
curl -X POST https://optima-core-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**TypeScript Example**:
```typescript
import { optimaCoreClient } from "@/lib/optima-core-client";

// Register
const registerResult = await optimaCoreClient.register({
  username: "johndoe",
  email: "john@example.com",
  password: "SecurePass123!",
  fullName: "John Doe",
});

// Login
const loginResult = await optimaCoreClient.login({
  email: "john@example.com",
  password: "SecurePass123!",
});

console.log("Auth token:", loginResult.token);
```

---

## 🐛 Troubleshooting Tests

### Test Failures: Connection Timeout

**Symptoms**:
```
Error: connect ETIMEDOUT
Error: Request timeout
```

**Possible Causes**:
1. Backend is not running
2. Wrong URL in configuration
3. Network/firewall issues
4. Render service is sleeping

**Solutions**:
```bash
# 1. Check backend status
curl https://optima-core-backend.onrender.com/health

# 2. Verify URL in .env
cat .env | grep OPTIMA

# 3. Try local backend first
curl http://localhost:8080/health

# 4. Wake up Render service (first request may be slow)
# Just wait 30-60 seconds for cold start
```

### Test Failures: 404 Not Found

**Symptoms**:
```
HTTP 404: Not Found
Route not registered
```

**Possible Causes**:
1. Endpoint doesn't exist
2. Wrong route path
3. Backend not fully deployed

**Solutions**:
```bash
# 1. Check available routes
curl https://optima-core-backend.onrender.com/

# 2. Verify backend logs for route registration

# 3. Check if backend is fully started
# Look for "Application startup complete" in logs
```

### Test Failures: 500 Internal Server Error

**Symptoms**:
```
HTTP 500: Internal Server Error
Server error occurred
```

**Possible Causes**:
1. GCP authentication failed
2. Missing environment variables
3. Backend code error

**Solutions**:
```bash
# 1. Check backend logs for error details

# 2. Verify environment variables
# In Render dashboard or local .env

# 3. Test GCP connection separately
# Run Python script to verify credentials
```

### Test Failures: CORS Error (Web)

**Symptoms**:
```
Access-Control-Allow-Origin error
CORS policy blocked
```

**Solutions**:
```typescript
// 1. Add your domain to backend CORS whitelist
// In backend configuration

// 2. Verify request includes credentials
fetch(url, {
  credentials: 'include',
  // ...
});

// 3. Check preflight OPTIONS request
// Backend must handle OPTIONS method
```

---

## 📊 Test Results Interpretation

### All Tests Pass ✅

```
✅ Passed: 5
❌ Failed: 0
📈 Success Rate: 100.0%
```

**What this means**:
- Backend is healthy and accessible
- All endpoints are working
- GCP connection is established
- Ready for production use

**Next steps**:
1. Deploy to production
2. Monitor logs and metrics
3. Start building features

### Some Tests Fail ⚠️

```
✅ Passed: 3
❌ Failed: 2
📈 Success Rate: 60.0%
```

**What to check**:
1. Which specific tests failed?
2. Are there patterns? (all POST requests fail, etc.)
3. Check error messages for clues

**Common patterns**:
- Health pass, others fail → Authentication issue
- All fail → Backend not running
- Random failures → Network issues

### All Tests Fail ❌

```
✅ Passed: 0
❌ Failed: 5
📈 Success Rate: 0.0%
```

**What to check**:
1. Is backend running?
2. Is URL correct?
3. Are you connected to internet?
4. Is Render service active?

**Quick diagnostic**:
```bash
# 1. Ping the backend
curl -I https://optima-core-backend.onrender.com/health

# 2. Check local network
ping 8.8.8.8

# 3. Try local backend
curl http://localhost:8080/health
```

---

## 🔄 Continuous Testing

### Set Up Automated Testing

Create a test script that runs periodically:

```bash
#!/bin/bash
# test-optima-hourly.sh

while true; do
  echo "========================================="
  echo "Running Optima-Core tests: $(date)"
  echo "========================================="
  
  node scripts/quick-optima-test.js
  
  if [ $? -eq 0 ]; then
    echo "✅ Tests passed"
  else
    echo "❌ Tests failed - check logs"
  fi
  
  echo "Sleeping for 1 hour..."
  sleep 3600
done
```

### Monitor with Health Checks

Set up health check endpoints:

```bash
# Create a monitoring endpoint
curl https://uptimerobot.com # or similar service

# Configure to check:
# - /health every 5 minutes
# - Alert on failure
```

---

## 📝 Test Checklist

Before considering integration complete:

- [ ] Health endpoint returns 200
- [ ] Root endpoint responds
- [ ] Pulse logging works
- [ ] Hive data submission works
- [ ] NFT creation works
- [ ] Authentication works (if implemented)
- [ ] GCP connection is active
- [ ] Vertex AI is initialized
- [ ] Tests pass on local development
- [ ] Tests pass on production deployment
- [ ] In-app tests pass on iOS
- [ ] In-app tests pass on Android
- [ ] In-app tests pass on web
- [ ] Error handling works correctly
- [ ] Logs show successful requests
- [ ] No authentication errors
- [ ] CORS works for web deployment

---

## 🎉 Success!

When all tests pass, you have successfully:

✅ Connected Rork app to Optima-Core backend  
✅ Established GCP integration  
✅ Verified all API endpoints  
✅ Tested data flow  
✅ Validated error handling  

You're ready to start using Optima-Core in production!

---

## 📚 Additional Resources

- [Optima Integration Guide](./OPTIMA_INTEGRATION_GUIDE.md)
- [Deployment Package](./OPTIMA_DEPLOYMENT_PACKAGE.md)
- [Test Scripts](./scripts/)
- [Client Library](./lib/optima-core-client.ts)

---

**Test Guide Version**: 1.0.0  
**Last Updated**: 2024  
**Maintainer**: R3AL Systems / Rork Integration Team
