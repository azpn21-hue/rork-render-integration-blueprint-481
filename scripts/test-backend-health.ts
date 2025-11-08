#!/usr/bin/env bun

/**
 * Backend Health Check Script
 * Tests if the backend is accessible and returns the available routes
 */

const BACKEND_URL = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "https://optima-core-712497593637.us-central1.run.app";

console.log("🔍 Testing backend health...");
console.log("Backend URL:", BACKEND_URL);
console.log("");

async function testEndpoint(name: string, url: string) {
  try {
    console.log(`Testing ${name}...`);
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${name} - Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log(`❌ ${name} - Status: ${response.status}`);
      const text = await response.text();
      console.log(`   Error:`, text.substring(0, 200));
      return false;
    }
  } catch (error: any) {
    console.log(`❌ ${name} - Network Error`);
    console.log(`   Error:`, error.message);
    return false;
  }
}

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("1. Testing Root Endpoint");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  await testEndpoint("Root", `${BACKEND_URL}/`);
  
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("2. Testing Health Endpoint");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  await testEndpoint("Health", `${BACKEND_URL}/health`);
  
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("3. Testing Routes Endpoint");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  await testEndpoint("Routes", `${BACKEND_URL}/api/routes`);
  
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("4. Testing tRPC Health Route");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  try {
    console.log("Testing tRPC health route...");
    const response = await fetch(
      `${BACKEND_URL}/api/trpc/health?input=%7B%22json%22%3Anull%7D`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ tRPC Health - Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ tRPC Health - Status: ${response.status}`);
      const text = await response.text();
      console.log(`   Error:`, text.substring(0, 200));
    }
  } catch (error: any) {
    console.log(`❌ tRPC Health - Network Error`);
    console.log(`   Error:`, error.message);
  }
  
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("5. Testing tRPC Verification Status Route");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  try {
    console.log("Testing tRPC verification.getStatus route...");
    const response = await fetch(
      `${BACKEND_URL}/api/trpc/r3al.verification.getStatus?input=%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%2C%22v%22%3A1%7D%7D`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-user-123"
        },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ tRPC Verification Status - Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ tRPC Verification Status - Status: ${response.status}`);
      const text = await response.text();
      console.log(`   Error:`, text.substring(0, 200));
    }
  } catch (error: any) {
    console.log(`❌ tRPC Verification Status - Network Error`);
    console.log(`   Error:`, error.message);
  }
  
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test Complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch(console.error);
