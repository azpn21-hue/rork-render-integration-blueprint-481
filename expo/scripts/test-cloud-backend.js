#!/usr/bin/env node

/**
 * Test Cloud Backend Connection
 * 
 * This script tests the deployed Google Cloud Run backend
 * to verify all endpoints are working correctly.
 */

const BACKEND_URL = 'https://optima-core-712497593637.us-central1.run.app';

console.log('🧪 Testing R3AL Backend Deployment\n');
console.log(`Backend URL: ${BACKEND_URL}\n`);
console.log('='.repeat(60));

async function testEndpoint(path, description) {
  const url = `${BACKEND_URL}${path}`;
  console.log(`\n📡 Testing: ${description}`);
  console.log(`   URL: ${url}`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const duration = Date.now() - startTime;
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ Status: ${response.status} OK (${duration}ms)`);
      console.log(`   Response:`, JSON.stringify(data, null, 2).split('\n').map(l => `     ${l}`).join('\n').trim());
      return { success: true, data, duration };
    } else {
      console.log(`   ❌ Status: ${response.status} ${response.statusText}`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
      return { success: false, error: data, status: response.status };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('\n🚀 Starting Backend Tests...\n');
  
  const tests = [
    { path: '/', description: 'Root endpoint' },
    { path: '/health', description: 'Health check endpoint' },
    { path: '/api/health', description: 'API health endpoint' },
    { path: '/api/routes', description: 'Available routes listing' },
    { path: '/api/test', description: 'API test endpoint' },
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description);
    results.push({ ...test, ...result });
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary\n');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is fully operational.');
    console.log('\n📝 Next Steps:');
    console.log('   1. Update your frontend .env with the backend URL');
    console.log('   2. Test tRPC routes from the frontend');
    console.log('   3. Run the comprehensive testing guide tests');
    console.log(`   4. Configure Firebase for push notifications`);
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    console.log('\n🔍 Debugging Tips:');
    console.log('   1. Check Cloud Run logs in Google Cloud Console');
    console.log('   2. Verify environment variables are set correctly');
    console.log('   3. Ensure the service is not in a crash loop');
    console.log('   4. Check that PORT=8080 is configured');
  }
  
  console.log('\n' + '='.repeat(60));
  
  return failed === 0;
}

runTests()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('\n💥 Unhandled error:', error);
    process.exit(1);
  });
