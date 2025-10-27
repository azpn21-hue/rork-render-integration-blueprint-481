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

export default app;
