import axios from "axios";
import type { ServerResponse } from "http";
import type { TChatRequest } from "../schema.js";

export async function ollamaStream(req: TChatRequest, res: ServerResponse) {
  const host = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
  const model = req.model || process.env.MODEL_ID || "llama3.1:8b";

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive"
  });

  try {
    const stream = await axios.post(`${host}/api/chat`, {
      model,
      stream: true,
      messages: req.messages
    }, { responseType: "stream" });

    stream.data.on("data", (chunk: Buffer) => {
      const lines = chunk.toString("utf8").split("\n").filter(Boolean);
      for (const line of lines) {
        res.write(`data: ${line}\n\n`);
      }
    });

    stream.data.on("end", () => {
      res.write(`data: [DONE]\n\n`);
      res.end();
    });

    stream.data.on("error", (err: unknown) => {
      res.write(`data: ${JSON.stringify({ error: String(err) })}\n\n`);
      res.end();
    });
  } catch (e: any) {
    if (!res.headersSent) res.writeHead(e?.response?.status || 500, { "Content-Type": "text/plain" });
    res.end(e?.response?.data || String(e));
  }
}
