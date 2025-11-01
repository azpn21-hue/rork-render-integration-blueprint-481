/**
 * R3AL automatic setup script for the RORK kernel.
 * ------------------------------------------------
 * This script:
 *  1. Creates the R3AL app directory structure.
 *  2. Generates manifest.json and all schema files.
 *  3. Writes placeholder legal files and brand notes.
 *  4. Registers the app in the RORK kernel registry.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const root = path.resolve(projectRoot, "apps/r3al");

function mkdir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function write(file, content) {
  fs.writeFileSync(file, content.trimStart() + "\n");
}

function log(msg) {
  console.log(`[RORK] ${msg}`);
}

log("🚀 Starting R3AL app scaffold generation...");

mkdir(root);
mkdir(`${root}/assets`);
mkdir(`${root}/theme`);
mkdir(`${root}/legal`);
mkdir(`${root}/docs`);
mkdir(`${root}/schemas`);

log("✅ Created base R3AL directory tree.");

const manifest = {
  app_id: "com.r3al.app",
  name: "R3AL",
  version: "1.0.0",
  description: "Truth-verified social app with identity verification and questionnaire-based truth scoring.",
  entry_screen: "splash",
  permissions: ["camera", "biometric"],
  schemas: {
    app: "schemas/app_schema.json",
    questionnaire: "schemas/questionnaire_schema.json",
    truthscore: "schemas/truthscore_schema.json",
    theme: "theme/ui_tokens.json",
    accessibility: "schemas/accessibility_map.json",
    locales: "schemas/locale_tokens.json"
  },
  features: {
    useRiseN: true,
    useOptimaII: true,
    analytics_opt_in: false
  },
  consent_required: true,
  last_legal_update: "2025-10-01"
};

write(`${root}/manifest.json`, JSON.stringify(manifest, null, 2));
log("✅ Manifest written.");

const uiTokens = {
  colors: {
    primary: "#1E90FF",
    secondary: "#111111",
    background: "#FFFFFF",
    accent: "#FFC107",
    error: "#D32F2F",
    success: "#388E3C"
  },
  fonts: {
    heading: { family: "Roboto", weight: "700", size: 24 },
    body: { family: "Roboto", weight: "400", size: 16 },
    small: { family: "Roboto", weight: "400", size: 12 }
  },
  dimensions: {
    borderRadius: 8,
    padding: 16,
    iconSize: 24
  },
  animations: {
    pulse_duration_ms: 1000,
    pulse_scale: 1.1
  }
};

write(`${root}/theme/ui_tokens.json`, JSON.stringify(uiTokens, null, 2));
log("✅ Theme tokens created.");

const appSchema = {
  screens: [
    {
      id: "splash",
      type: "SplashScreen",
      properties: {
        animation: "pulse",
        duration: "@theme.animations.pulse_duration_ms"
      },
      next: "onboard_welcome"
    },
    {
      id: "onboard_welcome",
      type: "OnboardingScreen",
      properties: {
        phase: 1,
        title: "@locale.welcome_title",
        body: "@locale.welcome_body"
      },
      components: [
        { type: "Image", source: "asset:intro.png", style: "banner" },
        { type: "Text", binding: "@locale.welcome_message" },
        { type: "Button", text: "@locale.start", action: "go_next" }
      ],
      next: "onboard_consent"
    },
    {
      id: "onboard_consent",
      type: "OnboardingScreen",
      properties: { phase: 2, title: "@locale.consent_title" },
      components: [
        {
          type: "Checkbox",
          id: "agree_terms",
          label: "@locale.consent_agree",
          required: true
        },
        { type: "Link", text: "@locale.view_terms", url: "@locale.terms_url" },
        { type: "Button", text: "@locale.next", action: "if(agree_terms) go_next" }
      ],
      next: "id_verify_intro"
    },
    {
      id: "id_verify_intro",
      type: "VerificationIntroScreen",
      properties: { title: "@locale.verify_id_title" },
      components: [
        { type: "Text", binding: "@locale.verify_id_instructions" },
        { type: "Button", text: "@locale.begin_verification", action: "go_next" }
      ],
      next: "id_verification"
    },
    {
      id: "id_verification",
      type: "IdentityVerificationScreen",
      properties: {
        useBiometric: true,
        useDocumentScan: true
      },
      events: {
        onVerified: "go(questionnaire)"
      },
      next: "questionnaire"
    },
    {
      id: "questionnaire",
      type: "QuestionnaireScreen",
      properties: {
        schema: "@schemas.questionnaire",
        title: "@locale.questionnaire_title"
      },
      events: {
        onSubmit: "calcTruthScore()"
      },
      next: "score_result"
    },
    {
      id: "score_result",
      type: "ScoreResultScreen",
      properties: {
        score: "@state.truthScore.value",
        summary: "@state.truthScore.summary"
      },
      components: [
        { type: "Text", binding: "@locale.truthscore_your_score", style: "heading" },
        { type: "Text", text: "${state.truthScore.value}", style: "score" },
        { type: "Button", text: "@locale.expand_truthpoints", action: "go(truth_expansion)" },
        { type: "Button", text: "@locale.finish", action: "go(profile_setup)" }
      ]
    },
    {
      id: "truth_expansion",
      type: "TruthExpansionScreen",
      properties: { source: "@state.truthScore.details" },
      components: [
        { type: "Chart", data: "@state.truthScore.details.consistencyChart" },
        { type: "Text", binding: "@state.truthScore.details.analysisText" }
      ]
    },
    {
      id: "profile_setup",
      type: "ProfileSetupScreen",
      properties: { title: "@locale.profile_title" },
      components: [
        { type: "TextField", id: "display_name", label: "@locale.name" },
        { type: "ImagePicker", id: "avatar", label: "@locale.avatar" },
        { type: "Button", text: "@locale.complete", action: "submitProfile()" }
      ],
      next: "home"
    },
    {
      id: "home",
      type: "HomeScreen",
      properties: { title: "@locale.home_welcome" },
      components: [
        {
          type: "Menu",
          items: [
            { icon: "chat", text: "@locale.menu_messages", target: "messages" },
            { icon: "user", text: "@locale.menu_profile", target: "user_profile" }
          ]
        }
      ]
    },
    {
      id: "messages",
      type: "MessagingScreen",
      properties: {},
      components: [
        { type: "MessageList", source: "@data.messages" },
        { type: "TextField", id: "new_message_text", hint: "@locale.type_message" },
        { type: "Button", text: "@locale.send", action: "sendMessage(new_message_text)" }
      ]
    },
    {
      id: "user_profile",
      type: "UserProfileScreen",
      properties: {},
      components: [
        { type: "Image", source: "@user.avatar", style: "profile_pic" },
        { type: "Text", text: "@user.name", style: "profile_name" },
        { type: "Text", binding: "@user.bio" }
      ]
    }
  ],
  navigation: {
    stack: ["home", "messages", "user_profile"],
    modal: ["truth_expansion"]
  }
};

write(`${root}/schemas/app_schema.json`, JSON.stringify(appSchema, null, 2));
log("✅ App schema created.");

const questionnaireSchema = {
  questions: [
    {
      id: "Q1",
      text: "Have you ever provided false information on an official document?",
      type: "multiple-choice",
      options: ["Never", "Rarely", "Sometimes", "Often"],
      weight: 10,
      truth_indicator: "honesty"
    },
    {
      id: "Q2",
      text: "How frequently do you double-check facts before sharing them?",
      type: "multiple-choice",
      options: ["Always", "Sometimes", "Rarely", "Never"],
      weight: 8,
      truth_indicator: "diligence"
    },
    {
      id: "Q3",
      text: "Describe a situation where you had to tell an uncomfortable truth.",
      type: "free-text",
      max_length: 200,
      weight: 5,
      truth_indicator: "transparency"
    },
    {
      id: "Q4",
      text: "Do you believe it's acceptable to lie to protect someone's feelings?",
      type: "multiple-choice",
      options: ["Never", "Rarely", "Sometimes", "Often"],
      weight: 7,
      truth_indicator: "honesty"
    },
    {
      id: "Q5",
      text: "How often do you admit when you're wrong?",
      type: "multiple-choice",
      options: ["Always", "Usually", "Sometimes", "Rarely"],
      weight: 9,
      truth_indicator: "transparency"
    }
  ],
  logic: {
    autoscoring: true,
    consistency_checks: [
      {
        question_ids: ["Q1", "Q3"],
        expectation: "if Q1 == 'Never', then Q3 narrative should reflect no prior incidents"
      }
    ],
    follow_ups: [
      {
        question_id: "Q1",
        trigger_answer: "Often",
        follow_question: {
          text: "You indicated you often falsify documents. Would you like to elaborate why?",
          type: "free-text",
          id: "Q1_follow"
        }
      }
    ]
  }
};

write(`${root}/schemas/questionnaire_schema.json`, JSON.stringify(questionnaireSchema, null, 2));
log("✅ Questionnaire schema created.");

const truthscoreSchema = {
  score_model: "weighted_sum",
  weights: {
    Q1: 10,
    Q2: 8,
    Q3: 5,
    Q4: 7,
    Q5: 9
  },
  truth_points: {
    Q1: { Never: 10, Rarely: 7, Sometimes: 4, Often: 0 },
    Q2: { Always: 10, Sometimes: 5, Rarely: 2, Never: 0 },
    Q4: { Never: 10, Rarely: 7, Sometimes: 4, Often: 0 },
    Q5: { Always: 10, Usually: 8, Sometimes: 5, Rarely: 2 }
  },
  algorithms: [
    {
      name: "RiseN_AI",
      enabled: true,
      function: "analyzeTruth(answers)",
      output: { consistency: "number", anomalies: "list" }
    },
    {
      name: "Optima_II",
      enabled: true,
      function: "optimizeScore(baseScore, context)",
      output: { adjustedScore: "number" }
    }
  ],
  output_schema: {
    score: "number",
    level: "string",
    summary: "string",
    details: {
      honesty: "number",
      diligence: "number",
      transparency: "number",
      consistencyChart: "object",
      analysisText: "string"
    }
  }
};

write(`${root}/schemas/truthscore_schema.json`, JSON.stringify(truthscoreSchema, null, 2));
log("✅ Truth score schema created.");

const accessibilityMap = {
  events: {
    "verification.start": {
      audio: "tone_start.wav",
      haptic: "light"
    },
    "verification.success": {
      audio: "success_chime.wav",
      haptic: "success"
    },
    "verification.failure": {
      audio: "error_buzz.wav",
      haptic: "error",
      visual: "shake"
    },
    "message.received": {
      audio: "notify_ping.wav",
      haptic: "light"
    },
    "truthscore.calculated": {
      audio: "drumroll.wav",
      haptic: "success"
    }
  },
  components: {
    button: {
      focus_outline: true,
      accessibility_label: "@locale.default_button_label"
    },
    ImagePicker: {
      voiceover: "@locale.pick_image_instructions"
    }
  }
};

write(`${root}/schemas/accessibility_map.json`, JSON.stringify(accessibilityMap, null, 2));
log("✅ Accessibility map created.");

const localeTokens = {
  en: {
    welcome_title: "Welcome to R3AL",
    welcome_message: "Your journey to truth starts here.",
    start: "Get Started",
    consent_title: "Consent & Privacy",
    consent_agree: "I agree to the Terms of Service and Privacy Policy",
    view_terms: "View Terms",
    next: "Next",
    verify_id_title: "Verify Your Identity",
    verify_id_instructions: "Follow the steps to verify your ID.",
    begin_verification: "Begin Verification",
    questionnaire_title: "Truth Questionnaire",
    truthscore_your_score: "Your Truth Score:",
    expand_truthpoints: "See Details",
    finish: "Finish",
    profile_title: "Set Up Your Profile",
    name: "Name",
    avatar: "Profile Picture",
    complete: "Complete",
    home_welcome: "Home",
    menu_messages: "Messages",
    menu_profile: "My Profile",
    type_message: "Type a message...",
    send: "Send",
    default_button_label: "Button",
    pick_image_instructions: "Double tap to select an image.",
    terms_url: "https://example.com/terms"
  },
  es: {
    welcome_title: "Bienvenido a R3AL",
    welcome_message: "Tu camino hacia la verdad comienza aquí.",
    start: "Comenzar",
    consent_title: "Consentimiento y Privacidad",
    consent_agree: "Acepto los Términos de Servicio y la Política de Privacidad",
    view_terms: "Leer términos",
    next: "Siguiente",
    verify_id_title: "Verifica tu Identidad",
    verify_id_instructions: "Sigue los pasos para verificar tu identificación.",
    begin_verification: "Iniciar verificación",
    questionnaire_title: "Cuestionario de la Verdad",
    truthscore_your_score: "Tu Puntaje de Veracidad:",
    expand_truthpoints: "Ver Detalles",
    finish: "Finalizar",
    profile_title: "Crea tu Perfil",
    name: "Nombre",
    avatar: "Foto de Perfil",
    complete: "Completar",
    home_welcome: "Inicio",
    menu_messages: "Mensajes",
    menu_profile: "Mi Perfil",
    type_message: "Escribe un mensaje...",
    send: "Enviar",
    default_button_label: "Botón",
    pick_image_instructions: "Doble toque para seleccionar una imagen.",
    terms_url: "https://example.com/terms"
  }
};

write(`${root}/schemas/locale_tokens.json`, JSON.stringify(localeTokens, null, 2));
log("✅ Locale tokens created.");

write(
  `${root}/legal/privacy_policy.md`,
  `# Privacy Policy

This application operates under the Privacy Act of 1974 (5 U.S.C. §552a) and
complies with GDPR and CCPA. Data processed through R3AL is encrypted and
stored in accordance with DoD 5400.11-R guidelines.

## Data Collection
We collect only essential data for identity verification and truth scoring.
All personal data is encrypted and stored securely.

## Data Usage
Your data is used solely for:
- Identity verification
- Truth score calculation
- App functionality improvement (with explicit consent)

## Your Rights
You have the right to access, modify, or delete your data at any time.
Contact privacy@r3al.app for data requests.

Last updated: 2025-10-01
`
);

write(
  `${root}/legal/user_agreement.md`,
  `# End-User License Agreement

By continuing, you acknowledge and consent to processing under the Privacy Act of 1974.
All data interactions follow the R3AL doctrine: Reveal • Relate • Respect.

## Terms of Use
1. You agree to provide truthful information
2. You will not misuse identity verification features
3. You understand data is processed according to our Privacy Policy

## Account Termination
We reserve the right to terminate accounts that violate these terms.

## Updates
We may update these terms. You will be notified of material changes.

Last updated: 2025-10-01
`
);

write(
  `${root}/legal/nda_consent.md`,
  `# Non-Disclosure Agreement

By using R3AL you agree not to share proprietary assets or algorithms contained within
the RORK kernel. Digital signature recorded at login.

## Confidentiality
You agree to maintain confidentiality of:
- Proprietary algorithms
- System architecture details
- Other users' personal information

## Enforcement
Violation of this NDA may result in account termination and legal action.

Last updated: 2025-10-01
`
);

log("✅ Legal documents generated.");

write(
  `${root}/docs/brandguide.txt`,
  `R3AL Brand Overview
====================
Theme: Modern Blue + Clean White
Motto: Reveal • Relate • Respect
Pulse: 60 BPM heartbeat animation on splash screen
Identity verification with biometric and document scanning
Truth-score based questionnaire system

Design Principles:
- Clean, trustworthy interface
- Accessibility-first approach
- Multi-sensory feedback (visual, audio, haptic)
- Privacy-focused design

See manifest.json for complete asset mapping and feature flags.
`
);

log("✅ Brand guide written.");

const registryPath = path.resolve(projectRoot, "rork_registry.json");
let registry = {};
if (fs.existsSync(registryPath)) {
  registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
}

registry["r3al"] = {
  path: "./apps/r3al",
  version: "1.0.0",
  registered: new Date().toISOString()
};

write(registryPath, JSON.stringify(registry, null, 2));
log("✅ R3AL registered in kernel registry.");

log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
log("✨ R3AL app scaffold complete!");
log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
log("");
log("📂 Created:");
log("   • apps/r3al/manifest.json");
log("   • apps/r3al/theme/ui_tokens.json");
log("   • apps/r3al/schemas/app_schema.json");
log("   • apps/r3al/schemas/questionnaire_schema.json");
log("   • apps/r3al/schemas/truthscore_schema.json");
log("   • apps/r3al/schemas/accessibility_map.json");
log("   • apps/r3al/schemas/locale_tokens.json");
log("   • apps/r3al/legal/*.md");
log("   • apps/r3al/docs/brandguide.txt");
log("");
log("🎯 Next steps:");
log("   1. Run: node scripts/rork_build_r3al.js");
log("   2. Review schemas in apps/r3al/");
log("   3. Customize theme tokens as needed");
log("   4. Add assets to apps/r3al/assets/");
log("");
