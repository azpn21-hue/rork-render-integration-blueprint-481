#!/usr/bin/env node

console.log('='.repeat(60));
console.log('🔍 Backend Routes Diagnostic Check');
console.log('='.repeat(60));

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
    skipLibCheck: true,
  }
});

try {
  console.log('\n📦 Loading backend router...');
  const { appRouter } = require('../backend/trpc/app-router');
  
  console.log('✅ Backend router loaded successfully\n');
  
  const procedures = Object.keys(appRouter._def.procedures);
  console.log(`📊 Total procedures: ${procedures.length}\n`);
  
  console.log('📋 All available routes:');
  console.log('─'.repeat(60));
  procedures.forEach(proc => {
    console.log(`  • ${proc}`);
  });
  console.log('─'.repeat(60));
  
  const r3alRoutes = procedures.filter(p => p.startsWith('r3al.'));
  const tokenRoutes = r3alRoutes.filter(p => p.includes('.tokens.'));
  const nftRoutes = r3alRoutes.filter(p => p.includes('.nft') || p.includes('NFT'));
  const qotdRoutes = r3alRoutes.filter(p => p.includes('.qotd.'));
  const pulseRoutes = r3alRoutes.filter(p => p.includes('.pulseChat.'));
  
  console.log(`\n🎯 R3AL Routes Summary:`);
  console.log(`  Total R3AL routes: ${r3alRoutes.length}`);
  console.log(`  • Token routes: ${tokenRoutes.length} - ${tokenRoutes.join(', ') || 'NONE'}`);
  console.log(`  • NFT routes: ${nftRoutes.length} - ${nftRoutes.join(', ') || 'NONE'}`);
  console.log(`  • QOTD routes: ${qotdRoutes.length} - ${qotdRoutes.join(', ') || 'NONE'}`);
  console.log(`  • Pulse Chat routes: ${pulseRoutes.length} - ${pulseRoutes.join(', ') || 'NONE'}`);
  
  const missing = [];
  
  if (tokenRoutes.length === 0) missing.push('Token routes');
  if (nftRoutes.length === 0) missing.push('NFT routes');
  if (qotdRoutes.length === 0) missing.push('QOTD routes');
  if (pulseRoutes.length === 0) missing.push('Pulse Chat routes');
  
  if (missing.length > 0) {
    console.log('\n❌ Missing route groups:');
    missing.forEach(m => console.log(`  • ${m}`));
  } else {
    console.log('\n✅ All expected route groups are present!');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Diagnostic check complete');
  console.log('='.repeat(60));
  
} catch (error) {
  console.error('\n❌ Error loading backend router:');
  console.error(error);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
}
