#!/usr/bin/env node

/**
 * Backend Verification Script
 * Tests that all backend endpoints are working correctly
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'http://localhost:10000';
const isHttps = BASE_URL.startsWith('https');
const client = isHttps ? https : http;

console.log('🔍 Verifying R3AL Connection Backend...');
console.log(`📍 Base URL: ${BASE_URL}\n`);

const tests = [
  {
    name: 'Root Health Check',
    path: '/',
    method: 'GET',
    expectedStatus: 200,
    expectedBody: { status: 'ok' }
  },
  {
    name: 'Health Endpoint',
    path: '/health',
    method: 'GET',
    expectedStatus: 200,
    expectedBody: { status: 'healthy' }
  },
];

let passed = 0;
let failed = 0;

function testEndpoint(test) {
  return new Promise((resolve) => {
    const url = new URL(test.path, BASE_URL);
    
    console.log(`Testing: ${test.name}`);
    console.log(`  ${test.method} ${url.href}`);
    
    const req = client.request(url, { method: test.method }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const body = JSON.parse(data);
          const statusMatch = res.statusCode === test.expectedStatus;
          const bodyMatch = Object.entries(test.expectedBody).every(
            ([key, value]) => body[key] === value
          );
          
          if (statusMatch && bodyMatch) {
            console.log(`  ✅ PASSED`);
            console.log(`     Status: ${res.statusCode}`);
            console.log(`     Body: ${JSON.stringify(body)}\n`);
            passed++;
          } else {
            console.log(`  ❌ FAILED`);
            console.log(`     Expected status: ${test.expectedStatus}, got: ${res.statusCode}`);
            console.log(`     Expected body to include: ${JSON.stringify(test.expectedBody)}`);
            console.log(`     Got: ${JSON.stringify(body)}\n`);
            failed++;
          }
        } catch (error) {
          console.log(`  ❌ FAILED - Invalid JSON response`);
          console.log(`     ${error.message}\n`);
          failed++;
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`  ❌ FAILED - Connection error`);
      console.log(`     ${error.message}\n`);
      failed++;
      resolve();
    });
    
    req.end();
  });
}

async function runTests() {
  for (const test of tests) {
    await testEndpoint(test);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (failed === 0) {
    console.log('✅ All backend tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Check your backend configuration.');
    process.exit(1);
  }
}

runTests();
