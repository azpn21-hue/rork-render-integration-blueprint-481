#!/usr/bin/env ts-node
/**
 * Optima-Core Connection Test Script
 * Tests all endpoints to verify backend is properly connected
 */

import { optimaCoreClient } from "../lib/optima-core-client";
import { getHealth, sendPulse, sendHiveEvent, createNFT } from "../lib/optima-bridge";

async function testOptimaCore() {
  console.log("\n🚀 Starting Optima-Core Connection Tests\n");
  console.log("=" .repeat(60));

  try {
    // Test 1: Health Check using axios client
    console.log("\n📍 Test 1: Health Check (Axios Client)");
    console.log("-".repeat(60));
    const healthAxios = await optimaCoreClient.health();
    console.log("✅ Health Response (Axios):", JSON.stringify(healthAxios, null, 2));

    // Test 2: Health Check using fetch bridge
    console.log("\n📍 Test 2: Health Check (Fetch Bridge)");
    console.log("-".repeat(60));
    const healthFetch = await getHealth();
    console.log("✅ Health Response (Fetch):", JSON.stringify(healthFetch, null, 2));

    // Test 3: Send Pulse Data
    console.log("\n📍 Test 3: Pulse Logging");
    console.log("-".repeat(60));
    const pulseResponse = await sendPulse("tyrone", "focused", "connection_test");
    console.log("✅ Pulse Response:", JSON.stringify(pulseResponse, null, 2));

    // Test 4: Hive Event
    console.log("\n📍 Test 4: Hive Event Submission");
    console.log("-".repeat(60));
    const hiveResponse = await sendHiveEvent("tyrone", {
      testConnection: true,
      timestamp: new Date().toISOString(),
      connections: ["user1", "user2"],
    });
    console.log("✅ Hive Response:", JSON.stringify(hiveResponse, null, 2));

    // Test 5: Create NFT
    console.log("\n📍 Test 5: NFT Creation");
    console.log("-".repeat(60));
    const nftResponse = await createNFT("tyrone", {
      name: "Test NFT",
      type: "credential",
      timestamp: new Date().toISOString(),
    });
    console.log("✅ NFT Response:", JSON.stringify(nftResponse, null, 2));

    console.log("\n" + "=".repeat(60));
    console.log("🎉 All tests passed! Optima-Core is fully connected.");
    console.log("=".repeat(60) + "\n");

  } catch (error: any) {
    console.error("\n❌ Test Failed:");
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    console.log("\n💡 Troubleshooting:");
    console.log("1. Verify Optima-Core backend is running:");
    console.log("   curl https://optima-core-backend.onrender.com/health");
    console.log("2. Check environment variables in .env");
    console.log("3. Verify EXPO_PUBLIC_OPTIMA_CORE_URL is set correctly");
    process.exit(1);
  }
}

// Run tests
testOptimaCore();
