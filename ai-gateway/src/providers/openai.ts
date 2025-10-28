import axios from "axios";
import type { ServerResponse } from "http";
import type { TChatRequest } from "../schema.js";

export async function openaiStream(req: TChatRequest, res: ServerResponse) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing OPENAI_API_KEY" }));
    return;
  }

  const model = req.model || process.env.MODEL_ID || "gpt-4o-mini";
  const timeout = Number(process.env.REQUEST_TIMEOUT_MS || 45000);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive"
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const stream = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        max_tokens: req.max_tokens ?? Number(process.env.MAX_TOKENS || 1024),
        temperature: req.temperature ?? Number(process.env.TEMPERATURE || 0.3),
        stream: true,
        messages: req.messages
      },
      {
        responseType: "stream",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        timeout
      }
    );

    stream.data.on("data", (chunk: Buffer) => {
      const lines = chunk.toString("utf8").split("\n").filter(Boolean);
      for (const line of lines) {
        if (line.startsWith("data:")) {
          res.write(`${line}\n\n`);
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
    if (!res.headersSent) res.writeHead(e?.response?.status || 500, { "Content-Type": "text/plain" });
    res.end(e?.response?.data || String(e));
    clearTimeout(timer);
  }
}
