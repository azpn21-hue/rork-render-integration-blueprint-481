#!/bin/bash

# Backend Test Script
# This script tests the deployed backend on Cloud Run

set -e

BACKEND_URL="https://optima-core-712497593637.us-central1.run.app"

echo "=================================================="
echo "Testing R3AL Backend on Cloud Run"
echo "URL: $BACKEND_URL"
echo "=================================================="
echo ""

# Test 1: Root endpoint
echo "Test 1: Root Endpoint (GET /)"
echo "----------------------------------------"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BACKEND_URL/")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: Root endpoint is working"
else
  echo "❌ FAIL: Expected 200, got $HTTP_STATUS"
fi
echo ""

# Test 2: Health endpoint
echo "Test 2: Health Endpoint (GET /health)"
echo "----------------------------------------"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BACKEND_URL/health")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: Health endpoint is working"
else
  echo "❌ FAIL: Expected 200, got $HTTP_STATUS"
fi
echo ""

# Test 3: API Health endpoint
echo "Test 3: API Health Endpoint (GET /api/health)"
echo "----------------------------------------"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BACKEND_URL/api/health")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: API health endpoint is working"
else
  echo "❌ FAIL: Expected 200, got $HTTP_STATUS"
fi
echo ""

# Test 4: API Test endpoint
echo "Test 4: API Test Endpoint (GET /api/test)"
echo "----------------------------------------"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BACKEND_URL/api/test")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: API test endpoint is working"
else
  echo "❌ FAIL: Expected 200, got $HTTP_STATUS"
fi
echo ""

# Summary
echo "=================================================="
echo "Test Summary"
echo "=================================================="
echo "Backend URL: $BACKEND_URL"
echo ""
echo "All basic endpoints should return 200 OK."
echo "If any test failed, check Cloud Run logs:"
echo "  gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=optima-core\" --limit 50"
echo ""
echo "Next steps:"
echo "  1. If tests pass, update app/config/api.ts with this URL"
echo "  2. Deploy the frontend to test full integration"
echo "  3. Set up Cloud SQL for persistent storage"
echo "=================================================="
