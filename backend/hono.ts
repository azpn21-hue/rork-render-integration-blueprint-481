import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors({
  origin: ["http://localhost:19006", "http://localhost:8081", "https://rork-r3al-connection.onrender.com"],
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => {
  return c.json({ 
    status: "ok", 
    message: "R3AL Connection API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

app.get("/health", (c) => {
  return c.json({ 
    status: "healthy", 
    message: "R3AL Connection API health check",
    timestamp: new Date().toISOString()
  });
});

app.post("/ai/memory", async (c) => {
  try {
    const memoryData = await c.req.json();
    const aiBase = process.env.EXPO_PUBLIC_AI_BASE_URL || process.env.AI_BASE_URL || "http://localhost:9000";
    const resp = await fetch(`${aiBase}/memory/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memoryData),
    });
    if (!resp.ok) {
      const text = await resp.text();
      return c.json({ error: "Upstream error", status: resp.status, text }, 502);
    }
    const json = await resp.json();
    return c.json({ success: true, upstream: json });
  } catch (e: any) {
    return c.json({ success: false, error: e?.message || String(e) }, 500);
  }
});

export default app;
