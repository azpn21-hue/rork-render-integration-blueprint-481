const { serve } = require('@hono/node-server');

const port = parseInt(process.env.PORT || '8080', 10);

console.log('='.repeat(60));
console.log('🚀 Starting R3AL Connection Backend (Cloud Run)...');
console.log(`📡 Port: ${port}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`⏰ Started at: ${new Date().toISOString()}`);
console.log('='.repeat(60));

require('tsconfig-paths').register({
  baseUrl: __dirname,
  paths: {
    '@/*': ['../*']
  }
});

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
    skipLibCheck: true,
  }
});

console.log('📦 Loading backend application...');
let app;
try {
  app = require('./hono').default;
  if (!app) {
    throw new Error('App export is undefined');
  }
  console.log('✅ Backend application loaded successfully');
} catch (error) {
  console.error('❌ Failed to load backend application:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}

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
  console.log(`🔍 Routes: http://0.0.0.0:${info.port}/api/routes`);
  console.log('='.repeat(60));
});

process.on('SIGTERM', () => {
  console.log('\n📴 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});
