#!/usr/bin/env node
/**
 * Quick Optima-Core Connection Test
 * Simple fetch-based test for Optima-Core backend
 */

const BASE_URL = process.env.EXPO_PUBLIC_OPTIMA_CORE_URL || "https://optima-core-backend.onrender.com";
const API_KEY = "rnd_w0obVzrvycssNp2SbIA3q2sbZZW0";

async function testEndpoint(name, endpoint, method = "GET", body = null) {
  console.log(`\n📍 Testing: ${name}`);
  console.log(`   URL: ${BASE_URL}${endpoint}`);
  console.log(`   Method: ${method}`);
  
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
      console.log(`   Body:`, body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Success (${response.status}):`, data);
      return data;
    } else {
      console.log(`   ❌ Failed (${response.status}):`, data);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log("\n🚀 Optima-Core Quick Connection Test");
  console.log("=".repeat(70));
  console.log(`Backend URL: ${BASE_URL}`);
  console.log("=".repeat(70));

  // Test 1: Root endpoint
  await testEndpoint("Root", "/");

  // Test 2: Health check
  await testEndpoint("Health Check", "/health");

  // Test 3: Pulse log
  await testEndpoint("Pulse Log", "/pulse", "POST", {
    user: "tyrone",
    mood: "focused",
    interaction: "quick_test"
  });

  // Test 4: Hive event
  await testEndpoint("Hive Event", "/hive", "POST", {
    user: "tyrone",
    networkData: {
      testConnection: true,
      timestamp: new Date().toISOString()
    }
  });

  // Test 5: NFT creation
  await testEndpoint("Create NFT", "/market/nft", "POST", {
    owner: "tyrone",
    tokenData: {
      name: "Test NFT",
      type: "credential",
      timestamp: new Date().toISOString()
    }
  });

  console.log("\n" + "=".repeat(70));
  console.log("🎉 Test suite completed!");
  console.log("=".repeat(70) + "\n");
}

// Run the tests
runTests().catch(console.error);
