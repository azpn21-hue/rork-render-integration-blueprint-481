#!/usr/bin/env node

/**
 * Comprehensive R3AL Backend Test Suite
 * Tests all aspects of the backend deployment
 */

const BACKEND_URL = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "https://r3al-app-271493276620.us-central1.run.app";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function header(text) {
  console.log("");
  log("═".repeat(70), colors.cyan);
  log(`  ${text}`, colors.bright);
  log("═".repeat(70), colors.cyan);
  console.log("");
}

function subheader(text) {
  console.log("");
  log(`─ ${text}`, colors.blue);
  console.log("");
}

async function testEndpoint(name, url, method = "GET", body = null) {
  totalTests++;
  subheader(`Test ${totalTests}: ${name}`);
  
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    log(`URL: ${url}`, colors.cyan);
    const response = await fetch(url, options);
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    
    if (response.ok) {
      passedTests++;
      log(`✅ PASSED - Status: ${response.status}`, colors.green);
      console.log("Response:", typeof data === 'object' ? JSON.stringify(data, null, 2).substring(0, 500) : data.substring(0, 500));
      if (JSON.stringify(data).length > 500) {
        log("... (truncated)", colors.yellow);
      }
    } else {
      failedTests++;
      log(`❌ FAILED - Status: ${response.status}`, colors.red);
      console.log("Error:", typeof data === 'object' ? JSON.stringify(data, null, 2).substring(0, 500) : data.substring(0, 500));
    }
  } catch (error) {
    failedTests++;
    log(`❌ FAILED - Network Error`, colors.red);
    console.log("Error:", error.message);
  }
}

async function main() {
  header("R3AL Comprehensive Backend Test Suite");
  log(`Backend URL: ${BACKEND_URL}`, colors.bright);
  log(`Timestamp: ${new Date().toISOString()}`, colors.bright);
  
  // ============================================================================
  // SECTION 1: Basic Health Checks
  // ============================================================================
  header("SECTION 1: Basic Health Checks");
  
  await testEndpoint("Root Endpoint", `${BACKEND_URL}/`);
  await testEndpoint("Health Check", `${BACKEND_URL}/health`);
  await testEndpoint("Routes List", `${BACKEND_URL}/api/routes`);
  
  // ============================================================================
  // SECTION 2: tRPC Core Routes
  // ============================================================================
  header("SECTION 2: tRPC Core Routes");
  
  await testEndpoint("tRPC Health", `${BACKEND_URL}/api/trpc/health?input=%7B%22json%22%3Anull%7D`);
  await testEndpoint("Example Hi Route", `${BACKEND_URL}/api/trpc/example.hi?input=%7B%22json%22%3Anull%7D`);
  
  // ============================================================================
  // SECTION 3: R3AL Verification System
  // ============================================================================
  header("SECTION 3: R3AL Verification System");
  
  await testEndpoint(
    "Get Verification Status",
    `${BACKEND_URL}/api/trpc/r3al.verification.getStatus?input=%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%2C%22v%22%3A1%7D%7D`
  );
  
  // ============================================================================
  // SECTION 4: R3AL Profile System
  // ============================================================================
  header("SECTION 4: R3AL Profile System");
  
  await testEndpoint(
    "Get Profile",
    `${BACKEND_URL}/api/trpc/r3al.profile.getProfile?input=%7B%22json%22%3A%7B%22userId%22%3A%22test-user-123%22%7D%7D`
  );
  
  // ============================================================================
  // SECTION 5: R3AL Token System
  // ============================================================================
  header("SECTION 5: R3AL Token System");
  
  await testEndpoint(
    "Get Token Balance",
    `${BACKEND_URL}/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D`
  );
  
  await testEndpoint(
    "Get Token Transactions",
    `${BACKEND_URL}/api/trpc/r3al.tokens.getTransactions?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D`
  );
  
  // ============================================================================
  // SECTION 6: R3AL Feed System
  // ============================================================================
  header("SECTION 6: R3AL Feed System");
  
  await testEndpoint(
    "Get Trending Feed",
    `${BACKEND_URL}/api/trpc/r3al.feed.getTrending?input=%7B%22json%22%3A%7B%22limit%22%3A25%2C%22offset%22%3A0%7D%7D`
  );
  
  await testEndpoint(
    "Get Local Feed",
    `${BACKEND_URL}/api/trpc/r3al.feed.getLocal?input=%7B%22json%22%3A%7B%22lat%22%3A30.2672%2C%22lon%22%3A-97.7431%2C%22radius%22%3A25%2C%22limit%22%3A25%7D%7D`
  );
  
  // ============================================================================
  // SECTION 7: R3AL QOTD System
  // ============================================================================
  header("SECTION 7: R3AL QOTD System");
  
  await testEndpoint(
    "Get Daily Question",
    `${BACKEND_URL}/api/trpc/r3al.qotd.getDaily?input=%7B%22json%22%3Anull%7D`
  );
  
  await testEndpoint(
    "Get QOTD Stats",
    `${BACKEND_URL}/api/trpc/r3al.qotd.getStats?input=%7B%22json%22%3Anull%7D`
  );
  
  // ============================================================================
  // SECTION 8: R3AL Market System
  // ============================================================================
  header("SECTION 8: R3AL Market System");
  
  await testEndpoint(
    "Get Market Summary",
    `${BACKEND_URL}/api/trpc/r3al.market.getSummary?input=%7B%22json%22%3Anull%7D`
  );
  
  await testEndpoint(
    "Get Trending Symbols",
    `${BACKEND_URL}/api/trpc/r3al.market.getTrendingSymbols?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D`
  );
  
  await testEndpoint(
    "Get Market News",
    `${BACKEND_URL}/api/trpc/r3al.market.getNews?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D`
  );
  
  // ============================================================================
  // SECTION 9: R3AL AI Insights
  // ============================================================================
  header("SECTION 9: R3AL AI Insights");
  
  await testEndpoint(
    "Get AI Insights",
    `${BACKEND_URL}/api/trpc/r3al.ai.getInsights?input=%7B%22json%22%3A%7B%22timeframe%22%3A%22day%22%7D%7D`
  );
  
  await testEndpoint(
    "Get Personalized Summary",
    `${BACKEND_URL}/api/trpc/r3al.ai.getPersonalizedSummary?input=%7B%22json%22%3Anull%7D`
  );
  
  // ============================================================================
  // SECTION 10: R3AL Match System
  // ============================================================================
  header("SECTION 10: R3AL Match System");
  
  await testEndpoint(
    "Get Match Suggestions",
    `${BACKEND_URL}/api/trpc/r3al.match.suggest?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D`
  );
  
  await testEndpoint(
    "Get Match Insights",
    `${BACKEND_URL}/api/trpc/r3al.match.insights?input=%7B%22json%22%3Anull%7D`
  );
  
  // ============================================================================
  // SECTION 11: R3AL Social System
  // ============================================================================
  header("SECTION 11: R3AL Social System");
  
  await testEndpoint(
    "Get Suggested Users",
    `${BACKEND_URL}/api/trpc/r3al.social.getSuggestedUsers?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D`
  );
  
  // ============================================================================
  // SECTION 12: R3AL Optima System
  // ============================================================================
  header("SECTION 12: R3AL Optima System");
  
  await testEndpoint(
    "Optima Health Check",
    `${BACKEND_URL}/api/trpc/r3al.optima.health?input=%7B%22json%22%3Anull%7D`
  );
  
  // ============================================================================
  // SECTION 13: R3AL Location System
  // ============================================================================
  header("SECTION 13: R3AL Location System");
  
  await testEndpoint(
    "Get Local News",
    `${BACKEND_URL}/api/trpc/r3al.location.getLocalNews?input=%7B%22json%22%3A%7B%22lat%22%3A30.2672%2C%22lon%22%3A-97.7431%2C%22limit%22%3A10%7D%7D`
  );
  
  await testEndpoint(
    "Get Local Events",
    `${BACKEND_URL}/api/trpc/r3al.location.getLocalEvents?input=%7B%22json%22%3A%7B%22lat%22%3A30.2672%2C%22lon%22%3A-97.7431%2C%22limit%22%3A10%7D%7D`
  );
  
  // ============================================================================
  // SECTION 14: R3AL ML System
  // ============================================================================
  header("SECTION 14: R3AL ML System");
  
  await testEndpoint(
    "Get ML Recommendations",
    `${BACKEND_URL}/api/trpc/r3al.ml.getRecommendations?input=%7B%22json%22%3A%7B%22userId%22%3A%22test-user%22%2C%22limit%22%3A10%7D%7D`
  );
  
  // ============================================================================
  // Test Summary
  // ============================================================================
  header("Test Summary");
  
  log(`Total Tests:  ${totalTests}`, colors.bright);
  log(`Passed:       ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`, colors.green);
  log(`Failed:       ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`, colors.red);
  console.log("");
  
  if (failedTests === 0) {
    log("🎉 All tests passed!", colors.green);
    process.exit(0);
  } else {
    log(`⚠️  ${failedTests} test(s) failed. Please review the output above.`, colors.yellow);
    process.exit(1);
  }
}

main().catch((error) => {
  log(`Fatal error: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
