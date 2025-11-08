#!/bin/bash

# Test tRPC routes on the deployed backend
SERVICE_URL=${1:-"https://optima-core-712497593637.us-central1.run.app"}

echo "=================================================="
echo "🧪 Testing tRPC Routes"
echo "=================================================="
echo "Service URL: $SERVICE_URL"
echo ""

echo "1. Health check:"
curl -s "$SERVICE_URL/health" | jq .
echo ""

echo "2. Available routes list:"
curl -s "$SERVICE_URL/api/routes" | jq .
echo ""

echo "3. Testing r3al.optima.health route:"
curl -s -X POST "$SERVICE_URL/api/trpc/r3al.optima.health" \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
echo ""

echo "4. Testing health route:"
curl -s -X GET "$SERVICE_URL/api/trpc/health" | jq .
echo ""

echo "=================================================="
echo "✅ Test complete!"
echo "=================================================="
