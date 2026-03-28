#!/bin/bash

# Script to make all startup scripts executable

echo "Making all scripts executable..."

chmod +x start-r3al-master.sh
chmod +x start-quick.sh
chmod +x start-app.sh
chmod +x clear-everything.sh

echo "✅ All scripts are now executable!"
echo ""
echo "Available commands:"
echo "  ./start-r3al-master.sh  - Recommended: Full startup with checks"
echo "  ./start-quick.sh        - Quick start"
echo "  ./start-app.sh          - Standard start"
echo "  ./clear-everything.sh   - Clear caches only"
echo ""
echo "Or simply run:"
echo "  npx expo start --clear"
