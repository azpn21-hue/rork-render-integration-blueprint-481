/**
 * R3AL Psych-Eval Questionnaire Patch
 * - Comprehensive psychological evaluation depth
 * - Lie-scale detection, attention checks, consistency validation
 * - Risk flags and anomaly detection
 * - Optional deep disclosure section
 */

import fs from "fs";
import path from "path";

const root = path.resolve(process.cwd());
const schemasDir = path.join(root, "schemas/r3al");
const appSchemaFile = path.join(schemasDir, "app_schema.json");
const qFile = path.join(schemasDir, "questionnaire_schema.json");
const tFile = path.join(schemasDir, "truthscore_schema.json");
const localeFile = path.join(schemasDir, "locale_tokens.json");

const write = (f, o) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(o, null, 2));
};

const load = (f) => {
  if (!fs.existsSync(f)) return null;
  return JSON.parse(fs.readFileSync(f, "utf8"));
};

console.log("🔧 R3AL Psych-Eval Questionnaire Patch");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// 1) Questionnaire — psych-eval depth with optional section toggle
const questionnaire = {
  version: "2.0.0",
  settings: {
    saveProgress: true,
    perPage: 1,
    allowBack: true,
    attentionChecks: true,
    measureResponseTimeMs: true,
  },
  sections: [
    {
      id: "identity_integrity",
      title: "Identity & Integrity",
      questions: [
        {
          id: "id_name_match",
          type: "single",
          label:
            "Does your display name match a real-world identity you actively use?",
          options: ["Yes", "No"],
          required: true,
        },
        {
          id: "id_verif_consent",
          type: "single",
          label: "I consent to identity & background verification.",
          options: ["Yes", "No"],
          required: true,
        },
        {
          id: "id_truth_exception",
          type: "single",
          label:
            "In what situations is it acceptable to hide important facts from a partner?",
          options: ["Never", "Rarely", "Sometimes", "Often"],
        },
        {
          id: "id_liescale_perfect",
          type: "single",
          label: "I have never told a lie of any kind.",
          options: ["True", "False"],
          meta: { lieScale: true },
        },
      ],
    },
    {
      id: "relationship_history_risk",
      title: "History & Risk",
      questions: [
        {
          id: "rh_past_partners",
          type: "number",
          label: "# of serious relationships (2+ months) in last 5 years",
          min: 0,
          max: 50,
        },
        {
          id: "rh_overlap",
          type: "single",
          label: "Any overlap between relationships?",
          options: ["No", "Unsure", "Yes"],
        },
        {
          id: "rh_order_restrain",
          type: "single",
          label:
            "Have you been subject to or sought a restraining order?",
          options: ["No", "Prefer not to say", "Yes"],
        },
        {
          id: "rh_accountability",
          type: "scale",
          label:
            "When relationships end, how often do you take responsibility for your part?",
          min: 1,
          max: 5,
        },
      ],
    },
    {
      id: "boundaries_safety",
      title: "Boundaries & Safety",
      questions: [
        {
          id: "bs_first_meet_public",
          type: "single",
          label: "First meetings in public places?",
          options: ["Always", "Usually", "Depends", "No"],
        },
        {
          id: "bs_location_share",
          type: "single",
          label:
            "Share live location with a trusted contact for first 3 meets?",
          options: ["Yes", "No"],
        },
        {
          id: "bs_escalation_style",
          type: "single",
          label: "When conflicts escalate, I usually…",
          options: [
            "Pause & cool off",
            "Seek dialogue",
            "Withdraw completely",
            "Confront aggressively",
          ],
        },
      ],
    },
    {
      id: "communication_conflict",
      title: "Communication & Conflict",
      questions: [
        {
          id: "cc_honesty_under_cost",
          type: "scale",
          label:
            "Likelihood I tell an uncomfortable truth even if it costs me in the short term",
          min: 1,
          max: 5,
          reverse: false,
        },
        {
          id: "cc_gray_zone",
          type: "single",
          label: "Is omission different from a lie in dating?",
          options: ["No", "Sometimes", "Yes"],
        },
        {
          id: "cc_always_honest_claim",
          type: "single",
          label: "I am always honest, even about trivial things.",
          options: ["True", "False"],
          meta: { reverseTruth: true },
        },
      ],
    },
    {
      id: "lifestyle_stability",
      title: "Lifestyle & Stability",
      questions: [
        {
          id: "ls_financial_transparency",
          type: "single",
          label:
            "I am willing to discuss debt, obligations, and financial constraints when serious.",
          options: ["Yes", "No"],
        },
        {
          id: "ls_substances",
          type: "multi",
          label: "Current regular use (select all that apply).",
          options: [
            "None",
            "Alcohol",
            "Nicotine/Vape",
            "Cannabis",
            "Prescription",
            "Other",
          ],
          allowOther: true,
        },
        {
          id: "ls_sleep_routine",
          type: "scale",
          label: "Sleep routine consistency (avg last 30 days).",
          min: 1,
          max: 5,
        },
      ],
    },
    {
      id: "digital_footprint_privacy",
      title: "Digital Footprint & Privacy",
      questions: [
        {
          id: "df_account_sharing",
          type: "single",
          label:
            "Would you ever share device passwords with a partner?",
          options: ["Never", "Maybe when serious", "Yes"],
        },
        {
          id: "df_past_catfish",
          type: "single",
          label:
            "Have you ever used a false persona online when dating?",
          options: ["No", "Yes (long ago)", "Yes (recently)"],
        },
      ],
    },
    {
      id: "values_dealbreakers",
      title: "Values & Dealbreakers",
      questions: [
        {
          id: "vd_nonnegotiables",
          type: "free",
          label: "Name 3 non-negotiables for you.",
          maxLength: 200,
        },
        {
          id: "vd_disclosures",
          type: "multi",
          label:
            "I will proactively disclose (visible to matches only after mutual opt-in):",
          options: [
            "Prior marriages",
            "Children",
            "Debt",
            "Health boundaries",
            "Religious commitments",
            "Legal issues",
            "None",
          ],
          allowOther: true,
        },
      ],
    },
    {
      id: "optional_deep_disclosure",
      title: "Optional Deep Disclosure",
      optional: true,
      questions: [
        {
          id: "od_sensitive_edges",
          type: "free",
          label:
            "What topics are sensitive that you still commit to address honestly if asked?",
          maxLength: 300,
        },
        {
          id: "od_user_truthpoint",
          type: "user_defined",
          template: {
            type: "single",
            label: "Create your own truth question",
            options: ["Yes", "No"],
          },
          allowAdd: true,
        },
      ],
    },
  ],
  logic: {
    attention: [
      {
        id: "attn_check_1",
        injectAfter: "cc_gray_zone",
        type: "single",
        label: "Select 'Yes' to confirm you are paying attention.",
        options: ["No", "Yes"],
        correct: "Yes",
      },
    ],
    consistencyChecks: [
      {
        a: "cc_always_honest_claim",
        b: "id_liescale_perfect",
        rule: "not_both_true",
      },
      {
        a: "id_truth_exception",
        b: "cc_gray_zone",
        rule: "coherent_rationale",
      },
    ],
    timingRules: { minMsPerItem: 800, flagFastResponses: true },
  },
};

// 2) Truth-score model — weights, subscales, lie/consistency/anomaly flags
const truthscore = {
  model: "composite",
  scales: {
    Integrity: {
      items: [
        "id_name_match",
        "id_verif_consent",
        "cc_honesty_under_cost",
        "cc_always_honest_claim",
      ],
      weights: {
        id_name_match: 2,
        id_verif_consent: 3,
        cc_honesty_under_cost: 2,
        cc_always_honest_claim: -1,
      },
    },
    Safety: {
      items: [
        "bs_first_meet_public",
        "bs_location_share",
        "bs_escalation_style",
      ],
      weights: {
        bs_first_meet_public: 1,
        bs_location_share: 1,
        bs_escalation_style: {
          "Pause & cool off": 1,
          "Seek dialogue": 1,
          "Withdraw completely": 0,
          "Confront aggressively": -1,
        },
      },
    },
    Transparency: {
      items: [
        "ls_financial_transparency",
        "vd_disclosures",
        "df_past_catfish",
      ],
      weights: {
        ls_financial_transparency: 2,
        vd_disclosures: "COUNT_SELECTED",
        df_past_catfish: {
          No: 1,
          "Yes (long ago)": 0,
          "Yes (recently)": -1,
        },
      },
    },
    Stability: {
      items: ["ls_sleep_routine", "rh_accountability"],
      weights: { ls_sleep_routine: 1, rh_accountability: 1 },
    },
    RiskHistory: {
      items: ["rh_overlap", "rh_order_restrain"],
      weights: {
        rh_overlap: { No: 1, Unsure: 0, Yes: -1 },
        rh_order_restrain: { No: 1, "Prefer not to say": 0, Yes: -2 },
      },
    },
  },
  lieScale: {
    items: ["id_liescale_perfect", "cc_always_honest_claim"],
    rules: { improbableAllTrue: -2 },
  },
  attention: { items: ["attn_check_1"], failPenalty: -3 },
  consistency: {
    pairs: [["cc_always_honest_claim", "id_liescale_perfect"]],
    penaltyPerConflict: -1,
  },
  timing: { minMsPerItem: 800, penaltyFastBurst: -1 },
  normalizeTo: 100,
  levels: [
    {
      min: 0,
      max: 39,
      label: "Low",
      color: "#B00020",
      summary:
        "Significant transparency/safety gaps or inconsistency detected.",
    },
    {
      min: 40,
      max: 69,
      label: "Medium",
      color: "#FFC107",
      summary:
        "Moderate alignment with room to clarify boundaries and history.",
    },
    {
      min: 70,
      max: 100,
      label: "High",
      color: "#16C784",
      summary:
        "Strong integrity, safety posture, and coherent disclosures.",
    },
  ],
  flags: {
    fakingGood: {
      threshold: true,
      rule: "lieScale.improbableAllTrue || consistency.conflicts>0",
    },
    riskAlerts: [
      { when: { rh_order_restrain: "Yes" }, tag: "LegalHistory" },
      {
        when: { bs_escalation_style: "Confront aggressively" },
        tag: "AggressiveConflict",
      },
    ],
  },
  outputs: {
    scorePath: "state.truthScore.value",
    levelPath: "state.truthScore.level",
    colorPath: "state.truthScore.color",
    summaryPath: "state.truthScore.summary",
    subscalePath: "state.truthScore.subscales",
    flagsPath: "state.truthScore.flags",
  },
};

// 3) Write schemas
console.log("📝 Writing questionnaire schema...");
write(qFile, questionnaire);

console.log("📝 Writing truth-score schema...");
write(tFile, truthscore);

// 4) Wire optional section toggle + update app schema
console.log("🔗 Updating app schema...");
const app = load(appSchemaFile);
if (app && app.screens) {
  app.screens = app.screens.map((s) => {
    if (s.id === "questionnaire") {
      s.properties = s.properties || {};
      s.properties.ui = {
        ...(s.properties.ui || {}),
        optionalToggleKey: "show_optional_deep_disclosure",
        showProgressBar: true,
        perPage: 1,
        allowBack: true,
        saveAsYouGo: true,
        accent: "#D4AF37",
        accessibility: { captions: true, largerTapTargets: true },
      };
      s.properties.scoring = "./truthscore_schema.json";
    }
    return s;
  });
  write(appSchemaFile, app);
}

// 5) Add localization
console.log("🌐 Updating locale tokens...");
const loc = load(localeFile) || { en: {}, es: {} };
loc.en = {
  ...loc.en,
  show_optional_deep_disclosure:
    "Include optional deep-disclosure section (advanced)",
  privacy_note:
    "Your answers are private, encrypted, and only revealed by mutual consent.",
  section_identity_integrity: "Identity & Integrity",
  section_relationship_history_risk: "History & Risk",
  section_boundaries_safety: "Boundaries & Safety",
  section_communication_conflict: "Communication & Conflict",
  section_lifestyle_stability: "Lifestyle & Stability",
  section_digital_footprint_privacy: "Digital Footprint & Privacy",
  section_values_dealbreakers: "Values & Dealbreakers",
  section_optional_deep_disclosure: "Optional Deep Disclosure",
  truthscore_integrity: "Integrity",
  truthscore_safety: "Safety",
  truthscore_transparency: "Transparency",
  truthscore_stability: "Stability",
  truthscore_risk_history: "Risk History",
  flag_faking_good: "Inconsistent response pattern detected",
  flag_legal_history: "Legal history disclosed",
  flag_aggressive_conflict: "Aggressive conflict style noted",
};

loc.es = {
  ...loc.es,
  show_optional_deep_disclosure:
    "Incluir sección de divulgación profunda opcional (avanzado)",
  privacy_note:
    "Tus respuestas son privadas, cifradas y solo se revelan con consentimiento mutuo.",
  section_identity_integrity: "Identidad e Integridad",
  section_relationship_history_risk: "Historia y Riesgo",
  section_boundaries_safety: "Límites y Seguridad",
  section_communication_conflict: "Comunicación y Conflicto",
  section_lifestyle_stability: "Estilo de Vida y Estabilidad",
  section_digital_footprint_privacy: "Huella Digital y Privacidad",
  section_values_dealbreakers: "Valores y Límites",
  section_optional_deep_disclosure: "Divulgación Profunda Opcional",
  truthscore_integrity: "Integridad",
  truthscore_safety: "Seguridad",
  truthscore_transparency: "Transparencia",
  truthscore_stability: "Estabilidad",
  truthscore_risk_history: "Historial de Riesgo",
  flag_faking_good: "Patrón de respuesta inconsistente detectado",
  flag_legal_history: "Historia legal divulgada",
  flag_aggressive_conflict: "Estilo de conflicto agresivo notado",
};

write(localeFile, loc);

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("✅ Psych-eval questionnaire installed");
console.log("");
console.log("📊 Features:");
console.log("  ✓ 8 sections (7 required + 1 optional)");
console.log("  ✓ Lie-scale detection");
console.log("  ✓ Attention checks");
console.log("  ✓ Consistency validation");
console.log("  ✓ Response timing analysis");
console.log("  ✓ Risk flags (Legal, Aggressive)");
console.log("  ✓ 5 subscales (0-100 composite score)");
console.log("  ✓ Color-coded levels with summaries");
console.log("");
console.log("📝 Next steps:");
console.log("  • Review schemas in schemas/r3al/");
console.log("  • Test questionnaire flow");
console.log("  • Verify scoring calculation");
console.log("");
