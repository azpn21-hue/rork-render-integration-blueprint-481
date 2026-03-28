#!/bin/bash
set -e
echo "🧠 [R3AL Backend Enhancement Suite] Initiating Operation Sentient Dream..."

if [ ! -d "ai-gateway" ]; then
  echo "❌ Missing ai-gateway directory."
  exit 1
fi

cd ai-gateway

echo "🩹 Aligning tsconfig.json..."
mv src/tsconfig.json . 2>/dev/null || true
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

echo "🔧 Ensuring package.json integrity..."
cat > package.json <<'EOF'
{
  "name": "optima-ai-gateway",
  "version": "2.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "dependencies": {
    "axios": "^1.7.7",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.7",
    "tsx": "^4.19.2",
    "typescript": "^5.4.5"
  }
}
EOF

mkdir -p src/core src/middleware src/server src/providers

cat > src/core/rewards.ts <<'EOF'
export type RewardInput = {
  honestyScore?: number;
  consistency?: number;
  verifications?: number;
};

export type RewardResult = { trustScore: number; tier: string };

export function evaluateTruthIndex(user: RewardInput): RewardResult {
  const honesty = user?.honestyScore ?? 0;
  const consistency = user?.consistency ?? 0;
  const verified = user?.verifications ?? 0;
  const trustScore = Math.round(honesty * 0.5 + consistency * 0.3 + verified * 0.2);
  const tier =
    trustScore >= 90
      ? "Truth Icon"
      : trustScore >= 75
      ? "R3AL Mentor"
      : trustScore >= 60
      ? "Fully R3AL"
      : trustScore >= 40
      ? "Intent Declared"
      : "Open Profile";
  return { trustScore, tier };
}
EOF

cat > src/core/logs.ts <<'EOF'
import fs from "fs";

export type LogPayload = Record<string, unknown>;

export function logEvent(type: string, data: LogPayload): void {
  const path = "./analytics.log";
  const entry = { type, ...data, time: new Date().toISOString() } as Record<string, unknown>;
  try {
    fs.appendFileSync(path, JSON.stringify(entry) + "\n");
  } catch (err) {
    console.error("Failed to write log", err);
  }
}
EOF

cat > src/middleware/security.ts <<'EOF'
import { Request, Response, NextFunction } from "express";

export function secureHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
}
EOF

cat > src/server/gateway.ts <<'EOF'
import express, { Request, Response } from "express";
import cors from "cors";
import { evaluateTruthIndex, RewardInput } from "../core/rewards";
import { logEvent } from "../core/logs";
import { secureHeaders } from "../middleware/security";

const app = express();
app.use(express.json());
app.use(cors());
app.use(secureHeaders);

app.get("/healthz", (_: Request, res: Response) => res.json({ status: "ok", service: "Optima-II-Gateway" }));

app.post("/rewards/evaluate", (req: Request<unknown, unknown, RewardInput>, res: Response) => {
  const result = evaluateTruthIndex(req.body);
  logEvent("reward_evaluated", { result });
  res.json(result);
});

app.post("/analytics/report", (req: Request, res: Response) => {
  logEvent("analytics", req.body as Record<string, unknown>);
  res.json({ ok: true });
});

export default app;
EOF

cat > src/index.ts <<'EOF'
import app from "./server/gateway";
const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`🧠 Optima II Gateway live on port ${port}`));
EOF

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️ Building..."
npm run build

echo "🚀 Testing /healthz locally..."
node dist/index.js &
PID=$!
sleep 3
if ! curl -fsSL http://localhost:9000/healthz >/dev/null; then
  echo "⚠️ Health check failed locally."
fi
kill $PID >/dev/null 2>&1 || true

echo "✅ Enhancement complete. Commit and push to redeploy Render."