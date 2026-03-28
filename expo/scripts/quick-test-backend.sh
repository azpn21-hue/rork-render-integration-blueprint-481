#!/bin/bash

# Quick test of deployed backend
SERVICE_URL="https://optima-core-712497593637.us-central1.run.app"

echo "Testing deployed backend..."
echo ""

echo "1. Root endpoint:"
curl -s "$SERVICE_URL/" | jq . 2>/dev/null || curl -s "$SERVICE_URL/"
echo -e "\n"

echo "2. Health endpoint:"
curl -s "$SERVICE_URL/health" | jq . 2>/dev/null || curl -s "$SERVICE_URL/health"
echo -e "\n"

echo "3. API health endpoint:"
curl -s "$SERVICE_URL/api/health" | jq . 2>/dev/null || curl -s "$SERVICE_URL/api/health"
echo -e "\n"

echo "4. API routes endpoint (should list tRPC routes):"
curl -s "$SERVICE_URL/api/routes" | jq . 2>/dev/null || curl -s "$SERVICE_URL/api/routes"
echo -e "\n"

echo "5. tRPC health query:"
curl -s "$SERVICE_URL/api/trpc/health" 2>/dev/null || echo "404 - tRPC not mounted"
echo -e "\n"

echo "6. tRPC r3al.optima.health query:"
curl -s "$SERVICE_URL/api/trpc/r3al.optima.health" 2>/dev/null || echo "404 - tRPC not mounted"
echo ""
