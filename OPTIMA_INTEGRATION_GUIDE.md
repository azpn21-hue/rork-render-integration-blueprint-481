# Optima-Core Integration Guide

## 🎯 Overview

This guide explains how to integrate Rork's R3AL mobile app with the Optima-Core backend and Google Cloud Platform services.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Google Cloud Project**: `civic-origin-476705-j8`
2. **Service Account Key**: Downloaded and stored securely
3. **Python 3.10.11** installed locally (for backend development)
4. **Node.js / Bun** installed (for frontend)
5. **Render Account** (for deployment) or Docker for local testing

## 🗂️ File Structure

```
project-root/
├── optima-core-manifest.yaml     # System configuration
├── Dockerfile.optima              # Docker deployment
├── lib/
│   ├── optima-core-client.ts     # TypeScript API client
│   └── optima-bridge.ts          # Simplified bridge functions
├── app/config/
│   └── optima-core.ts            # Configuration & URL management
├── scripts/
│   ├── test-optima-connection.ts # Full connection test
│   └── quick-optima-test.js      # Quick Node.js test
└── .env                          # Environment variables
```

## 🚀 Quick Start

### Step 1: Configure Environment Variables

Add to your `.env` file:

```bash
# Optima-Core Configuration
EXPO_PUBLIC_OPTIMA_CORE_URL=http://localhost:8080
EXPO_PUBLIC_OPTIMA_GCP_PROJECT_ID=civic-origin-476705-j8
EXPO_PUBLIC_OPTIMA_GCP_REGION=us-central1
EXPO_PUBLIC_OPTIMA_ENV=development

# API Keys
EXPO_PUBLIC_RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
EXPO_PUBLIC_OPTIMA_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0

# For production
# EXPO_PUBLIC_OPTIMA_CORE_URL=https://optima-core-backend.onrender.com
```

### Step 2: Test Connection

Run the quick test (no dependencies):

```bash
node scripts/quick-optima-test.js
```

Or the full TypeScript test:

```bash
bun run scripts/test-optima-connection.ts
```

Expected output:
```
✅ Health Check
   Status: 200
   Response: { "status": "healthy", ... }

✅ Root Endpoint
   Status: 200

✅ Log Pulse
   Status: 200
```

### Step 3: Use in Your App

Import and use the client:

```typescript
import { optimaCoreClient } from "@/lib/optima-core-client";

// Check health
const health = await optimaCoreClient.health();
console.log("Optima-Core Health:", health);

// Log pulse data
const pulse = await optimaCoreClient.logPulse({
  userId: "tyrone",
  mood: "focused",
  activity: "setup_test",
});

// Submit hive data
const hive = await optimaCoreClient.submitHiveData({
  userId: "tyrone",
  connections: ["user1", "user2"],
});

// Create NFT
const nft = await optimaCoreClient.createNFT({
  userId: "tyrone",
  nftType: "credential",
  metadata: { type: "identity" },
});
```

## 🔌 API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Root heartbeat |
| `/health` | GET | Health check + GCP status |
| `/pulse` | POST | Log behavioral data |
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | User authentication |
| `/hive` | POST | Submit network graph data |
| `/market/nft` | POST | Create NFT credential |

### Request Examples

**Health Check:**
```bash
curl https://optima-core-backend.onrender.com/health
```

**Log Pulse:**
```bash
curl -X POST https://optima-core-backend.onrender.com/pulse \
  -H "Content-Type: application/json" \
  -H "x-api-key: rnd_w0obVzrvycssNp2SbIA3q2sbZZW0" \
  -d '{
    "user": "tyrone",
    "mood": "focused",
    "interaction": "test"
  }'
```

## 🐳 Docker Deployment

Build and run locally:

```bash
docker build -t optima-core -f Dockerfile.optima .
docker run -p 8080:8080 optima-core
```

Test:
```bash
curl http://localhost:8080/health
```

## 🌐 Render Deployment

1. **Connect Repository** to Render
2. **Create New Web Service**
3. **Configure Settings**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port 8080`
   - Environment: Python 3.10
4. **Add Environment Variables**:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/opt/render/project/.secrets/service-account.json
   GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8
   GOOGLE_CLOUD_REGION=us-central1
   RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
   ```
5. **Upload Service Account Key** to `.secrets/` folder
6. **Deploy**

## 🔐 Google Cloud Setup

### Required Services

- ✅ Vertex AI (Model training and inference)
- ✅ Cloud Storage (Data and model storage)
- ✅ Firestore (Real-time tracking)
- ✅ BigQuery (Analytics)
- ✅ Pub/Sub (Event streaming)

### Service Account Permissions

Your service account needs:
- `roles/aiplatform.user`
- `roles/storage.admin`
- `roles/datastore.user`
- `roles/bigquery.admin`

### Verify GCP Connection

```python
from google.cloud import storage, aiplatform

# Initialize
storage_client = storage.Client(project="civic-origin-476705-j8")
aiplatform.init(project="civic-origin-476705-j8", location="us-central1")

# Test
buckets = [b.name for b in storage_client.list_buckets()]
print("Connected! Buckets:", buckets)
```

## 🧪 Testing Checklist

- [ ] Health endpoint returns 200
- [ ] Pulse logging works
- [ ] GCP connection established
- [ ] Vertex AI initialized
- [ ] Service account authenticated
- [ ] Frontend can call all endpoints
- [ ] Error handling works properly

## 🔧 Troubleshooting

### Issue: 404 Errors

**Problem**: Endpoints return 404

**Solution**:
1. Check backend is running
2. Verify URL in `.env`
3. Check CORS configuration
4. Ensure routes are registered

### Issue: DefaultCredentialsError

**Problem**: GCP authentication fails

**Solution**:
1. Verify service account key exists
2. Check file path in environment variable
3. Ensure key matches project ID
4. Verify service account has permissions

### Issue: Connection Timeout

**Problem**: Requests timeout

**Solution**:
1. Check backend is running and accessible
2. Verify firewall/network settings
3. Increase timeout in client config
4. Check Render deployment status

## 📚 Additional Resources

- [Optima-Core Manifest](./optima-core-manifest.yaml)
- [Test Scripts](./scripts/)
- [Client Library](./lib/optima-core-client.ts)
- [Configuration](./app/config/optima-core.ts)

## 🆘 Support

For issues or questions:
1. Check logs: `console.log` statements throughout
2. Run test scripts to isolate issues
3. Verify environment variables
4. Check backend deployment status

## 🎉 Success Criteria

When everything is working:
- ✅ Health check returns success
- ✅ All test scripts pass
- ✅ Frontend can call Optima-Core
- ✅ GCP services are connected
- ✅ Data flows between app → backend → GCP
