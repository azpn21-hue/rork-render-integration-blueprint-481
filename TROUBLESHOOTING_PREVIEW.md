# App Preview Not Loading - Troubleshooting Guide

## Quick Fixes

### 1. Clear Cache and Restart
```bash
chmod +x restart-dev.sh
./restart-dev.sh
```

Or manually:
```bash
# Clear Metro cache
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/react-*

# Restart
bun run start
```

### 2. Check Console for Errors
Look for errors in:
- Browser console (F12)
- Terminal where you ran `bun run start`
- Expo Dev Tools

### 3. Common Issues

#### Issue: White Screen
**Solution**: Clear cache and restart (see #1)

#### Issue: "Unable to resolve module"
**Solution**: 
```bash
rm -rf node_modules
bun install
bun run start
```

#### Issue: Metro bundler stuck
**Solution**:
```bash
# Kill Metro
pkill -f metro
# Clear and restart
./restart-dev.sh
```

#### Issue: Assets not loading
**Solution**: Check that these files exist:
- `assets/images/icon.png`
- `assets/images/splash-icon.png`
- `assets/images/favicon.png`

### 4. Verify Entry Points

Check that these files exist and have no syntax errors:
- `app/_layout.tsx` ✓
- `app/index.tsx` ✓
- `app/r3al/splash.tsx` ✓
- `app.json` ✓

### 5. Browser Console Check

If running in web preview:
1. Open browser console (F12)
2. Look for red errors
3. Common errors:
   - Module resolution issues
   - Asset loading failures
   - Context provider issues

### 6. Full Reset (Nuclear Option)

If nothing else works:
```bash
# Stop all processes
pkill -f metro
pkill -f node

# Clean everything
rm -rf node_modules
rm -rf .expo
rm -rf node_modules/.cache
rm -rf bun.lock

# Reinstall
bun install

# Clear cache and start
./restart-dev.sh
```

## Debugging Steps

1. **Check if Metro is running**
   ```bash
   ps aux | grep metro
   ```

2. **Check if port is available**
   ```bash
   lsof -i :8081
   ```

3. **Force kill if needed**
   ```bash
   lsof -ti:8081 | xargs kill -9
   ```

4. **Check environment**
   ```bash
   # Verify .env file exists
   cat .env
   
   # Check if required env vars are set
   echo $EXPO_PUBLIC_TOOLKIT_URL
   ```

## What Should Happen

When the app loads correctly:
1. Metro bundler starts on port 8081
2. App shows splash screen with R3AL logo
3. After 3 seconds, navigates to welcome or promo screen
4. You see console logs like:
   ```
   [Index] Mounting
   [R3AL] Starting to load state...
   [Splash] Starting boot pulse
   ```

## Still Not Working?

Share:
1. Complete error message from console
2. Screenshot of preview window
3. Last 20 lines from terminal where you ran `bun run start`
