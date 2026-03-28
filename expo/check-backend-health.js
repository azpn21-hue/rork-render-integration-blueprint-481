#!/usr/bin/env node

const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:10000';

console.log('🔍 Checking Backend Health...');
console.log(`📡 Backend URL: ${BACKEND_URL}`);
console.log('');

async function checkEndpoint(path, description) {
  return new Promise((resolve) => {
    const url = `${BACKEND_URL}${path}`;
    console.log(`Testing: ${description}`);
    console.log(`  URL: ${url}`);
    
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`  ✅ Status: ${res.statusCode}`);
          try {
            const json = JSON.parse(data);
            console.log(`  📦 Response:`, json);
          } catch (e) {
            console.log(`  📦 Response:`, data.substring(0, 100));
          }
          resolve(true);
        } else {
          console.log(`  ❌ Status: ${res.statusCode}`);
          console.log(`  Response:`, data.substring(0, 200));
          resolve(false);
        }
        console.log('');
      });
    });

    req.on('error', (err) => {
      console.log(`  ❌ Error: ${err.message}`);
      console.log('');
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log(`  ❌ Timeout after 5 seconds`);
      console.log('');
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const results = [];

  results.push(await checkEndpoint('/', 'Root Endpoint'));
  results.push(await checkEndpoint('/health', 'Health Check'));
  results.push(await checkEndpoint('/api/routes', 'Available Routes'));

  console.log('='.repeat(60));
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  if (passed === total) {
    console.log(`✅ All checks passed (${passed}/${total})`);
    console.log('Backend is healthy and ready!');
    process.exit(0);
  } else {
    console.log(`❌ Some checks failed (${passed}/${total})`);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('  1. Make sure backend is running: npm run backend');
    console.log('  2. Check if port 10000 is available: lsof -i :10000');
    console.log('  3. Check backend logs for errors');
    console.log('  4. Try restarting: ./start-backend-simple.sh');
    process.exit(1);
  }
}

main();
