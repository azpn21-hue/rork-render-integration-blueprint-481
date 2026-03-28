#!/usr/bin/env node
/* continuous watcher that pings services, logs status, and does a functional truth-score probe */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const cfg = {
  intervalMs: Number(process.env.HEALTH_INTERVAL_MS || 30000),
  timeoutMs: Number(process.env.HEALTH_TIMEOUT_MS || 10000),
  backend: (process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "http://localhost:10000").replace(/\/$/, ""),
  frontend: (process.env.EXPO_PUBLIC_FRONTEND_URL || "http://localhost:8080").replace(/\/$/, ""),
  gateway: (process.env.EXPO_PUBLIC_AI_BASE_URL || "http://localhost:9000").replace(/\/$/, ""),
};

async function fetchJSON(url, timeoutMs) {
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

async function pingAll() {
  const checks = [
    { name: "backend", url: cfg.backend + "/health", expect: (j) => j && (j.status === "healthy" || j.status === "ok") },
    { name: "frontend", url: cfg.frontend + "/", expect: () => true },
    { name: "gateway", url: cfg.gateway + "/healthz", expect: (j) => j && j.status === "ok" },
  ];
  const results = [];
  for (const c of checks) {
    const r = await fetchJSON(c.url, cfg.timeoutMs);
    const pass = r.ok && (typeof r.body === "object" ? c.expect(r.body) : c.expect({}));
    results.push({ name: c.name, pass, status: r.status, body: r.body });
  }
  return results;
}

async function functionalProbe() {
  const url = cfg.gateway + "/rewards/evaluate";
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), cfg.timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "healthbot" }),
      signal: ac.signal,
    });
    const json = await res.json().catch(() => ({}));
    const ok = res.ok && json && typeof json === "object";
    return { ok, status: res.status, body: json };
  } catch (e) {
    return { ok: false, status: 0, body: String(e?.message || e) };
  } finally {
    clearTimeout(id);
  }
}

(async () => {
  console.log("🩺 Health watcher started");
  while (true) {
    const started = new Date().toISOString();
    const results = await pingAll();
    const probe = await functionalProbe();
    const summary = {
      time: started,
      checks: results.map((r) => ({ name: r.name, pass: r.pass, status: r.status })),
      probe: { ok: probe.ok, status: probe.status },
    };
    const allOk = results.every((r) => r.pass) && probe.ok;
    if (allOk) console.log("✅", JSON.stringify(summary));
    else console.error("❌", JSON.stringify({ ...summary, details: { results, probe } }));
    await sleep(cfg.intervalMs);
  }
})();
