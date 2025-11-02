# R3AL Beta Branding & Promo Implementation

## ✅ Completed Changes

### 1. Beta Promo Screen (`app/r3al/promo-beta.tsx`)
**Status**: ✅ Created and Functional

**Features**:
- Special Forces Operator headline and branding
- Military-grade security messaging
- Three feature cards with icons:
  - 🛡️ Military-Grade Security
  - 🔒 Privacy First
  - 👁️ Unfiltered Reality
- Beta badge with expiration date display
- Primary "Continue" button → Onboarding
- Secondary "Learn More" button (ready for implementation)
- Responsive layout with safe area insets
- Gold theme with dark gradient background

**Route**: `/r3al/promo-beta`

---

### 2. Updated Manifest (`schemas/r3al/manifest.json`)
**Status**: ✅ Updated

**New Fields Added**:
```json
{
  "branding": {
    "logo": "./assets/r3al_mask_beta.png",
    "palette": {
      "primary": "#D4AF37",
      "background": "#0A0A0A",
      "surface": "#111111"
    },
    "version": "R3AL-FracturedMask-Beta"
  },
  "beta_promo": {
    "enabled": true,
    "ends_at": "2025-03-15T00:00:00.000Z"
  }
}
```

**Beta Duration**: ~75 days (until March 15, 2025)

---

### 3. Splash Screen Routing (`app/r3al/splash.tsx`)
**Status**: ✅ Updated

**Logic**:
```
Splash Screen (3 seconds with pulse animation)
    ↓
Check beta_promo.enabled && current date < beta_promo.ends_at
    ↓
If Beta Active → /r3al/promo-beta
If Beta Ended → /r3al/onboarding/welcome
```

---

### 4. Route Registration (`app/r3al/_layout.tsx`)
**Status**: ✅ Updated

Added `promo-beta` screen to the stack navigation.

---

### 5. Debugging & Logging
**Status**: ✅ Enhanced

Added console logs to:
- **R3alContext**: State loading from AsyncStorage
- **Index Router**: Navigation decision logging

This will help diagnose the white screen issue.

---

## 📋 Current App Flow

```
app/index.tsx (Root Loader)
    ↓
Checks R3alContext state
    ↓
If no state → /r3al/splash
    ↓
Splash Screen (3s animation)
    ↓
If beta_promo.enabled && current date < ends_at
    ↓
/r3al/promo-beta
    ↓
Continue Button
    ↓
/r3al/onboarding/welcome
    ↓
/r3al/onboarding/consent (NDA)
    ↓
/r3al/verification/intro
    ↓
/r3al/verification/index
    ↓
/r3al/questionnaire/index
    ↓
/r3al/questionnaire/result (Truth Score calculated)
    ↓
/r3al/profile/setup
    ↓
/r3al/home
```

---

## 🎨 Design Tokens

**Color Palette**:
- Gold: `#D4AF37` (primary, buttons, accents)
- Background: `#0A0A0A` (dark)
- Surface: `#111111` (cards, inputs)
- Text: White/off-white
- Text Secondary: Gray

**Typography**:
- Headlines: Bold, 28-32px
- Body: Regular, 16px
- Secondary: 14px

---

## 🐛 White Screen Troubleshooting

### Potential Causes:
1. **R3alContext not loading**: AsyncStorage might be blocked
2. **Navigation loop**: Router stuck in redirect cycle
3. **Missing dependencies**: Linear gradient or lucide icons
4. **Schema parsing error**: manifest.json or other JSON files

### Debug Steps:
1. **Check Console Logs**:
   - Look for `[R3AL] Loading state from AsyncStorage...`
   - Look for `[Index] State: { ... }`
   - Check for any error messages

2. **Clear AsyncStorage**:
   ```javascript
   // In your app, add a temporary button:
   import AsyncStorage from '@react-native-async-storage/async-storage';
   await AsyncStorage.clear();
   ```

3. **Test Navigation Directly**:
   Navigate to `/r3al/splash` or `/r3al/promo-beta` manually

4. **Verify Dependencies**:
   ```bash
   npm list expo-linear-gradient
   npm list lucide-react-native
   npm list @react-native-async-storage/async-storage
   ```

5. **Check Platform**:
   - Web might have different behavior than native
   - Test on both if possible

---

## 📦 Files Modified/Created

### Created:
- ✅ `app/r3al/promo-beta.tsx` (Beta promo screen)
- ✅ `NAS_CONFIGURATION.md` (NAS setup documentation)
- ✅ `scripts/r3al-beta-brand-patch.js` (Patch documentation script)
- ✅ `R3AL_BETA_IMPLEMENTATION.md` (This file)

### Modified:
- ✅ `app/r3al/_layout.tsx` (Added promo-beta route)
- ✅ `app/r3al/splash.tsx` (Added beta routing logic)
- ✅ `schemas/r3al/manifest.json` (Added branding + beta_promo)
- ✅ `app/contexts/R3alContext.tsx` (Added debug logging)
- ✅ `app/index.tsx` (Added debug logging)

---

## 🚀 Next Steps

### Required (to fix white screen):
1. **Check browser/metro console** for error messages
2. **Clear app storage** and test fresh start
3. **Verify all JSON schemas** are valid (no syntax errors)

### Optional Enhancements:
1. **Add Logo Image**:
   - Place fractured mask image at `assets/images/r3al_mask_beta.png`
   - Update `promo-beta.tsx` to use `<Image>` instead of text logo
   
2. **Extend Beta Period**:
   - Edit `schemas/r3al/manifest.json`
   - Change `beta_promo.ends_at` to later date

3. **Implement "Learn More"**:
   - Add modal with more details
   - Or navigate to info page
   - Or open external URL

4. **Add Hero Image**:
   - Add full promo image with headshot + mask
   - Display at top of promo-beta screen

---

## 🔧 Testing Commands

```bash
# Start the app
npm start

# Check logs
# Look for:
# - [R3AL] Loading state from AsyncStorage...
# - [Index] State: { ... }

# Clear and rebuild
# If needed, clear metro cache:
npm start -- --clear

# Run verification script
node scripts/r3al-beta-brand-patch.js
```

---

## 📞 Support

If white screen persists:
1. Share console logs (look for errors)
2. Test on different platform (web vs mobile)
3. Check if you can navigate to `/r3al/promo-beta` directly
4. Verify AsyncStorage permissions (mobile)

---

## 📊 NAS Configuration

See `NAS_CONFIGURATION.md` for complete Buffalo NAS setup:
- ✅ IP: 192.168.1.119
- ✅ Share: /share
- ✅ Mount: /mnt/nas
- ✅ Auto-sync agent ready
- ✅ R3AL Hive integration configured

---

**Implementation Date**: 2025-11-02
**Beta Ends**: 2025-03-15
**Version**: R3AL-FracturedMask-Beta 1.0.0
