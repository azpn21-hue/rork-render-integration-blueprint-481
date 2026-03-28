# Optima-Core Deployment Package

## 📦 Complete Deployment Kit for Rork Team

This package contains everything needed to deploy Optima-Core with full Google Cloud integration.

---

## 🎯 What's Included

### 1. Configuration Files
- `optima-core-manifest.yaml` - System configuration and service definitions
- `Dockerfile.optima` - Docker containerization for deployment
- `.env` - Environment variables (update with your values)

### 2. Integration Libraries
- `lib/optima-core-client.ts` - Full-featured Axios-based API client
- `lib/optima-bridge.ts` - Simplified fetch-based API functions
- `app/config/optima-core.ts` - Configuration and URL management

### 3. Test Scripts
- `scripts/test-optima-connection.ts` - TypeScript test suite
- `scripts/quick-optima-test.js` - Standalone Node.js test
- `app/optima-test.tsx` - In-app testing screen

### 4. Documentation
- `OPTIMA_INTEGRATION_GUIDE.md` - Complete integration guide
- `OPTIMA_CONNECTION_TEST_GUIDE.md` - Testing instructions
- This file - Deployment package overview

---

## 🚀 Quick Deployment Workflow

### For Local Development

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp env.example .env
# Edit .env with your GCP credentials

# 3. Test connection
node scripts/quick-optima-test.js

# 4. Start backend (if running Python backend locally)
# cd to your Optima-Core Python backend
# uvicorn app:app --host 0.0.0.0 --port 8080

# 5. Start Rork app
bun start
```

### For Render Deployment

```bash
# 1. Push code to Git repository

# 2. Connect repository to Render

# 3. Create Web Service with these settings:
#    - Name: optima-core-backend
#    - Environment: Python 3.10
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn app:app --host 0.0.0.0 --port 8080
#    - Port: 8080

# 4. Add environment variables in Render dashboard:
GOOGLE_APPLICATION_CREDENTIALS=/opt/render/project/.secrets/service-account.json
GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8
GOOGLE_CLOUD_REGION=us-central1
RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0

# 5. Upload service-account.json to .secrets/ folder

# 6. Deploy!
```

### For Docker Deployment

```bash
# 1. Build image
docker build -t optima-core -f Dockerfile.optima .

# 2. Run container
docker run -d -p 8080:8080 \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/.secrets/service-account.json \
  -e GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8 \
  -e GOOGLE_CLOUD_REGION=us-central1 \
  -v $(pwd)/.secrets:/app/.secrets \
  --name optima-core \
  optima-core

# 3. Test
curl http://localhost:8080/health
```

---

## 🔐 Google Cloud Setup Steps

### Step 1: Service Account Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `civic-origin-476705-j8`
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Find service account: `optima-core-node@civic-origin-476705-j8.iam.gserviceaccount.com`
5. Create new key (JSON format)
6. Download and save as `.secrets/service-account.json`

### Step 2: Enable Required APIs

Enable these APIs in your GCP project:

```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable storage-api.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable bigquery.googleapis.com
gcloud services enable pubsub.googleapis.com
```

Or enable via Console:
- Vertex AI API
- Cloud Storage API
- Cloud Firestore API
- BigQuery API
- Cloud Pub/Sub API

### Step 3: Grant Permissions

Ensure service account has these roles:
- Vertex AI User (`roles/aiplatform.user`)
- Storage Admin (`roles/storage.admin`)
- Firestore User (`roles/datastore.user`)
- BigQuery Admin (`roles/bigquery.admin`)
- Pub/Sub Editor (`roles/pubsub.editor`)

---

## 📋 Pre-Flight Checklist

Before deploying, verify:

- [ ] Google Cloud project is accessible
- [ ] Service account key is downloaded
- [ ] Required GCP APIs are enabled
- [ ] Service account has correct permissions
- [ ] `.env` file is configured
- [ ] Backend code is in repository
- [ ] Test scripts pass locally
- [ ] CORS is configured for your domain
- [ ] API keys are set correctly

---

## 🧪 Testing Guide

### Test 1: Quick Health Check

```bash
# Local
curl http://localhost:8080/health

# Production (update URL)
curl https://optima-core-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Optima-Core",
  "timestamp": "2024-01-XX...",
  "gcp_connection": true
}
```

### Test 2: Run Test Scripts

```bash
# Quick Node.js test (no deps)
node scripts/quick-optima-test.js

# Full TypeScript test suite
bun run scripts/test-optima-connection.ts
```

### Test 3: In-App Testing

1. Start Rork app: `bun start`
2. Navigate to `/optima-test`
3. Tap "Run All Tests"
4. Verify all tests pass

---

## 🔧 API Usage Examples

### Using the Axios Client

```typescript
import { optimaCoreClient } from "@/lib/optima-core-client";

// Health check
const health = await optimaCoreClient.health();

// Log pulse data
const pulse = await optimaCoreClient.logPulse({
  userId: "user123",
  mood: "happy",
  activity: "social_interaction",
  timestamp: new Date().toISOString(),
});

// Submit hive data
const hive = await optimaCoreClient.submitHiveData({
  userId: "user123",
  connections: ["user456", "user789"],
  timestamp: new Date().toISOString(),
});

// Create NFT
const nft = await optimaCoreClient.createNFT({
  userId: "user123",
  nftType: "credential",
  metadata: {
    type: "identity_verification",
    verified: true,
  },
});
```

### Using the Simple Bridge

```typescript
import { getHealth, sendPulse, sendHiveEvent, createNFT } from "@/lib/optima-bridge";

// Health check
const health = await getHealth();

// Send pulse
const pulse = await sendPulse("user123", "happy", "test_interaction");

// Hive event
const hive = await sendHiveEvent("user123", { connections: 5 });

// Create NFT
const nft = await createNFT("user123", { type: "credential" });
```

---

## 🐛 Troubleshooting

### Backend Not Responding

**Symptoms**: Connection timeouts, 502/503 errors

**Solutions**:
1. Check backend is running: `curl http://localhost:8080/health`
2. Check logs for errors
3. Verify environment variables are set
4. Check firewall/network settings
5. Verify Render deployment status

### GCP Authentication Errors

**Symptoms**: `DefaultCredentialsError`, "Could not load credentials"

**Solutions**:
1. Verify service account key exists at path
2. Check `GOOGLE_APPLICATION_CREDENTIALS` env var
3. Ensure service account has permissions
4. Verify key is for correct project
5. Check key isn't expired or revoked

### CORS Errors (Web)

**Symptoms**: "Access-Control-Allow-Origin" errors in browser

**Solutions**:
1. Add your domain to CORS whitelist in backend
2. Check `Access-Control-Allow-Origin` header
3. Verify `credentials: true` in requests
4. Check preflight OPTIONS requests

### 404 Errors

**Symptoms**: Endpoints return 404

**Solutions**:
1. Verify backend is running
2. Check URL in `.env` matches deployment
3. Verify routes are registered in backend
4. Check API path includes correct prefix

---

## 📊 Monitoring & Logs

### View Logs

**Local**:
```bash
# Backend logs
tail -f logs/optima-core.log

# Docker logs
docker logs -f optima-core
```

**Render**:
- Go to Render Dashboard
- Select your service
- Click "Logs" tab
- Monitor real-time logs

**GCP**:
- Go to Cloud Console
- Navigate to Logging
- Filter by service account
- Monitor Vertex AI and Storage logs

### Key Metrics to Monitor

- Request latency
- Error rate
- GCP API usage
- Storage usage
- Vertex AI inference calls

---

## 🔄 Updates & Maintenance

### Update Backend Code

```bash
# 1. Update code
git pull origin main

# 2. Rebuild (if using Docker)
docker build -t optima-core -f Dockerfile.optima .

# 3. Restart
docker restart optima-core

# For Render: Push to Git, it auto-deploys
```

### Rotate Service Account Key

```bash
# 1. Create new key in GCP Console
# 2. Download new key
# 3. Replace .secrets/service-account.json
# 4. Restart backend
# 5. Delete old key in GCP Console
```

### Update Environment Variables

```bash
# 1. Edit .env file
# 2. Restart backend
# For Render: Update in dashboard, then trigger redeploy
```

---

## 📚 Additional Resources

### Documentation
- [Optima Integration Guide](./OPTIMA_INTEGRATION_GUIDE.md)
- [Connection Test Guide](./OPTIMA_CONNECTION_TEST_GUIDE.md)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)

### Code References
- [Axios Client](./lib/optima-core-client.ts)
- [Bridge Functions](./lib/optima-bridge.ts)
- [Configuration](./app/config/optima-core.ts)
- [Test Suite](./scripts/test-optima-connection.ts)

---

## ✅ Success Criteria

Your deployment is successful when:

- [x] Backend responds to health checks
- [x] All test scripts pass
- [x] GCP connection is established
- [x] Vertex AI is initialized
- [x] Frontend can call all endpoints
- [x] Logs show successful requests
- [x] No authentication errors
- [x] Data flows: App → Backend → GCP

---

## 🆘 Need Help?

1. **Check logs first** - Most issues show up in logs
2. **Run test scripts** - Isolate the problem
3. **Verify environment** - Double-check `.env` values
4. **Check GCP Console** - Verify services are enabled
5. **Review documentation** - See guides above

---

## 🎉 Next Steps

Once deployed successfully:

1. **Monitor performance** - Watch logs and metrics
2. **Set up alerts** - Configure GCP monitoring
3. **Scale as needed** - Adjust resources
4. **Implement features** - Build on the foundation
5. **Collect data** - Start feeding Vertex AI

---

**Deployment Package Version**: 1.0.0  
**Last Updated**: 2024  
**Maintainer**: R3AL Systems / Rork Integration Team
