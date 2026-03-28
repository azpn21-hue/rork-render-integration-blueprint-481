#!/usr/bin/env ts-node
/**
 * Optima-Core Connection Test Script
 * Tests connection between Rork app and Optima-Core backend
 */

import { optimaCoreClient } from "../lib/optima-core-client";

async function testOptimaConnection() {
  console.log("\n🧪 Starting Optima-Core Connection Test...\n");
  console.log("=" .repeat(60));

  let passedTests = 0;
  let failedTests = 0;

  try {
    console.log("\n✅ Test 1: Health Check");
    const health = await optimaCoreClient.health();
    console.log("   Response:", JSON.stringify(health, null, 2));
    passedTests++;
  } catch (error: any) {
    console.error("   ❌ Health check failed:", error.message);
    failedTests++;
  }

  try {
    console.log("\n✅ Test 2: Root Endpoint");
    const root = await optimaCoreClient.root();
    console.log("   Response:", JSON.stringify(root, null, 2));
    passedTests++;
  } catch (error: any) {
    console.error("   ❌ Root endpoint failed:", error.message);
    failedTests++;
  }

  try {
    console.log("\n✅ Test 3: Log Pulse Data");
    const pulse = await optimaCoreClient.logPulse({
      userId: "test_user",
      mood: "focused",
      activity: "connection_test",
      timestamp: new Date().toISOString(),
    });
    console.log("   Response:", JSON.stringify(pulse, null, 2));
    passedTests++;
  } catch (error: any) {
    console.error("   ❌ Pulse logging failed:", error.message);
    failedTests++;
  }

  try {
    console.log("\n✅ Test 4: Submit Hive Data");
    const hive = await optimaCoreClient.submitHiveData({
      userId: "test_user",
      connections: ["user1", "user2", "user3"],
      timestamp: new Date().toISOString(),
    });
    console.log("   Response:", JSON.stringify(hive, null, 2));
    passedTests++;
  } catch (error: any) {
    console.error("   ❌ Hive submission failed:", error.message);
    failedTests++;
  }

  try {
    console.log("\n✅ Test 5: Create NFT");
    const nft = await optimaCoreClient.createNFT({
      userId: "test_user",
      nftType: "credential",
      metadata: {
        credentialType: "identity_verification",
        timestamp: new Date().toISOString(),
      },
    });
    console.log("   Response:", JSON.stringify(nft, null, 2));
    passedTests++;
  } catch (error: any) {
    console.error("   ❌ NFT creation failed:", error.message);
    failedTests++;
  }

  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  console.log("\n" + "=".repeat(60));

  if (failedTests === 0) {
    console.log("\n🎉 All tests passed! Optima-Core connection is working.\n");
    process.exit(0);
  } else {
    console.log("\n⚠️  Some tests failed. Check the Optima-Core backend.\n");
    process.exit(1);
  }
}

testOptimaConnection().catch((error) => {
  console.error("\n❌ Test suite failed:", error);
  process.exit(1);
});
