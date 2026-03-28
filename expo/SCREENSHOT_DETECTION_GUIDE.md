# Screenshot Detection Implementation Guide

## Overview

The R3AL app now includes comprehensive screenshot detection and logging functionality to protect sensitive content and maintain privacy standards.

## How It Works

### Core Components

1. **Hook: `useScreenshotDetection`** (`hooks/useScreenshotDetection.ts`)
   - Monitors screenshot/screen capture events on mobile and web
   - Logs events to capture history
   - Shows alerts to users when screenshots are detected
   - Optional: Can prevent screenshots on mobile (Android/iOS)

2. **Context: `R3alContext`** (`app/contexts/R3alContext.tsx`)
   - Stores capture history in persistent storage (AsyncStorage)
   - Provides `addCaptureEvent` function
   - Maintains up to 50 most recent capture events

3. **Screens**:
   - **Capture History** (`app/r3al/security/capture-history.tsx`) - View all detection events
   - **Appeal Form** (`app/r3al/security/appeal-form.tsx`) - Contest false positives

## Usage

### Adding Screenshot Detection to a Screen

```typescript
import { useScreenshotDetection } from '@/hooks/useScreenshotDetection';

export default function MyProtectedScreen() {
  // Enable screenshot detection
  useScreenshotDetection({
    screenName: 'my_screen_name',      // Required: identifier for this screen
    enabled: true,                     // Optional: toggle detection on/off
    showAlert: true,                   // Optional: show alert to user
    preventCapture: false,             // Optional: block screenshots (mobile only)
  });

  // ... rest of your component
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `screenName` | string | **required** | Identifier for the screen in capture logs |
| `enabled` | boolean | `true` | Enable/disable detection for this screen |
| `showAlert` | boolean | `true` | Show alert dialog when screenshot detected |
| `preventCapture` | boolean | `false` | Physically block screenshots (mobile only) |

## Platform Support

### Mobile (iOS/Android)
- ✅ Real-time screenshot detection via `expo-screen-capture`
- ✅ Optional screenshot prevention
- ✅ Native alerts
- ✅ Captures all screenshot methods

### Web
- ✅ Keyboard shortcut detection (PrintScreen, Cmd+Shift+3/4/5, Win+Shift+S)
- ✅ Browser alerts
- ⚠️ Cannot prevent screenshots (browser limitation)
- ⚠️ Cannot detect browser extension screenshots

## Testing

### Test Button on Home Screen

The home screen includes a **"Test Screenshot Alarm"** button that simulates a screenshot detection event:

1. Navigate to `/r3al/home`
2. Click **"Test Screenshot Alarm"** (yellow button with camera icon)
3. Alert will show confirming detection
4. Check **"Content Capture History"** to see the logged event

### Testing Real Screenshots

**Mobile:**
1. Navigate to any protected screen (home, profile, etc.)
2. Take a screenshot using device shortcuts:
   - **iOS**: Press Side Button + Volume Up
   - **Android**: Press Power + Volume Down
3. Alert should appear immediately
4. Event logged to capture history

**Web:**
1. Navigate to any protected screen
2. Press screenshot shortcuts:
   - **Windows**: `Win + Shift + S` or `PrintScreen`
   - **Mac**: `Cmd + Shift + 3/4/5`
3. Alert should appear
4. Event logged to capture history

## Data Structure

### Capture Event

```typescript
interface CaptureEvent {
  id: string;                    // Unique identifier
  screen: string;                // Screen name where capture occurred
  timestamp: string;             // ISO 8601 timestamp
  status: "recorded" |           // Initial state
          "appeal_pending" |     // User filed appeal
          "resolved" |           // Appeal accepted
          "dismissed";           // Appeal rejected
}
```

### Storage
- Events stored in AsyncStorage under `@r3al_state`
- Maximum 50 events retained (oldest auto-purged)
- Persists across app restarts

## Screens Using Detection

Currently enabled on:
- ✅ `/r3al/home` - Home screen with Truth Score
- ✅ `/r3al/profile/setup` - Profile creation/editing

### Adding to More Screens

To protect additional screens, simply add the hook:

```typescript
// In any screen component
import { useScreenshotDetection } from '@/hooks/useScreenshotDetection';

export default function MyScreen() {
  useScreenshotDetection({
    screenName: 'questionnaire',
    enabled: true,
    showAlert: true,
  });
  
  // ... component code
}
```

## Viewing Capture History

1. Navigate to Home screen
2. Tap **"Content Capture History"**
3. View list of all detection events
4. Tap any event to file an appeal

### Appeal Process

1. From Capture History, tap on a detection event
2. Fill in appeal form:
   - **Subject**: Brief description
   - **Explanation**: Detailed reasoning (max 1000 chars)
3. Submit appeal
4. Status changes to "Under Review"
5. Moderator reviews and updates status

## Privacy & Security

### What We Log
- ✅ Screen identifier
- ✅ Timestamp
- ✅ Appeal text (if filed)

### What We DON'T Log
- ❌ User identifiers
- ❌ Actual screenshot images
- ❌ Device information
- ❌ Location data
- ❌ User metadata

### Data Retention
- Events auto-purge after 90 days (planned)
- User can't delete events (audit trail)
- Appeals encrypted in transit

## Troubleshooting

### Screenshots Not Being Detected

**Mobile:**
1. Check `expo-screen-capture` is installed:
   ```bash
   bun expo install expo-screen-capture
   ```
2. Verify hook is called in component
3. Check console logs for errors
4. Ensure `enabled: true` in hook options

**Web:**
1. Open browser console
2. Look for `[ScreenshotDetection]` logs
3. Verify keyboard event listeners are attached
4. Try different screenshot shortcuts

### No Alert Showing

1. Verify `showAlert: true` in hook options
2. Check if alerts are blocked in browser/OS
3. Look for console errors

### Events Not Persisting

1. Check AsyncStorage permissions
2. Verify R3alContext provider wraps app
3. Check console for save errors

## Performance Considerations

- Minimal performance impact (event listeners only)
- No polling or continuous monitoring
- Cleanup automatically on component unmount
- Web keyboard listeners are lightweight

## Future Enhancements

- [ ] Auto-purge events after 90 days
- [ ] Admin dashboard for reviewing appeals
- [ ] ML-based false positive reduction
- [ ] Watermarking for screenshots
- [ ] Cloud sync of capture events
- [ ] Analytics dashboard

## Dependencies

```json
{
  "expo-screen-capture": "^7.0.0",
  "@react-native-async-storage/async-storage": "^2.1.0"
}
```

## Support

For issues or questions:
- Check console logs for detailed error messages
- Review this guide for configuration options
- Test with the built-in test button first
