#!/bin/bash
set -e

echo "🚀 R3AL Optima II AI Gateway Auto-Repair Utility"
echo "------------------------------------------------"

# 0️⃣ Project root sanity
if [ ! -d "ai-gateway/src" ]; then
  echo "❌ ai-gateway/src not found. Run from project root.";
  exit 1;
fi

# 1️⃣ Fix tsconfig.json path issue
echo "🧩 Fixing tsconfig.json configuration..."
cd ai-gateway/src || { echo "❌ Cannot cd into ai-gateway/src"; exit 1; }

cat <<'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["./"],
  "exclude": ["node_modules", "dist"]
}
EOF

echo "✅ tsconfig.json rewritten successfully."

# 2️⃣ Ensure dependencies installed
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Basic dep check for common culprits
echo "🔍 Verifying critical dependencies..."
node -e "try{console.log('express:',!!require('express'));console.log('cors:',!!require('cors'));}catch(e){console.error('Dependency missing:',e?.message||String(e));process.exit(1)}"

echo "✅ Dependencies installed."

# 3️⃣ Type-check & build
echo "🧠 Running type check..."
npx tsc --noEmit

echo "✅ Type check passed."

echo "🏗️ Building TypeScript project..."
if npm run build; then
  echo "✅ Build complete."
else
  echo "❌ Build failed. Aborting."; exit 1;
fi

# 4️⃣ Local smoke test
echo "🔥 Running local smoke test..."
node dist/index.js &
SERVER_PID=$!
sleep 3

if curl -fsSL http://localhost:9000/healthz >/dev/null; then
  echo "✅ Health check passed — Gateway running clean."
else
  echo "❌ Health check failed. Inspect dist/index.js output.";
  kill $SERVER_PID >/dev/null 2>&1 || true
  exit 1
fi

kill $SERVER_PID >/dev/null 2>&1 || true

echo "🧹 Local test stopped."

# 5️⃣ Render deploy confirmation (auto-set URL if missing)
echo "🌐 Render deploy check..."
cd ../.. # back to project root
if [ -z "$RENDER_URL" ]; then
  # Try to infer from render.yaml or known convention
  if [ -f "render.yaml" ] && grep -q "name: optima-ai-gateway" render.yaml; then
    export RENDER_URL="https://optima-ai-gateway.onrender.com"
  else
    export RENDER_URL="https://optima-ai-gateway.onrender.com"
  fi
  echo "ℹ️  RENDER_URL not set. Defaulting to $RENDER_URL"
fi

if curl -fsSL "${RENDER_URL}/healthz" >/dev/null; then
  echo "✅ Remote Render health check passed for ${RENDER_URL}"
else
  echo "⚠️ Remote Render health check failed or service not live yet: ${RENDER_URL}"
fi

echo "------------------------------------------------"
echo "🎯 R3AL Gateway Diagnostic Complete"