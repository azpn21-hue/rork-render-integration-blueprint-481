#!/bin/bash

set -e

echo "========================================="
echo "R3AL Backend - Google Cloud Deployment"
echo "========================================="
echo ""

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-"civic-origin-476705-j8"}
REGION=${REGION:-"us-central1"}
SERVICE_NAME="optima-core"
IMAGE_NAME="gcr.io/$PROJECT_ID/optima-core-backend"

echo "📋 Configuration:"
echo "   Project ID: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Service: $SERVICE_NAME"
echo "   Image: $IMAGE_NAME"
echo ""

# Check if gcloud is configured
if ! gcloud config get-value project &> /dev/null; then
    echo "❌ gcloud is not configured. Please run 'gcloud init' first."
    exit 1
fi

# Set project
echo "🔧 Setting active project..."
gcloud config set project $PROJECT_ID

# Navigate to backend directory
cd "$(dirname "$0")/../backend"

echo "📂 Current directory: $(pwd)"
echo ""

# Build and push the image
echo "🏗️  Building Docker image..."
gcloud builds submit --tag $IMAGE_NAME -f Dockerfile.backend .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Image built successfully!"
echo ""

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "NODE_ENV=production,AI_ENGINE_URL=https://optima-ai-engine-712497593637.us-central1.run.app" \
    --port 8080 \
    --timeout 300 \
    --memory 512Mi \
    --cpu 1

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    echo ""
    echo "📋 Troubleshooting steps:"
    echo "1. Check logs: gcloud run services logs read $SERVICE_NAME --region $REGION"
    echo "2. View service: gcloud run services describe $SERVICE_NAME --region $REGION"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ Deployment Successful!"
echo "========================================="
echo ""

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "🧪 Test endpoints:"
echo "   Health: $SERVICE_URL/health"
echo "   Routes: $SERVICE_URL/api/routes"
echo ""
echo "📊 View logs:"
echo "   gcloud run services logs read $SERVICE_NAME --region $REGION --limit 50"
echo ""
