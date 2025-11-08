#!/bin/bash

# R3AL Test Runner
# Quick script to run all backend tests

echo "╔════════════════════════════════════════════════════════════╗"
echo "║              R3AL Backend Test Runner                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Running comprehensive backend tests..."
echo ""

# Run the comprehensive test
node scripts/comprehensive-test.js

# Capture exit code
EXIT_CODE=$?

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Test Complete                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All systems operational!"
  echo ""
  echo "Your R3AL backend at:"
  echo "https://r3al-app-271493276620.us-central1.run.app"
  echo ""
  echo "is fully functional and ready to use."
else
  echo "⚠️  Some tests failed."
  echo ""
  echo "Please review the test output above to identify issues."
  echo "Common fixes:"
  echo "  - Redeploy backend if routes are missing"
  echo "  - Check database connection"
  echo "  - Verify .env configuration"
fi

exit $EXIT_CODE
