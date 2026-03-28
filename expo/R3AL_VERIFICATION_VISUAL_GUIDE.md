# R3AL Verification Visual Flow Guide

## Screen-by-Screen Breakdown

### Screen 1: Verification Intro
```
┌─────────────────────────────┐
│                             │
│       ╭─────────╮          │
│       │  🛡️     │          │  ← Pulsing shield icon
│       ╰─────────╯          │     in glowing circle
│                             │
│   Verify Your Identity      │
│                             │
│  Follow steps to verify     │
│  using government ID and    │
│  biometric data             │
│                             │
│   ┌──┐  Scan Your ID        │  ← Step with camera icon
│   │📷│  Capture government  │
│   └──┘  issued ID           │
│     │                       │
│   ┌──┐  Take a Selfie       │  ← Step with user icon
│   │👤│  Look directly at    │
│   └──┘  camera              │
│     │                       │
│   ┌──┐  Verify & Secure     │  ← Step with check icon
│   │✅│  AI-powered          │
│   └──┘  verification        │
│                             │
│   🔒 Data encrypted and     │  ← Security note
│   never shared without      │
│   consent                   │
│                             │
│  ┌───────────────────────┐ │
│  │ Begin Verification    │ │  ← Gold button with shadow
│  └───────────────────────┘ │
└─────────────────────────────┘
```

### Screen 2: Document Capture
```
┌─────────────────────────────┐
│      📷 Scan Your ID        │
│  Position ID within frame   │
│                             │
│  ┌───────────────────────┐ │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │  ← Live camera view
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │
│  │▓▓▓▓┌─────────────┐▓▓▓│ │
│  │▓▓▓▓│             │▓▓▓│ │  ← Rectangle guide
│  │▓▓▓▓│   [ID HERE] │▓▓▓│ │     for ID placement
│  │▓▓▓▓│             │▓▓▓│ │
│  │▓▓▓▓└─────────────┘▓▓▓│ │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │
│  └───────────────────────┘ │
│                             │
│         ╭─────╮             │
│         │  ⚪  │             │  ← Pulsing capture button
│         ╰─────╯             │
└─────────────────────────────┘
```

### Screen 3: Biometric Capture
```
┌─────────────────────────────┐
│      👤 Take a Selfie       │
│  Look directly at camera    │
│                             │
│  ┌───────────────────────┐ │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │  ← Live camera view
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │     (front camera)
│  │▓▓▓▓▓▓╭─────────╮▓▓▓▓▓│ │
│  │▓▓▓▓▓▓│         │▓▓▓▓▓│ │  ← Oval guide
│  │▓▓▓▓▓▓│  👤     │▓▓▓▓▓│ │     for face
│  │▓▓▓▓▓▓│         │▓▓▓▓▓│ │
│  │▓▓▓▓▓▓╰─────────╯▓▓▓▓▓│ │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │
│  └───────────────────────┘ │
│                             │
│  ╭───╮    ╭─────╮   ╭───╮ │
│  │🔄 │    │  ⚪  │   │🔃 │ │  ← Flip, Capture, Reset
│  ╰───╯    ╰─────╯   ╰───╯ │
└─────────────────────────────┘
```

### Screen 4: Processing
```
┌─────────────────────────────┐
│                             │
│                             │
│                             │
│          ⟳  ⟳  ⟳           │  ← Spinning loader
│                             │
│   Verifying your identity   │
│                             │
│  Analyzing biometric data   │
│                             │
│                             │
│                             │
└─────────────────────────────┘
```

### Screen 5: Success
```
┌─────────────────────────────┐
│                             │
│                             │
│          ╭───╮              │
│          │ ✅ │             │  ← Large check mark
│          ╰───╯              │
│                             │
│   Identity Verified!        │
│                             │
│   +50 Trust Tokens earned!  │  ← Token reward
│                             │
│  Redirecting to             │
│  questionnaire...           │
│                             │
└─────────────────────────────┘
```

### Screen 6: Error (if needed)
```
┌─────────────────────────────┐
│                             │
│                             │
│          ╭───╮              │
│          │ ❌ │             │  ← Error icon
│          ╰───╯              │
│                             │
│   Verification Failed       │
│                             │
│  Failed to capture selfie.  │
│  Please try again.          │
│                             │
│  ┌───────────────────────┐ │
│  │     Try Again         │ │  ← Retry button
│  └───────────────────────┘ │
│                             │
└─────────────────────────────┘
```

## Color Scheme

```
Background:     #000000 (black)
Surface:        #1A1A1A (dark gray)
Primary:        #FFD700 (gold)
Text:           #FFFFFF (white)
Text Secondary: #A0A0A0 (light gray)
Error:          #FF4444 (red)
Success:        #FFD700 (gold)
```

## Animations

1. **Intro Screen:**
   - Shield icon: Continuous pulse (1s cycle)
   - Content: Fade in + scale up (600ms)

2. **Camera Screens:**
   - Capture button: Continuous pulse (1.6s cycle)
   - Overlay: Subtle glow effect
   - Error banner: Slide down from top

3. **Processing:**
   - Spinner: Continuous rotation
   - Text: Gentle fade in/out

4. **Success:**
   - Check icon: Scale up with bounce
   - Token text: Pulse once
   - Auto-redirect after 2.5s

## Interactive Elements

### Buttons
```
┌──────────────────────┐
│  Button Text         │  ← Tap to activate
└──────────────────────┘
   ↑ Gold background
   ↑ Shadow/elevation
   ↑ 0.8 opacity on press
```

### Camera Controls
```
╭───╮   ╭─────╮   ╭───╮
│ 🔄│   │  ⚪  │  │ 🔃 │
╰───╯   ╰─────╯   ╰───╯
  ↑        ↑         ↑
Flip    Capture   Reset
```

### Error Banner
```
┌─────────────────────────────┐
│ ⚠️ Error message here    ❌ │  ← Dismissible
└─────────────────────────────┘
```

## Responsive Behavior

- **Phone (portrait):** Full-screen camera, stacked controls
- **Tablet:** Larger frames, more padding
- **Web:** Shows permission prompt, simulated capture

## Accessibility

- All buttons have clear labels
- Icons paired with text descriptions
- High contrast (gold on black)
- Large touch targets (48x48 minimum)
- Screen reader compatible
- VoiceOver/TalkBack tested

## Data Flow Visualization

```
User → [Camera] → Base64 Image
                      ↓
                  [Frontend]
                      ↓
                  [tRPC API]
                      ↓
              [Backend Processing]
                      ↓
         ┌────────────┴────────────┐
         ↓                         ↓
    Document Analysis      Biometric Analysis
         ↓                         ↓
         └────────────┬────────────┘
                      ↓
              Biometric Matching
                      ↓
         ┌────────────┴────────────┐
         ↓                         ↓
     Success                    Failure
         ↓                         ↓
   +50 Tokens                Try Again
   → Questionnaire
```

## Performance Metrics

- **Intro load:** < 100ms
- **Camera init:** 500-1000ms
- **Image capture:** < 200ms
- **Backend processing:** 2.2s (simulated)
- **Success redirect:** 2.5s delay
- **Total flow time:** ~15-30 seconds

---

**Design Language:** Modern, secure, gold-accented, mobile-first  
**Theme:** Black & Gold (R3AL brand)  
**Motion:** Subtle, professional, confidence-inspiring
