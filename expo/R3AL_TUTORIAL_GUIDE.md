# R3AL Interactive Tutorial + Optima AI Assistant

## 🎓 Overview

The R3AL app now includes an **interactive overlay tutorial system** with **Optima AI assistant** that guides users through features using real UI elements instead of static screens.

---

## 🏗️ Architecture

### 1. **TutorialContext** (`app/contexts/TutorialContext.tsx`)
- State management for tutorial flows
- Progress tracking with AsyncStorage
- Auto-start logic for first-time users
- Multiple tutorial flows (home, vault, etc.)

### 2. **TutorialOverlay** (`components/TutorialOverlay.tsx`)
- Modal overlay with spotlight effect
- Highlights real UI elements with animated borders
- Progress dots and navigation controls
- Optima branding and messaging

### 3. **OptimaAssistant** (`components/OptimaAssistant.tsx`)
- Floating action button (FAB) with glow animation
- Chat interface with AI-powered responses
- Context-aware guidance about app features
- Persistent throughout the app

---

## 📦 Features

### Interactive Tutorial
- ✅ Highlights actual UI elements (not screenshots)
- ✅ Animated spotlight with pulsing border
- ✅ Context-aware tooltips with placement logic
- ✅ Progress tracking (dots + step counter)
- ✅ Previous/Next/Skip navigation
- ✅ Auto-starts for new users
- ✅ Persists completion state

### Optima AI Assistant
- ✅ Always-available floating button
- ✅ Chat interface with streaming responses
- ✅ Special Forces operator context
- ✅ Guides through features, privacy, security
- ✅ Typing indicators and error handling
- ✅ Glow animation for attention

---

## 🎯 Tutorial Flows

### Home Tour (`home_tour`)
Auto-starts on first home visit

1. **Welcome** - Intro to R3AL + Optima
2. **Truth Score** - Explains baseline score and refinement
3. **Edit Profile** - Verification and disclosure settings
4. **Settings** - Privacy, 2FA, security
5. **Hive Intro** - Community guidelines
6. **Complete** - Motto and encouragement

### Vault Tour (`vault_tour`)
Manual start (Settings → Help → Tutorial)

1. **Vault Intro** - Private disclosures and mutual consent

---

## 🛠️ Usage

### For Users

**First Time:**
1. Complete onboarding (splash → welcome → consent → questionnaire → profile)
2. Arrive at home screen
3. Tutorial auto-starts after 500ms delay
4. Follow Optima's guidance through 6 steps

**Optima Assistant:**
- Tap the floating Sparkles button (bottom-right)
- Ask questions about features, privacy, trust score, etc.
- Optima responds with context-aware guidance

**Replay Tutorial:**
- Settings → Help → Replay Tutorial
- Or call `startTutorial("home_tour")` programmatically

### For Developers

**Add New Tutorial Flow:**
```typescript
// In TutorialContext.tsx, add to TUTORIAL_FLOWS
my_feature_tour: {
  id: "my_feature_tour",
  name: "Feature Tour",
  autoStart: false,
  repeatable: true,
  steps: [
    {
      id: "step_1",
      target: "my-element-testID",
      title: "Feature Title",
      message: "User-facing message",
      placement: "bottom",
      spotlightPadding: 12,
      optimaMessage: "Optima's enhanced guidance"
    }
  ]
}
```

**Trigger Tutorial:**
```typescript
import { useTutorial } from "@/app/contexts/TutorialContext";

function MyScreen() {
  const { startTutorial } = useTutorial();
  
  useEffect(() => {
    startTutorial("my_feature_tour");
  }, []);
}
```

**Add testID to UI Elements:**
```tsx
<View testID="my-element-testID">
  {/* This will be highlighted in the tutorial */}
</View>
```

---

## 📋 Integration Checklist

- [x] TutorialContext created with AsyncStorage persistence
- [x] TutorialOverlay with spotlight and animation
- [x] OptimaAssistant with AI chat
- [x] TutorialProvider added to app layout
- [x] Home screen integrated with auto-start
- [x] testIDs added to key UI elements
- [x] Validation script created

---

## 🧪 Validation

Run the validation script:
```bash
node scripts/r3al-tutorial-patch.js
```

Expected output:
```
🎓 R3AL Tutorial System Validation

✅ tutorialContext: OK
✅ tutorialOverlay: OK
✅ optimaAssistant: OK
✅ appLayout: OK
✅ home: OK

============================================================
✅ All tutorial components installed and integrated!
```

---

## 🎨 Customization

### Theme Integration
Tutorial uses `useTheme()` for colors:
- Overlay background: `theme.overlay` (dark with opacity)
- Spotlight border: `theme.accent` (gold)
- Tooltip background: `theme.surface`
- Text colors: `theme.text`, `theme.textSecondary`

### Optima Context
Edit `SYSTEM_CONTEXT` in `OptimaAssistant.tsx` to customize AI personality and knowledge base.

### Tutorial Steps
Edit `TUTORIAL_FLOWS` in `TutorialContext.tsx` to add/remove/modify steps.

---

## 🚀 Future Enhancements

1. **Advanced Spotlighting**
   - Measure actual UI element positions (requires ref system)
   - Cutout overlay for pointer interaction

2. **Voice Guidance**
   - Text-to-speech for Optima messages
   - Voice input for questions

3. **Analytics**
   - Track tutorial completion rates
   - Identify steps where users skip/struggle

4. **Multi-language**
   - Localize tutorial messages
   - Optima responses in user's language

5. **Adaptive Tutorials**
   - Show tutorials based on user behavior
   - Context-sensitive help triggers

---

## 📞 Support

**Built by:** Special Forces Operator  
**Platform:** R3AL - Truth, Privacy, Authenticity  
**AI Guide:** Optima  

For issues or questions, ask Optima directly in the app or contact support.

---

**Reveal • Relate • Respect**
