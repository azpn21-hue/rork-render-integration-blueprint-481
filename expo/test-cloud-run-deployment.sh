#!/bin/bash

echo "========================================"
echo "🧪 Testing Cloud Run Deployment"
echo "========================================"

# Your Cloud Run service URL
SERVICE_URL="https://r3al-app-271493276620.us-central1.run.app"

# Test 1: Root endpoint
echo ""
echo "📡 Test 1: Root endpoint"
curl -s "${SERVICE_URL}/" | jq .

# Test 2: Health check
echo ""
echo "📡 Test 2: Health check"
curl -s "${SERVICE_URL}/health" | jq .

# Test 3: Routes listing
echo ""
echo "📡 Test 3: Available routes"
curl -s "${SERVICE_URL}/api/routes" | jq '.r3alRoutes[:5]'

# Test 4: tRPC endpoint
echo ""
echo "📡 Test 4: tRPC verification status"
curl -s "${SERVICE_URL}/api/trpc/r3al.verification.getStatus?input=%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%2C%22v%22%3A1%7D%7D" | jq .

echo ""
echo "========================================"
echo "✅ Tests complete!"
echo "========================================"
