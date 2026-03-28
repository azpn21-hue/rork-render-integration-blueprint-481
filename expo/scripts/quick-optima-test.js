#!/usr/bin/env node
/**
 * Quick Optima-Core Connection Test (No dependencies)
 * Simple fetch-based test that works anywhere
 */

const OPTIMA_URL = process.env.EXPO_PUBLIC_OPTIMA_CORE_URL || "https://optima-core-backend.onrender.com";
const API_KEY = process.env.EXPO_PUBLIC_RORK_API_KEY || "rnd_w0obVzrvycssNp2SbIA3q2sbZZW0";

async function quickTest() {
  console.log("\n🚀 Quick Optima-Core Connection Test\n");
  console.log("Target URL:", OPTIMA_URL);
  console.log("=" .repeat(60) + "\n");

  let passed = 0;
  let failed = 0;

  async function testEndpoint(name, endpoint, method = "GET", body = null) {
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${OPTIMA_URL}${endpoint}`, options);
      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${name}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(data, null, 2).split('\n').map(l => '   ' + l).join('\n').trim());
        passed++;
      } else {
        console.log(`❌ ${name}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error:`, data);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    console.log("");
  }

  await testEndpoint("Health Check", "/health");
  await testEndpoint("Root Endpoint", "/");
  await testEndpoint("Log Pulse", "/pulse", "POST", {
    user: "test_user",
    mood: "focused",
    interaction: "quick_test",
  });

  console.log("=" .repeat(60));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log("🎉 All tests passed!\n");
    process.exit(0);
  } else {
    console.log("⚠️  Some tests failed. Check backend deployment.\n");
    process.exit(1);
  }
}

quickTest();
