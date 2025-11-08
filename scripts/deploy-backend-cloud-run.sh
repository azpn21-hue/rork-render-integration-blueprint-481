#!/bin/bash

set -e

echo "=================================================="
echo "🚀 R3AL Backend Deployment to Cloud Run"
echo "=================================================="

# Configuration
PROJECT_ID="r3al-app-1"
REGION="us-central1"
SERVICE_NAME="r3al-app"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo ""
echo "📋 Configuration:"
echo "  Project: ${PROJECT_ID}"
echo "  Region: ${REGION}"
echo "  Service: ${SERVICE_NAME}"
echo "  Image: ${IMAGE_NAME}"
echo ""

# Build Docker image
echo "🔨 Building Docker image..."
docker build -f backend/Dockerfile -t ${IMAGE_NAME}:latest .

echo ""
echo "📤 Pushing image to Google Container Registry..."
docker push ${IMAGE_NAME}:latest

echo ""
echo "🚢 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image=${IMAGE_NAME}:latest \
  --platform=managed \
  --region=${REGION} \
  --project=${PROJECT_ID} \
  --allow-unauthenticated \
  --port=8080 \
  --memory=2Gi \
  --cpu=2 \
  --timeout=300 \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars="NODE_ENV=production,PORT=8080" \
  --update-env-vars="CLOUD_SQL_CONNECTION_NAME=r3al-app-1:us-central1:system32-fdc" \
  --no-use-http2

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📡 Service URL:"
gcloud run services describe ${SERVICE_NAME} \
  --platform=managed \
  --region=${REGION} \
  --project=${PROJECT_ID} \
  --format="value(status.url)"

echo ""
echo "=================================================="
echo "✅ Deployment successful!"
echo "=================================================="
