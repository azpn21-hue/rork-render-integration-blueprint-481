# Bundling Error Fix

## Problem
Metro bundler was trying to bundle backend code (PostgreSQL, Node.js-specific modules) into the React Native frontend, causing a "Bundling failed without error" message.

## Solution Applied

### 1. Created `.metroignore` file
This tells Metro to completely ignore backend and script files during bundling:
- `backend/**/*` - All backend code
- `scripts/**/*` - Build/deployment scripts  
- `*.md` - Documentation files
- `*.sh` - Shell scripts
- `server.js` - Backend server entry point

### 2. Created cache-clearing script
`fix-bundling-error-now.sh` clears all Metro caches and restarts cleanly.

## How to Fix the Error

### Quick Fix (Recommended):
```bash
# Make the script executable
chmod +x fix-bundling-error-now.sh

# Run it
./fix-bundling-error-now.sh
```

### Manual Fix:
```bash
# Stop any running processes
pkill -f metro
pkill -f expo

# Clear all caches
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/react-*

# If you have watchman installed
watchman watch-del-all

# Restart with clean cache
bunx expo start --clear
```

## Why This Happened

The backend code was added to `backend/routes/founding-member.ts` which imports:
- `pg` (PostgreSQL library) - Not compatible with React Native
- `backend/db/config.ts` - Node.js-specific database config

Metro was scanning all `.ts` files in the project and trying to bundle them, including backend code that contains Node.js-only modules.

## Prevention

- ✅ Keep backend code in `backend/` folder (now ignored by Metro)
- ✅ Never import backend code directly into frontend code
- ✅ Use tRPC for client-server communication (already configured)
- ✅ The `.metroignore` file prevents Metro from scanning backend files

## Verify the Fix

After running the fix script, you should see:
1. Metro bundler starts successfully
2. No "Bundling failed" errors
3. App loads on device/simulator

If you still see issues, try:
```bash
# Nuclear option - reinstall dependencies
rm -rf node_modules
bun install
./fix-bundling-error-now.sh
```

## Technical Details

**Metro Bundler** (React Native's bundler) automatically scans all JavaScript/TypeScript files in your project. When it found `backend/routes/founding-member.ts` importing PostgreSQL (`pg` library), it tried to bundle that Node.js-specific code into your React Native bundle, which is impossible and caused the error.

The `.metroignore` file tells Metro to skip the backend directory entirely, preventing this issue.
