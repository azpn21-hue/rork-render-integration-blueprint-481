#!/bin/bash

# R3AL Backend Deployment Script with tRPC Support
# This script deploys the backend with the correct server.js that includes tRPC routes

set -e

PROJECT_ID="civic-origin-476705-j8"
SERVICE_NAME="optima-core"
REGION="us-central1"
IMAGE_NAME="optima-core-backend"

echo "=========================================="
echo "🚀 R3AL Backend Deployment"
echo "=========================================="
echo ""

# Step 1: Build the container image
echo "📦 Step 1: Building container image..."
gcloud builds submit \
  --tag gcr.io/$PROJECT_ID/$IMAGE_NAME \
  --project $PROJECT_ID \
  --timeout=10m \
  --config - <<EOF
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-f', 'backend/Dockerfile', '-t', 'gcr.io/$PROJECT_ID/$IMAGE_NAME', '.']
images:
- 'gcr.io/$PROJECT_ID/$IMAGE_NAME'
EOF

echo "✅ Container built successfully!"
echo ""

# Step 2: Deploy to Cloud Run
echo "🚀 Step 2: Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --timeout 300 \
  --memory 1Gi \
  --cpu 2 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,AI_ENGINE_URL=https://optima-ai-engine-712497593637.us-central1.run.app,EXPO_PUBLIC_RORK_API_BASE_URL=https://optima-core-712497593637.us-central1.run.app \
  --project $PROJECT_ID

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Service URL: https://$SERVICE_NAME-712497593637.us-central1.run.app"
echo ""
echo "Test endpoints:"
echo "  curl https://$SERVICE_NAME-712497593637.us-central1.run.app/health"
echo "  curl https://$SERVICE_NAME-712497593637.us-central1.run.app/api/routes"
echo ""
