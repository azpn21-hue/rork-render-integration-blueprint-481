#!/bin/bash

# Quick Backend Test Script for Google Cloud Run Deployment
BACKEND_URL="https://optima-core-712497593637.us-central1.run.app"

echo "=========================================="
echo "🧪 Quick Backend Test"
echo "🌐 URL: $BACKEND_URL"
echo "=========================================="

echo ""
echo "📍 Test 1: Health Check"
curl -s "$BACKEND_URL/health" | jq '.' || echo "❌ Failed"

echo ""
echo "📍 Test 2: Root Endpoint"
curl -s "$BACKEND_URL/" | jq '.' || echo "❌ Failed"

echo ""
echo "📍 Test 3: Available Routes"
curl -s "$BACKEND_URL/api/routes" | jq '.routes | length' || echo "❌ Failed"

echo ""
echo "=========================================="
echo "✅ Quick test complete!"
echo "For detailed testing, run:"
echo "  node scripts/test-deployed-backend.js"
echo "=========================================="
