#!/bin/bash

echo "🚀 Running R3AL Psych-Eval Questionnaire Patch..."
echo ""

cd "$(dirname "$0")/.."

node scripts/r3al-questionnaire-psycheval-patch.js

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Patch completed successfully!"
  echo ""
  echo "📋 Review the updated schemas:"
  echo "   • schemas/r3al/questionnaire_schema.json"
  echo "   • schemas/r3al/truthscore_schema.json"
  echo "   • schemas/r3al/app_schema.json"
  echo "   • schemas/r3al/locale_tokens.json"
  echo ""
else
  echo ""
  echo "❌ Patch failed. Check the error messages above."
  exit 1
fi
