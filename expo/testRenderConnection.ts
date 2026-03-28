import axios from "axios";

const services = {
  gateway: process.env.API_GATEWAY_URL || "https://rork-gateway.onrender.com",
  hive: process.env.HIVE_CORE_URL || "https://hive-core.onrender.com",
  vault: process.env.VAULT_URL || "https://vault-service.onrender.com",
  comms: process.env.COMMS_URL || "https://comms-gateway.onrender.com",
  payments: process.env.PAYMENT_URL || "https://monetization-engine.onrender.com",
};

export async function testRenderConnection() {
  console.log("🔄 Testing RORK REAR microservices connection...\n");

  for (const [serviceName, serviceUrl] of Object.entries(services)) {
    try {
      console.log(`Testing ${serviceName}: ${serviceUrl}`);
      const response = await axios.get(`${serviceUrl}/health`, { timeout: 10000 });
      
      if (response.status === 200) {
        console.log(`✅ ${serviceName} service: ONLINE (${response.status})`);
      } else {
        console.log(`⚠️ ${serviceName} service: Unexpected status ${response.status}`);
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        console.error(`❌ ${serviceName} service: TIMEOUT (service may be cold starting)`);
      } else if (error.response) {
        console.error(`❌ ${serviceName} service: ERROR ${error.response.status}`);
      } else if (error.request) {
        console.error(`❌ ${serviceName} service: NO RESPONSE (may not be deployed yet)`);
      } else {
        console.error(`❌ ${serviceName} service: ${error.message}`);
      }
    }
    console.log("");
  }

  console.log("🔍 Connection test complete.");
}

if (require.main === module) {
  testRenderConnection().then(() => {
    console.log("\n✅ Test script finished.");
    process.exit(0);
  }).catch((error) => {
    console.error("\n❌ Test script failed:", error);
    process.exit(1);
  });
}
