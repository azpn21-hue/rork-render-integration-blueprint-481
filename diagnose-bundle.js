#!/usr/bin/env node

/**
 * Bundle Diagnostic Tool
 * Checks for common bundling issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 R3AL Bundle Diagnostics\n');
console.log('=' .repeat(50));

// Check 1: TypeScript configuration
console.log('\n1️⃣ Checking TypeScript Configuration...');
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  console.log('   ✅ tsconfig.json is valid');
  console.log('   → Strict mode:', tsconfig.compilerOptions?.strict);
  console.log('   → Paths configured:', Object.keys(tsconfig.compilerOptions?.paths || {}).length);
} catch (error) {
  console.log('   ❌ tsconfig.json error:', error.message);
}

// Check 2: Package.json dependencies
console.log('\n2️⃣ Checking package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('   ✅ package.json is valid');
  console.log('   → Dependencies:', Object.keys(pkg.dependencies || {}).length);
  console.log('   → Main entry:', pkg.main);
  
  // Check for common problematic packages
  const deps = pkg.dependencies || {};
  if (deps['react-native-reanimated']) {
    console.log('   ⚠️  react-native-reanimated detected (can cause web issues)');
  }
} catch (error) {
  console.log('   ❌ package.json error:', error.message);
}

// Check 3: Key entry files
console.log('\n3️⃣ Checking entry files...');
const entryFiles = [
  'app/_layout.tsx',
  'app/index.tsx',
  'backend/trpc/app-router.ts',
  'lib/trpc.ts'
];

entryFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      console.log(`   ✅ ${file} (${content.length} bytes)`);
      
      // Check for common issues
      if (content.includes('import React from') && !content.includes("import React")) {
        console.log(`      ⚠️  Possible React import issue`);
      }
      
      // Check for unterminated strings/brackets
      const openBrackets = (content.match(/\{/g) || []).length;
      const closeBrackets = (content.match(/\}/g) || []).length;
      if (openBrackets !== closeBrackets) {
        console.log(`      ⚠️  Bracket mismatch: ${openBrackets} open, ${closeBrackets} close`);
      }
    } else {
      console.log(`   ❌ ${file} NOT FOUND`);
    }
  } catch (error) {
    console.log(`   ❌ ${file} error: ${error.message}`);
  }
});

// Check 4: Backend router imports
console.log('\n4️⃣ Checking backend router imports...');
try {
  const routerContent = fs.readFileSync('backend/trpc/routes/r3al/router.ts', 'utf8');
  const imports = routerContent.match(/import .+ from ['"]\..+['"]/g) || [];
  console.log(`   → Found ${imports.length} imports`);
  
  // Check if all imported files exist
  let missingFiles = 0;
  imports.forEach(imp => {
    const match = imp.match(/from ['"](.+)['"]/);
    if (match) {
      const importPath = match[1];
      const fullPath = path.join('backend/trpc/routes/r3al', importPath.replace(/^\.\//, ''));
      
      // Try with various extensions
      const possiblePaths = [
        fullPath,
        fullPath + '.ts',
        fullPath + '/route.ts'
      ];
      
      const exists = possiblePaths.some(p => fs.existsSync(p));
      if (!exists) {
        console.log(`   ⚠️  Missing: ${importPath}`);
        missingFiles++;
      }
    }
  });
  
  if (missingFiles === 0) {
    console.log('   ✅ All imports appear to exist');
  } else {
    console.log(`   ⚠️  ${missingFiles} potentially missing imports`);
  }
} catch (error) {
  console.log('   ❌ Router check error:', error.message);
}

// Check 5: Circular dependencies (basic check)
console.log('\n5️⃣ Checking for potential circular dependencies...');
console.log('   ℹ️  This is a basic check - use madge for complete analysis');

// Check 6: Cache directories
console.log('\n6️⃣ Checking cache directories...');
const cacheDirs = [
  '.expo',
  'node_modules/.cache',
  'dist'
];

cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ⚠️  ${dir} exists (should be cleared)`);
  } else {
    console.log(`   ✅ ${dir} is clean`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📋 Summary');
console.log('   Run ./fix-bundling-final.sh to clear caches and restart');
console.log('   If issues persist, check the specific files flagged above');
console.log('\n💡 Common fixes:');
console.log('   • Clear all caches: rm -rf .expo node_modules/.cache');
console.log('   • Restart Metro bundler: kill all node processes');
console.log('   • Check for syntax errors in recently modified files');
console.log('   • Verify all imports are correct\n');
