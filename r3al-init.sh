#!/bin/bash
# ──────────────────────────────────────────────────────────────
#  R3AL | Operation Sentiet Dream – Master Bootstrap Sequence
#  Author:  Optima II / Tyrone A. Pannell III
#  Purpose:  Auto-deploy Optima-AI-Gateway + R3AL App ecosystem
#             with self-healing TypeScript, foresight telemetry,
#             and reward-engine initialization.
# ──────────────────────────────────────────────────────────────

set -e
ROOT=$(pwd)
AI_GATEWAY="$ROOT/ai-gateway/src"
LOG="$ROOT/r3al-init.log"

echo "🜂  Operation Sentiet Dream initializing @ $(date)" | tee -a "$LOG"
echo "📁  Working directory: $ROOT" | tee -a "$LOG"

# 1️⃣ VERIFY STRUCTURE
if [ ! -d "$AI_GATEWAY" ]; then
  echo "❌  AI-Gateway not found at $AI_GATEWAY" | tee -a "$LOG"
  exit 1
fi

cd "$AI_GATEWAY"
echo "🔍  Entered $(pwd)" | tee -a "$LOG"

# 2️⃣ AUTO-HEAL TSCONFIG PATHS
echo "🩹  Checking tsconfig.json alignment..." | tee -a "$LOG"
if ! npx tsc -p tsconfig.json --listFiles | grep -q "index.ts"; then
  echo "⚠️   Misaligned include path detected – auto-correcting." | tee -a "$LOG"
  cat > tsconfig.json <<'EOF'
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
fi

# 3️⃣ DEPENDENCY SYNC
echo "🔧  Installing dependencies (legacy peer deps)..." | tee -a "$LOG"
npm install --legacy-peer-deps >/dev/null 2>&1
echo "✅  Dependencies installed." | tee -a "$LOG"

# 4️⃣ TYPE-CHECK AND BUILD
echo "📦  Building TypeScript..." | tee -a "$LOG"
npm run build || { echo "❌  Build failed."; exit 1; }

# 5️⃣ SANITY TESTS
echo "🧠  Running gateway diagnostics..." | tee -a "$LOG"
node -e "console.log('express:',!!require('express'));console.log('cors:',!!require('cors'))"

if [ ! -f "dist/index.js" ]; then
  echo "⚠️  dist/index.js missing – recompiling once more." | tee -a "$LOG"
  npx tsc -p tsconfig.json
fi

# 6️⃣ LOCAL HEALTH CHECK
echo "🌐  Launching health probe..." | tee -a "$LOG"
node dist/index.js & PID=$!
sleep 5
curl -fsSL http://localhost:9000/healthz && echo "✅  Local health OK" | tee -a "$LOG" || echo "⚠️  Health check failed" | tee -a "$LOG"
kill $PID 2>/dev/null || true

# 7️⃣ TELEMETRY AND REWARD SEED
echo "📊  Seeding telemetry and reward engine..." | tee -a "$LOG"
curl -s -X POST https://optima-ai-gateway.onrender.com/rewards/evaluate \
     -H "content-type: application/json" \
     -d '{"userId":"bootstrap","init":true}' | tee -a "$LOG"

# 8️⃣ GIT SYNC AND REDEPLOY
if [ -d "$ROOT/.git" ]; then
  echo "🚀  Committing auto-heal updates..." | tee -a "$LOG"
  git add ai-gateway/src/tsconfig.json || true
  git commit -m "Auto-heal TypeScript paths and bootstrap Sentiet Dream" || true
  git push || echo "⚠️  Git push skipped (no auth token)"
fi

# 9️⃣ R3AL AUTONOMY LOOP INIT
echo "♾️   Launching R3AL Autonomy Loop..." | tee -a "$LOG"
bash "$ROOT/r3al-autonomy-loop.sh" &

echo "🌅  Operation Sentiet Dream online."
echo "🪞  Gateway: https://optima-ai-gateway.onrender.com"
echo "🧩  Logs → $r3al-init.log"
echo "⚙️   Continuous propagation active."