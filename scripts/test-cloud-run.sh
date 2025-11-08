#!/bin/bash

# Get the service URL
SERVICE_URL="https://r3al-app-271493276620.us-central1.run.app"

echo "=================================================="
echo "🧪 Testing Cloud Run Deployment"
echo "=================================================="
echo ""
echo "Service URL: ${SERVICE_URL}"
echo ""

# Test root endpoint
echo "1️⃣ Testing root endpoint..."
curl -s "${SERVICE_URL}/" | jq '.'
echo ""

# Test health endpoint
echo "2️⃣ Testing health endpoint..."
curl -s "${SERVICE_URL}/health" | jq '.'
echo ""

# Test routes listing
echo "3️⃣ Testing routes endpoint..."
curl -s "${SERVICE_URL}/api/routes" | jq '.r3alRoutes | length'
echo ""

# Test tRPC verification route
echo "4️⃣ Testing tRPC verification.getStatus route..."
curl -s "${SERVICE_URL}/api/trpc/r3al.verification.getStatus?input=%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%2C%22v%22%3A1%7D%7D" | jq '.'
echo ""

echo "=================================================="
echo "✅ Tests complete!"
echo "=================================================="
