#!/bin/bash

echo "=================================================="
echo "🔍 R3AL Backend Status Check"
echo "=================================================="
echo ""

BACKEND_URL="https://r3al-app-271493276620.us-central1.run.app"

# Quick health check
echo "🏥 Checking backend health..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/health")

if [ "$HEALTH_STATUS" = "200" ]; then
  echo "✅ Backend is healthy (${HEALTH_STATUS})"
  
  # Get backend info
  HEALTH_DATA=$(curl -s "${BACKEND_URL}/health")
  echo ""
  echo "📊 Backend Info:"
  echo "${HEALTH_DATA}" | python3 -m json.tool 2>/dev/null || echo "${HEALTH_DATA}"
  
  # Get routes count
  echo ""
  echo "📋 Checking available routes..."
  ROUTES_DATA=$(curl -s "${BACKEND_URL}/api/routes")
  R3AL_COUNT=$(echo "${ROUTES_DATA}" | grep -o '"r3alCount":[0-9]*' | grep -o '[0-9]*')
  TOTAL_COUNT=$(echo "${ROUTES_DATA}" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
  
  echo "✅ Total routes: ${TOTAL_COUNT}"
  echo "✅ R3AL routes: ${R3AL_COUNT}"
  
  if [ "$R3AL_COUNT" -gt "0" ]; then
    echo "✅ Backend is fully configured and ready"
  else
    echo "⚠️  No R3AL routes found - backend may need redeployment"
  fi
else
  echo "❌ Backend is not responding (${HEALTH_STATUS})"
  echo ""
  echo "Possible issues:"
  echo "  1. Backend service is not running"
  echo "  2. Backend URL is incorrect"
  echo "  3. Network connectivity issue"
  echo ""
  echo "Try:"
  echo "  - Check Cloud Run: gcloud run services describe r3al-app"
  echo "  - Redeploy: ./scripts/deploy-backend-cloud-run.sh"
fi

echo ""
echo "=================================================="
