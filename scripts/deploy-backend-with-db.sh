#!/bin/bash

# Deploy backend to Cloud Run with Cloud SQL connection
# This script deploys the R3AL backend with database integration

set -e

echo "=========================================="
echo "Deploying R3AL Backend to Cloud Run"
echo "=========================================="

# Configuration
PROJECT_ID="r3al-app-1"
SERVICE_NAME="r3al-app"
REGION="us-central1"
CLOUD_SQL_INSTANCE="system32-fdc"
CLOUD_SQL_CONNECTION="${PROJECT_ID}:${REGION}:${CLOUD_SQL_INSTANCE}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  This script will deploy your backend with Cloud SQL integration${NC}"
echo ""
echo "Please ensure you have set the following in Cloud Run:"
echo "  - DB_USER (Cloud SQL username)"
echo "  - DB_PASSWORD (Cloud SQL password)"
echo "  - DB_NAME (database name, default: r3al)"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project
echo -e "${YELLOW}Setting GCP project to ${PROJECT_ID}...${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "${YELLOW}Ensuring required APIs are enabled...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com

# Build and deploy
echo -e "${YELLOW}Building and deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
  --source . \
  --region ${REGION} \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,CLOUD_SQL_CONNECTION_NAME=${CLOUD_SQL_CONNECTION}" \
  --add-cloudsql-instances ${CLOUD_SQL_CONNECTION}

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo -e "✅ Deployment Successful!"
    echo -e "==========================================${NC}"
    echo ""
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')
    
    echo -e "${GREEN}Service URL: ${SERVICE_URL}${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set database credentials (if not already set):"
    echo "   gcloud run services update ${SERVICE_NAME} --region ${REGION} \\"
    echo "     --set-env-vars \"DB_USER=postgres,DB_PASSWORD=YOUR_PASSWORD,DB_NAME=r3al\""
    echo ""
    echo "2. Test the health endpoint:"
    echo "   curl ${SERVICE_URL}/health"
    echo ""
    echo "3. Update your .env file:"
    echo "   EXPO_PUBLIC_RORK_API_BASE_URL=${SERVICE_URL}"
    echo ""
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
