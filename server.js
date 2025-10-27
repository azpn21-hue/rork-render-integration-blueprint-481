const { serve } = require('@hono/node-server');

const port = parseInt(process.env.PORT || '10000', 10);

console.log('🚀 Starting R3AL Connection Backend...');
console.log(`📡 Port: ${port}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
    skipLibCheck: true,
  }
});

const app = require('./backend/hono').default;

console.log('📡 TRPC endpoint: /api/trpc');
console.log('💚 Health check: /health');

serve({
  fetch: app.fetch,
  port: port,
});

console.log(`✅ Server started successfully on port ${port}!`);
