#!/bin/bash

# Quick test script to verify Cloud SQL integration
# Tests: Health, Routes, Registration, Login

set -e

SERVICE_URL="https://r3al-app-271493276620.us-central1.run.app"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=========================================="
echo "Testing R3AL Backend with Cloud SQL"
echo "=========================================="
echo ""

# Test 1: Health Check
echo -e "${BLUE}Test 1: Health Check${NC}"
HEALTH_RESPONSE=$(curl -s "${SERVICE_URL}/health")
echo "$HEALTH_RESPONSE" | jq '.'

DB_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.database // "unknown"')
if [ "$DB_STATUS" = "connected" ]; then
    echo -e "${GREEN}✅ Database connected${NC}"
else
    echo -e "${YELLOW}⚠️  Database status: $DB_STATUS${NC}"
fi
echo ""

# Test 2: Routes List
echo -e "${BLUE}Test 2: Available Routes${NC}"
ROUTES_RESPONSE=$(curl -s "${SERVICE_URL}/api/routes")
ROUTE_COUNT=$(echo "$ROUTES_RESPONSE" | jq -r '.count // 0')
R3AL_COUNT=$(echo "$ROUTES_RESPONSE" | jq -r '.r3alCount // 0')
echo "Total routes: $ROUTE_COUNT"
echo "R3AL routes: $R3AL_COUNT"

if [ "$ROUTE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Routes registered${NC}"
else
    echo -e "${RED}❌ No routes found${NC}"
fi
echo ""

# Test 3: User Registration
echo -e "${BLUE}Test 3: User Registration${NC}"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test_${TIMESTAMP}@example.com"

REGISTER_RESPONSE=$(curl -s -X POST "${SERVICE_URL}/api/trpc/auth.register" \
  -H "Content-Type: application/json" \
  -d "{\"json\":{\"email\":\"${TEST_EMAIL}\",\"password\":\"test123456\",\"name\":\"Test User\"}}")

echo "$REGISTER_RESPONSE" | jq '.'

SUCCESS=$(echo "$REGISTER_RESPONSE" | jq -r '.result.data.json.success // false')
MOCK=$(echo "$REGISTER_RESPONSE" | jq -r '.result.data.json.mock // false')

if [ "$SUCCESS" = "true" ]; then
    if [ "$MOCK" = "false" ]; then
        echo -e "${GREEN}✅ Registration successful (using database)${NC}"
    else
        echo -e "${YELLOW}⚠️  Registration successful (using mock/fallback)${NC}"
    fi
else
    echo -e "${RED}❌ Registration failed${NC}"
fi
echo ""

# Test 4: User Login
echo -e "${BLUE}Test 4: User Login${NC}"

LOGIN_RESPONSE=$(curl -s -X POST "${SERVICE_URL}/api/trpc/auth.login" \
  -H "Content-Type: application/json" \
  -d "{\"json\":{\"email\":\"${TEST_EMAIL}\",\"password\":\"test123456\"}}")

echo "$LOGIN_RESPONSE" | jq '.'

SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r '.result.data.json.success // false')
MOCK=$(echo "$LOGIN_RESPONSE" | jq -r '.result.data.json.mock // false')

if [ "$SUCCESS" = "true" ]; then
    if [ "$MOCK" = "false" ]; then
        echo -e "${GREEN}✅ Login successful (using database)${NC}"
    else
        echo -e "${YELLOW}⚠️  Login successful (using mock/fallback)${NC}"
    fi
else
    echo -e "${RED}❌ Login failed${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""

if [ "$DB_STATUS" = "connected" ] && [ "$ROUTE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Backend is healthy and database is connected${NC}"
    echo ""
    echo "Your backend is ready to use!"
    echo "Backend URL: ${SERVICE_URL}"
    echo ""
    echo "Update your .env file:"
    echo "  EXPO_PUBLIC_RORK_API_BASE_URL=${SERVICE_URL}"
else
    echo -e "${YELLOW}⚠️  Backend is running but database may not be connected${NC}"
    echo ""
    echo "To fix:"
    echo "1. Run: chmod +x scripts/setup-cloudsql-env.sh"
    echo "2. Run: ./scripts/setup-cloudsql-env.sh"
    echo "3. Check logs: gcloud run logs read r3al-app --region us-central1 --limit 50"
fi
