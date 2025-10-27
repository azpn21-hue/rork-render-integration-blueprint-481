# Fix for "process with pid 552 not found" Error

## Problem
The error `{"json":{"name":"NotFoundError","message":"[not_found] process with pid 552 not found"}}` occurs when Expo's development server references a process that no longer exists. This is typically caused by:

1. **Stale process references** - Metro bundler cache pointing to dead processes
2. **Hot reload issues** - Development server trying to reconnect to terminated processes
3. **Network failures** - Backend API calls failing and breaking the process lifecycle
4. **Multiple instances** - Conflicting Expo/Metro processes running simultaneously

## Quick Fix

### Option 1: Using the Clean Start Script
```bash
chmod +x clean-start.sh
./clean-start.sh
```

### Option 2: Manual Commands
```bash
# 1. Kill all expo/metro processes
pkill -f "expo" || true
pkill -f "metro" || true
pkill -f "node" || true

# 2. Clear all caches
rm -rf node_modules/.cache
rm -rf .expo
rm -rf /tmp/metro-*
rm -rf /tmp/react-*
rm -rf /tmp/haste-map-*

# 3. Reinstall and restart
bun install
bun start
```

## What Was Fixed

### 1. API Configuration (`app/config/api.ts`)
- Reduced timeout from 30s to 15s
- Added `validateStatus` to handle 4xx errors gracefully
- Prevents process crashes from failed API calls

### 2. Root Layout (`app/_layout.tsx`)
- Added React Query configuration with retry limits
- Installed and configured `react-error-boundary`
- Added error fallback UI
- Improved QueryClient defaults to prevent infinite retries

### 3. Improved Error Handling
- Queries now retry only once (instead of infinite)
- Mutations don't retry at all
- Stale time set to 5 seconds
- Disabled refetch on window focus

## Backend Connection Issues

Your `.env` points to these services that may not be deployed yet:
```
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-gateway.onrender.com
HIVE_CORE_URL=https://hive-core.onrender.com
VAULT_URL=https://vault-service.onrender.com
COMMS_URL=https://comms-gateway.onrender.com
PAYMENT_URL=https://monetization-engine.onrender.com
```

**The app now handles these gracefully**, but you should either:
1. Deploy the backend services to Render
2. Use mock/local endpoints for development
3. Comment out backend calls until services are ready

## Testing the Fix

After running the clean start script:

1. Check the terminal for `✅ Clean complete!`
2. Wait for `Metro bundler ready`
3. Scan QR code or press 'w' for web
4. You should see the login screen without errors

## Preventing Future Issues

### Always use clean start when:
- Switching branches
- After installing new packages
- When seeing weird bundler errors
- After computer sleep/wake
- When hot reload stops working

### Never:
- Force quit terminal without stopping Expo properly (use Ctrl+C)
- Run multiple `bun start` instances simultaneously
- Delete `.expo` while the dev server is running

## Still Having Issues?

If the error persists:

1. **Check for port conflicts:**
   ```bash
   lsof -ti:8081 | xargs kill -9
   lsof -ti:19000 | xargs kill -9
   lsof -ti:19001 | xargs kill -9
   ```

2. **Nuclear option - full reset:**
   ```bash
   rm -rf node_modules
   rm -rf bun.lock
   bun install
   ./clean-start.sh
   ```

3. **Check system resources:**
   - Ensure you have enough RAM (>2GB free)
   - Close heavy applications
   - Restart your computer if needed

## Support

If none of these fixes work, the issue may be:
- System-level process management issues
- Corrupted Node/Bun installation
- File system permissions problems
- Firewall blocking Metro bundler ports

Check logs in:
- Terminal output
- `.expo/` directory
- Metro bundler cache folder
