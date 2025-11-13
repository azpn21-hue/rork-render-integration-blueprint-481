#!/bin/bash

# Master Fix Script - Automatically tries fixes in order

echo "🔧 R3AL Master Fix Script"
echo "========================="
echo ""
echo "This script will try fixes in order:"
echo "  1. Quick cache clear and restart"
echo "  2. Complete cache clear"
echo "  3. Nuclear option (complete reset)"
echo ""

# Make all scripts executable
chmod +x quick-fix-bundle.sh
chmod +x nuclear-fix.sh
chmod +x run-diagnostics.sh
chmod +x diagnose-bundle.js

echo "Step 1: Running diagnostics..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./run-diagnostics.sh

echo ""
echo ""
read -p "Do you want to try the quick fix? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Running quick fix..."
    ./quick-fix-bundle.sh
    exit 0
fi

echo ""
read -p "Do you want to try the NUCLEAR option (complete reset)? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Running nuclear option..."
    ./nuclear-fix.sh
    exit 0
fi

echo ""
echo "No fix selected. Exiting."
echo ""
echo "To manually run fixes:"
echo "  Quick fix:    ./quick-fix-bundle.sh"
echo "  Nuclear fix:  ./nuclear-fix.sh"
echo ""

