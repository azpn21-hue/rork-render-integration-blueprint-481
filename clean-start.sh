#!/bin/bash

echo "🧹 Cleaning R3AL Connection App..."

echo "  → Killing stale processes..."
pkill -f "expo" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
pkill -f "node.*9wjyl0e4hila7inz8ajca" 2>/dev/null || true

echo "  → Clearing caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .expo 2>/dev/null || true
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

echo "✅ Clean complete!"
echo ""
echo "🚀 Starting fresh..."
bun start
