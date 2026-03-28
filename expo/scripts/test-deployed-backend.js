#!/usr/bin/env node

const BACKEND_URL = 'https://optima-core-712497593637.us-central1.run.app';

console.log('='.repeat(70));
console.log('🧪 Testing R3AL Connection Backend on Google Cloud Run');
console.log('🌐 Backend URL:', BACKEND_URL);
console.log('='.repeat(70));

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function testEndpoint(name, url, options = {}) {
  const startTime = Date.now();
  try {
    console.log(`\n${colors.cyan}Testing:${colors.reset} ${name}`);
    console.log(`${colors.blue}URL:${colors.reset} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const duration = Date.now() - startTime;
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (response.ok) {
      console.log(`${colors.green}✅ PASS${colors.reset} (${response.status}) - ${duration}ms`);
      console.log('Response:', JSON.stringify(data, null, 2));
      return { success: true, status: response.status, data, duration };
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset} (${response.status}) - ${duration}ms`);
      console.log('Response:', JSON.stringify(data, null, 2));
      return { success: false, status: response.status, data, duration };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`${colors.red}❌ ERROR${colors.reset} - ${duration}ms`);
    console.log('Error:', error.message);
    return { success: false, error: error.message, duration };
  }
}

async function runTests() {
  const results = [];
  
  // Test 1: Root endpoint
  results.push(await testEndpoint(
    'Root Endpoint',
    `${BACKEND_URL}/`
  ));
  
  // Test 2: Health endpoint
  results.push(await testEndpoint(
    'Health Check',
    `${BACKEND_URL}/health`
  ));
  
  // Test 3: Routes listing
  results.push(await testEndpoint(
    'Routes Listing',
    `${BACKEND_URL}/api/routes`
  ));
  
  // Test 4: Gateway probe
  results.push(await testEndpoint(
    'AI Gateway Probe',
    `${BACKEND_URL}/probe/gateway`
  ));
  
  // Test 5: tRPC health query
  results.push(await testEndpoint(
    'tRPC Health Query',
    `${BACKEND_URL}/api/trpc/health?batch=1&input=%7B%220%22%3A%7B%7D%7D`
  ));
  
  // Test 6: tRPC example.hi query
  results.push(await testEndpoint(
    'tRPC Example Hi',
    `${BACKEND_URL}/api/trpc/example.hi?batch=1&input=%7B%220%22%3A%7B%7D%7D`
  ));
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Test Summary');
  console.log('='.repeat(70));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);
  const avgDuration = totalDuration / results.length;
  
  console.log(`${colors.green}✅ Passed:${colors.reset} ${passed}/${results.length}`);
  console.log(`${colors.red}❌ Failed:${colors.reset} ${failed}/${results.length}`);
  console.log(`⏱️  Total Duration: ${totalDuration}ms`);
  console.log(`⏱️  Average Duration: ${Math.round(avgDuration)}ms`);
  
  if (passed === results.length) {
    console.log(`\n${colors.green}🎉 All tests passed! Backend is fully operational.${colors.reset}`);
    console.log(`\n${colors.cyan}Next Steps:${colors.reset}`);
    console.log('1. Update your frontend .env with the backend URL');
    console.log('2. Test frontend-to-backend connectivity');
    console.log('3. Begin feature testing as outlined in COMPREHENSIVE_TESTING_GUIDE.md');
  } else {
    console.log(`\n${colors.yellow}⚠️  Some tests failed. Review the errors above.${colors.reset}`);
  }
  
  console.log('='.repeat(70));
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
