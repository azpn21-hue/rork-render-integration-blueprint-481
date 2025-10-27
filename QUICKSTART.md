# ⚡ R3AL Connection - Quick Start Guide

Get up and running in 5 minutes!

---

## 🎯 Prerequisites

- [ ] Node.js installed ([install with nvm](https://github.com/nvm-sh/nvm))
- [ ] Bun installed ([install Bun](https://bun.sh/docs/installation))
- [ ] Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

---

## 🚀 Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>

# Install dependencies
bun install

# Verify environment variables
cat .env
```

### Step 2: Start the App

```bash
# Start Expo development server with tunnel
bun run start

# Alternative: Start web preview
bun run start-web
```

### Step 3: Open on Your Device

**iOS:**
1. Open Expo Go app
2. Scan the QR code from terminal
3. App will load in a few seconds

**Android:**
1. Open Expo Go app
2. Scan the QR code from terminal
3. App will load in a few seconds

**Web:**
1. Press `w` in terminal to open web browser
2. Or navigate to the URL shown in terminal

---

## ✅ Test Authentication Flow

### Test 1: Create Account

1. On the Login screen, click **"Create Account"**
2. Fill in:
   - **Name**: Your Name
   - **Email**: test@example.com
   - **Password**: password123
   - **Confirm Password**: password123
3. Click **"Create Account"**
4. ✅ Should redirect to NDA screen
5. Check the agreement checkbox
6. Click **"Accept and Continue"**
7. ✅ Should redirect to Home screen showing your name

### Test 2: Login

1. From Home screen, go to Profile
2. Logout
3. On Login screen, enter:
   - **Email**: test@example.com
   - **Password**: password123
4. Click **"Sign In"**
5. ✅ Should redirect to Home screen (NDA already accepted)

### Test 3: Guest Mode

1. From Home screen, go to Profile
2. Logout
3. On Login screen, click **"Continue as Guest"**
4. Click **"Continue as Guest"** button
5. Accept NDA
6. ✅ Should see Home screen with "Guest User" and "Guest Mode" badge

---

## 🧪 Test Backend Connection

```bash
# Test all microservices
bun run test:render

# Expected output:
# Testing gateway: https://rork-gateway.onrender.com
# ✅ gateway service: ONLINE (200)
# 
# Testing hive: https://hive-core.onrender.com
# ✅ hive service: ONLINE (200)
# 
# ... and so on
```

**Note**: Services may show "TIMEOUT" or "NO RESPONSE" if not deployed yet. This is expected.

---

## 🐛 Common Issues

### Issue: "Network Error" or "URI empty"

**Solution**:
```bash
# 1. Stop the dev server (Ctrl+C)
# 2. Clear cache and restart
bun run start -- --clear
```

### Issue: "Can't connect to Metro"

**Solution**:
```bash
# Make sure you're on the same WiFi network as your computer
# Or use tunnel mode:
bun run start -- --tunnel
```

### Issue: "Module not found"

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
bun install
bun run start -- --clear
```

### Issue: "App crashes on startup"

**Solution**:
```bash
# Check console for errors
# Make sure .env file exists with proper values
cat .env

# Restart with clear cache
bun run start -- --clear
```

---

## 📱 App Structure Overview

```
Login Screen (/)
    ↓
NDA Screen (/nda)
    ↓
Home Screen (/home)
    └── Profile Screen (/home/profile)
```

### Authentication States

1. **Not Authenticated** → Redirects to Login
2. **Authenticated + No NDA** → Redirects to NDA
3. **Authenticated + NDA Accepted** → Access to Home
4. **Guest Mode** → Same flow as authenticated user

---

## 🎨 Screens Overview

### Login Screen (`/login`)
- Email/password login
- Link to registration
- Guest mode option
- Beautiful gradient background
- Responsive design

### Register Screen (`/register`)
- Name, email, password fields
- Password confirmation
- Form validation
- Back to login option

### Guest Screen (`/guest`)
- Information about guest mode
- Feature limitations list
- Warning about data persistence
- Continue or go back options

### NDA Screen (`/nda`)
- Terms and conditions
- Checkbox to accept
- Can't proceed without accepting
- Scrollable content

### Home Screen (`/home`)
- Welcome message with user name
- System status indicator
- Stats grid (sessions, users, API calls, uptime)
- Connection info card
- Test API button
- Navigation to profile

### Profile Screen (`/home/profile`)
- User information
- Account settings
- Logout button
- Guest mode indicator

---

## 🔍 Debugging Tips

### View Console Logs

**Expo CLI:**
```bash
# In terminal where you ran 'bun run start'
# Logs will appear automatically
```

**Chrome DevTools (Web):**
1. Open app in web browser
2. Press F12 or Cmd+Option+I
3. Go to Console tab

**React Native Debugger:**
```bash
# Install standalone debugger
brew install --cask react-native-debugger

# Start it
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Check Auth State

Add this to any screen to debug:
```typescript
import { useAuth } from '@/app/contexts/AuthContext';

export default function MyScreen() {
  const auth = useAuth();
  console.log('Auth State:', {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    ndaAccepted: auth.ndaAccepted,
    isLoading: auth.isLoading,
  });
  // ... rest of component
}
```

### Clear App Data

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clear all stored data
await AsyncStorage.clear();

// Clear specific keys
await AsyncStorage.multiRemove([
  '@r3al_user',
  '@r3al_token',
  '@r3al_nda_accepted',
]);
```

---

## 🛠️ Development Commands

```bash
# Start development server
bun run start

# Start with clear cache
bun run start -- --clear

# Start with tunnel (if same network doesn't work)
bun run start -- --tunnel

# Web preview
bun run start-web

# Test backend connection
bun run test:render

# Run linter
bun run lint
```

---

## 📊 Environment Variables Explained

```bash
# Frontend API URL (used by Expo app)
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-gateway.onrender.com
# This is the main URL your app connects to

# Backend Service URLs (used by backend services to talk to each other)
API_GATEWAY_URL=https://rork-gateway.onrender.com
HIVE_CORE_URL=https://hive-core.onrender.com
VAULT_URL=https://vault-service.onrender.com
COMMS_URL=https://comms-gateway.onrender.com
PAYMENT_URL=https://monetization-engine.onrender.com

# Render Configuration
RENDER_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
RENDER_REGION=virginia

# Security
JWT_SECRET=UltraSecureKey123!  # Used for token signing
STRIPE_KEY=sk_test_RorkAIIntegration  # Stripe test key

# App Settings
OPTIMA_MODE=prod
OPTIMA_NAME="Optima II"
```

---

## 🎯 Next Steps

### For Frontend Development
1. ✅ Authentication works
2. ✅ Navigation flows properly
3. 🔲 Connect to real APIs
4. 🔲 Add more screens
5. 🔲 Implement chat functionality
6. 🔲 Add payment flows

### For Backend Development
1. 🔲 Deploy microservices to Render
2. 🔲 Set up PostgreSQL database
3. 🔲 Configure Redis cache
4. 🔲 Implement actual API endpoints
5. 🔲 Add WebSocket for real-time features
6. 🔲 Set up Stripe integration

### For Production
1. 🔲 Replace test keys with production keys
2. 🔲 Enable SSL/TLS
3. 🔲 Set up monitoring
4. 🔲 Configure CDN
5. 🔲 Submit to App Store / Play Store

---

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[API_REFERENCE.md](API_REFERENCE.md)** - Full API documentation
- **[FIXES_APPLIED.md](FIXES_APPLIED.md)** - What was fixed
- **[README.md](README.md)** - General project information

---

## 💡 Pro Tips

### Faster Reloads
- **iOS**: Shake device → "Reload"
- **Android**: Shake device → "Reload"
- **Both**: `r` in terminal

### Show Dev Menu
- **iOS**: Shake device or Cmd+D in simulator
- **Android**: Shake device or Cmd+M in emulator

### Test on Multiple Devices
- All devices must be on same WiFi
- Or use tunnel mode: `bun run start -- --tunnel`

### Hot Reload Not Working?
```bash
# Restart with clear cache
bun run start -- --clear
```

---

## ✅ Checklist: Is Everything Working?

- [ ] App loads without errors
- [ ] Login screen appears
- [ ] Can create new account
- [ ] Redirects to NDA screen after registration
- [ ] Can accept NDA
- [ ] Redirects to Home screen after NDA
- [ ] Home screen shows user name
- [ ] Can navigate to Profile
- [ ] Can logout
- [ ] Guest mode works
- [ ] No console errors

If all checked: **🎉 You're ready to develop!**

---

## 🆘 Still Having Issues?

1. **Check console logs** for error messages
2. **Clear cache**: `bun run start -- --clear`
3. **Reinstall dependencies**: `rm -rf node_modules && bun install`
4. **Check environment**: `cat .env`
5. **Test backend**: `bun run test:render`
6. **Review fixes**: Read [FIXES_APPLIED.md](FIXES_APPLIED.md)

---

**Happy coding! 🚀**
