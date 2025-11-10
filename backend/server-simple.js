const { serve } = require('@hono/node-server');
const { Hono } = require('hono');
const { cors } = require('hono/cors');

const port = parseInt(process.env.PORT || '8080', 10);

console.log('='.repeat(60));
console.log('🚀 Starting R3AL Connection Backend (Cloud Run)...');
console.log(`📡 Port: ${port}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`⏰ Started at: ${new Date().toISOString()}`);
console.log('='.repeat(60));

const app = new Hono();

const envSnapshot = [
  { key: 'DB_USER', value: process.env.DB_USER },
  { key: 'DB_NAME', value: process.env.DB_NAME },
  { key: 'CLOUD_SQL_CONNECTION_NAME', value: process.env.CLOUD_SQL_CONNECTION_NAME },
  { key: 'EXPO_PUBLIC_RORK_API_BASE_URL', value: process.env.EXPO_PUBLIC_RORK_API_BASE_URL },
  { key: 'EXPO_PUBLIC_AI_BASE_URL', value: process.env.EXPO_PUBLIC_AI_BASE_URL },
];

const missingEnvVars = envSnapshot
  .filter(({ value }) => !value || value.trim().length === 0)
  .map(({ key }) => key);

console.log('🛠️ Environment diagnostics:');
envSnapshot.forEach(({ key, value }) => {
  if (!value) {
    console.log(`   • ${key}: (missing)`);
  } else {
    const redacted = key.includes('PASSWORD') || key.includes('KEY') ? '***' : value;
    console.log(`   • ${key}: ${redacted}`);
  }
});

if (missingEnvVars.length > 0) {
  console.log('⚠️  Missing environment variables detected:', missingEnvVars.join(', '));
  console.log('   The service will continue to start, but upstream calls may fail until these are provided.');
} else {
  console.log('✅ All critical environment variables are present.');
}

// CORS setup
app.use("*", cors({
  origin: (origin) => {
    const allowed = [
      "http://localhost:19006",
      "http://localhost:8081",
      "http://localhost:10000",
      "https://rork-r3al-connection.onrender.com",
    ];
    
    if (!origin) return true;
    if (allowed.includes(origin)) return origin;
    if (origin && (origin.includes('.rork.live') || origin.includes('.rork.app') || origin.includes('.rorktest.dev'))) {
      return origin;
    }
    
    return false;
  },
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Health check endpoints
app.get("/", (c) => {
  return c.json({ 
    status: "ok", 
    message: "R3AL Connection API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

app.get("/health", (c) => {
  return c.json({ 
    status: "healthy", 
    message: "R3AL Connection API health check",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (c) => {
  return c.json({ 
    status: "healthy", 
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    port: port,
    env: process.env.NODE_ENV
  });
});

// Simple test endpoints
app.get("/api/test", (c) => {
  return c.json({ 
    message: "API test successful",
    timestamp: new Date().toISOString()
  });
});

console.log(`\n🚀 Starting server on port ${port}...`);

const server = serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
}, (info) => {
  console.log('='.repeat(60));
  console.log(`✅ Server is running!`);
  console.log(`📡 Listening on: http://0.0.0.0:${info.port}`);
  console.log(`🧪 Health check: http://0.0.0.0:${info.port}/health`);
  console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📴 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📴 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});

console.log('✅ Server initialization complete');
