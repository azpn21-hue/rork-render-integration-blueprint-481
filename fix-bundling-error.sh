#!/bin/bash
# Fix Bundling Error Script

echo "🔧 Fixing bundling error..."
echo ""

# 1. Fix Zod version in package.json
echo "📦 Fixing Zod version..."
sed -i.bak 's/"zod": "^4.1.12"/"zod": "^3.23.8"/' package.json

# 2. Clear all caches
echo "🧹 Clearing Metro bundler cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# 3. Reinstall dependencies
echo "📥 Reinstalling dependencies..."
bun install

# 4. Clear watchman
echo "👁️ Clearing watchman..."
watchman watch-del-all 2>/dev/null || echo "Watchman not installed, skipping..."

# 5. Start fresh
echo "✅ Done! Now restart the dev server with: bun start"
echo ""
echo "If the issue persists, try:"
echo "  1. Close all terminals"
echo "  2. Run this script again"
echo "  3. Start the dev server"
