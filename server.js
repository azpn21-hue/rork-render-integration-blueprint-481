const { serve } = require('@hono/node-server');

const port = parseInt(process.env.PORT || '10000', 10);

console.log('='.repeat(60));
console.log('🚀 Starting R3AL Connection Backend...');
console.log(`📡 Port: ${port}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`⏰ Started at: ${new Date().toISOString()}`);
console.log('='.repeat(60));

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
    skipLibCheck: true,
  }
});

console.log('📦 Loading backend application...');
const app = require('./backend/hono').default;
console.log('✅ Backend application loaded successfully');

console.log('\n📍 Available endpoints:');
console.log('  • GET  /           - Root endpoint');
console.log('  • GET  /health     - Health check');
console.log('  • POST /api/trpc/* - tRPC API');
console.log('  • GET  /probe/gateway - AI Gateway probe');
console.log('  • POST /ai/memory  - AI memory update');

console.log(`\n🚀 Starting server on port ${port}...`);

serve({
  fetch: app.fetch,
  port: port,
}, (info) => {
  console.log('='.repeat(60));
  console.log(`✅ Server is running!`);
  console.log(`📡 Listening on: http://localhost:${info.port}`);
  console.log(`🌐 Access from network: http://<your-ip>:${info.port}`);
  console.log(`🧪 Try: http://localhost:${info.port}/health`);
  console.log('='.repeat(60));
});
