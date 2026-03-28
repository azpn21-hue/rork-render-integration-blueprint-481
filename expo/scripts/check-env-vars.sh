#!/bin/bash

echo "📋 Environment Variables Configuration Check"
echo "============================================"
echo ""

# Required environment variables for r3al-app
R3AL_REQUIRED_VARS=(
  "NODE_ENV"
  "PORT"
  "DATABASE_URL"
  "CLOUD_SQL_CONNECTION_NAME"
  "DB_USER"
  "DB_PASSWORD"
  "DB_NAME"
  "EXPO_PUBLIC_RORK_API_BASE_URL"
  "EXPO_PUBLIC_AI_BASE_URL"
)

# Required environment variables for optima-core
OPTIMA_REQUIRED_VARS=(
  "NODE_ENV"
  "PORT"
  "OPENAI_API_KEY"
  "ANTHROPIC_API_KEY"
)

echo "Checking r3al-app environment variables..."
echo "-----------------------------------------"
for var in "${R3AL_REQUIRED_VARS[@]}"; do
  VALUE=$(gcloud run services describe r3al-app --region=us-central1 --format="value(spec.template.spec.containers[0].env)" 2>/dev/null | grep "$var")
  if [ -n "$VALUE" ]; then
    echo "✅ $var: SET"
  else
    echo "❌ $var: MISSING"
  fi
done
echo ""

echo "Checking optima-core environment variables..."
echo "--------------------------------------------"
for var in "${OPTIMA_REQUIRED_VARS[@]}"; do
  VALUE=$(gcloud run services describe optima-core --region=us-central1 --format="value(spec.template.spec.containers[0].env)" 2>/dev/null | grep "$var")
  if [ -n "$VALUE" ]; then
    echo "✅ $var: SET"
  else
    echo "❌ $var: MISSING"
  fi
done
echo ""

echo "💡 To add missing environment variables:"
echo "gcloud run services update SERVICE_NAME --region=us-central1 --set-env-vars KEY=VALUE"
