# Bundling Error Fix Guide

## Error: "Bundling failed without error"

This silent bundling error typically occurs due to:
1. **Invalid package versions** (Zod v4.x doesn't exist)
2. **Deprecated React Query options** (`onSuccess`, `onError`)
3. **Metro bundler cache corruption**

---

## ✅ Quick Fix (Recommended)

### Step 1: Run the fix script

```bash
chmod +x fix-bundling-error.sh
./fix-bundling-error.sh
```

### Step 2: Restart the dev server

```bash
# Kill any existing processes
pkill -f "expo\|metro\|node"

# Start fresh
bun start
```

---

## 🔧 Manual Fix (If script doesn't work)

### 1. Fix Zod version

The issue is in `package.json` - Zod v4.x doesn't exist:

```json
// WRONG:
"zod": "^4.1.12"

// CORRECT:
"zod": "^3.23.8"
```

**Fix manually:**

```bash
# Edit package.json
sed -i 's/"zod": "^4.1.12"/"zod": "^3.23.8"/' package.json

# Reinstall
bun install
```

### 2. Clear all caches

```bash
# Remove Metro cache
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Clear watchman
watchman watch-del-all
```

### 3. Reinstall dependencies

```bash
rm -rf node_modules
rm bun.lock
bun install
```

---

## 🐛 If Still Failing

### Check for syntax errors

```bash
# Run TypeScript check
bunx tsc --noEmit

# Check for import errors
bunx eslint app --ext .ts,.tsx
```

### Start with minimal bundle

Try starting just the root layout:

```bash
# Temporarily comment out all routes except splash in app/r3al/_layout.tsx
# Then restart: bun start
```

### Check Metro logs

```bash
# Start with verbose logging
DEBUG=expo:* bun start
```

Look for:
- Module resolution errors
- Circular dependency warnings
- Transform errors

---

## 🎯 Fixed Issues

The following have already been fixed:

✅ **VerificationContext.tsx** - Removed deprecated `onSuccess`/`onError` options  
✅ **React Query v5 migration** - Using `useEffect` with mutation data  
✅ **Script created** - Automated fix for Zod version  

---

## 📝 Common Causes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Invalid package version | Silent bundling failure | Check package.json for non-existent versions |
| Deprecated options | Build errors | Update React Query callbacks to useEffect |
| Metro cache | Stale modules | Clear all caches |
| Circular imports | Stack overflow | Check import chains |
| Missing dependencies | Module not found | Run `bun install` |

---

## 🚀 After Fixing

1. **Kill all processes**: `pkill -f "expo\|metro\|node"`
2. **Clear caches**: `rm -rf .expo node_modules/.cache`
3. **Start fresh**: `bun start`

If you still see the error, share the Metro logs for deeper investigation.
