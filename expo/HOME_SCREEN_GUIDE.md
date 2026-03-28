# 🏠 R3AL Home Screen Guide

## Where Is Everything?

This guide shows you exactly where each feature is located on the R3AL home screen.

---

## 📱 Home Screen Layout

```
┌─────────────────────────────────────────┐
│  Welcome Back                     ⚙️    │ ← Settings
│  [User Name]                            │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  ✨  Optima II™ Banner          │ │ ← **OPTIMA AI IS HERE!**
│  │                                   │ │    Click this gold banner
│  │  Your AI consultant for R3AL     │ │
│  │  features, Trust Scores, and     │ │
│  │  relationship guidance            │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 🧭   │ │ ⬡    │ │ ❤️   │ │ 🪙   │  │ ← Quick Actions
│  │Explor│ │Circle│ │Pulse │ │Token │  │    Tap to access features
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
│  💰 Trust-Token Wallet                  │
│  ┌───────────────────────────────────┐ │
│  │  Available Balance                │ │
│  │         1,250                     │ │ ← Token Balance
│  │                                   │ │    (from backend)
│  │  📈 +100     ⚡ -50              │ │
│  └───────────────────────────────────┘ │
│                         View All →     │
│                                         │
│  🏆 Your Truth Score                    │
│  ┌───────────────────────────────────┐ │
│  │  🏅  92  Excellent                │ │ ← Truth Score Card
│  │                                   │ │    Tap for details
│  │          View Details →           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ⬡ Featured                             │
│  ┌────────────┐ ┌────────────┐         │
│  │ 💭 QOTD    │ │ 🏺 NFT     │         │ ← Featured Tiles
│  │ Question   │ │ Hive       │         │    Tap to open
│  │ of the Day │ │            │         │
│  └────────────┘ └────────────┘         │
│  ┌────────────┐ ┌────────────┐         │
│  │ 👥 Join    │ │ 🎖️  Your   │         │
│  │ Circles    │ │ Profile    │         │
│  └────────────┘ └────────────┘         │
│                                         │
│  [More content below...]                │
└─────────────────────────────────────────┘
```

---

## 🎯 Feature Locations

### 1. ✨ Optima AI - GOLD BANNER AT TOP
**Visual:** Large banner with sparkle icon, gold border, dark background
**Text:** "✨ Ask Optima II™" 
**Subtitle:** "Your AI consultant for R3AL features, Trust Scores, and relationship guidance"
**Action:** Tap anywhere on banner
**Route:** `/r3al/optima-ai`

**What you'll see:**
- Sparkle icon (✨) on the left
- Gold border (2px)
- Dark surface background
- Descriptive text about AI features

### 2. 🧭 Explore - Quick Action Button
**Visual:** Square button with compass icon, gold accent
**Text:** "Explore"
**Action:** Tap button
**Route:** `/r3al/explore`

### 3. ⬡ Circles - Quick Action Button
**Visual:** Square button with hexagon icon, green accent
**Text:** "Circles"
**Action:** Tap button
**Route:** `/r3al/circles`

### 4. ❤️ Pulse Chat - Quick Action Button
**Visual:** Square button with heart icon, red accent
**Text:** "Pulse"
**Action:** Tap button
**Route:** `/r3al/pulse-chat/index`

### 5. 🪙 Token Wallet - Quick Action Button
**Visual:** Square button with coins icon, gold accent
**Text:** "Tokens"
**Action:** Tap button
**Route:** `/r3al/hive/token-wallet`

### 6. 💰 Trust-Token Wallet Section
**Visual:** Card with gold border showing balance
**Components:**
- Balance number (large, gold text)
- Earned tokens (green, +)
- Spent tokens (red, -)
- "View All" link
**Action:** Tap "View All" or anywhere on card
**Route:** `/r3al/hive/token-wallet`

### 7. 🏆 Truth Score Card
**Visual:** Card with trophy icon and score
**Components:**
- Score number (large, gold)
- Level text (e.g., "Excellent")
- "View Details →" link
**Action:** Tap card
**Route:** `/r3al/truth-score-detail`

### 8. 💭 Question of the Day (Featured)
**Visual:** Tile with message circle icon, purple accent
**Text:** "Question of the Day"
**Subtitle:** "Share your perspective and earn tokens"
**Action:** Tap tile
**Route:** `/r3al/qotd/index`

### 9. 🏺 NFT Hive (Featured)
**Visual:** Tile with hexagon icon, gold accent
**Text:** "NFT Hive"
**Subtitle:** "Create, trade, and gift unique assets"
**Action:** Tap tile
**Route:** `/r3al/hive/index`

### 10. 👥 Circles (Featured)
**Visual:** Tile with users icon, green accent
**Text:** "Join Circles"
**Subtitle:** "Connect with verified communities"
**Action:** Tap tile
**Route:** `/r3al/circles`

### 11. 🎖️ Profile (Featured)
**Visual:** Tile with award icon, orange accent
**Text:** "Your Profile"
**Subtitle:** "Manage photos and endorsements"
**Action:** Tap tile
**Route:** `/r3al/profile/view`

---

## 🔍 How to Find Optima AI

Many users miss the Optima AI banner because they're looking for a button. Here's how to spot it:

### Visual Markers:
1. **Location:** Very top of scrollable content (below header)
2. **Size:** Wide banner spanning full width
3. **Color:** Gold border (unmissable)
4. **Icon:** Sparkles ✨ on the left side
5. **Text:** "Ask Optima II™" in large gold text

### Step by Step:
1. Open the app
2. Complete onboarding (if first time)
3. Navigate to R3AL Home
4. Look at the **first item** after the header
5. You'll see a large gold-bordered banner
6. That's Optima AI!

### Common Mistakes:
❌ Looking for a small button
❌ Scrolling past it too quickly  
❌ Expecting it in a menu
✅ It's a **prominent banner at the very top**

---

## 📊 Component Styles Reference

If you're looking at the code, here are the style names:

```typescript
// Optima AI Banner
styles.optimaAiBanner          // Main banner container
styles.optimaAiIconContainer   // Sparkle icon circle
styles.optimaAiContent         // Text content area
styles.optimaAiTitle          // "✨ Ask Optima II™"
styles.optimaAiSubtitle       // Description text

// Quick Actions
styles.quickActions           // Row of 4 buttons
styles.quickAction            // Individual button
styles.quickActionPrimary     // Explore (gold background)

// Token Wallet
styles.tokenPreview          // Wallet card container
styles.tokenBalance          // Balance display area
styles.tokenValue            // Large number (e.g., "1,250")

// Featured Tiles
styles.featuredGrid          // Grid container
styles.featureCard           // Individual tile
styles.featureTitle          // Tile title
styles.featureDescription    // Tile subtitle
```

---

## 🎨 Visual Hierarchy

From top to bottom, elements are prioritized:

1. **Header** (Welcome + Settings)
2. **Optima AI Banner** ← Most prominent feature
3. **Quick Actions** (4 buttons)
4. **Token Wallet Preview**
5. **Truth Score Card**
6. **Featured Section** (4 tiles)
7. **Footer** (Legal, Trademarks)

The Optima AI banner is positioned **#2** - right after the header - making it one of the first things users see.

---

## 🧪 Testing Visibility

To verify Optima AI is visible:

1. Start the app:
   ```bash
   ./start-backend.sh  # Terminal 1
   bun start           # Terminal 2
   ```

2. Navigate to `/r3al/home`

3. Look for these visual indicators:
   - ✨ Sparkles icon
   - Gold (#D4AF37) colored border
   - Text "Ask Optima II™"
   - Dark surface background
   - Width spans full screen (minus padding)

4. Tap the banner - should navigate to `/r3al/optima-ai`

5. Optima AI chat interface should load with:
   - Welcome message
   - Quick prompt buttons
   - Text input field
   - Send button

---

## 🐛 Troubleshooting "Can't Find It"

### Issue: "I don't see Optima AI"

**Checklist:**
- [ ] Are you on `/r3al/home` (not main app home)?
- [ ] Did you complete onboarding?
- [ ] Is the page fully loaded?
- [ ] Try scrolling to the very top
- [ ] Check if backend is running (affects all features)

**Debug:**
```bash
# Check if backend is running
curl http://localhost:10000/health

# Restart everything
./scripts/start-full-stack.sh
```

### Issue: "Banner is there but not clickable"

**Possible causes:**
- TouchableOpacity not registered
- JavaScript error preventing interaction
- Modal or overlay covering it

**Fix:**
- Check browser console for errors
- Restart the app
- Verify no error boundaries are catching issues

---

## 📱 Expected User Flow

### First Time User:
1. App opens → Splash screen
2. Onboarding → Welcome, Consent, etc.
3. Questionnaire → Answer questions
4. Profile Setup → Add info
5. **Home Screen** → See Optima AI banner at top!

### Returning User:
1. App opens → Splash screen
2. **Home Screen** → Directly to home, see banner!

### Using Optima AI:
1. See gold banner at top of home
2. Tap banner
3. Chat interface opens
4. Read welcome message
5. Tap quick prompt or type question
6. Get AI response
7. Continue conversation
8. Back button to return to home

---

## ✅ Verification Script

Run this to verify everything:

```bash
# Full system check
./scripts/check-optima-system.sh

# Expected output should include:
# ✅ app/r3al/optima-ai.tsx exists
# ✅ app/r3al/home.tsx exists  
# ✅ Backend running
# ✅ All features accessible
```

---

## 📚 Code Reference

**Banner Code Location:**
- File: `app/r3al/home.tsx`
- Lines: 76-90 (approximately)
- Component: `optimaAiBanner` TouchableOpacity

**Optima AI Chat:**
- File: `app/r3al/optima-ai.tsx`
- Uses: `@rork/toolkit-sdk` for AI generation
- Features: Chat interface, quick prompts, message history

---

## 🎯 Summary

**Optima AI location:** Top of home screen, gold banner with sparkle icon

**All features working:** Yes! Just need backend running

**Quick start:**
```bash
./start-backend.sh  # Terminal 1
bun start           # Terminal 2
```

**Navigate to:** `/r3al/home` and look at the top!

---

**Questions?** Check `QUICK_START_GUIDE.md` or `SYSTEM_STATUS.md`
