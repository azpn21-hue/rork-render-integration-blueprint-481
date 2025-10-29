import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse as parseUrl } from "url";
import { ChatRequest, type TChatRequest } from "../schema.js";
import { anthropicStream } from "../providers/anthropic.js";
import { openaiStream } from "../providers/openai.js";
import { ollamaStream } from "../providers/ollama.js";
import { EthicsEngine } from "../core/ethics.js";
import { ForesightModule } from "../core/foresight.js";
import { handleAIRequest } from "../core/learning.js";
import { SelfEducation } from "../core/selfEducation.js";
import { evaluateTruthScore } from "../core/truthScoringEngine.js";

function setCors(res: ServerResponse) {
  const allowOrigin = process.env.CORS_ALLOW_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
}

async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer | string) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try {
        const text = Buffer.concat(chunks).toString("utf8");
        resolve(text ? JSON.parse(text) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, code: number, data: unknown) {
  if (!res.headersSent) {
    res.writeHead(code, { "Content-Type": "application/json" });
  }
  res.end(JSON.stringify(data));
}

export const startGateway = () => {
  const port = Number(process.env.PORT || 9000);

  const ethics = new EthicsEngine();
  const foresight = new ForesightModule();
  const se = new SelfEducation();

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      setCors(res);
      const { pathname, query } = parseUrl(req.url || "", true);

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
      }

      if (req.method === "GET" && pathname === "/healthz") {
        return sendJson(res, 200, {
          status: "ok",
          provider: process.env.AI_PROVIDER || "unset",
          model: process.env.MODEL_ID || "unset",
          ethics: ethics.status(),
          timestamp: new Date().toISOString(),
        });
      }

      if (req.method === "POST" && pathname === "/memory/update") {
        try {
          const body = await parseBody(req);
          const fs = await import("node:fs");
          const path = await import("node:path");
          const memoryPath = path.resolve("./memory.json");
          const exists = fs.existsSync(memoryPath);
          const current = exists ? JSON.parse(fs.readFileSync(memoryPath, "utf8")) : [];
          current.push({ ...(body ?? {}), timestamp: Date.now() });
          fs.writeFileSync(memoryPath, JSON.stringify(current, null, 2));
          return sendJson(res, 200, { success: true, count: current.length });
        } catch (e: any) {
          return sendJson(res, 500, { success: false, error: e?.message || String(e) });
        }
      }

      if (req.method === "GET" && pathname === "/introspect") {
        try {
          const reflections = await se.periodicReflection();
          const stats = se.stats();
          return sendJson(res, 200, { reflections, stats });
        } catch (e: any) {
          return sendJson(res, 500, { error: e?.message || String(e) });
        }
      }

      if (req.method === "GET" && pathname === "/reflections") {
        try {
          const limit = Number((query as any).limit ?? 50);
          const offset = Number((query as any).offset ?? 0);
          const entries = se.list({
            limit: Number.isFinite(limit) ? limit : 50,
            offset: Number.isFinite(offset) ? offset : 0,
          });
          const stats = se.stats();
          return sendJson(res, 200, { entries, limit, offset, total: stats.total });
        } catch (e: any) {
          return sendJson(res, 500, { error: e?.message || String(e) });
        }
      }

      if (req.method === "GET" && pathname === "/foresight/logs") {
        try {
          const entries = se.list({ limit: 1000, offset: 0 });
          return sendJson(res, 200, { entries });
        } catch (e: any) {
          return sendJson(res, 500, { error: e?.message || String(e) });
        }
      }

      // HIVE endpoints
      if (req.method === "POST" && pathname === "/hive/feed") {
        try {
          const body = await parseBody(req);
          const fs = await import("node:fs");
          const path = await import("node:path");
          const hivePath = path.resolve("./hive.json");
          const hive = fs.existsSync(hivePath) ? JSON.parse(fs.readFileSync(hivePath, "utf8")) : [];
          hive.push({ ...(body ?? {}), timestamp: Date.now() });
          fs.writeFileSync(hivePath, JSON.stringify(hive, null, 2));
          return sendJson(res, 200, { ok: true, entries: hive.length });
        } catch (e: any) {
          return sendJson(res, 500, { ok: false, error: e?.message || String(e) });
        }
      }

      if (req.method === "GET" && pathname === "/hive/status") {
        try {
          const fs = await import("node:fs");
          const path = await import("node:path");
          const hivePath = path.resolve("./hive.json");
          if (!fs.existsSync(hivePath)) return sendJson(res, 200, { hiveHealth: "dormant", topActions: [], totalEntries: 0 });
          const data: Array<{ action?: string }> = JSON.parse(fs.readFileSync(hivePath, "utf8"));
          const activityByAction: Record<string, number> = {};
          for (const e of data) {
            if (!e?.action) continue;
            activityByAction[e.action] = (activityByAction[e.action] || 0) + 1;
          }
          const topActions = Object.entries(activityByAction).sort((a, b) => b[1] - a[1]).slice(0, 5);
          const hiveHealth = topActions.length ? "active" : "dormant";
          return sendJson(res, 200, { hiveHealth, topActions, totalEntries: data.length });
        } catch (e: any) {
          return sendJson(res, 500, { error: e?.message || String(e) });
        }
      }

      if (req.method === "POST" && pathname === "/hive/sync") {
        try {
          const fs = await import("node:fs");
          const path = await import("node:path");
          const hivePath = path.resolve("./hive.json");
          if (!fs.existsSync(hivePath)) return sendJson(res, 200, { synced: true, empty: true });
          const data: Array<{ action?: string }> = JSON.parse(fs.readFileSync(hivePath, "utf8"));
          const summary = { totalEntries: data.length };
          console.log("[HIVE SYNC]", summary);
          return sendJson(res, 200, { synced: true, ...summary });
        } catch (e: any) {
          return sendJson(res, 500, { synced: false, error: e?.message || String(e) });
        }
      }

      if (req.method === "POST" && pathname === "/rewards/evaluate") {
        try {
          const body = await parseBody(req);
          const userId = body?.userId;
          if (!userId || typeof userId !== "string") {
            return sendJson(res, 400, { success: false, error: "userId required" });
          }
          const result = evaluateTruthScore(userId);
          return sendJson(res, 200, { success: true, ...result });
        } catch (e: any) {
          return sendJson(res, 500, { success: false, error: e?.message || String(e) });
        }
      }

      if (req.method === "POST" && pathname === "/v1/chat") {
        const body = await parseBody(req);
        const parsed = ChatRequest.safeParse(body);
        if (!parsed.success) {
          return sendJson(res, 400, { error: parsed.error.flatten() });
        }
        const data: TChatRequest = parsed.data;
        const provider = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
        try {
          if (provider === "anthropic") return anthropicStream(data, res);
          if (provider === "openai") return openaiStream(data, res);
          if (provider === "ollama") return ollamaStream(data, res);
          return sendJson(res, 400, { error: `Unsupported AI_PROVIDER: ${provider}` });
        } catch (e: any) {
          return sendJson(res, 500, { error: e?.message || String(e) });
        }
      }

      if (req.method === "POST" && pathname === "/inference") {
        try {
          const body = await parseBody(req);
          const output = await handleAIRequest(body, ethics, foresight);
          return sendJson(res, 200, { response: output });
        } catch (e: any) {
          return sendJson(res, 500, { error: e?.message || String(e) });
        }
      }

      // -------------------------------------------------------
// 📤 Export Endpoints for Hive, TrustVault, and Circles
// -------------------------------------------------------
if (req.method === "GET" && pathname.startsWith("/export/")) {
  try {
    const auth = (query as any).auth;
    const AUTH_KEY = process.env.EXPORT_AUTH_KEY || "supersecretkey";
    if (auth !== AUTH_KEY) {
      return sendJson(res, 401, { error: "Unauthorized" });
    }

    const fs = await import("node:fs");
    const path = await import("node:path");

    const map = {
      "/export/hive": "./hive.json",
      "/export/trust": "./trustVault.json",
      "/export/circles": "./circleRegistry.json",
    };

    const filePath = map[pathname as keyof typeof map];
    if (!filePath) return sendJson(res, 404, { error: "Unknown export target" });

    const absPath = path.resolve(filePath);
    const exists = fs.existsSync(absPath);
    if (!exists) return sendJson(res, 200, { type: pathname, entries: [] });

    const content = JSON.parse(fs.readFileSync(absPath, "utf8"));
    const payload = {
      type: pathname.replace("/export/", ""),
      timestamp: new Date().toISOString(),
      entries: content,
    };

    res.setHeader("Content-Disposition", `attachment; filename=${pathname.replace("/export/", "")}-export.json`);
    return sendJson(res, 200, payload);
  } catch (e: any) {
    console.error("Export error:", e);
    return sendJson(res, 500, { error: e?.message || String(e) });
  }
}

      sendJson(res, 404, { error: "Not Found" });
    } catch (e: any) {
      try {
        sendJson(res, 500, { error: e?.message || String(e) });
      } catch {}
    }
  });

  server.listen(port, () => {
    console.log(`🧠 Optima II Gateway live on port ${port}`);
    console.log(`🤖 Provider: ${process.env.AI_PROVIDER || "anthropic"}`);
    console.log(`📡 Model: ${process.env.MODEL_ID || "default"}`);
  });

  const intervalMs = Number(process.env.SELF_EDUCATION_INTERVAL ?? 600000);
  setInterval(async () => {
    try {
      const reflection = await se.periodicReflection();
      console.log(reflection);
    } catch (e: any) {
      console.error("Self-education reflection error:", e?.message || String(e));
    }
  }, intervalMs);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    startGateway();
  } catch (e) {
    console.error("Gateway start failed:", e);
    process.exit(1);
  }
}

