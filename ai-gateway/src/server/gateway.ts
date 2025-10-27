import express, { Request, Response } from "express";
import cors from "cors";
import { ChatRequest, type TChatRequest } from "../schema.js";
import { anthropicStream } from "../providers/anthropic.js";
import { openaiStream } from "../providers/openai.js";
import { ollamaStream } from "../providers/ollama.js";
import { EthicsEngine } from "../core/ethics.js";
import { ForesightModule } from "../core/foresight.js";
import { handleAIRequest } from "../core/learning.js";

export const startGateway = () => {
  const app = express();
  const port = process.env.PORT || 9000;

  app.use(express.json({ limit: "2mb" }));
  app.use(cors({ origin: process.env.CORS_ALLOW_ORIGIN || "*" }));

  const ethics = new EthicsEngine();
  const foresight = new ForesightModule();

  app.get("/healthz", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      provider: process.env.AI_PROVIDER || "unset",
      model: process.env.MODEL_ID || "unset",
      ethics: ethics.status(),
      timestamp: new Date().toISOString(),
    });
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
};
