#!/usr/bin/env node

/**
 * Comprehensive Backend Endpoint Checker
 * Tests all Hono routes and tRPC procedures
 */

const BASE_URL = process.env.BACKEND_URL || 'https://optima-core-271493276620.us-central1.run.app';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

async function testEndpoint(name, fn) {
  try {
    const result = await fn();
    if (result.success) {
      results.passed++;
      log(colors.green, `✓ ${name}`);
      results.tests.push({ name, status: 'passed', ...result });
    } else {
      results.failed++;
      log(colors.red, `✗ ${name}: ${result.error}`);
      results.tests.push({ name, status: 'failed', error: result.error });
    }
  } catch (error) {
    results.failed++;
    log(colors.red, `✗ ${name}: ${error.message}`);
    results.tests.push({ name, status: 'failed', error: error.message });
  }
}

// ========================================
// HONO ROUTE TESTS
// ========================================

async function testRootEndpoint() {
  const response = await fetch(`${BASE_URL}/`);
  const data = await response.json();
  return {
    success: response.ok && data.status === 'ok',
    error: !response.ok ? `Status ${response.status}` : null,
    data
  };
}

async function testHealthEndpoint() {
  const response = await fetch(`${BASE_URL}/health`);
  const data = await response.json();
  return {
    success: response.ok && data.status === 'healthy',
    error: !response.ok ? `Status ${response.status}` : null,
    data
  };
}

async function testRoutesEndpoint() {
  const response = await fetch(`${BASE_URL}/api/routes`);
  const data = await response.json();
  return {
    success: response.ok && data.status === 'ok',
    error: !response.ok ? `Status ${response.status}` : null,
    routeCount: data.count,
    r3alCount: data.r3alCount
  };
}

async function testProbeGateway() {
  const response = await fetch(`${BASE_URL}/probe/gateway`);
  const data = await response.json();
  return {
    success: response.ok,
    error: !response.ok ? `Status ${response.status}` : null,
    data
  };
}

// ========================================
// TRPC ENDPOINT TESTS
// ========================================

async function testTRPCEndpoint(procedure, input = {}) {
  const url = `${BASE_URL}/api/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify(input))}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-trpc-source': 'endpoint-checker'
    }
  });
  
  const data = await response.json();
  return {
    success: response.ok,
    error: !response.ok ? data.error?.message || `Status ${response.status}` : null,
    data
  };
}

async function testTRPCMutation(procedure, input = {}) {
  const url = `${BASE_URL}/api/trpc/${procedure}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-trpc-source': 'endpoint-checker'
    },
    body: JSON.stringify(input)
  });
  
  const data = await response.json();
  return {
    success: response.ok,
    error: !response.ok ? data.error?.message || `Status ${response.status}` : null,
    data
  };
}

// ========================================
// FOUNDING MEMBER ROUTES
// ========================================

async function testFoundingMemberEndpoint() {
  const response = await fetch(`${BASE_URL}/api/founding-member`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test submission'
    })
  });
  
  const data = await response.json();
  return {
    success: response.ok && data.success === true,
    error: !response.ok ? data.message || `Status ${response.status}` : null,
    data
  };
}

async function testInvestorEndpoint() {
  const response = await fetch(`${BASE_URL}/api/investor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Investor',
      email: 'investor@example.com',
      message: 'Test investor submission'
    })
  });
  
  const data = await response.json();
  return {
    success: response.ok && data.success === true,
    error: !response.ok ? data.message || `Status ${response.status}` : null,
    data
  };
}

async function testContactEndpoint() {
  const response = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Contact',
      email: 'contact@example.com',
      message: 'Test contact submission'
    })
  });
  
  const data = await response.json();
  return {
    success: response.ok && data.success === true,
    error: !response.ok ? data.message || `Status ${response.status}` : null,
    data
  };
}

// ========================================
// MAIN TEST RUNNER
// ========================================

async function runAllTests() {
  log(colors.cyan, '\n========================================');
  log(colors.cyan, '🔍 COMPREHENSIVE BACKEND ENDPOINT CHECK');
  log(colors.cyan, '========================================\n');
  log(colors.blue, `Testing backend at: ${BASE_URL}\n`);

  // Core Hono Routes
  log(colors.yellow, '📍 Testing Core Hono Routes...');
  await testEndpoint('GET /', testRootEndpoint);
  await testEndpoint('GET /health', testHealthEndpoint);
  await testEndpoint('GET /api/routes', testRoutesEndpoint);
  await testEndpoint('GET /probe/gateway', testProbeGateway);

  // Marketing/Lead Routes
  log(colors.yellow, '\n📍 Testing Marketing Lead Routes...');
  await testEndpoint('POST /api/founding-member', testFoundingMemberEndpoint);
  await testEndpoint('POST /api/investor', testInvestorEndpoint);
  await testEndpoint('POST /api/contact', testContactEndpoint);

  // Example tRPC Routes
  log(colors.yellow, '\n📍 Testing Example tRPC Routes...');
  await testEndpoint('tRPC example.hi', () => testTRPCEndpoint('example.hi'));

  // Auth tRPC Routes
  log(colors.yellow, '\n📍 Testing Auth tRPC Routes...');
  await testEndpoint('tRPC health', () => testTRPCEndpoint('health'));

  // R3AL tRPC Routes - Profile
  log(colors.yellow, '\n📍 Testing R3AL Profile Routes...');
  await testEndpoint('tRPC r3al.profile.getProfile', () => 
    testTRPCEndpoint('r3al.profile.getProfile', { userId: 'test-user-1' }));

  // R3AL tRPC Routes - Tokens
  log(colors.yellow, '\n📍 Testing R3AL Token Routes...');
  await testEndpoint('tRPC r3al.tokens.getBalance', () =>
    testTRPCEndpoint('r3al.tokens.getBalance', { userId: 'test-user-1' }));

  // R3AL tRPC Routes - Feed
  log(colors.yellow, '\n📍 Testing R3AL Feed Routes...');
  await testEndpoint('tRPC r3al.feed.getTrending', () =>
    testTRPCEndpoint('r3al.feed.getTrending', {}));

  // R3AL tRPC Routes - QOTD
  log(colors.yellow, '\n📍 Testing R3AL QOTD Routes...');
  await testEndpoint('tRPC r3al.qotd.getDaily', () =>
    testTRPCEndpoint('r3al.qotd.getDaily', {}));

  // R3AL tRPC Routes - Verification
  log(colors.yellow, '\n📍 Testing R3AL Verification Routes...');
  await testEndpoint('tRPC r3al.verification.getStatus', () =>
    testTRPCEndpoint('r3al.verification.getStatus', { userId: 'test-user-1' }));

  // R3AL tRPC Routes - Match
  log(colors.yellow, '\n📍 Testing R3AL Match Routes...');
  await testEndpoint('tRPC r3al.match.suggest', () =>
    testTRPCEndpoint('r3al.match.suggest', { userId: 'test-user-1' }));

  // R3AL tRPC Routes - Pulse
  log(colors.yellow, '\n📍 Testing R3AL Pulse Routes...');
  await testEndpoint('tRPC r3al.pulse.getState', () =>
    testTRPCEndpoint('r3al.pulse.getState', { userId: 'test-user-1' }));

  // R3AL tRPC Routes - History
  log(colors.yellow, '\n📍 Testing R3AL History Routes...');
  await testEndpoint('tRPC r3al.history.getHistory', () =>
    testTRPCEndpoint('r3al.history.getHistory', { userId: 'test-user-1' }));

  // R3AL tRPC Routes - Hive
  log(colors.yellow, '\n📍 Testing R3AL Hive Routes...');
  await testEndpoint('tRPC r3al.hive.getConnections', () =>
    testTRPCEndpoint('r3al.hive.getConnections', { userId: 'test-user-1' }));

  // R3AL tRPC Routes - DM
  log(colors.yellow, '\n📍 Testing R3AL DM Routes...');
  await testEndpoint('tRPC r3al.dm.getConversations', () =>
    testTRPCEndpoint('r3al.dm.getConversations', { userId: 'test-user-1' }));

  // R3AL tRPC Routes - Market
  log(colors.yellow, '\n📍 Testing R3AL Market Routes...');
  await testEndpoint('tRPC r3al.market.getSummary', () =>
    testTRPCEndpoint('r3al.market.getSummary', {}));

  // R3AL tRPC Routes - AI
  log(colors.yellow, '\n📍 Testing R3AL AI Routes...');
  await testEndpoint('tRPC r3al.ai.getInsights', () =>
    testTRPCEndpoint('r3al.ai.getInsights', { userId: 'test-user-1' }));

  // R3AL tRPC Routes - Location
  log(colors.yellow, '\n📍 Testing R3AL Location Routes...');
  await testEndpoint('tRPC r3al.location.getLocalNews', () =>
    testTRPCEndpoint('r3al.location.getLocalNews', { lat: 40.7128, lng: -74.0060 }));

  // R3AL tRPC Routes - Optima
  log(colors.yellow, '\n📍 Testing R3AL Optima Routes...');
  await testEndpoint('tRPC r3al.optima.health', () =>
    testTRPCEndpoint('r3al.optima.health', {}));

  // Print Results
  log(colors.cyan, '\n========================================');
  log(colors.cyan, '📊 TEST RESULTS SUMMARY');
  log(colors.cyan, '========================================\n');
  
  log(colors.green, `✓ Passed: ${results.passed}`);
  log(colors.red, `✗ Failed: ${results.failed}`);
  log(colors.yellow, `⊘ Skipped: ${results.skipped}`);
  
  const total = results.passed + results.failed + results.skipped;
  const passRate = ((results.passed / total) * 100).toFixed(2);
  
  log(colors.cyan, `\n📈 Pass Rate: ${passRate}%`);
  log(colors.cyan, `📝 Total Tests: ${total}`);

  // Print failed tests details
  if (results.failed > 0) {
    log(colors.red, '\n❌ FAILED TESTS:\n');
    results.tests
      .filter(t => t.status === 'failed')
      .forEach(test => {
        log(colors.red, `  • ${test.name}`);
        log(colors.red, `    Error: ${test.error}`);
      });
  }

  log(colors.cyan, '\n========================================\n');

  // Exit with error code if any tests failed
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log(colors.red, '\n❌ Fatal error running tests:', error.message);
  process.exit(1);
});
