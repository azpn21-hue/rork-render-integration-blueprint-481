# Optima-Core Integration Guide

## Overview
Optima-Core is the central AI orchestration layer for R3AL, managing:
- Pulse analytics
- Hive social mapping  
- NFT identity registry
- AI-driven consulting engine

## Quick Start

### Prerequisites
- Python 3.10.11
- Google Cloud Project: civic-origin-476705-j8
- Service account JSON key

### Local Development

1. **Install Dependencies**
```bash
pip install -r requirements.txt
```

2. **Set Environment Variables**
Create `.env` file:
```env
GOOGLE_APPLICATION_CREDENTIALS=./.secrets/service-account.json
GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8
GOOGLE_CLOUD_REGION=us-central1
RORK_API_URL=https://rork-r3al-connection.onrender.com/inference
RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
API_ENV=production
API_PORT=8080
```

3. **Run Locally**
```bash
uvicorn app:app --reload
```

4. **Test Endpoints**
Visit http://127.0.0.1:8000/docs

### Deployment to Render

1. **Connect Repository**
   - Link your GitHub/GitLab repo to Render
   - Select "Web Service"

2. **Configure Build**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port 8080`

3. **Set Environment Variables** in Render Dashboard:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/opt/render/project/.secrets/service-account.json
   GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8
   GOOGLE_CLOUD_REGION=us-central1
   RORK_API_URL=https://rork-r3al-connection.onrender.com/inference
   RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
   ```

4. **Upload Secrets**
   - Create `.secrets` folder in project
   - Upload `service-account.json` file

5. **Deploy**
   - Trigger manual deploy
   - Verify health endpoint: `https://your-app.onrender.com/health`

### Docker Deployment (Alternative)

```bash
# Build
docker build -t optima-core -f Dockerfile.optima .

# Run
docker run -p 8080:8080 optima-core

# Verify
curl http://localhost:8080/health
```

## API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Root API heartbeat |
| `/health` | GET | Server + GCP health check |
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User authentication |
| `/pulse` | POST | Log pulse/activity data |
| `/hive` | POST | User community graph data |
| `/market/nft` | POST | NFT creation and linking |

## Frontend Integration

Use the Optima Bridge client from the R3AL app:

```typescript
import { getHealth, sendPulse, createNFT } from "@/lib/optima-bridge";

// Check health
const health = await getHealth();

// Log pulse data
await sendPulse("user123", "positive", "profile_view");

// Create NFT
await createNFT("user123", { title: "My NFT", image: "url" });
```

## Troubleshooting

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `ModuleNotFoundError: No module named 'google'` | Missing GCP SDKs | `pip install google-cloud-aiplatform google-cloud-storage` |
| `DefaultCredentialsError` | Missing JSON key | Place `service-account.json` in `.secrets` folder |
| `Permission denied` | File access | Run with proper permissions or fix ACLs |
| `Port already in use` | Port 8080 busy | Change port or kill existing process |

### Health Check
```bash
curl https://your-deploy-url.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Optima-Core is running",
  "timestamp": "2025-01-15T10:30:00Z",
  "gcp_connected": true
}
```

## Architecture

```
┌─────────────────┐
│  R3AL Mobile    │
│   (React Native)│
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  Optima-Core    │
│  (FastAPI)      │
└────────┬────────┘
         │
         ├──► Vertex AI
         ├──► Cloud Storage
         ├──► BigQuery
         ├──► Firestore
         └──► Pub/Sub
```

## Support

For deployment issues, contact R3AL Systems deployment team.
For GCP configuration, see [GCP Console](https://console.cloud.google.com/home/dashboard?project=civic-origin-476705-j8).
