import fs from "node:fs";
import path from "node:path";

const memoryPath = path.resolve("./memory.json");

export type TruthEvaluation = {
  score: number;
  tier: string;
  nextGoal: string;
};

export function evaluateTruthScore(userId: string): TruthEvaluation {
  if (!fs.existsSync(memoryPath)) {
    return { score: 0, tier: "Unverified", nextGoal: "Complete ID check" };
  }

  const raw = fs.readFileSync(memoryPath, "utf8");
  const memory: Array<Record<string, any>> = JSON.parse(raw);
  const userEntries = memory.filter((m) => m?.userId === userId);

  if (userEntries.length === 0) {
    return { score: 0, tier: "Unverified", nextGoal: "Start verification" };
  }

  const idCheck = userEntries.some((e) => e?.action === "id_verified");
  const background = userEntries.some((e) => e?.action === "background_check_passed");
  const faithDeclared = userEntries.some((e) => e?.action === "faith_disclosed");
  const intent = userEntries.some((e) => e?.action === "relationship_intent_declared");
  const endorsements = userEntries.filter((e) => e?.action === "truth_endorsed").length;
  const falseReports = userEntries.filter((e) => e?.action === "false_report").length;
  const consistency = Math.max(0, 1 - falseReports / (userEntries.length || 1));

  let score = 0;
  score += idCheck ? 150 : 0;
  score += background ? 250 : 0;
  score += faithDeclared ? 100 : 0;
  score += intent ? 150 : 0;
  score += endorsements * 50;
  score *= consistency;

  score = Math.min(1000, Math.round(score));

  let tier = "Open Profile";
  let nextGoal = "Add lifestyle & intent info";
  if (score >= 200) { tier = "Intent Declared"; nextGoal = "Complete background check"; }
  if (score >= 450) { tier = "Fully R3AL"; nextGoal = "Gain 3 honesty endorsements"; }
  if (score >= 700) { tier = "R3AL Mentor"; nextGoal = "Maintain perfect record for 12 months"; }
  if (score >= 950) { tier = "Truth Icon"; nextGoal = "Enjoy your honeymoon"; }

  return { score, tier, nextGoal };
}
