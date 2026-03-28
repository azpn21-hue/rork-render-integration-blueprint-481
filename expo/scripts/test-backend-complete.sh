#!/bin/bash

# R3AL Backend Complete Test Suite
# Tests all backend endpoints including tRPC routes

SERVICE_URL="https://optima-core-712497593637.us-central1.run.app"

echo "=========================================="
echo "🧪 R3AL Backend Test Suite"
echo "=========================================="
echo ""
echo "Service URL: $SERVICE_URL"
echo ""

# Test 1: Root endpoint
echo "Test 1: Root endpoint"
echo "----------------------------"
curl -s $SERVICE_URL | jq '.'
echo ""
echo ""

# Test 2: Health check
echo "Test 2: Health check"
echo "----------------------------"
curl -s $SERVICE_URL/health | jq '.'
echo ""
echo ""

# Test 3: API health
echo "Test 3: API Health"
echo "----------------------------"
curl -s $SERVICE_URL/api/health | jq '.'
echo ""
echo ""

# Test 4: List all tRPC routes
echo "Test 4: List all tRPC routes"
echo "----------------------------"
curl -s $SERVICE_URL/api/routes | jq '.'
echo ""
echo ""

# Test 5: Test tRPC health endpoint
echo "Test 5: tRPC health endpoint"
echo "----------------------------"
curl -s -X GET "$SERVICE_URL/api/trpc/health?input=%7B%7D" | jq '.'
echo ""
echo ""

# Test 6: Test example.hi endpoint
echo "Test 6: tRPC example.hi endpoint"
echo "----------------------------"
curl -s -X GET "$SERVICE_URL/api/trpc/example.hi?input=%7B%7D" | jq '.'
echo ""
echo ""

# Test 7: Test r3al.health endpoint
echo "Test 7: tRPC r3al.health endpoint"
echo "----------------------------"
curl -s -X GET "$SERVICE_URL/api/trpc/r3al.health?input=%7B%7D" | jq '.'
echo ""
echo ""

echo "=========================================="
echo "✅ Test Suite Complete"
echo "=========================================="
echo ""
echo "If all tests show valid JSON responses, your backend is working!"
echo "If you see 404 errors, the tRPC routes are not properly mounted."
echo ""
