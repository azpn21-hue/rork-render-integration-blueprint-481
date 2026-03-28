#!/bin/bash

echo "========================================"
echo "🚀 Deploying R3AL Backend to Cloud Run"
echo "========================================"

# Variables
PROJECT_ID="r3al-app-1"
SERVICE_NAME="r3al-app"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

# Build and push the container
echo "📦 Building container image..."
gcloud builds submit --tag ${IMAGE_NAME} \
  --project=${PROJECT_ID} \
  --region=${REGION}

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

# Deploy to Cloud Run with all environment variables
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 1 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "PORT=8080" \
  --set-env-vars "CLOUD_SQL_CONNECTION_NAME=r3al-app-1:us-central1:system32-fdc" \
  --set-env-vars "DB_USER=postgres" \
  --set-env-vars "DB_NAME=r3al" \
  --set-secrets="DB_PASSWORD=db-password:latest" \
  --add-cloudsql-instances "r3al-app-1:us-central1:system32-fdc"

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed!"
  exit 1
fi

echo "========================================"
echo "✅ Deployment complete!"
echo "📡 Service URL:"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --project ${PROJECT_ID} --format='value(status.url)'
echo "========================================"
