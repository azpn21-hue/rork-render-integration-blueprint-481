#!/bin/bash

# R3AL Connection - Quick Start Script
# This script helps you get started testing your deployed backend

set -e

BACKEND_URL="https://optima-core-712497593637.us-central1.run.app"
PROJECT_ID="civic-origin-476705-j8"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║      🚀 R3AL Connection - Quick Start                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if backend is responding
echo "📡 Checking backend status..."
if curl -s --fail "${BACKEND_URL}/health" > /dev/null; then
    echo "✅ Backend is UP and responding!"
else
    echo "❌ Backend is not responding. Please check Cloud Run logs."
    exit 1
fi

echo ""
echo "What would you like to do?"
echo ""
echo "  1) Test backend health (quick)"
echo "  2) Run comprehensive backend tests"
echo "  3) View Cloud Run logs (live)"
echo "  4) View recent error logs"
echo "  5) Check available API routes"
echo "  6) Start frontend app"
echo "  7) Deploy backend updates"
echo "  8) Setup Cloud SQL database"
echo "  9) Exit"
echo ""
read -p "Enter your choice (1-9): " choice

case $choice in
    1)
        echo ""
        echo "🧪 Testing backend health..."
        echo ""
        curl -s "${BACKEND_URL}/health" | jq '.'
        echo ""
        echo "✅ Health check complete!"
        ;;
    2)
        echo ""
        echo "🧪 Running comprehensive tests..."
        echo ""
        node scripts/test-cloud-backend.js
        ;;
    3)
        echo ""
        echo "📊 Streaming live logs (Ctrl+C to stop)..."
        echo ""
        gcloud logging tail \
            "resource.type=cloud_run_revision AND resource.labels.service_name=optima-core" \
            --project="${PROJECT_ID}"
        ;;
    4)
        echo ""
        echo "❌ Recent error logs..."
        echo ""
        gcloud logging read \
            "resource.type=cloud_run_revision AND resource.labels.service_name=optima-core AND severity>=ERROR" \
            --project="${PROJECT_ID}" \
            --limit=20 \
            --format="table(timestamp,severity,textPayload)"
        ;;
    5)
        echo ""
        echo "🔍 Available API routes..."
        echo ""
        curl -s "${BACKEND_URL}/api/routes" | jq '.routes'
        ;;
    6)
        echo ""
        echo "🎨 Starting frontend app..."
        echo ""
        bunx rork start
        ;;
    7)
        echo ""
        echo "🚀 Deploying backend updates..."
        echo ""
        cd backend
        echo "Building Docker image..."
        gcloud builds submit --tag gcr.io/${PROJECT_ID}/optima-core-backend .
        echo ""
        echo "Deploying to Cloud Run..."
        gcloud run deploy optima-core \
            --image gcr.io/${PROJECT_ID}/optima-core-backend \
            --region us-central1 \
            --project=${PROJECT_ID}
        echo ""
        echo "✅ Deployment complete!"
        cd ..
        ;;
    8)
        echo ""
        echo "🗄️  Setting up Cloud SQL..."
        echo ""
        echo "This will create a PostgreSQL instance for your app."
        read -p "Enter database root password: " -s db_password
        echo ""
        echo ""
        echo "Creating Cloud SQL instance (this takes 5-10 minutes)..."
        gcloud sql instances create r3al-db \
            --database-version=POSTGRES_15 \
            --tier=db-f1-micro \
            --region=us-central1 \
            --root-password="${db_password}" \
            --project=${PROJECT_ID}
        echo ""
        echo "Creating application database..."
        gcloud sql databases create r3al_production \
            --instance=r3al-db \
            --project=${PROJECT_ID}
        echo ""
        echo "✅ Cloud SQL setup complete!"
        echo ""
        echo "Connection name:"
        gcloud sql instances describe r3al-db \
            --format='value(connectionName)' \
            --project=${PROJECT_ID}
        ;;
    9)
        echo ""
        echo "👋 Goodbye!"
        echo ""
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        echo ""
        exit 1
        ;;
esac

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║      ✅ Task Complete!                                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 For more information, see:"
echo "   - CURRENT_STATUS_AND_NEXT_STEPS.md"
echo "   - BACKEND_DEPLOYED_GUIDE.md"
echo "   - QUICK_COMMANDS.md"
echo ""
