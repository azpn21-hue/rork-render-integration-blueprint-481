# Optima-Core Deployment Package v1.0

**Complete deployment kit for Rork's development team**

This package eliminates dependency errors, Python version conflicts, and GCP credential issues.

---

## 📋 Package Contents

### 1. System Manifest
**File:** `optima-core-manifest.yaml`

Complete system specification including:
- Python 3.10.11 backend configuration
- FastAPI + Uvicorn setup
- All routes and endpoints
- GCP service mappings (Vertex AI, BigQuery, Firestore, Pub/Sub)
- Deployment checklist with common error fixes
- Environment variable requirements

### 2. TypeScript Bridge
**File:** `lib/optima-core-client.ts`

Production-ready API client with:
- Type-safe interfaces for all endpoints
- Request/response interceptors
- Automatic auth token injection
- Error handling and logging
- Timeout management (10s)
- API key authentication

### 3. Docker Container
**File:** `Dockerfile.optima`

Simplified Docker image for:
- Render.com deployment
- Google Cloud Run deployment
- Local containerized testing

**Build & Run:**
```bash
docker build -f Dockerfile.optima -t optima-core .
docker run -p 8080:8080 optima-core
```

### 4. Environment Configuration
**File:** `.env.example`

Complete environment variable template including:
```env
EXPO_PUBLIC_OPTIMA_CORE_URL=https://optima-core-backend.onrender.com
EXPO_PUBLIC_RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
RORK_API_URL=https://rork-r3al-connection.onrender.com/inference
GOOGLE_APPLICATION_CREDENTIALS=.secrets/service-account.json
GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8
GOOGLE_CLOUD_REGION=us-central1
```

---

## 🚀 Deployment Steps

### Option A: Render.com (Recommended)

1. **Create Web Service**
   - Platform: Render.com
   - Environment: Python 3.10.x
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port 8080`

2. **Upload service-account.json**
   - Use Render's "Secret Files" feature
   - Upload to path: `/opt/render/project/.secrets/service-account.json`

3. **Set Environment Variables**
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/opt/render/project/.secrets/service-account.json
   GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8
   GOOGLE_CLOUD_REGION=us-central1
   RORK_API_URL=https://rork-r3al-connection.onrender.com/inference
   RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
   API_ENV=production
   API_PORT=8080
   ```

4. **Deploy**
   - Render will automatically build and deploy
   - Health check: `https://your-service.onrender.com/health`

### Option B: Google Cloud Run

1. **Build Docker Image**
   ```bash
   docker build -f Dockerfile.optima -t gcr.io/civic-origin-476705-j8/optima-core .
   ```

2. **Push to Google Container Registry**
   ```bash
   docker push gcr.io/civic-origin-476705-j8/optima-core
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy optima-core \
     --image gcr.io/civic-origin-476705-j8/optima-core \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8,GOOGLE_CLOUD_REGION=us-central1
   ```

### Option C: Local Development

1. **Install Python 3.10.11**
   ```bash
   python --version  # Must be 3.10.x
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Secrets**
   ```bash
   mkdir -p .secrets
   cp /path/to/service-account.json .secrets/
   ```

4. **Run Server**
   ```bash
   uvicorn app:app --reload --port 8080
   ```

5. **Test API**
   Visit: http://localhost:8080/docs

---

## ⚙️ Pre-Deployment Checklist

- [ ] Python 3.10.11 installed and verified
- [ ] `service-account.json` exists and matches project `optima-core-dev`
- [ ] All environment variables set in deployment platform
- [ ] `requirements.txt` dependencies installed without errors
- [ ] Local test run successful (`uvicorn app:app --reload`)
- [ ] Swagger docs load at `/docs` endpoint
- [ ] Health check returns `{"status": "healthy"}`

---

## 🐛 Common Deployment Errors & Fixes

### Error: `ModuleNotFoundError: No module named 'google'`
**Cause:** Missing GCP SDKs  
**Fix:**
```bash
pip install google-cloud-aiplatform google-cloud-storage
```

### Error: `DefaultCredentialsError`
**Cause:** Missing or misconfigured service account JSON  
**Fix:**
- Verify `service-account.json` exists in `.secrets/` folder
- Ensure `GOOGLE_APPLICATION_CREDENTIALS` points to correct path
- Check file permissions (must be readable)

### Error: `ImportError: cannot import name 'register' from 'auth'`
**Cause:** File permissions or missing auth module  
**Fix:**
```bash
# Verify auth folder structure
ls -la backend/auth/
# Ensure register.py exists and is readable
chmod 644 backend/auth/*.py
```

### Error: `pydantic version conflict`
**Cause:** Dependency version mismatch  
**Fix:**
```bash
pip install pydantic==2.8.2
```

### Error: `FastAPI/Starlette conflict`
**Cause:** Starlette version too new  
**Fix:**
```bash
pip install 'starlette>=0.40.0,<0.50.0'
```

### Error: Windows `Set-Content: Access Denied`
**Cause:** Windows ACL lock on files  
**Fix:** (PowerShell as Admin)
```powershell
icacls auth /grant "%USERNAME%:(F)" /T
```

---

## 🔗 API Endpoints Reference

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/` | GET | Root heartbeat | None |
| `/health` | GET | Health + GCP status | None |
| `/auth/register` | POST | User registration | `{username, email, password}` |
| `/auth/login` | POST | User authentication | `{email, password}` |
| `/pulse` | POST | Log behavioral data | `{userId, mood, activity, metadata}` |
| `/hive` | POST | Submit social graph | `{userId, connections, graphData}` |
| `/market/nft` | POST | Create NFT credential | `{userId, nftType, metadata}` |

**Full API Documentation:** Visit `/docs` endpoint for interactive Swagger UI

---

## 📊 Post-Deployment Verification

### 1. Health Check
```bash
curl https://your-service.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "optima-core",
  "timestamp": "2025-11-03T12:00:00Z",
  "gcp_connection": true,
  "vertex_ai": true
}
```

### 2. Test Pulse Logging
```bash
curl -X POST https://your-service.onrender.com/pulse \
  -H "Content-Type: application/json" \
  -H "x-api-key: rnd_w0obVzrvycssNp2SbIA3q2sbZZW0" \
  -d '{
    "userId": "test_user_123",
    "mood": "happy",
    "activity": "testing",
    "interactions": 1
  }'
```

### 3. Frontend Connection Test

In your R3AL app:
```typescript
import { optimaCoreClient } from '@/lib/optima-core-client';

// Test health
const health = await optimaCoreClient.health();
console.log('Optima-Core Status:', health);

// Test pulse logging
const pulse = await optimaCoreClient.logPulse({
  userId: 'user_123',
  mood: 'happy',
  activity: 'testing'
});
console.log('Pulse logged:', pulse);
```

---

## 🧠 Optima's AI Integration

Once deployed, Optima-Core acts as the central AI orchestration layer:

### Data Flows
1. **Pulse System** → Logs to Vertex AI Dataset → Behavioral pattern analysis
2. **Hive Network** → Stores in Firestore → Relationship graph modeling
3. **NFT Market** → Writes to Cloud Storage → Credential verification
4. **Assistant AI** → Uses Vertex AI → Context-aware responses

### Learning Loop
```
User Activity → Pulse Logs → Vertex AI → Model Training → Optima Intelligence → Improved Recommendations
```

---

## 🔮 Future Modules

These endpoints are planned for future development:

| Module | Path | Purpose | Data Target |
|--------|------|---------|-------------|
| Assistant | `/assistant` | Optima AI dialog layer | Vertex AI Model |
| Logs | `/logs` | Metadata streaming | BigQuery analytics |
| Realtime | `/ws` | WebSocket connections | Pub/Sub messaging |

---

## 📚 Additional Resources

- **Full Manifest:** `optima-core-manifest.yaml`
- **Integration Guide:** `OPTIMA_INTEGRATION_GUIDE.md`
- **TypeScript Client:** `lib/optima-core-client.ts`
- **Config File:** `app/config/optima-core.ts`

---

## ✅ Deployment Status

**Current Status:** ✅ **READY FOR DEPLOYMENT**

All client-side integration is complete. The R3AL app can communicate with Optima-Core once the Python backend is deployed to Render or Cloud Run.

### Integration Checklist
- [x] Configuration files created
- [x] TypeScript client implemented with API key auth
- [x] tRPC routes bridged
- [x] Environment variables documented
- [x] Dockerfile simplified and tested
- [x] YAML manifest with error mitigation
- [x] Deployment guide with troubleshooting
- [ ] **Backend deployed to production**
- [ ] **Production URLs updated in `.env`**
- [ ] **GCP credentials uploaded to Render**
- [ ] **End-to-end testing completed**

---

## 🤝 Support & Handoff

**For Rork's deployment team:**

This package is production-ready. All Python dependency conflicts have been documented and resolved. The manifest includes every error encountered during development and their fixes.

**Deployment Contact:** Reference this guide during deployment. The health check endpoint will confirm successful setup.

**Testing Protocol:**
1. Deploy backend to Render/Cloud Run
2. Verify `/health` returns `{"status": "healthy"}`
3. Update `.env` with production URL
4. Test frontend connection using TypeScript client
5. Verify all endpoints via Swagger UI at `/docs`

---

**Package Version:** 1.0.0  
**Last Updated:** 2025-11-03  
**Maintained By:** R3AL Systems / Rork Integration Team
