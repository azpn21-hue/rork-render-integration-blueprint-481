# R3AL Screenshot Detection & Security System - Enhanced

## 🛡️ Overview

The R3AL app now features a comprehensive screenshot detection and security system with:

- **Real-time screenshot detection** (mobile & web)
- **Haptic/vibration feedback** on capture attempts
- **Strike tracking system** (3 strikes = 24-hour restriction)
- **Visual alerts** with detailed messaging
- **Capture history tracking** with appeal system
- **Restriction enforcement** for repeat offenders

---

## 📱 Features Implemented

### 1. Enhanced Screenshot Detection Hook

**Location:** `hooks/useScreenshotDetection.ts`

**Features:**
- ✅ iOS/Android native screenshot detection via `expo-screen-capture`
- ✅ Web keyboard shortcut detection (PrintScreen, Cmd+Shift+3/4/5, Win+Shift+S)
- ✅ Haptic feedback (iOS) and vibration patterns (Android)
- ✅ Enhanced alert dialogs with emoji icons
- ✅ Auto-logging to capture history
- ✅ Configurable per-screen (enabled, showAlert, preventCapture)

**Alert Example:**
```
🛡️ Privacy Shield Triggered

Screenshot detected on home

This content is protected. The capture has been logged 
and the content owner has been notified.

Repeated violations may result in account restrictions.

[I Understand] [View History]
```

---

### 2. Strike Tracking System

**Location:** `app/contexts/R3alContext.tsx`

**Security State:**
```typescript
interface SecurityState {
  captureStrikes: number;          // Current strike count (0-3+)
  restrictionUntil: string | null; // ISO timestamp for restriction end
  restrictedFeatures: string[];    // List of blocked features
  lastCaptureTimestamp: string | null;
}
```

**Rules:**
- Strike 1-2: Warning alerts + logged events
- Strike 3+: **24-hour account restriction**
  - Blocked features: `['messages', 'vault_edit', 'hive_post']`
  - Restriction timestamp saved
  - Visual warning on home screen

**Functions:**
```typescript
addCaptureEvent(event)  // Increments strikes, applies restrictions
clearStrikes()          // Admin function to reset strikes
isRestricted()          // Check if user is currently restricted
```

---

### 3. Visual Strike Indicators

**Home Screen Warning Card:**

When `captureStrikes > 0`, a warning card appears:

```
⚠️ Privacy Warning
You have 2 of 3 screenshot strikes. Further violations 
will result in a 24-hour restriction.

● ● ○  (visual strike dots)
```

When `captureStrikes >= 3`:

```
⛔ Account Restricted
Your account has been restricted due to 3 screenshot 
violations. Restriction expires on [date/time].

● ● ●  (all dots red)
```

**Capture History Status:**

Shows strike counter at top:
```
Security Status          2 / 3 Strikes
```

If restricted:
```
⛔ Account restricted until [date/time]
```

---

### 4. Capture History & Appeals

**Location:** `app/r3al/security/capture-history.tsx`

**Features:**
- List of all capture events (up to 50 most recent)
- Event details: screen name, timestamp, status
- Status badges: Detected, Under Review, Resolved, Dismissed
- Appeal button for each event
- Strike counter display
- Empty state when no captures

**Location:** `app/r3al/security/appeal-form.tsx`

**Features:**
- Subject field (100 chars max)
- Explanation field (1000 chars max)
- Character counter
- Submit validation
- Status update on submission

---

## 🧪 Testing

### Test Button on Home Screen

A dedicated test button simulates screenshot detection:

```typescript
🎬 Test Screenshot Alarm
- Triggers haptic/vibration feedback
- Increments strike counter
- Logs event to capture history
- Shows full alert dialog
- Updates security state
```

**How to test:**
1. Navigate to R3AL Home (`/r3al/home`)
2. Tap "Test Screenshot Alarm" button
3. Observe:
   - Vibration/haptic feedback
   - Alert dialog appears
   - Strike counter increments
   - Warning card appears (after 1+ strikes)
   - Restriction applied at 3 strikes
4. Check "Content Capture History" to see logged events

---

## 🔊 Feedback Mechanisms

### Haptic Feedback (iOS)
```typescript
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
```

### Vibration (Android)
```typescript
Vibration.vibrate([0, 200, 100, 200])  // Double-pulse pattern
```

### Visual Alerts
- Alert dialogs with 🛡️ emoji
- Warning cards with ⚠️ or ⛔ icons
- Color-coded strike dots (gold → yellow → red)
- Status badges in capture history

### Console Logs
```
🚨 [ScreenshotDetection] Screenshot detected!
⚠️ [Security] Capture event logged. Strikes: 2/3
⛔ [Security] User restricted until [timestamp] due to 3 strikes
✅ [Security] Strikes cleared
```

---

## 🎨 UI Design

### Color Scheme
- **Warning (1-2 strikes):** `#FFC107` (yellow/gold)
- **Danger (3+ strikes):** `#B00020` (red)
- **Success:** `#16C784` (green)
- **Gold accent:** `#D4AF37`

### Component Styling
- Cards: 8px border radius, 2px border
- Badges: Semi-transparent backgrounds (color + '15')
- Strike dots: 16x16px circles with 2px borders
- Buttons: 16px padding, rounded corners

---

## 🔒 Privacy & Security

### Data Stored
```json
{
  "id": "capture_[timestamp]_[random]",
  "screen": "home",
  "timestamp": "2025-11-02T...",
  "status": "recorded"
}
```

### Data NOT Stored
- ❌ User identifiers (beyond session)
- ❌ Screenshot images
- ❌ Device metadata
- ❌ Location data

### Retention
- Maximum 50 recent capture events
- Auto-purge after 90 days (optional)
- Strikes reset via admin function
- Restrictions expire after 24 hours

---

## 📋 Next Steps (Optional Enhancements)

1. **Audio Alerts**
   - Add warning sound on capture detection
   - Success chime for appeal resolution

2. **Admin Dashboard**
   - Review pending appeals
   - Manual strike adjustment
   - User restriction management

3. **Photo Validation**
   - AI filter detection
   - Deepfake/AI-generated image blocking
   - Trust score integration

4. **Integrity Index**
   - Composite score from behavior, community, and photo trust
   - Badge system (Verified, Reviewing, Unverified)
   - Trend tracking over time

5. **Escalation Workflow**
   - Auto-flag high-severity screens (vault, messages)
   - Supervisor notification for repeat offenders
   - Case management system

---

## 🐛 Troubleshooting

### Screenshot Detection Not Working on Mobile

**Check:**
1. `expo-screen-capture` is installed: `npm list expo-screen-capture`
2. Hook is called in component: `useScreenshotDetection({ screenName: 'home', enabled: true })`
3. Permissions granted (iOS may require camera/photo permissions)
4. Console shows listener setup: `[ScreenshotDetection] Listener added successfully`

### Web Detection Not Triggering

**Check:**
1. Browser allows keyboard event detection
2. Console shows: `[ScreenshotDetection] Web keyboard listener added`
3. Try PrintScreen key or Cmd+Shift+3 (Mac) / Win+Shift+S (Windows)

### Haptics Not Working

**Check:**
1. `expo-haptics` is installed
2. Device supports haptic feedback (not all Android devices do)
3. Device volume/haptic settings enabled
4. iOS: Check Settings → Sounds & Haptics → System Haptics

### Strikes Not Incrementing

**Check:**
1. `R3alContext` is wrapping the app
2. `addCaptureEvent` function is called
3. Console shows: `⚠️ [Security] Capture event logged. Strikes: X/3`
4. AsyncStorage is working (check with React Native Debugger)

---

## 📖 API Reference

### `useScreenshotDetection(options)`

**Parameters:**
```typescript
{
  screenName: string;      // Identifier for the screen
  enabled?: boolean;       // Enable/disable detection (default: true)
  showAlert?: boolean;     // Show alert dialog (default: true)
  preventCapture?: boolean;// Block screenshots on mobile (default: false)
}
```

**Returns:** `void`

**Example:**
```typescript
useScreenshotDetection({
  screenName: 'profile_view',
  enabled: true,
  showAlert: true,
  preventCapture: true,  // Blocks screenshots on mobile
});
```

### `useR3al()` - Security Functions

```typescript
const { 
  security,           // Current security state
  captureHistory,     // Array of capture events
  addCaptureEvent,    // Log new capture
  submitAppeal,       // Submit appeal
  clearStrikes,       // Reset strikes
  isRestricted,       // Check restriction status
} = useR3al();
```

---

## ✅ Implementation Checklist

- [x] Screenshot detection hook with haptics
- [x] Strike tracking system (3-strike rule)
- [x] Visual warning cards on home screen
- [x] Strike indicator dots (animated)
- [x] Capture history screen with events
- [x] Appeal form with validation
- [x] Security status display
- [x] Test button for manual testing
- [x] Enhanced alert dialogs
- [x] Console logging for debugging
- [x] AsyncStorage persistence
- [x] 24-hour restriction enforcement
- [x] Web fallback (keyboard detection)
- [x] Documentation

---

## 🎯 Summary

The R3AL screenshot detection system is now fully functional with:

✅ **Detection**: Native mobile + web keyboard shortcuts  
✅ **Feedback**: Haptics + vibration + visual + console logs  
✅ **Enforcement**: 3-strike rule with 24-hour restrictions  
✅ **History**: Full capture log with appeal system  
✅ **Testing**: Built-in test button for validation  

**Try it now:**
1. Navigate to `/r3al/home`
2. Click "Test Screenshot Alarm"
3. See the magic happen! 🎬

---

*Built by a Special Forces Operator with security, intelligence, and unfiltered reality at its core.*
