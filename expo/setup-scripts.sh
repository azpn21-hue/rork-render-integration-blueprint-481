#!/bin/bash

echo "🔧 Setting up R3AL startup scripts..."
echo ""

# Make all scripts executable
chmod +x start-all.sh
chmod +x BACKEND_STARTUP.sh
chmod +x start-backend-simple.sh
chmod +x check-backend-health.js

echo "✅ Made scripts executable:"
echo "  • start-all.sh"
echo "  • BACKEND_STARTUP.sh"
echo "  • start-backend-simple.sh"
echo "  • check-backend-health.js"
echo ""

echo "🎯 You can now run:"
echo ""
echo "  ./start-all.sh           - Start everything"
echo "  ./BACKEND_STARTUP.sh     - Start backend only"
echo "  node check-backend-health.js  - Check health"
echo ""

echo "✨ Setup complete!"
