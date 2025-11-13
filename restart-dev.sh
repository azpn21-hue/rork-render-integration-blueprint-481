#!/bin/bash

echo "🧹 Clearing Metro bundler cache..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/metro-* 2>/dev/null
rm -rf $TMPDIR/react-* 2>/dev/null

echo "🧹 Clearing system temp..."
rm -rf /tmp/metro-* 2>/dev/null
rm -rf /tmp/react-* 2>/dev/null
rm -rf /tmp/haste-* 2>/dev/null

echo "✅ Cache cleared!"
echo ""
echo "🚀 Starting app..."
bun run start
