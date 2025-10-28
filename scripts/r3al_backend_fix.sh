#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."/ai-gateway/src

cat > package.json <<'EOF'
{
  "name": "optima-ai-gateway",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server/gateway.js",
    "dev": "tsx watch index.ts"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "axios": "^1.7.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.12.7",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "typescript": "^5.4.5",
    "tsx": "^4.19.2"
  }
}
EOF

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

npm install --legacy-peer-deps
npm run build

node dist/server/gateway.js &
PID=$!
trap 'kill $PID >/dev/null 2>&1 || true' EXIT
sleep 2
curl -fsSL http://localhost:9000/healthz | tee /dev/stderr
kill $PID
trap - EXIT

echo "✅ Optima AI Gateway rebuilt and health-checked."
