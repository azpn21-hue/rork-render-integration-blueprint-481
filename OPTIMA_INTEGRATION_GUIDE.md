# Optima-Core Integration Guide

**Complete Deployment Package for R3AL + Optima-Core**

This guide provides everything needed to deploy and integrate Optima-Core with the R3AL application.

---

## 📦 Delivered Artifacts

### 1. **Configuration Files**
- ✅ `app/config/optima-core.ts` - System configuration and base URLs
- ✅ `.env.example` - Environment variables template
- ✅ `optima-core-manifest.yaml` - Complete system manifest

### 2. **TypeScript API Client**
- ✅ `lib/optima-core-client.ts` - Type-safe Optima-Core client
  - Health checks
  - Pulse logging
  - Hive data submission
  - NFT credential creation
  - Auth endpoints

### 3. **tRPC Bridge Routes**
- ✅ `backend/trpc/routes/r3al/optima/health.ts`
- ✅ `backend/trpc/routes/r3al/optima/log-pulse.ts`
- ✅ `backend/trpc/routes/r3al/optima/submit-hive.ts`
- ✅ `backend/trpc/routes/r3al/optima/create-nft.ts`
- ✅ Updated `backend/trpc/routes/r3al/router.ts` with Optima routes

### 4. **Deployment Files**
- ✅ `Dockerfile.optima` - Simplified Docker container for Cloud Run/Render
- ✅ `optima-core-manifest.yaml` - Complete system specification
- ✅ `.env.example` - Updated with RORK API keys

### 5. **Integration Points**
- ✅ Python FastAPI backend routes ready
- ✅ TypeScript client with axios interceptors
- ✅ Environment-based URL switching (local/production)
- ✅ GCP service integration specs

---

## 🚀 Quick Start

### Step 1: Configure Environment

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update the following variables:

```env
# Local development
EXPO_PUBLIC_OPTIMA_CORE_URL=http://localhost:8080

# Production (after deployment)
EXPO_PUBLIC_OPTIMA_CORE_URL=https://optima-core-backend.onrender.com
```

### Step 2: Test Connection

Use the health check to verify connectivity:

```typescript
import { trpc } from '@/lib/trpc';

// In a React component
const healthQuery = trpc.r3al.optima.health.useQuery();

if (healthQuery.data?.success) {
  console.log('Optima-Core connected:', healthQuery.data);
}
```

### Step 3: Log Pulse Data

```typescript
import { trpc } from '@/lib/trpc';

const logPulseMutation = trpc.r3al.optima.logPulse.useMutation();

await logPulseMutation.mutateAsync({
  mood: 'happy',
  activity: 'chatting',
  interactions: 5,
  metadata: { sessionDuration: 300 }
});
```

### Step 4: Submit Hive Data

```typescript
import { trpc } from '@/lib/trpc';

const submitHiveMutation = trpc.r3al.optima.submitHive.useMutation();

await submitHiveMutation.mutateAsync({
  connections: ['user123', 'user456'],
  graphData: { strength: 0.8 }
});
```

### Step 5: Create NFT Credential

```typescript
import { trpc } from '@/lib/trpc';

const createNFTMutation = trpc.r3al.optima.createNFT.useMutation();

await createNFTMutation.mutateAsync({
  nftType: 'verification_badge',
  metadata: {
    name: 'Truth Score Elite',
    description: 'Verified with 95+ truth score',
    imageUrl: 'https://...'
  }
});
```

---

## 🎯 Available tRPC Routes

All routes are accessible via `trpc.r3al.optima.*`:

| Route | Type | Description |
|-------|------|-------------|
| `health` | Query | Check Optima-Core backend status |
| `logPulse` | Mutation | Log user activity and behavioral data |
| `submitHive` | Mutation | Submit user network graph data |
| `createNFT` | Mutation | Create NFT credential on blockchain |

---

## 🔧 Backend Setup (Python)

### Prerequisites

- Python 3.10.11 (exact version required)
- pip package manager
- GCP service account JSON key
- Access to Google Cloud Project: `civic-origin-476705-j8`

### Local Development

1. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**Note:** If you encounter module errors, install GCP SDKs explicitly:
```bash
pip install google-cloud-aiplatform google-cloud-storage
```

2. **Configure GCP credentials:**
```bash
# Place your service-account.json in .secrets/
mkdir -p .secrets
cp /path/to/service-account.json .secrets/
```

3. **Set environment variables:**
```bash
cp .env.example .env
# Edit .env and update GOOGLE_APPLICATION_CREDENTIALS path
```

4. **Run the server:**
```bash
uvicorn app:app --reload --port 8080
```

5. **Test endpoints:**
Visit http://localhost:8080/docs for FastAPI Swagger UI

**Expected Routes:**
- `GET /` - Root heartbeat
- `GET /health` - Health check + GCP connection status
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /pulse` - Log behavioral/activity data
- `POST /hive` - Submit social graph data
- `POST /market/nft` - Create NFT credential

### Render Deployment

1. **Create new Web Service on Render**
2. **Connect to your repository**
3. **Set build settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port 8080`

4. **Add environment variables:**
```
GOOGLE_APPLICATION_CREDENTIALS=/opt/render/project/.secrets/service-account.json
GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8
GOOGLE_CLOUD_REGION=us-central1
API_ENV=production
```

5. **Upload secrets:**
   - Add service-account.json via Render's Secret Files feature

### Google Cloud Run (Optional)

1. **Build and push Docker image:**
```bash
docker build -f Dockerfile.optima -t gcr.io/civic-origin-476705-j8/optima-core .
docker push gcr.io/civic-origin-476705-j8/optima-core
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy optima-core \
  --image gcr.io/civic-origin-476705-j8/optima-core \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🐛 Common Issues

### Issue: Module not found errors

**Solution:**
```bash
pip install google-cloud-aiplatform google-cloud-storage
```

### Issue: DefaultCredentialsError

**Solution:** 
Verify `service-account.json` exists in `.secrets/` folder

### Issue: Connection timeout

**Solution:** 
Check firewall settings and ensure port 8080 is accessible

### Issue: Type errors in TypeScript

**Solution:**
```bash
# Regenerate tRPC types
npm run type-check
```

---

## 📊 Monitoring

### Health Check Endpoint

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "optima-core",
  "timestamp": "2025-11-03T12:00:00Z",
  "gcp_connection": true,
  "vertex_ai": true
}
```

### Logs

Monitor logs in development:
```bash
# Python backend logs
uvicorn app:app --reload --log-level debug

# R3AL app logs
npx expo start --clear
```

---

## 🔮 Future Enhancements

### Planned Modules

1. **Optima AI Assistant** (`/assistant`)
   - Dialog layer with Vertex AI
   - Context-aware responses
   - Personality tuning

2. **Advanced Analytics** (`/logs`)
   - BigQuery integration
   - Real-time dashboards via Looker

3. **Blockchain Integration**
   - Smart contract deployment
   - NFT marketplace features

4. **Real-time Sync**
   - WebSocket support via Pub/Sub
   - Live activity feeds

---

## 📚 API Documentation

Full API documentation is available at:
- Local: http://localhost:8080/docs
- Production: https://optima-core-backend.onrender.com/docs

---

## 🤝 Support

For issues or questions:
1. Check `optima-core-manifest.yaml` for system details
2. Review error logs in console
3. Test connection with health check endpoint
4. Verify environment variables are set correctly

---

## ✅ Integration Checklist

- [x] Configuration files created
- [x] TypeScript client implemented
- [x] tRPC routes bridged
- [x] Environment variables documented
- [x] Dockerfile for Cloud Run
- [x] YAML manifest generated
- [ ] Backend deployed to Render/Cloud Run
- [ ] Production URLs updated in config
- [ ] GCP credentials uploaded
- [ ] End-to-end testing completed

---

**Integration Status:** ✅ **COMPLETE - Ready for Deployment**

All client-side integration is complete. The R3AL app can now communicate with Optima-Core once the Python backend is deployed.
