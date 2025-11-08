#!/bin/bash

echo "=================================================="
echo "🧪 Testing Backend CORS Configuration"
echo "=================================================="
echo ""

BACKEND_URL="https://r3al-app-271493276620.us-central1.run.app"
PREVIEW_ORIGIN="https://dev-9wjyl0e4hila7inz8ajca.rorktest.dev"

echo "📡 Backend URL: ${BACKEND_URL}"
echo "🌐 Preview Origin: ${PREVIEW_ORIGIN}"
echo ""

# Test 1: Health Check
echo "🏥 Test 1: Health Check"
echo "-------------------------------------------"
HEALTH_RESPONSE=$(curl -s "${BACKEND_URL}/health")
echo "Response: ${HEALTH_RESPONSE}"
echo ""

# Test 2: CORS Preflight for tRPC endpoint
echo "🔐 Test 2: CORS Preflight (OPTIONS)"
echo "-------------------------------------------"
curl -v \
  -H "Origin: ${PREVIEW_ORIGIN}" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  "${BACKEND_URL}/api/trpc/r3al.verification.getStatus" \
  2>&1 | grep -i "access-control"
echo ""

# Test 3: Actual GET Request with Origin
echo "📥 Test 3: GET Request with Origin"
echo "-------------------------------------------"
curl -v \
  -H "Origin: ${PREVIEW_ORIGIN}" \
  -H "Content-Type: application/json" \
  "${BACKEND_URL}/health" \
  2>&1 | grep -i "access-control"
echo ""

# Test 4: List Available Routes
echo "📋 Test 4: Available Routes"
echo "-------------------------------------------"
ROUTES_RESPONSE=$(curl -s "${BACKEND_URL}/api/routes")
echo "${ROUTES_RESPONSE}" | grep -o '"r3alCount":[0-9]*'
echo ""

# Test 5: Test from different origins
echo "🌍 Test 5: Testing Multiple Origins"
echo "-------------------------------------------"
for origin in \
  "https://dev-9wjyl0e4hila7inz8ajca.rorktest.dev" \
  "https://app.rork.live" \
  "https://app.rork.app" \
  "http://localhost:19006"
do
  echo "Testing origin: ${origin}"
  CORS_RESULT=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Origin: ${origin}" \
    -X OPTIONS \
    "${BACKEND_URL}/health")
  
  if [ "$CORS_RESULT" = "200" ] || [ "$CORS_RESULT" = "204" ]; then
    echo "  ✅ CORS allowed (${CORS_RESULT})"
  else
    echo "  ❌ CORS blocked (${CORS_RESULT})"
  fi
done
echo ""

echo "=================================================="
echo "✅ CORS Test Complete"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. If tests fail, redeploy backend with updated CORS config"
echo "2. Check Cloud Run logs: gcloud run logs read r3al-app --limit=50"
echo "3. Test from preview app and check browser console"
echo ""
