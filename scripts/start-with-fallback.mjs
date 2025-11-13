#!/usr/bin/env node
import { spawn } from "node:child_process";

const userArgs = process.argv.slice(2);
const expoArgs = ["expo", "start", "--clear", ...userArgs];
const shouldUseShell = process.platform === "win32";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: shouldUseShell });
    child.on("error", (error) => {
      reject(error);
    });
    child.on("exit", (code, signal) => {
      resolve({ code, signal });
    });
  });
}

async function start() {
  try {
    const bunResult = await run("bunx", expoArgs);
    if (bunResult.code === 0) {
      return;
    }
    if (bunResult.code !== null) {
      console.warn("bunx exited with code", bunResult.code, "falling back to npx expo start");
    }
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code !== "ENOENT") {
      console.warn("bunx failed", error.message);
    }
  }

  try {
    const npxResult = await run("npx", expoArgs);
    if (npxResult.code !== 0) {
      process.exit(npxResult.code ?? 1);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to start Expo using npx", error.message);
    } else {
      console.error("Failed to start Expo using npx");
    }
    process.exit(1);
  }
}

start().catch((error) => {
  if (error instanceof Error) {
    console.error("Unexpected error while starting Expo", error.message);
  } else {
    console.error("Unexpected error while starting Expo");
  }
  process.exit(1);
});
