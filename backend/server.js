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
const app = require('./hono').default;
console.log('✅ Backend application loaded successfully');

console.log(`\n🚀 Starting server on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log('='.repeat(60));
  console.log(`✅ Server is running!`);
  console.log(`📡 Listening on: http://localhost:${info.port}`);
  console.log(`🧪 Try: http://localhost:${info.port}/health`);
  console.log('='.repeat(60));
});
