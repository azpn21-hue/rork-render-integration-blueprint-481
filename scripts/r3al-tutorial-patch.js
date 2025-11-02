#!/usr/bin/env node
/**
 * R3AL Interactive Tutorial + Optima AI Assistant Patch
 * 
 * This script validates that all tutorial components are properly integrated:
 * - TutorialContext for state management
 * - TutorialOverlay for interactive UI highlights
 * - OptimaAssistant for AI-guided help
 * - Integration in app layout and home screen
 * 
 * Run: node scripts/r3al-tutorial-patch.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const files = {
  tutorialContext: path.join(root, "app/contexts/TutorialContext.tsx"),
  tutorialOverlay: path.join(root, "components/TutorialOverlay.tsx"),
  optimaAssistant: path.join(root, "components/OptimaAssistant.tsx"),
  appLayout: path.join(root, "app/_layout.tsx"),
  home: path.join(root, "app/r3al/home.tsx")
};

function checkFile(filepath, requiredStrings = []) {
  if (!fs.existsSync(filepath)) {
    return { exists: false, hasRequired: false, missing: requiredStrings };
  }
  
  const content = fs.readFileSync(filepath, "utf8");
  const missing = requiredStrings.filter(str => !content.includes(str));
  
  return {
    exists: true,
    hasRequired: missing.length === 0,
    missing
  };
}

console.log("🎓 R3AL Tutorial System Validation\n");

const checks = {
  tutorialContext: checkFile(files.tutorialContext, [
    "TutorialProvider",
    "useTutorial",
    "home_tour",
    "vault_tour"
  ]),
  tutorialOverlay: checkFile(files.tutorialOverlay, [
    "TutorialOverlay",
    "Sparkles",
    "nextStep",
    "previousStep"
  ]),
  optimaAssistant: checkFile(files.optimaAssistant, [
    "OptimaAssistant",
    "chatCompletion",
    "SYSTEM_CONTEXT"
  ]),
  appLayout: checkFile(files.appLayout, [
    "TutorialProvider",
    "import { TutorialProvider }"
  ]),
  home: checkFile(files.home, [
    "TutorialOverlay",
    "OptimaAssistant",
    "shouldAutoStart",
    "startTutorial"
  ])
};

let allPassed = true;

for (const [name, result] of Object.entries(checks)) {
  if (!result.exists) {
    console.log(`❌ ${name}: File not found at ${files[name]}`);
    allPassed = false;
  } else if (!result.hasRequired) {
    console.log(`⚠️  ${name}: Missing required content`);
    console.log(`   Missing: ${result.missing.join(", ")}`);
    allPassed = false;
  } else {
    console.log(`✅ ${name}: OK`);
  }
}

console.log("\n" + "=".repeat(60));

if (allPassed) {
  console.log("✅ All tutorial components installed and integrated!");
  console.log("\n📋 Features:");
  console.log("  • Interactive overlay tutorial with spotlight highlights");
  console.log("  • Optima AI assistant with real-time chat");
  console.log("  • Auto-start on first home visit");
  console.log("  • Progress tracking with AsyncStorage");
  console.log("  • Multiple tutorial flows (home_tour, vault_tour)");
  console.log("\n🎯 Next Steps:");
  console.log("  1. Start the app: bun start");
  console.log("  2. Navigate to the home screen");
  console.log("  3. Tutorial will auto-start for new users");
  console.log("  4. Click the Optima floating button for AI help");
  console.log("  5. Settings → Help → Replay Tutorial to restart");
  
  process.exit(0);
} else {
  console.log("❌ Tutorial integration incomplete");
  console.log("\n🔧 To fix:");
  console.log("  Ensure all files from the tutorial patch are in place");
  console.log("  Re-run this script to validate");
  
  process.exit(1);
}
