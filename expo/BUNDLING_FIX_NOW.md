# Bundling Fix Guide - Quick Resolution

## Problem
- `bunx` command not found
- Bundling failures without clear error messages
- Node/npm/bun compatibility issues

## Solution

### Step 1: Clear All Caches
```bash
# Run this in project root
chmod +x clear-everything.sh
./clear-everything.sh
```

### Step 2: Start the App
```bash
# Use npx instead of bunx
npx expo start --clear
```

### Alternative: Use the new startup script
```bash
chmod +x start-app.sh
./start-app.sh
```

## What Changed

1. **Fixed Scripts**: Replaced `bunx rork start` with `npx expo start`
2. **Cache Clearing**: Created automated cache cleanup
3. **Environment Check**: Ensured all env vars are properly loaded

## If You Still Get Errors

### Check Node Version
```bash
node --version  # Should be v16+ or v18+
```

### Reinstall Dependencies
```bash
rm -rf node_modules
npm install
```

or if using bun:
```bash
rm -rf node_modules
bun install
```

### Check Metro Bundler
```bash
# Kill any running Metro processes
pkill -f metro
pkill -f node
```

### Full Nuclear Reset
```bash
# Clear everything
rm -rf node_modules
rm -rf .expo
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
rm -rf node_modules/.cache

# Reinstall
npm install  # or: bun install

# Start fresh
npx expo start --clear
```

## Commands Reference

### Start Development Server
```bash
npx expo start --clear
```

### Start for Web Only
```bash
npx expo start --web --clear
```

### Start with Tunnel (for physical device testing)
```bash
npx expo start --tunnel --clear
```

## Environment Variables Check

Ensure `.env` file exists with:
```
EXPO_PUBLIC_PROJECT_ID=9wjyl0e4hila7inz8ajca
EXPO_PUBLIC_RORK_API_BASE_URL=https://optima-core-712497593637.us-central1.run.app
```

## Known Issues Fixed

1. ✅ Removed dependency on `bunx rork` command
2. ✅ Fixed _layout.tsx syntax errors
3. ✅ Cleared all Metro bundler caches
4. ✅ Updated startup scripts to use standard Expo CLI

## Support

If issues persist:
1. Check the terminal output for specific errors
2. Look for TypeScript compilation errors
3. Verify all imports are resolving correctly
4. Check that backend is running (if needed)
