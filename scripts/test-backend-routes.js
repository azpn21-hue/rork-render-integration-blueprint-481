#!/usr/bin/env node

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:10000";

console.log("🧪 Testing R3AL Backend Routes");
console.log("📡 Base URL:", BASE_URL);
console.log("");

async function testRoute(name, url, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    console.log(`Testing ${name}...`);
    const response = await fetch(url, options);
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    
    if (response.ok) {
      console.log(`✅ ${name}: ${response.status}`);
      console.log(`   Response preview: ${JSON.stringify(data).substring(0, 100)}...`);
    } else {
      console.log(`❌ ${name}: ${response.status}`);
      console.log(`   Error: ${JSON.stringify(data).substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
  }
  console.log("");
}

async function runTests() {
  // Basic health checks
  await testRoute("Health Check", `${BASE_URL}/health`);
  await testRoute("Root", `${BASE_URL}/`);
  await testRoute("Routes List", `${BASE_URL}/api/routes`);
  
  // tRPC routes
  const trendingUrl = `${BASE_URL}/api/trpc/r3al.feed.getTrending?input=${encodeURIComponent(JSON.stringify({ json: { limit: 25, offset: 0 } }))}`;
  await testRoute("Feed - Get Trending", trendingUrl);
  
  const localUrl = `${BASE_URL}/api/trpc/r3al.feed.getLocal?input=${encodeURIComponent(JSON.stringify({ json: { lat: 30.2672, lon: -97.7431, radius: 25, limit: 25 } }))}`;
  await testRoute("Feed - Get Local", localUrl);
  
  const marketUrl = `${BASE_URL}/api/trpc/r3al.market.getSummary?input=${encodeURIComponent(JSON.stringify({ json: {} }))}`;
  await testRoute("Market - Get Summary", marketUrl);
  
  const aiUrl = `${BASE_URL}/api/trpc/r3al.ai.getInsights?input=${encodeURIComponent(JSON.stringify({ json: { timeframe: "day" } }))}`;
  await testRoute("AI - Get Insights", aiUrl);
  
  const healthCheckUrl = `${BASE_URL}/api/trpc/health?input=${encodeURIComponent(JSON.stringify({ json: {} }))}`;
  await testRoute("Health tRPC", healthCheckUrl);
  
  console.log("✅ All tests completed!");
}

runTests().catch(console.error);
