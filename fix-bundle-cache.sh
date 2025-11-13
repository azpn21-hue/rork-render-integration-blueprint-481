#!/bin/bash
set -e

echo "🧹 Cleaning Metro bundler cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

echo "✅ Cache cleared!"
echo "📦 Reinstalling dependencies..."

# Use bun if available, otherwise npm
if command -v bun &> /dev/null; then
    bun install
else
    npm install
fi

echo "🚀 Starting fresh development server..."
npx expo start --clear
