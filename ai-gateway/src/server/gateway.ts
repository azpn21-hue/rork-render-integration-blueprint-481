import express, { Request, Response } from "express";
import cors from "cors";
import { ChatRequest, type TChatRequest } from "../schema.js";
import { anthropicStream } from "../providers/anthropic.js";
import { openaiStream } from "../providers/openai.js";
import { ollamaStream } from "../providers/ollama.js";
import { EthicsEngine } from "../core/ethics.js";
import { ForesightModule } from "../core/foresight.js";
import { handleAIRequest } from "../core/learning.js";
import { SelfEducation } from "../core/selfEducation.js";

export const startGateway = () => {
  const app = express();
  const port = process.env.PORT || 9000;

  app.use(express.json({ limit: "2mb" }));
  app.use(cors({ origin: process.env.CORS_ALLOW_ORIGIN || "*" }));

  const ethics = new EthicsEngine();
  const foresight = new ForesightModule();
  const se = new SelfEducation();

  app.post("/memory/update", async (req: Request, res: Response) => {
    try {
      const entry = req.body ?? {};
      const fs = await import("node:fs");
      const path = await import("node:path");
      const memoryPath = path.resolve("./memory.json");
      const exists = fs.existsSync(memoryPath);
      const current = exists ? JSON.parse(fs.readFileSync(memoryPath, "utf8")) : [];
      current.push({ ...entry, timestamp: Date.now() });
      fs.writeFileSync(memoryPath, JSON.stringify(current, null, 2));
      res.status(200).json({ success: true, count: current.length });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message || String(e) });
    }
  });

  app.get("/healthz", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      provider: process.env.AI_PROVIDER || "unset",
      model: process.env.MODEL_ID || "unset",
      ethics: ethics.status(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/introspect", async (_req: Request, res: Response) => {
    try {
      const reflections = await se.periodicReflection();
      const stats = se.stats();
      res.status(200).json({ reflections, stats });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || String(e) });
    }
  });

  app.get("/reflections", (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit ?? 50);
      const offset = Number(req.query.offset ?? 0);
      const entries = se.list({ limit: Number.isFinite(limit) ? limit : 50, offset: Number.isFinite(offset) ? offset : 0 });
      const stats = se.stats();
      res.status(200).json({ entries, limit, offset, total: stats.total });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || String(e) });
    }
  });

  app.get("/foresight/logs", (_req: Request, res: Response) => {
    try {
      const entries = se.list({ limit: 1000, offset: 0 });
      res.status(200).json({ entries });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || String(e) });
    }
  });

  app.post("/v1/chat", async (req: Request, res: Response) => {
    const parsed = ChatRequest.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const data: TChatRequest = parsed.data;
    const provider = (process.env.AI_PROVIDER || "anthropic").toLowerCase();

    try {
      if (provider === "anthropic") return anthropicStream(data, res);
      if (provider === "openai") return openaiStream(data, res);
      if (provider === "ollama") return ollamaStream(data, res);
      return res.status(400).json({ error: `Unsupported AI_PROVIDER: ${provider}` });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || String(e) });
    }
  });

  app.post("/inference", async (req: Request, res: Response) => {
    try {
      const output = await handleAIRequest(req.body, ethics, foresight);
      res.status(200).json({ response: output });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  app.listen(port, () => {
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
