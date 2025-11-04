#!/bin/bash

# ============================================================
# OPTIMA-CORE SYSTEM HEALTH CHECK
# Comprehensive diagnostic script for Rork team
# ============================================================

echo ""
echo "🔍 Optima-Core System Health Check"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

# Function to print test result
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✅ $2${NC}"
    ((PASSED++))
  else
    echo -e "${RED}❌ $2${NC}"
    ((FAILED++))
  fi
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
  ((WARNINGS++))
}

# ============================================================
# 1. Check Environment Variables
# ============================================================

echo "📋 Checking Environment Configuration..."
echo ""

if [ -f ".env" ]; then
  print_result 0 ".env file exists"
  
  if grep -q "EXPO_PUBLIC_OPTIMA_CORE_URL" .env; then
    OPTIMA_URL=$(grep EXPO_PUBLIC_OPTIMA_CORE_URL .env | cut -d '=' -f2)
    print_result 0 "OPTIMA_CORE_URL is set: $OPTIMA_URL"
  else
    print_result 1 "OPTIMA_CORE_URL not found in .env"
  fi
  
  if grep -q "EXPO_PUBLIC_OPTIMA_GCP_PROJECT_ID" .env; then
    print_result 0 "GCP_PROJECT_ID is set"
  else
    print_result 1 "GCP_PROJECT_ID not found in .env"
  fi
  
  if grep -q "EXPO_PUBLIC_RORK_API_KEY" .env; then
    print_result 0 "RORK_API_KEY is set"
  else
    print_result 1 "RORK_API_KEY not found in .env"
  fi
else
  print_result 1 ".env file not found"
fi

echo ""

# ============================================================
# 2. Check Required Files
# ============================================================

echo "📁 Checking Required Files..."
echo ""

files=(
  "lib/optima-core-client.ts"
  "lib/optima-bridge.ts"
  "app/config/optima-core.ts"
  "scripts/test-optima-connection.ts"
  "scripts/quick-optima-test.js"
  "optima-core-manifest.yaml"
  "Dockerfile.optima"
  "OPTIMA_INTEGRATION_GUIDE.md"
  "OPTIMA_DEPLOYMENT_PACKAGE.md"
  "OPTIMA_CONNECTION_TEST_GUIDE.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    print_result 0 "$file exists"
  else
    print_result 1 "$file not found"
  fi
done

echo ""

# ============================================================
# 3. Check GCP Service Account Key
# ============================================================

echo "🔐 Checking GCP Credentials..."
echo ""

if [ -d ".secrets" ]; then
  print_result 0 ".secrets directory exists"
  
  if [ -f ".secrets/service-account.json" ]; then
    print_result 0 "service-account.json exists"
    
    # Check if file is not empty
    if [ -s ".secrets/service-account.json" ]; then
      print_result 0 "service-account.json is not empty"
    else
      print_result 1 "service-account.json is empty"
    fi
  else
    print_result 1 "service-account.json not found"
    echo "   ℹ️  Download from: https://console.cloud.google.com"
  fi
else
  print_result 1 ".secrets directory not found"
  echo "   ℹ️  Create with: mkdir -p .secrets"
fi

echo ""

# ============================================================
# 4. Check Backend Connection
# ============================================================

echo "🌐 Checking Backend Connection..."
echo ""

# Get URL from .env or use default
if [ -f ".env" ]; then
  BACKEND_URL=$(grep EXPO_PUBLIC_OPTIMA_CORE_URL .env | cut -d '=' -f2 | tr -d ' ')
else
  BACKEND_URL="https://optima-core-backend.onrender.com"
fi

echo "   Testing: $BACKEND_URL"
echo ""

# Test health endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" --max-time 10)

if [ "$HTTP_CODE" -eq 200 ]; then
  print_result 0 "Backend health check passed (HTTP $HTTP_CODE)"
elif [ "$HTTP_CODE" -eq 000 ]; then
  print_result 1 "Backend not reachable (Connection failed)"
else
  print_result 1 "Backend health check failed (HTTP $HTTP_CODE)"
fi

# Test root endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/" --max-time 10)

if [ "$HTTP_CODE" -eq 200 ]; then
  print_result 0 "Backend root endpoint passed (HTTP $HTTP_CODE)"
else
  print_warning "Backend root endpoint returned HTTP $HTTP_CODE"
fi

echo ""

# ============================================================
# 5. Check Dependencies
# ============================================================

echo "📦 Checking Dependencies..."
echo ""

if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  print_result 0 "Node.js installed ($NODE_VERSION)"
else
  print_result 1 "Node.js not installed"
fi

if command -v bun &> /dev/null; then
  BUN_VERSION=$(bun --version)
  print_result 0 "Bun installed ($BUN_VERSION)"
else
  print_warning "Bun not installed (optional)"
fi

if command -v docker &> /dev/null; then
  DOCKER_VERSION=$(docker --version | cut -d ' ' -f3 | tr -d ',')
  print_result 0 "Docker installed ($DOCKER_VERSION)"
else
  print_warning "Docker not installed (optional)"
fi

echo ""

# ============================================================
# 6. Check package.json
# ============================================================

echo "📄 Checking Package Configuration..."
echo ""

if [ -f "package.json" ]; then
  print_result 0 "package.json exists"
  
  if grep -q "@tanstack/react-query" package.json; then
    print_result 0 "React Query installed"
  else
    print_warning "React Query not found in package.json"
  fi
  
  if grep -q "axios" package.json; then
    print_result 0 "Axios installed"
  else
    print_warning "Axios not found in package.json"
  fi
else
  print_result 1 "package.json not found"
fi

echo ""

# ============================================================
# 7. Run Quick Tests
# ============================================================

echo "🧪 Running Quick Connection Tests..."
echo ""

if [ -f "scripts/quick-optima-test.js" ]; then
  echo "   Running: node scripts/quick-optima-test.js"
  echo "   ─────────────────────────────────────────"
  
  if node scripts/quick-optima-test.js > /tmp/optima-test.log 2>&1; then
    print_result 0 "Quick test suite passed"
    echo ""
    echo "   Test output:"
    cat /tmp/optima-test.log | grep -E "✅|❌|📊" | sed 's/^/   /'
  else
    print_result 1 "Quick test suite failed"
    echo ""
    echo "   Error details:"
    tail -5 /tmp/optima-test.log | sed 's/^/   /'
  fi
  
  rm -f /tmp/optima-test.log
else
  print_warning "Quick test script not found"
fi

echo ""

# ============================================================
# 8. Summary
# ============================================================

echo "======================================"
echo "📊 System Health Summary"
echo "======================================"
echo ""
echo -e "✅ Passed:   ${GREEN}$PASSED${NC}"
echo -e "❌ Failed:   ${RED}$FAILED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
  SUCCESS_RATE=$(echo "scale=1; $PASSED * 100 / $TOTAL" | bc)
  echo "📈 Success Rate: ${SUCCESS_RATE}%"
else
  echo "📈 Success Rate: 0%"
fi

echo ""

# ============================================================
# 9. Recommendations
# ============================================================

if [ $FAILED -gt 0 ] || [ $WARNINGS -gt 0 ]; then
  echo "💡 Recommendations:"
  echo ""
  
  if [ ! -f ".env" ]; then
    echo "   • Create .env file with Optima-Core configuration"
  fi
  
  if [ ! -f ".secrets/service-account.json" ]; then
    echo "   • Download GCP service account key"
    echo "   • Save to .secrets/service-account.json"
  fi
  
  if [ $HTTP_CODE -ne 200 ]; then
    echo "   • Check backend deployment status"
    echo "   • Verify EXPO_PUBLIC_OPTIMA_CORE_URL in .env"
    echo "   • Start local backend: uvicorn app:app --port 8080"
  fi
  
  echo ""
fi

# ============================================================
# 10. Next Steps
# ============================================================

echo "📚 Documentation:"
echo "   • Integration Guide: ./OPTIMA_INTEGRATION_GUIDE.md"
echo "   • Deployment Package: ./OPTIMA_DEPLOYMENT_PACKAGE.md"
echo "   • Connection Tests: ./OPTIMA_CONNECTION_TEST_GUIDE.md"
echo "   • Setup Complete: ./OPTIMA_SETUP_COMPLETE.md"
echo ""

echo "🧪 Manual Testing:"
echo "   • Quick test:  node scripts/quick-optima-test.js"
echo "   • Full test:   bun run scripts/test-optima-connection.ts"
echo "   • In-app test: Navigate to /optima-test in the app"
echo ""

# ============================================================
# 11. Exit Code
# ============================================================

if [ $FAILED -eq 0 ]; then
  echo "🎉 System is healthy and ready!"
  echo ""
  exit 0
else
  echo "⚠️  System has issues that need attention"
  echo ""
  exit 1
fi
