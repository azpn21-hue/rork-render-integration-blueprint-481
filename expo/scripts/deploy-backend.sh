#!/bin/bash

# R3AL Backend Deployment Script
# Deploys backend with ML/AI features to Google Cloud Run

set -e

echo "🚀 R3AL Backend Deployment Script"
echo "===================================="
echo ""

# Configuration
PROJECT_ID="civic-origin-476705-j8"
REGION="us-central1"
SERVICE_NAME="optima-core"
IMAGE_NAME="us-central1-docker.pkg.dev/$PROJECT_ID/optima-core-repo/optima-core:latest"

echo "📋 Configuration:"
echo "  Project: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service: $SERVICE_NAME"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI not found"
    echo "   Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in to gcloud
echo "🔐 Checking gcloud authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not logged in to gcloud"
    echo "   Run: gcloud auth login"
    exit 1
fi
echo "✅ Authenticated"
echo ""

# Set project
echo "🔧 Setting project..."
gcloud config set project $PROJECT_ID
echo ""

# Check if in backend directory
if [ ! -f "cloudbuild.yaml" ]; then
    echo "❌ Error: cloudbuild.yaml not found"
    echo "   Make sure you're in the backend directory"
    exit 1
fi

echo "🏗️  Starting Cloud Build..."
echo ""

# Submit build
gcloud builds submit \
  --config cloudbuild.yaml \
  --project=$PROJECT_ID \
  --timeout=20m

echo ""
echo "✅ Build completed successfully!"
echo ""

# Get service URL
echo "🔍 Getting service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region=$REGION \
  --project=$PROJECT_ID \
  --format='value(status.url)')

echo ""
echo "✅ Deployment Complete!"
echo "===================================="
echo ""
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📊 Next steps:"
echo "  1. Test health endpoint: curl $SERVICE_URL/health"
echo "  2. Check logs: gcloud logging read \"resource.type=cloud_run_revision\" --limit=50"
echo "  3. Update .env with SERVICE_URL"
echo ""
echo "🎉 Done!"
