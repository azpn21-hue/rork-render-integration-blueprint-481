#!/bin/bash

# R3AL Backend Deployment Script for Google Cloud Run
# This script deploys the backend from the project root

set -e  # Exit on error

echo "=========================================="
echo "🚀 R3AL Backend Cloud Run Deployment"
echo "=========================================="

# Check if PROJECT_ID is set
if [ -z "$PROJECT_ID" ]; then
  echo "⚠️  PROJECT_ID not set. Detecting from gcloud..."
  export PROJECT_ID=$(gcloud config get-value project)
  echo "✅ PROJECT_ID set to: $PROJECT_ID"
fi

# Build the container image
echo ""
echo "📦 Building container image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/r3al-backend .

# Deploy to Cloud Run (simplified, no JWT_SECRET for now)
echo ""
echo "🚢 Deploying to Cloud Run..."
gcloud run deploy optima-core \
    --image gcr.io/$PROJECT_ID/r3al-backend \
    --region us-central1 \
    --platform managed \
    --set-env-vars NODE_ENV=production \
    --allow-unauthenticated \
    --timeout 300 \
    --memory 1Gi \
    --cpu 2 \
    --port 8080

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Test your backend with:"
echo "  curl https://optima-core-712497593637.us-central1.run.app/health"
echo ""
