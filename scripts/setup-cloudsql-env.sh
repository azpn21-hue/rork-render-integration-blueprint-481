#!/bin/bash

# Quick script to set up Cloud SQL environment variables for Cloud Run
# Run this after deploying your backend

set -e

PROJECT_ID="r3al-app-1"
SERVICE_NAME="r3al-app"
REGION="us-central1"
CLOUD_SQL_CONNECTION="r3al-app-1:us-central1:system32-fdc"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "=========================================="
echo "Cloud SQL Environment Setup for Cloud Run"
echo "=========================================="
echo ""

# Prompt for database password
read -sp "Enter PostgreSQL password for 'postgres' user: " DB_PASSWORD
echo ""
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Password cannot be empty${NC}"
    exit 1
fi

echo -e "${YELLOW}Updating Cloud Run service with database configuration...${NC}"

gcloud run services update ${SERVICE_NAME} \
  --region ${REGION} \
  --set-env-vars "CLOUD_SQL_CONNECTION_NAME=${CLOUD_SQL_CONNECTION},DB_USER=postgres,DB_PASSWORD=${DB_PASSWORD},DB_NAME=r3al,NODE_ENV=production" \
  --add-cloudsql-instances ${CLOUD_SQL_CONNECTION}

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Environment variables updated successfully!${NC}"
    echo ""
    echo "Testing connection..."
    sleep 5
    
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')
    echo ""
    echo "Health check:"
    curl -s "${SERVICE_URL}/health" | jq '.'
    echo ""
    echo -e "${GREEN}Done! Your backend should now be connected to Cloud SQL.${NC}"
else
    echo -e "${RED}❌ Failed to update environment variables${NC}"
    exit 1
fi
