#!/bin/bash

# Deploy backend with full tRPC support to Cloud Run
set -e

PROJECT_ID=${PROJECT_ID:-"civic-origin-476705-j8"}
SERVICE_NAME="optima-core"
REGION="us-central1"

echo "=================================================="
echo "🚀 Deploying R3AL Backend with tRPC Support"
echo "=================================================="
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Navigate to the project root
cd "$(dirname "$0")/.."

echo "📦 Building container image..."
gcloud builds submit \
  --tag gcr.io/$PROJECT_ID/optima-core-backend \
  --config=backend/cloudbuild.yaml \
  .

echo ""
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/optima-core-backend \
  --region $REGION \
  --platform managed \
  --update-env-vars NODE_ENV=production,AI_ENGINE_URL=https://optima-ai-engine-712497593637.us-central1.run.app,EXPO_PUBLIC_RORK_API_BASE_URL=https://optima-core-712497593637.us-central1.run.app \
  --allow-unauthenticated \
  --port 8080 \
  --timeout 300 \
  --memory 2Gi \
  --cpu 2

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🧪 Testing endpoints..."
echo ""

SERVICE_URL="https://optima-core-712497593637.us-central1.run.app"

echo "1. Health check:"
curl -s "$SERVICE_URL/health" | jq . || echo "Failed"
echo ""

echo "2. Available routes:"
curl -s "$SERVICE_URL/api/routes" | jq . || echo "Failed"
echo ""

echo "=================================================="
echo "✅ Backend deployed and tested!"
echo "Service URL: $SERVICE_URL"
echo "tRPC endpoint: $SERVICE_URL/api/trpc/*"
echo "=================================================="
