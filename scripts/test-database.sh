#!/bin/bash

# Database Connection Test Script
# Tests Cloud SQL connectivity

echo "╔════════════════════════════════════════════════════════════╗"
echo "║           Cloud SQL Database Connection Test              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Database configuration from previous messages
DB_HOST="34.59.125.192"
DB_CONNECTION_NAME="r3al-app-1:us-central1:system32-fdc"
DB_NAME="r3al_db"
DB_USER="postgres"

echo "Testing database connectivity..."
echo "Host: $DB_HOST"
echo "Connection Name: $DB_CONNECTION_NAME"
echo "Database: $DB_NAME"
echo ""

# Check if backend has database environment variables
if [ -f ".env" ]; then
  echo "Checking .env configuration..."
  grep -E "DB_|DATABASE_" .env || echo "No database config found in .env"
  echo ""
fi

# Test backend database connection via API
echo "Testing backend database health endpoint..."
BACKEND_URL="${1:-https://r3al-app-271493276620.us-central1.run.app}"

response=$(curl -s "$BACKEND_URL/health")
echo "$response" | jq '.'

db_status=$(echo "$response" | jq -r '.database')
if [ "$db_status" = "connected" ]; then
  echo "✅ Database is connected"
else
  echo "❌ Database connection failed"
  echo "Current status: $db_status"
fi
