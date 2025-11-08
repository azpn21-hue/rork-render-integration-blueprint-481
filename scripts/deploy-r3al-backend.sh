#!/bin/bash

set -e

echo "========================================="
echo "R3AL App - Backend Deployment to Cloud Run"
echo "========================================="
echo ""

# Configuration
PROJECT_ID="r3al-app-1"
REGION="us-central1"
SERVICE_NAME="r3al-app"
IMAGE_NAME="gcr.io/$PROJECT_ID/r3al-backend"

# Database Configuration
CLOUD_SQL_CONNECTION_NAME="r3al-app-1:us-central1:system32-fdc"
DB_USER="postgres"
DB_NAME="r3al"

echo "📋 Configuration:"
echo "   Project ID: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Service: $SERVICE_NAME"
echo "   Image: $IMAGE_NAME"
echo "   Cloud SQL: $CLOUD_SQL_CONNECTION_NAME"
echo ""

# Check if gcloud is configured
if ! gcloud config get-value project &> /dev/null; then
    echo "❌ gcloud is not configured. Please run 'gcloud init' first."
    exit 1
fi

# Prompt for database password
read -sp "Enter database password for user '$DB_USER': " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "⚠️  No password provided. Backend will run without database."
    echo "Press Enter to continue or Ctrl+C to cancel..."
    read
fi

# Set project
echo "🔧 Setting active project..."
gcloud config set project $PROJECT_ID

# Navigate to project root
cd "$(dirname "$0")/.."

echo "📂 Current directory: $(pwd)"
echo ""

# Build and push the image
echo "🏗️  Building Docker image..."
gcloud builds submit --tag $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Image built successfully!"
echo ""

# Prepare environment variables
ENV_VARS="NODE_ENV=production"
ENV_VARS="$ENV_VARS,EXPO_PUBLIC_AI_BASE_URL=https://optima-core-712497593637.us-central1.run.app"
ENV_VARS="$ENV_VARS,AI_BASE_URL=https://optima-core-712497593637.us-central1.run.app"

# Add database configuration if password provided
if [ ! -z "$DB_PASSWORD" ]; then
    echo "🔐 Adding database configuration..."
    ENV_VARS="$ENV_VARS,CLOUD_SQL_CONNECTION_NAME=$CLOUD_SQL_CONNECTION_NAME"
    ENV_VARS="$ENV_VARS,DB_USER=$DB_USER"
    ENV_VARS="$ENV_VARS,DB_PASSWORD=$DB_PASSWORD"
    ENV_VARS="$ENV_VARS,DB_NAME=$DB_NAME"
    
    CLOUD_SQL_INSTANCES="--add-cloudsql-instances=$CLOUD_SQL_CONNECTION_NAME"
else
    echo "⚠️  Skipping database configuration"
    CLOUD_SQL_INSTANCES=""
fi

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "$ENV_VARS" \
    $CLOUD_SQL_INSTANCES \
    --port 8080 \
    --timeout 300 \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 0

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
echo "   Root: $SERVICE_URL/"
echo "   Health: $SERVICE_URL/health"
echo "   Routes: $SERVICE_URL/api/routes"
echo ""
echo "📊 View logs:"
echo "   gcloud run services logs read $SERVICE_NAME --region $REGION --limit 50"
echo ""
echo "🔧 Update .env file with:"
echo "   EXPO_PUBLIC_RORK_API_BASE_URL=$SERVICE_URL"
echo ""
