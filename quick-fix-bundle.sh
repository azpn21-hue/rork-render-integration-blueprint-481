#!/bin/bash

# R3AL Quick Fix - Bundling Error
# This script fixes the most common bundling issues

set -e  # Exit on error

echo "🚀 R3AL Quick Fix"
echo "================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${GREEN}►${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Step 1: Kill processes
print_step "Stopping all Node/Expo processes..."
pkill -9 node 2>/dev/null || true
pkill -9 expo 2>/dev/null || true
sleep 2

# Step 2: Clear caches
print_step "Clearing caches..."
rm -rf .expo 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true

# Clear watchman if available
if command -v watchman &> /dev/null; then
    print_step "Clearing Watchman..."
    watchman watch-del-all 2>/dev/null || true
fi

# Step 3: Verify key files exist
print_step "Verifying key files..."
required_files=(
    "app/_layout.tsx"
    "app/index.tsx"
    "package.json"
    "tsconfig.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Missing required file: $file"
        exit 1
    fi
done

# Step 4: Check node_modules
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found, installing..."
    bun install
fi

# Step 5: Start with clean cache
print_step "Starting Expo with clean cache..."
echo ""
echo "If you see errors, they will appear below:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Expo
exec bun expo start --clear

