# R3AL Bundling Error - Complete Fix Guide

## The Problem
You're experiencing "Bundling failed without error" which typically means:
1. Silent syntax/type errors in TypeScript
2. Circular dependencies
3. Invalid imports
4. Metro bundler cache corruption
5. File system issues

## Quick Fix (Try This First)

```bash
# Make scripts executable
chmod +x quick-fix-bundle.sh run-diagnostics.sh

# Run diagnostics
./run-diagnostics.sh

# If diagnostics show no issues, run the quick fix
./quick-fix-bundle.sh
```

## If Quick Fix Doesn't Work

### Step 1: Complete Cache Clear
```bash
# Kill all processes
pkill -9 node; pkill -9 expo; pkill -9 metro

# Clear ALL caches
rm -rf .expo
rm -rf node_modules/.cache
rm -rf dist
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
rm -rf ~/.expo/cache

# Clear watchman (if installed)
watchman watch-del-all
```

### Step 2: Check for Syntax Errors
```bash
# Run TypeScript compiler
bunx tsc --noEmit
```

If you see errors, fix them before proceeding.

### Step 3: Check for Circular Dependencies
```bash
# Install madge if not available
bun add -d madge

# Check for circular dependencies
madge --circular app
madge --circular backend
```

### Step 4: Verify File Integrity
```bash
# Run the diagnostic script
node diagnose-bundle.js
```

### Step 5: Clean Reinstall
```bash
# Remove everything
rm -rf node_modules
rm -f bun.lock

# Reinstall
bun install

# Start clean
bun expo start --clear
```

## Common Issues and Fixes

### Issue 1: "Cannot find module"
**Fix:** Check that all imports use correct paths and files exist

### Issue 2: Type errors not showing
**Fix:** Run `bunx tsc --noEmit` to see hidden type errors

### Issue 3: Metro cache stuck
**Fix:** Delete `$TMPDIR/metro-*` and `$TMPDIR/haste-*`

### Issue 4: Circular dependencies
**Fix:** Use `madge --circular` to find and break circular imports

### Issue 5: Backend router too large
**Fix:** The r3al router is very large (356 lines). Consider splitting it

## Nuclear Option (Last Resort)

If nothing works, try this complete reset:

```bash
#!/bin/bash

# Stop everything
pkill -9 node; pkill -9 expo; pkill -9 metro; pkill -9 bun

# Delete everything
rm -rf node_modules
rm -rf .expo
rm -rf dist
rm -rf build
rm -f bun.lock
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
rm -rf $TMPDIR/react-*
rm -rf ~/.expo

# Watchman
watchman watch-del-all 2>/dev/null || true

# Reinstall from scratch
bun install

# Start completely clean
bun expo start --clear --reset-cache
```

## What to Check in Your Code

Based on your project structure, check these files for errors:

1. **app/_layout.tsx** - Main layout, check all imports
2. **app/index.tsx** - Entry point, verify it's clean
3. **backend/trpc/routes/r3al/router.ts** - VERY large file (356 lines of imports)
   - This is the most likely culprit
   - Check for missing imports
   - Verify all imported files exist
4. **lib/trpc.ts** - tRPC client setup
5. **lib/app-router-type.ts** - Type definitions

## Debugging Tips

1. **Start small:** Comment out sections of r3al router to isolate the issue
2. **Check logs:** Look at Metro bundler output carefully
3. **Test imports:** Try importing files one by one
4. **Use verbose mode:** Run with `DEBUG=expo* bun expo start`

## Getting More Information

If the error persists, run:

```bash
# Full verbose output
DEBUG=expo* bun expo start --clear 2>&1 | tee bundle-error.log

# Then check the log
cat bundle-error.log
```

## Next Steps

1. Run `./run-diagnostics.sh` to identify the issue
2. Run `./quick-fix-bundle.sh` to fix common issues
3. If still broken, try the nuclear option above
4. If STILL broken, check the specific files flagged by diagnostics

---

**Note:** The "Bundling failed without error" message usually means there's a syntax or type error that's being silently swallowed. The TypeScript compiler (`bunx tsc --noEmit`) often reveals these hidden errors.
