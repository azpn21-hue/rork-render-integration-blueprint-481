#!/bin/bash

echo "🔍 R3AL Deployment Baseline Verification"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check Environment Variables
echo "1️⃣ Checking Environment Variables..."
echo "-----------------------------------"
echo "r3al-app environment variables:"
gcloud run services describe r3al-app --region=us-central1 --format="value(spec.template.spec.containers[0].env)" 2>/dev/null || echo "❌ Failed to fetch r3al-app env vars"
echo ""
echo "optima-core environment variables:"
gcloud run services describe optima-core --region=us-central1 --format="value(spec.template.spec.containers[0].env)" 2>/dev/null || echo "❌ Failed to fetch optima-core env vars"
echo ""

# 2. Check API Routes
echo "2️⃣ Checking API Routes..."
echo "-------------------------"
R3AL_URL=$(gcloud run services describe r3al-app --region=us-central1 --format="value(status.url)" 2>/dev/null)
OPTIMA_URL=$(gcloud run services describe optima-core --region=us-central1 --format="value(status.url)" 2>/dev/null)

if [ -n "$R3AL_URL" ]; then
  echo "r3al-app routes:"
  curl -s "$R3AL_URL/api/routes" | head -20 || echo "❌ Failed to fetch routes"
  echo ""
else
  echo "❌ Could not get r3al-app URL"
fi

if [ -n "$OPTIMA_URL" ]; then
  echo "optima-core routes:"
  curl -s "$OPTIMA_URL/api/routes" | head -20 || echo "❌ Failed to fetch routes"
  echo ""
else
  echo "❌ Could not get optima-core URL"
fi

# 3. Check Health Endpoints
echo "3️⃣ Checking Health Endpoints..."
echo "-------------------------------"
if [ -n "$R3AL_URL" ]; then
  echo "r3al-app health:"
  curl -s "$R3AL_URL/health" || echo "❌ Failed"
  echo ""
fi

if [ -n "$OPTIMA_URL" ]; then
  echo "optima-core health:"
  curl -s "$OPTIMA_URL/health" || echo "❌ Failed"
  echo ""
fi

# 4. Check Recent Logs
echo "4️⃣ Checking Recent Logs (Last 10 entries)..."
echo "-------------------------------------------"
echo "r3al-app logs:"
gcloud logging read "resource.labels.service_name=r3al-app" --limit=10 --format="table(timestamp,severity,textPayload)" 2>/dev/null || echo "❌ Failed to fetch logs"
echo ""

echo "optima-core logs:"
gcloud logging read "resource.labels.service_name=optima-core" --limit=10 --format="table(timestamp,severity,textPayload)" 2>/dev/null || echo "❌ Failed to fetch logs"
echo ""

# 5. Summary
echo "✅ Baseline Verification Complete"
echo "=================================="
echo ""
echo "Service URLs:"
echo "  R3AL App: $R3AL_URL"
echo "  Optima Core: $OPTIMA_URL"
echo ""
echo "Next steps:"
echo "  1. Review environment variables above"
echo "  2. Verify /api/routes output"
echo "  3. Check health endpoint responses"
echo "  4. Review logs for any errors"
echo "  5. Update frontend with correct API base URLs"
