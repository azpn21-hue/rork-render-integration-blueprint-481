#!/bin/bash

# R3AL Backend API Test Commands
# Base URL: https://optima-core-712497593637.us-central1.run.app

BASE_URL="https://optima-core-712497593637.us-central1.run.app"

echo "=================================="
echo "R3AL Backend API Test Suite"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

test_endpoint() {
  TESTS_RUN=$((TESTS_RUN + 1))
  echo -e "${YELLOW}Testing:${NC} $1"
  
  response=$(eval $2)
  status=$?
  
  if [ $status -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo "Response: $response"
  else
    echo -e "${RED}✗ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo "Error: $response"
  fi
  echo ""
}

echo "1. MUSIC STUDIO ENDPOINTS"
echo "-------------------------"

test_endpoint "Create Music Project" \
  "curl -s -X POST $BASE_URL/api/music/project/create \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"title\":\"Summer Vibes\",\"genre\":\"electronic\",\"bpm\":120,\"mood\":\"energetic\"}'"

test_endpoint "Get User Music Projects" \
  "curl -s -X GET $BASE_URL/api/music/projects/test_user"

test_endpoint "Generate Music" \
  "curl -s -X POST $BASE_URL/api/music/generate \
    -H 'Content-Type: application/json' \
    -d '{\"projectId\":\"test_project_1\",\"userId\":\"test_user\",\"prompt\":\"upbeat electronic dance music\",\"duration\":30,\"style\":\"electronic\"}'"

test_endpoint "Share Music Project" \
  "curl -s -X POST $BASE_URL/api/music/share/test_project_1 \
    -H 'Content-Type: application/json' \
    -d '{\"platform\":\"soundcloud\"}'"

echo ""
echo "2. WRITERS GUILD ENDPOINTS"
echo "-------------------------"

test_endpoint "Create Writing Project" \
  "curl -s -X POST $BASE_URL/api/writers/project/create \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"title\":\"My Novel\",\"genre\":\"sci-fi\",\"contentType\":\"novel\",\"description\":\"A story about AI\",\"matureContent\":false}'"

test_endpoint "Get Guild Member Info" \
  "curl -s -X GET $BASE_URL/api/writers/member/test_user"

test_endpoint "Start Writing Session" \
  "curl -s -X POST $BASE_URL/api/writers/session/start \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"projectId\":\"test_project_1\"}'"

test_endpoint "Get AI Writing Assistance" \
  "curl -s -X POST $BASE_URL/api/writers/assist \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"projectId\":\"test_project_1\",\"prompt\":\"Help me write a sci-fi opening scene\",\"context\":\"Space station orbiting Mars\"}'"

echo ""
echo "3. TACTICAL HQ ENDPOINTS"
echo "-------------------------"

test_endpoint "Register Tactical User" \
  "curl -s -X POST $BASE_URL/api/tactical/register \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"rank\":\"Captain\",\"department\":\"Cyber Defense\",\"serviceBranch\":\"Space Force\",\"clearanceLevel\":\"secret\"}'"

test_endpoint "Get Tactical Dashboard" \
  "curl -s -X GET $BASE_URL/api/tactical/dashboard/test_user"

test_endpoint "Send Communication" \
  "curl -s -X POST $BASE_URL/api/tactical/comm/send \
    -H 'Content-Type: application/json' \
    -d '{\"fromUserId\":\"test_user\",\"toUserId\":\"test_user_2\",\"content\":\"Status report needed\",\"messageType\":\"standard\"}'"

test_endpoint "Get Optima SR Analysis" \
  "curl -s -X GET $BASE_URL/api/tactical/analysis/sr?userId=test_user&analysisType=situational"

test_endpoint "Get Communications" \
  "curl -s -X GET $BASE_URL/api/tactical/comms/test_user"

echo ""
echo "4. PREMIUM IMAGE GENERATION ENDPOINTS"
echo "-------------------------"

test_endpoint "Generate AI Image" \
  "curl -s -X POST $BASE_URL/api/premium/image/generate \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"prompt\":\"a futuristic cyberpunk city at sunset with neon lights\",\"size\":\"1024x1024\"}'"

test_endpoint "Get Image Generation History" \
  "curl -s -X GET $BASE_URL/api/premium/image/history/test_user"

test_endpoint "Get Usage Summary" \
  "curl -s -X GET $BASE_URL/api/premium/usage/test_user"

echo ""
echo "5. SUBSCRIPTION ENDPOINTS"
echo "-------------------------"

test_endpoint "Get User Tier" \
  "curl -s -X GET $BASE_URL/api/subscription/tier/test_user"

test_endpoint "Check Feature Access" \
  "curl -s -X POST $BASE_URL/api/subscription/check-access \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"feature\":\"music_generation\"}'"

test_endpoint "Track Usage" \
  "curl -s -X POST $BASE_URL/api/subscription/track-usage \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"feature\":\"ai_chat\",\"amount\":1}'"

test_endpoint "Upgrade Tier" \
  "curl -s -X POST $BASE_URL/api/subscription/upgrade \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"newTier\":\"premium\",\"paymentMethod\":\"stripe_token_abc123\"}'"

echo ""
echo "6. AI CHAT ENDPOINTS"
echo "-------------------------"

test_endpoint "Send AI Chat Message" \
  "curl -s -X POST $BASE_URL/api/ai/chat/send \
    -H 'Content-Type: application/json' \
    -d '{\"userId\":\"test_user\",\"sessionId\":\"session_1\",\"message\":\"What is R3AL?\",\"context\":{}}'"

test_endpoint "Get Chat History" \
  "curl -s -X GET $BASE_URL/api/ai/chat/history/session_1"

echo ""
echo "7. STORAGE ENDPOINTS"
echo "-------------------------"

# Create a test file
echo "test audio content" > /tmp/test_audio.mp3
echo "test image content" > /tmp/test_image.png

test_endpoint "Upload Audio File" \
  "curl -s -X POST $BASE_URL/api/storage/upload \
    -F 'file=@/tmp/test_audio.mp3' \
    -F 'bucket=music' \
    -F 'path=users/test_user/projects/p1/test.mp3'"

test_endpoint "Upload Image File" \
  "curl -s -X POST $BASE_URL/api/storage/upload \
    -F 'file=@/tmp/test_image.png' \
    -F 'bucket=images' \
    -F 'path=users/test_user/generations/g1/original.png'"

test_endpoint "Delete File" \
  "curl -s -X DELETE $BASE_URL/api/storage/delete \
    -H 'Content-Type: application/json' \
    -d '{\"url\":\"$BASE_URL/cdn/r3al-studio-music/users/test_user/projects/p1/test.mp3\"}'"

# Clean up
rm /tmp/test_audio.mp3 /tmp/test_image.png

echo ""
echo "=================================="
echo "TEST RESULTS"
echo "=================================="
echo -e "Total Tests: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed. Please check the backend implementation.${NC}"
  exit 1
fi
