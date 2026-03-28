#!/bin/bash
# Make all Cloud SQL scripts executable

chmod +x scripts/deploy-backend-with-db.sh
chmod +x scripts/setup-cloudsql-env.sh
chmod +x scripts/test-cloudsql-integration.sh

echo "✅ All Cloud SQL scripts are now executable"
echo ""
echo "Available commands:"
echo "  ./scripts/deploy-backend-with-db.sh      - Deploy backend with Cloud SQL"
echo "  ./scripts/setup-cloudsql-env.sh          - Configure environment variables"
echo "  ./scripts/test-cloudsql-integration.sh   - Test database integration"
