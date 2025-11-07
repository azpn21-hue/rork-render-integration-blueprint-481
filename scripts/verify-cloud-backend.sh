#!/bin/bash

# Quick Backend Verification Script
# Tests the deployed Cloud Run backend

BACKEND_URL="https://optima-core-712497593637.us-central1.run.app"

echo "======================================================================"
echo "🧪 R3AL Backend Verification"
echo "======================================================================"
echo ""
echo "Backend URL: $BACKEND_URL"
echo ""

echo "🔍 Testing Health Endpoint..."
echo "----------------------------------------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  "$BACKEND_URL/health" | jq '.' 2>/dev/null || curl -s -w "\nHTTP Status: %{http_code}\n" "$BACKEND_URL/health"

echo ""
echo "----------------------------------------------------------------------"
echo "🔍 Testing Root Endpoint..."
echo "----------------------------------------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  "$BACKEND_URL/" | jq '.' 2>/dev/null || curl -s -w "\nHTTP Status: %{http_code}\n" "$BACKEND_URL/"

echo ""
echo "----------------------------------------------------------------------"
echo "🔍 Testing API Routes Endpoint..."
echo "----------------------------------------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  "$BACKEND_URL/api/routes" | jq '.count, .routes[:5]' 2>/dev/null || curl -s -w "\nHTTP Status: %{http_code}\n" "$BACKEND_URL/api/routes"

echo ""
echo "======================================================================"
echo "✅ Verification Complete"
echo "======================================================================"
echo ""
echo "If all endpoints returned HTTP Status 200, your backend is working!"
echo "Next steps:"
echo "  1. Run: node scripts/test-cloud-backend.js"
echo "  2. Start your app: bunx rork start"
echo "  3. Test features from the app"
echo ""
