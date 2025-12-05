#!/bin/bash

echo "🧹 Clearing Metro bundler cache..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

echo "🧹 Clearing watchman..."
if command -v watchman &> /dev/null; then
  watchman watch-del-all
fi

echo "✅ Cache cleared!"
echo "🚀 Starting app..."

bun start
