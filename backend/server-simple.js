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
