# 🚀 Quick Command Reference

## Backend Testing

### Test Backend Health
```bash
# Quick health check
curl https://optima-core-712497593637.us-central1.run.app/health

# Automated tests
node scripts/test-cloud-backend.js

# Check available routes
curl https://optima-core-712497593637.us-central1.run.app/api/routes
```

## Cloud Run Management

### View Logs
```bash
# Recent logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=optima-core" \
  --project=civic-origin-476705-j8 --limit=50

# Live logs
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=optima-core" \
  --project=civic-origin-476705-j8
```

### Deploy Updates
```bash
# Build and deploy
cd backend
gcloud builds submit --tag gcr.io/civic-origin-476705-j8/optima-core-backend .
gcloud run deploy optima-core --image gcr.io/civic-origin-476705-j8/optima-core-backend \
  --region us-central1 --project=civic-origin-476705-j8
```

### Update Environment Variables
```bash
gcloud run services update optima-core \
  --update-env-vars KEY=VALUE \
  --region us-central1 \
  --project=civic-origin-476705-j8
```

## Local Development

### Start Frontend
```bash
bunx rork start
```

### Test Backend Locally
```bash
cd backend
npm run start
# Or
node server-simple.js
```

## Cloud SQL Setup

### Create Database
```bash
# Create instance
gcloud sql instances create r3al-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --project=civic-origin-476705-j8

# Create database
gcloud sql databases create r3al_production \
  --instance=r3al-db

# Get connection string
gcloud sql instances describe r3al-db \
  --format='value(connectionName)'
```

## Quick Debugging

### Check Service Status
```bash
gcloud run services describe optima-core \
  --region us-central1 \
  --project=civic-origin-476705-j8
```

### Check Recent Errors
```bash
gcloud logging read \
  "resource.type=cloud_run_revision AND severity>=ERROR" \
  --project=civic-origin-476705-j8 \
  --limit=20
```

### Test tRPC Endpoint
```bash
curl -X POST https://optima-core-712497593637.us-central1.run.app/api/trpc/example.hi \
  -H "Content-Type: application/json"
```
