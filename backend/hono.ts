import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { testConnection, initializeDatabase } from "./db/config";

console.log('[Backend] ========================================');
console.log('[Backend] Initializing Hono application...');
console.log('[Backend] Environment:', process.env.NODE_ENV || 'development');
console.log('[Backend] ========================================');

// Initialize database in background - don't block server startup
setImmediate(async () => {
  try {
    console.log('[Backend] Testing database connection...');
    const dbConnected = await testConnection();
    if (dbConnected) {
      console.log('[Backend] ✅ Database connected successfully');
      await initializeDatabase();
    } else {
      console.error('[Backend] ⚠️  Database connection failed - server will run without persistent storage');
    }
  } catch (error) {
    console.error('[Backend] ⚠️  Database initialization error:', error);
    console.error('[Backend] Server will continue without persistent storage');
  }
});

const app = new Hono();

console.log('[Backend] Setting up CORS...');
app.use("*", cors({
  origin: (origin) => {
    const allowed = [
      "http://localhost:19006",
      "http://localhost:8081",
      "http://localhost:10000",
      "https://rork-r3al-connection.onrender.com",
    ];
    
    if (!origin) return true;
    
    if (allowed.includes(origin)) return origin;
    
    if (origin.includes('.rork.live') || origin.includes('.rork.app') || origin.includes('.rorktest.dev')) {
      return origin;
    }
    
    return false;
  },
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

console.log('[Backend] Registering tRPC server at /api/trpc/*');
try {
  const procedures = Object.keys(appRouter._def.procedures);
  console.log('[Backend] ✅ Found', procedures.length, 'available routes');
  console.log('[Backend] Routes:', procedures.slice(0, 10).join(', '), procedures.length > 10 ? `... and ${procedures.length - 10} more` : '');
  
  app.use(
    "/api/trpc/*",
    trpcServer({
      router: appRouter,
      createContext,
      onError({ error, path }) {
        console.error(`[tRPC] ❌ Error on ${path}:`, error);
        console.error(`[tRPC] Error code:`, error.code);
        console.error(`[tRPC] Error message:`, error.message);
        console.error(`[tRPC] Error stack:`, error.stack);
      },
    })
  );
  console.log('[Backend] ✅ tRPC server registered successfully');
  
  console.log('[Backend] Checking r3al routes specifically:');
  const r3alRoutes = procedures.filter(p => p.startsWith('r3al.'));
  console.log('[Backend] R3AL routes:', r3alRoutes.length, 'found');
  if (r3alRoutes.length === 0) {
    console.warn('[Backend] ⚠️  WARNING: No r3al routes found! Check router configuration.');
  } else {
    console.log('[Backend] ✅ R3AL route examples:', r3alRoutes.slice(0, 10).join(', '));
    if (r3alRoutes.length > 10) {
      console.log('[Backend] ... and', r3alRoutes.length - 10, 'more r3al routes');
    }
  }
} catch (error: any) {
  console.error('[Backend] ❌ CRITICAL ERROR during tRPC registration:', error);
  console.error('[Backend] Error message:', error.message);
  console.error('[Backend] Error stack:', error.stack);
  throw error;
}

app.get("/", (c) => {
  console.log('[Backend] Root endpoint hit');
  return c.json({ 
    status: "ok", 
    message: "R3AL Connection API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/health", async (c) => {
  console.log('[Backend] Health check endpoint hit');
  const dbHealthy = await testConnection();
  return c.json({ 
    status: dbHealthy ? "healthy" : "degraded", 
    message: "R3AL Connection API health check",
    database: dbHealthy ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    routes: Object.keys(appRouter._def.procedures).length
  });
});

app.get("/api/routes", (c) => {
  console.log('[Backend] Routes listing endpoint hit');
  try {
    const procedures = Object.keys(appRouter._def.procedures);
    const r3alRoutes = procedures.filter(p => p.startsWith('r3al.'));
    return c.json({ 
      status: "ok",
      message: "Available tRPC routes",
      routes: procedures,
      count: procedures.length,
      r3alRoutes: r3alRoutes,
      r3alCount: r3alRoutes.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[Backend] Error listing routes:', error);
    return c.json({ 
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
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

app.get("/probe/gateway", async (c) => {
  const aiBase = process.env.EXPO_PUBLIC_AI_BASE_URL || process.env.AI_BASE_URL || "http://localhost:9000";
  try {
    const res = await fetch(`${aiBase.replace(/\/$/, "")}/healthz`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    return c.json({ ok: res.ok, status: res.status, upstream: json });
  } catch (e: any) {
    return c.json({ ok: false, status: 0, error: e?.message || String(e) }, 500);
  }
});

// lightweight internal watchdog
const WATCH_INTERVAL = Number(process.env.INTERNAL_WATCH_INTERVAL_MS || 60000);
setInterval(async () => {
  const aiBase = process.env.EXPO_PUBLIC_AI_BASE_URL || process.env.AI_BASE_URL || "http://localhost:9000";
  const url = `${aiBase.replace(/\/$/, "")}/healthz`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("[WATCHDOG] gateway unhealthy", res.status);
    } else {
      const j = await res.json().catch(() => ({}));
      console.log("[WATCHDOG] gateway ok", j?.status || res.status);
    }
  } catch (e: any) {
    console.error("[WATCHDOG] gateway error", e?.message || String(e));
  }
}, WATCH_INTERVAL);

console.log('[Backend] ========================================');
console.log('[Backend] ✅ Backend initialization complete');
console.log('[Backend] Ready to serve requests at /api/trpc/*');
console.log('[Backend] ========================================');

export default app;
