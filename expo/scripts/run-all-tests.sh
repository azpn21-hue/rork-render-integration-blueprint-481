#!/bin/bash

# Comprehensive R3AL Backend Test Suite
# Tests all aspects of the backend deployment

set -e

BACKEND_URL="${1:-https://r3al-app-271493276620.us-central1.run.app}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         R3AL Comprehensive Backend Test Suite             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Backend URL: $BACKEND_URL"
echo "Timestamp: $(date)"
echo ""

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test an endpoint
test_endpoint() {
  local name="$1"
  local url="$2"
  local method="${3:-GET}"
  local data="${4:-}"
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Test $TOTAL_TESTS: $name"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" 2>&1)
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -d "$data" 2>&1)
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 400 ]; then
    echo "✅ PASSED - Status: $http_code"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo "Response:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
  else
    echo "❌ FAILED - Status: $http_code"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo "Response:"
    echo "$body" | head -c 500
  fi
  echo ""
}

# ============================================================================
# SECTION 1: Basic Health Checks
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║               SECTION 1: Basic Health Checks              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Root Endpoint" "$BACKEND_URL/"
test_endpoint "Health Check" "$BACKEND_URL/health"
test_endpoint "Routes List" "$BACKEND_URL/api/routes"

# ============================================================================
# SECTION 2: tRPC Core Routes
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              SECTION 2: tRPC Core Routes                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "tRPC Health" "$BACKEND_URL/api/trpc/health?input=%7B%22json%22%3Anull%7D"
test_endpoint "Example Hi Route" "$BACKEND_URL/api/trpc/example.hi?input=%7B%22json%22%3Anull%7D"

# ============================================================================
# SECTION 3: R3AL Verification System
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           SECTION 3: R3AL Verification System             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Get Verification Status" \
  "$BACKEND_URL/api/trpc/r3al.verification.getStatus?input=%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%2C%22v%22%3A1%7D%7D"

# ============================================================================
# SECTION 4: R3AL Profile System
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║             SECTION 4: R3AL Profile System                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Get Profile" \
  "$BACKEND_URL/api/trpc/r3al.profile.getProfile?input=%7B%22json%22%3A%7B%22userId%22%3A%22test-user-123%22%7D%7D"

# ============================================================================
# SECTION 5: R3AL Token System
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║             SECTION 5: R3AL Token System                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Get Token Balance" \
  "$BACKEND_URL/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D"

test_endpoint "Get Token Transactions" \
  "$BACKEND_URL/api/trpc/r3al.tokens.getTransactions?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D"

# ============================================================================
# SECTION 6: R3AL Feed System
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              SECTION 6: R3AL Feed System                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Get Trending Feed" \
  "$BACKEND_URL/api/trpc/r3al.feed.getTrending?input=%7B%22json%22%3A%7B%22limit%22%3A25%2C%22offset%22%3A0%7D%7D"

test_endpoint "Get Local Feed" \
  "$BACKEND_URL/api/trpc/r3al.feed.getLocal?input=%7B%22json%22%3A%7B%22lat%22%3A30.2672%2C%22lon%22%3A-97.7431%2C%22radius%22%3A25%2C%22limit%22%3A25%7D%7D"

# ============================================================================
# SECTION 7: R3AL QOTD System
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              SECTION 7: R3AL QOTD System                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Get Daily Question" \
  "$BACKEND_URL/api/trpc/r3al.qotd.getDaily?input=%7B%22json%22%3Anull%7D"

test_endpoint "Get QOTD Stats" \
  "$BACKEND_URL/api/trpc/r3al.qotd.getStats?input=%7B%22json%22%3Anull%7D"

# ============================================================================
# SECTION 8: R3AL Market System
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║             SECTION 8: R3AL Market System                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Get Market Summary" \
  "$BACKEND_URL/api/trpc/r3al.market.getSummary?input=%7B%22json%22%3Anull%7D"

test_endpoint "Get Trending Symbols" \
  "$BACKEND_URL/api/trpc/r3al.market.getTrendingSymbols?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D"

test_endpoint "Get Market News" \
  "$BACKEND_URL/api/trpc/r3al.market.getNews?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D"

# ============================================================================
# SECTION 9: R3AL AI Insights
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║             SECTION 9: R3AL AI Insights                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Get AI Insights" \
  "$BACKEND_URL/api/trpc/r3al.ai.getInsights?input=%7B%22json%22%3A%7B%22timeframe%22%3A%22day%22%7D%7D"

test_endpoint "Get Personalized Summary" \
  "$BACKEND_URL/api/trpc/r3al.ai.getPersonalizedSummary?input=%7B%22json%22%3Anull%7D"

# ============================================================================
# SECTION 10: R3AL Match System
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║             SECTION 10: R3AL Match System                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Get Match Suggestions" \
  "$BACKEND_URL/api/trpc/r3al.match.suggest?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D"

test_endpoint "Get Match Insights" \
  "$BACKEND_URL/api/trpc/r3al.match.insights?input=%7B%22json%22%3Anull%7D"

# ============================================================================
# SECTION 11: R3AL Social System
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║             SECTION 11: R3AL Social System                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Get Suggested Users" \
  "$BACKEND_URL/api/trpc/r3al.social.getSuggestedUsers?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D"

# ============================================================================
# SECTION 12: R3AL Optima System
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║             SECTION 12: R3AL Optima System                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

test_endpoint "Optima Health Check" \
  "$BACKEND_URL/api/trpc/r3al.optima.health?input=%7B%22json%22%3Anull%7D"

# ============================================================================
# Test Summary
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                     Test Summary                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Total Tests:  $TOTAL_TESTS"
echo "Passed:       $PASSED_TESTS ($(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")%)"
echo "Failed:       $FAILED_TESTS ($(awk "BEGIN {printf \"%.1f\", ($FAILED_TESTS/$TOTAL_TESTS)*100}")%)"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "⚠️  Some tests failed. Please review the output above."
  exit 1
fi
