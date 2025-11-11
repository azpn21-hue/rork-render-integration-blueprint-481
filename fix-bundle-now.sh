#!/bin/bash

echo "🧹 Clearing all Metro bundler caches..."

# Kill any running Metro processes
pkill -f metro || true
pkill -f expo || true

# Clear Metro cache
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true

# Clear watchman if available
if command -v watchman &> /dev/null; then
  echo "🧹 Clearing watchman..."
  watchman watch-del-all 2>/dev/null || true
fi

# Verify metroignore exists
if [ ! -f "metroignore" ]; then
  echo "⚠️  Warning: metroignore file not found!"
  echo "Creating metroignore..."
  cat > metroignore << 'EOF'
# Metro bundler ignore patterns
# Prevent Metro from trying to bundle backend Node.js code

# Backend server code (contains Node.js modules like pg, hono, etc.)
backend/**/*

# Build and deployment scripts
scripts/**/*

# AI Gateway (contains Node.js-specific code)
ai-gateway/**/*

# Documentation
*.md

# Shell scripts
*.sh

# SQL files
*.sql

# Docker files
Dockerfile*
*.dockerignore

# Cloud Build
cloudbuild.yaml
.gcloudignore

# Server entry points
server.js
backend/server.js

# Public web files
public/**/*

# Firebase files
firebase.json
.firebaserc

# Render config
render.yaml

# Test files
**/*.test.ts
**/*.test.tsx
**/*.spec.ts
**/*.spec.tsx

# Schema files
schemas/**/*.sql
EOF
fi

echo "✅ Cache cleared!"
echo "🚀 Starting Expo with clean cache..."
echo ""

bun start --clear
