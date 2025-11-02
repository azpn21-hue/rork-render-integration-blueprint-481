# R3AL Developer Mode Guide

## Overview

Developer mode allows you to bypass ID verification for testing and development purposes. This is useful for quickly accessing the app without going through the full verification flow.

## How to Enable Developer Mode

1. **Launch the app** - Open R3AL and wait for the splash screen
2. **Tap the R3AL logo 7 times** - Quickly tap the gold R3AL logo on the splash screen 7 times (within 2 seconds)
3. **Confirmation** - You'll see an alert: "Developer mode enabled! You can now login before verification."

## How to Use Developer Mode

### Option 1: From Verification Intro Screen
1. After enabling dev mode, proceed through the onboarding flow
2. When you reach the ID verification intro screen, you'll see a **"Dev Login"** button
3. Tap the "Dev Login" button to go to the login screen

### Option 2: Direct Login
1. If you're already at the verification screen, tap the "Dev Login" button
2. You'll be taken to the login screen

### Admin Credentials

When in developer mode, the login screen shows a special badge:

**Email:** `admin@r3al.app`  
**Password:** `R3alDev2025!`

**Quick Fill:** Tap the "Developer Mode" badge at the top of the login form to automatically fill in the admin credentials.

### What Admin Login Does

When you login with admin credentials:
- ✅ Automatically accepts NDA
- ✅ Skips ID verification
- ✅ Takes you directly to `/r3al/home`
- ✅ Marks verification as skipped in storage

### Regular Users in Dev Mode

If you login with regular (non-admin) credentials in dev mode:
- You still need to accept the NDA
- You still need to complete verification
- The only difference is you can access the login screen before verification

## Disabling Developer Mode

To disable developer mode:
1. Go to the splash screen (relaunch the app)
2. Tap the R3AL logo 7 times again
3. You'll see: "Developer mode disabled"

## Technical Details

### Storage Keys
- Dev mode state: `@r3al_dev_mode`
- Verification skipped: `@r3al_verification_skipped`

### Files Modified
- `app/config/constants.ts` - Added dev credentials and storage keys
- `app/r3al/splash.tsx` - Added tap gesture to toggle dev mode
- `app/r3al/verification/intro.tsx` - Added dev login button
- `app/contexts/AuthContext.tsx` - Added admin login detection
- `app/login.tsx` - Added dev mode badge and auto-fill

## Security Notes

⚠️ **Important:** This feature is for development and testing only. Make sure to:
- Never ship the app with dev mode enabled by default
- Change or remove the hardcoded admin credentials before production
- Consider adding environment checks to disable this feature in production builds

## Testing Checklist

- [ ] Enable dev mode from splash screen
- [ ] See dev login button on verification intro
- [ ] Login with admin credentials
- [ ] Verify direct access to home screen
- [ ] Verify NDA and verification are skipped
- [ ] Disable dev mode and verify button disappears
- [ ] Test regular user login in dev mode
