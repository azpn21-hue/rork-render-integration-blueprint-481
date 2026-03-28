#!/bin/bash

# Quick test script for deployed backend

set -e

BACKEND_URL="https://optima-core-712497593637.us-central1.run.app"

echo "🧪 Testing R3AL Backend Deployment"
echo "===================================="
echo ""

echo "1️⃣ Testing root endpoint..."
curl -s "$BACKEND_URL/" | jq '.' || echo "❌ Root endpoint failed"
echo ""

echo "2️⃣ Testing /health endpoint..."
curl -s "$BACKEND_URL/health" | jq '.' || echo "❌ Health endpoint failed"
echo ""

echo "3️⃣ Testing /api/health endpoint..."
curl -s "$BACKEND_URL/api/health" | jq '.' || echo "❌ API health endpoint failed"
echo ""

echo "4️⃣ Testing /api/test endpoint..."
curl -s "$BACKEND_URL/api/test" | jq '.' || echo "❌ API test endpoint failed"
echo ""

echo "===================================="
echo "✅ All tests complete!"
