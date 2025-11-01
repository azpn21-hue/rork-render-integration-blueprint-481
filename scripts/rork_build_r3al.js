/**
 * R3AL automatic setup script for the RORK kernel.
 * ------------------------------------------------
 * This script:
 *  1. Creates the R3AL app directory structure.
 *  2. Generates manifest.json and theme/ui_tokens.json.
 *  3. Writes placeholder legal files and brand notes.
 *  4. Registers the app in the RORK kernel registry.
 */

import fs from "fs";
import path from "path";
const root = path.resolve(process.cwd(), "schemas/r3al");

function mkdir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
function write(file, content) {
  fs.writeFileSync(file, content.trimStart() + "\n");
}
function log(msg) {
  console.log(`[RORK] ${msg}`);
}

// ──────────────────────────────────────────────────────────────
// 1️⃣  Folder tree
mkdir(root);
mkdir(`${root}/assets`);
mkdir(`${root}/theme`);
mkdir(`${root}/legal`);
mkdir(`${root}/docs`);

log("Created base R3AL directory tree.");

// ──────────────────────────────────────────────────────────────
// 2️⃣  Manifest
const manifest = {
  app: "R3AL",
  version: "1.0.0",
  engine: "rork",
  description:
    "R3AL front-end identity layer built on the RORK kernel. Reveal • Relate • Respect.",
  theme: "./theme/ui_tokens.json",
  assets: {
    logo: "./assets/logo.svg",
    animations: {
      intro: "./assets/intro_anim.mp4",
      verify: "./assets/verify_anim.mp4",
    },
    audio: {
      pulse: "./assets/pulse_60bpm.mp3",
      verifyPulse: "./assets/verify_pulse.mp3",
    },
  },
  legal: {
    privacy: "./legal/privacy_policy.md",
    eula: "./legal/user_agreement.md",
    nda: "./legal/nda_consent.md",
  },
  scripts: {
    onStart: "playAudio('pulse')",
    onVerify: "playAudio('verifyPulse'); triggerAnimation('verify');",
  },
};

if (fs.existsSync(`${root}/manifest.json`)) {
  log("Manifest already exists, skipping creation.");
} else {
  write(`${root}/manifest.json`, JSON.stringify(manifest, null, 2));
  log("Manifest written.");
}

// ──────────────────────────────────────────────────────────────
// 3️⃣  Theme tokens
const uiTokens = {
  primary: "#D4AF37",
  background: "#0A0A0A",
  accent: "#FFC857",
  fontFamily: "Orbitron",
  pulseBPM: 60,
  animationSpeed: "1x",
};

if (fs.existsSync(`${root}/theme/ui_tokens.json`)) {
  log("Theme tokens already exist, skipping creation.");
} else {
  write(`${root}/theme/ui_tokens.json`, JSON.stringify(uiTokens, null, 2));
  log("Theme tokens created.");
}

// ──────────────────────────────────────────────────────────────
// 4️⃣  Legal stubs
if (!fs.existsSync(`${root}/legal/privacy_policy.md`)) {
  write(
    `${root}/legal/privacy_policy.md`,
    `# Privacy Policy
This application operates under the Privacy Act of 1974 (5 U.S.C. §552a) and
complies with GDPR and CCPA. Data processed through R3AL is encrypted and
stored in accordance with DoD 5400.11-R guidelines.`
  );
}

if (!fs.existsSync(`${root}/legal/user_agreement.md`)) {
  write(
    `${root}/legal/user_agreement.md`,
    `# End-User License Agreement
By continuing, you acknowledge and consent to processing under the Privacy Act of 1974.
All data interactions follow the R3AL doctrine: Reveal • Relate • Respect.`
  );
}

if (!fs.existsSync(`${root}/legal/nda_consent.md`)) {
  write(
    `${root}/legal/nda_consent.md`,
    `# Non-Disclosure Agreement
By using R3AL you agree not to share proprietary assets or algorithms contained within
the RORK kernel. Digital signature recorded at login.`
  );
}

log("Legal documents generated.");

// ──────────────────────────────────────────────────────────────
// 5️⃣  Brand notes
if (!fs.existsSync(`${root}/docs/brandguide.txt`)) {
  write(
    `${root}/docs/brandguide.txt`,
    `R3AL Brand Overview
====================
Theme: Black + Forged Gold
Motto: Reveal • Relate • Respect
Pulse: 60 BPM heartbeat animation.
Eyes glow intensify on identity verification.
See manifest.json for asset mapping.`
  );
}

log("Brand guide stub written.");

// ──────────────────────────────────────────────────────────────
// 6️⃣  Register in RORK kernel registry
const registryPath = path.resolve(process.cwd(), "rork_registry.json");
let registry = {};
if (fs.existsSync(registryPath))
  registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

registry["r3al"] = {
  path: "./schemas/r3al",
  version: "1.0.0",
  registered: new Date().toISOString(),
};

write(registryPath, JSON.stringify(registry, null, 2));

log("R3AL registered in kernel registry.");

// ──────────────────────────────────────────────────────────────
// 7️⃣  Behaviour + Layout Schema
const appSchema = {
  ui: {
    layout: {
      splash: {
        background: "#0A0A0A",
        logo: "./assets/logo.svg",
        animation: "./assets/intro_anim.mp4",
        audio: "./assets/pulse_60bpm.mp3",
        motto: "Reveal • Relate • Respect",
        pulseBPM: 60,
      },
      verify: {
        animation: "./assets/verify_anim.mp4",
        audio: "./assets/verify_pulse.mp3",
        onSuccess: {
          eyeGlow: "intensify",
          wordmarkSweep: true,
          caption: "Identity Verified — Reveal • Relate • Respect",
        },
      },
      main: {
        theme: "./theme/ui_tokens.json",
        footer: "Reveal • Relate • Respect — Privacy Act of 1974 Compliant",
        sections: ["Feed", "Verify", "Profile", "Settings"],
      },
    },
  },
  behaviour: {
    startupSequence: [
      "fadeInGrid",
      "animateLogo",
      "playAudio:pulse",
      "showMotto",
    ],
    verifySequence: [
      "triggerAnimation:verify",
      "playAudio:verifyPulse",
      "displayCaption",
    ],
    security: {
      encryption: "AES-256",
      transport: "TLS1.3",
      jwt: true,
      consentRequired: true,
    },
  },
  accessibility: {
    captions: true,
    altAudio: true,
  },
};

if (fs.existsSync(`${root}/app_schema.json`)) {
  log("App schema already exists, skipping creation.");
} else {
  write(`${root}/app_schema.json`, JSON.stringify(appSchema, null, 2));
  log("Behaviour + layout schema created.");
}

// ──────────────────────────────────────────────────────────────
log("✅  R3AL app scaffold complete.");
