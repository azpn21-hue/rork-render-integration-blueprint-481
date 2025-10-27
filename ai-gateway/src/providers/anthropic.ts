import axios from "axios";
import type { Response } from "express";
import type { TChatRequest } from "../schema.js";

const API = "https://api.anthropic.com/v1/messages";

export async function anthropicStream(req: TChatRequest, res: Response) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing ANTHROPIC_API_KEY" });
    return;
  }

  const model = req.model || process.env.MODEL_ID || "claude-3-5-sonnet-20241022";
  const timeout = Number(process.env.REQUEST_TIMEOUT_MS || 45000);

  const messages = req.messages.map(m => ({ role: m.role, content: m.content }));

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive"
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const stream = await axios.post(API, {
      model,
      max_tokens: req.max_tokens ?? Number(process.env.MAX_TOKENS || 1024),
      temperature: req.temperature ?? Number(process.env.TEMPERATURE || 0.3),
      messages,
      stream: true
    }, {
      responseType: "stream",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      timeout
    });

    stream.data.on("data", (chunk: Buffer) => {
      const lines = chunk.toString("utf8").split("\n").filter(Boolean);
      for (const line of lines) {
        if (line.startsWith("data:")) {
          const payload = line.slice(5).trim();
          res.write(`data: ${payload}\n\n`);
        }
      }
    });

    stream.data.on("end", () => {
      res.write(`data: [DONE]\n\n`);
      res.end();
      clearTimeout(timer);
    });

    stream.data.on("error", (err: unknown) => {
      res.write(`data: ${JSON.stringify({ error: String(err) })}\n\n`);
      res.end();
      clearTimeout(timer);
    });
  } catch (e: any) {
    res.status(e?.response?.status || 500).end(e?.response?.data || String(e));
    clearTimeout(timer);
  }
}

export async function invokeAnthropic(prompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");

  const model = process.env.MODEL_ID || "claude-3-5-sonnet-20241022";

  const response = await axios.post(
    API,
    {
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: Number(process.env.MAX_TOKENS || 1024),
      temperature: Number(process.env.TEMPERATURE || 0.3),
      stream: false,
    },
    {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
    }
  );

  const content = response.data?.content?.[0]?.text;
  if (typeof content !== "string") {
    throw new Error("Unexpected Anthropic response shape");
  }
  return content;
}
