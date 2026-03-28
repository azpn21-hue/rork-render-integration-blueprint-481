#!/bin/bash

set -e

echo "========================================="
echo "Quick Fix - Redeploy R3AL Backend"
echo "========================================="
echo ""

PROJECT_ID="r3al-app-1"
REGION="us-central1"
SERVICE_NAME="r3al-app"
IMAGE_NAME="gcr.io/$PROJECT_ID/r3al-backend"

echo "This will redeploy the backend WITHOUT database connection."
echo "The backend will start immediately and serve requests."
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

# Set project
gcloud config set project $PROJECT_ID

# Navigate to project root
cd "$(dirname "$0")/.."

echo "🏗️  Building Docker image..."
gcloud builds submit --tag $IMAGE_NAME

echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "NODE_ENV=production,EXPO_PUBLIC_AI_BASE_URL=https://optima-core-712497593637.us-central1.run.app,AI_BASE_URL=https://optima-core-712497593637.us-central1.run.app" \
    --port 8080 \
    --timeout 300 \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 0

SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "🧪 Test it:"
echo "   curl $SERVICE_URL/health"
echo ""
