import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export type DependencyStatus = {
  name: string;
  ok: boolean;
  message?: string;
};

const RUNTIME_DEPS = ["express", "axios", "zod", "cors"] as const;
const DEV_DEPS = ["@types/express", "@types/cors"] as const;

function tryResolve(name: string): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

export async function checkDependencies(): Promise<{ runtime: DependencyStatus[]; dev: DependencyStatus[]; hasMissingCritical: boolean }> {
  const runtime: DependencyStatus[] = RUNTIME_DEPS.map((name) => ({
    name,
    ok: tryResolve(name),
  }));

  const dev: DependencyStatus[] = DEV_DEPS.map((name) => ({
    name,
    ok: tryResolve(name),
  }));

  const missingRuntime = runtime.filter((d) => !d.ok);
  const missingDev = dev.filter((d) => !d.ok);

  if (missingRuntime.length === 0 && missingDev.length === 0) {
    console.log("[deps] All dependencies present ✔");
  } else {
    if (missingRuntime.length > 0) {
      console.error(
        "[deps] Missing runtime packages:",
        missingRuntime.map((d) => d.name).join(", ") || "none"
      );
      console.error("[deps] Install with: npm install --legacy-peer-deps " + missingRuntime.map((d) => d.name).join(" "));
    }
    if (missingDev.length > 0) {
      console.warn(
        "[deps] Missing dev type packages (not critical at runtime):",
        missingDev.map((d) => d.name).join(", ") || "none"
      );
      console.warn("[deps] Add with: npm i -D " + missingDev.map((d) => d.name).join(" "));
    }
  }

  return { runtime, dev, hasMissingCritical: missingRuntime.length > 0 };
}
