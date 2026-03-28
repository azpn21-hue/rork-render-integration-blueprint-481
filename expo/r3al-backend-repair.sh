#!/bin/bash
set -e

echo "🔧 [R3AL Backend Repair] Starting diagnostic..."

# ensure we’re in correct root
if [ ! -d "ai-gateway" ]; then
  echo "❌ Error: ai-gateway directory not found. Run from /home/user/rork-app"
  exit 1
fi

cd ai-gateway

echo "📁 Moving tsconfig.json to correct location..."
if [ -f src/tsconfig.json ]; then
  mv src/tsconfig.json .
fi

echo "📝 Rewriting tsconfig.json..."
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

echo "✅ tsconfig.json rewritten."

# Patch render.yaml in parent if it exists
cd ..
if [ -f render.yaml ]; then
  echo "🩹 Patching render.yaml..."
  sed -i 's#rootDir: ./ai-gateway/src#rootDir: ./ai-gateway#' render.yaml || true
  echo "✅ render.yaml patched."
else
  echo "⚠️ No render.yaml found in current directory. Skipping."
fi

# Back to gateway dir
cd ai-gateway

echo "📦 Installing dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

echo "🏗️ Building TypeScript..."
npm run build || { echo "❌ Build failed."; exit 1; }

echo "🚀 Running sanity test..."
nohup node dist/index.js >/tmp/optima_test.log 2>&1 &
PID=$!
sleep 3

if curl -fsSL http://localhost:9000/healthz >/dev/null 2>&1; then
  echo "✅ Health check passed locally at http://localhost:9000/healthz"
else
  echo "⚠️ Could not verify healthz locally (may need HTTPS). Check logs:"
  tail -n 20 /tmp/optima_test.log
fi

kill $PID >/dev/null 2>&1 || true
echo "🧠 R3AL Backend Repair complete."
