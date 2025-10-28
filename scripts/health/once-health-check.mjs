#!/usr/bin/env node
/* continuous one-off health check for backend, frontend, and gateway */
const targets = [
  {
    name: "backend",
    url: process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "http://localhost:10000",
    path: "/health",
    expect: (json) => json && (json.status === "healthy" || json.status === "ok"),
  },
  {
    name: "frontend",
    url: process.env.EXPO_PUBLIC_FRONTEND_URL || "http://localhost:8080",
    path: "/",
    expect: () => true,
  },
  {
    name: "gateway",
    url: process.env.EXPO_PUBLIC_AI_BASE_URL || "http://localhost:9000",
    path: "/healthz",
    expect: (json) => json && json.status === "ok",
  },
];

const timeoutMs = Number(process.env.HEALTH_TIMEOUT_MS || 10000);

async function fetchJson(url) {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ac.signal });
    const ct = res.headers.get("content-type") || "";
    let body = null;
    if (ct.includes("application/json")) body = await res.json();
    else body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    return { ok: false, status: 0, body: String(e?.message || e) };
  } finally {
    clearTimeout(id);
  }
}

(async () => {
  let allOk = true;
  for (const t of targets) {
    const url = t.url.replace(/\/$/, "") + t.path;
    console.log(`[PING] ${t.name} -> ${url}`);
    const { ok, status, body } = await fetchJson(url);
    if (!ok) {
      allOk = false;
      console.error(`❌ ${t.name} offline status=${status} body=${typeof body === "string" ? body : JSON.stringify(body)}`);
      continue;
    }
    const passed = typeof body === "object" ? t.expect(body) : t.expect({});
    if (passed) console.log(`✅ ${t.name} healthy (${status})`);
    else {
      allOk = false;
      console.error(`⚠️ ${t.name} responded but did not meet expectations (${status}) -> ${typeof body === "string" ? body : JSON.stringify(body)}`);
    }
  }
  if (!allOk) process.exit(1);
})();
