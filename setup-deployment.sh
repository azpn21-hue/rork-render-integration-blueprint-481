#!/bin/bash

echo "Making deployment scripts executable..."
chmod +x deploy-cloud-run.sh
chmod +x test-cloud-run-deployment.sh

echo "✅ Scripts are now executable!"
echo ""
echo "To deploy your backend, run:"
echo "  ./deploy-cloud-run.sh"
echo ""
echo "To test after deployment, run:"
echo "  ./test-cloud-run-deployment.sh"
