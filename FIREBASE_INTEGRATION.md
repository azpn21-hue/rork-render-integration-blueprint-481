# 🔥 Firebase + Google Cloud Integration Guide

## Current Status

Your R3AL backend is currently set up with:

✅ **Google Cloud Run** - Hosting FastAPI/Node backend
✅ **Cloud Storage (GCS)** - File storage for NFTs, photos
✅ **Cloud Build** - Container image building
✅ **Vertex AI** - Available for ML features
✅ **Service Account** - IAM permissions configured

❌ **Firebase** - NOT yet enabled (but easy to add)

---

## Should You Add Firebase?

### You DON'T Need Firebase If:
- ✅ You're happy with current tRPC + AsyncStorage setup
- ✅ Backend handles all auth via your own system
- ✅ No real-time features needed beyond what you have
- ✅ Push notifications not required

### You SHOULD Add Firebase If:
- 🎯 Want Google/Apple social login
- 🎯 Need real-time database sync (Firestore)
- 🎯 Want push notifications (FCM)
- 🎯 Need Firebase Analytics/Crashlytics
- 🎯 Want easier mobile-first auth flows

---

## Current Architecture (No Firebase)

```
Rork App (React Native)
    ↓
tRPC Client
    ↓
Backend (Hono + tRPC)
    ↓
├── Cloud Storage (GCS) - photos, NFTs
├── Cloud Run - hosting
└── Vertex AI - ML models
```

**Storage:** AsyncStorage (local) + Backend API
**Auth:** Custom token system via tRPC
**Real-time:** Polling or manual refresh

---

## With Firebase Architecture

```
Rork App (React Native)
    ↓
├── Firebase SDK ───┐
│   ├── Auth       │
│   ├── Firestore  │
│   └── FCM        │
│                  │
└── tRPC Client    │
    ↓              ↓
Backend (Hono + tRPC) ← Verifies Firebase tokens
    ↓
├── Cloud Storage (GCS)
├── Firestore (real-time DB)
├── Cloud Run
└── Vertex AI
```

**Storage:** Firestore (real-time) + GCS (files) + AsyncStorage (offline)
**Auth:** Firebase Auth (email, Google, Apple, etc.)
**Real-time:** Firestore `onSnapshot` listeners
**Push:** Firebase Cloud Messaging

---

## How to Add Firebase (Step-by-Step)

### Step 1: Enable Firebase in Your Project

```bash
# 1. Go to Firebase Console
https://console.firebase.google.com

# 2. Click "Add project"

# 3. Select "Use existing project"

# 4. Choose: civic-origin-476705-j8

# 5. Confirm and enable Firebase
```

This links Firebase to your existing Google Cloud project!

### Step 2: Install Firebase SDK

```bash
# In your Rork app
bun install firebase

# Or npm
npm install firebase
```

### Step 3: Get Firebase Config

1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps"
3. Click "Add app" → Web (</>) icon
4. Register app, get config object

### Step 4: Create Firebase Config File

Create `app/config/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "civic-origin-476705-j8.firebaseapp.com",
  projectId: "civic-origin-476705-j8",
  storageBucket: "optima-core-data",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Messaging only on web
export const messaging = typeof window !== 'undefined' && isSupported() 
  ? getMessaging(app) 
  : null;
```

### Step 5: Update .env

Add to `.env`:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=<your-api-key>
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=civic-origin-476705-j8.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=civic-origin-476705-j8
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=optima-core-data
EXPO_PUBLIC_FIREBASE_SENDER_ID=<your-sender-id>
EXPO_PUBLIC_FIREBASE_APP_ID=<your-app-id>
```

### Step 6: Add Firebase Auth to Backend

```bash
# In backend
bun install firebase-admin
```

Create `backend/firebase/admin.ts`:

```typescript
import admin from "firebase-admin";

const serviceAccount = require("../../.secrets/service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "civic-origin-476705-j8",
});

export const auth = admin.auth();
export const firestore = admin.firestore();
```

### Step 7: Add Token Verification Middleware

Update `backend/trpc/create-context.ts`:

```typescript
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { auth as firebaseAuth } from "../firebase/admin";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const authHeader = opts.req.headers.get("authorization");
  
  let user = null;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    
    try {
      // Verify Firebase token
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      user = {
        id: decodedToken.uid,
        email: decodedToken.email,
        token: token,
      };
      console.log("[Auth] Firebase user verified:", user.id);
    } catch (error) {
      console.error("[Auth] Token verification failed:", error);
      // Fall back to anonymous
      user = { id: "anonymous", token: "anonymous" };
    }
  }

  return {
    req: opts.req,
    user,
  };
};

// ... rest of file unchanged
```

### Step 8: Update Frontend Auth Context

Modify `app/contexts/AuthContext.tsx` to use Firebase:

```typescript
import { auth } from "@/app/config/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return { user, loading, login, register, logout };
});
```

### Step 9: Use Firebase Auth in tRPC Calls

Update `lib/trpc.ts` to include Firebase token:

```typescript
import { auth } from "@/app/config/firebase";

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (url, options) => {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
          },
        });
      },
    }),
  ],
});
```

---

## Firebase Features You Can Add

### 1. Firestore (Real-time Database)

**Use for:**
- User profiles (sync across devices)
- Pulse Chat messages (real-time)
- Feed posts
- Reactions, comments
- Circle memberships

**Example:**

```typescript
import { db } from "@/app/config/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

// Save pulse message
await addDoc(collection(db, "pulse_messages"), {
  userId: user.uid,
  text: "Hello!",
  timestamp: Date.now(),
});

// Listen to messages (real-time)
const unsubscribe = onSnapshot(
  collection(db, "pulse_messages"),
  (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMessages(messages);
  }
);
```

### 2. Firebase Authentication

**Use for:**
- Email/password login
- Google sign-in
- Apple sign-in
- Phone auth
- Password reset

**Example:**

```typescript
import { auth } from "@/app/config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Google Sign-In
const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
const user = result.user;
```

### 3. Firebase Cloud Messaging (Push Notifications)

**Use for:**
- New message alerts
- Endorsement notifications
- QOTD reminders
- Circle invites

**Example:**

```typescript
import { messaging } from "@/app/config/firebase";
import { getToken } from "firebase/messaging";

// Request notification permission
const token = await getToken(messaging, {
  vapidKey: "your-vapid-key"
});

// Save token to backend
await trpc.profile.saveNotificationToken.mutate({ token });
```

### 4. Firebase Analytics

**Use for:**
- Track user behavior
- Feature usage stats
- Conversion tracking
- A/B testing

**Example:**

```typescript
import { getAnalytics, logEvent } from "firebase/analytics";

const analytics = getAnalytics();

// Log events
logEvent(analytics, 'feature_used', {
  feature_name: 'optima_ai',
  user_id: user.uid
});
```

---

## Migration Strategy

If you decide to add Firebase, here's a safe migration path:

### Phase 1: Add Firebase Auth (Optional)
1. Enable Firebase
2. Install SDK
3. Add auth to backend verification
4. Keep existing auth as fallback
5. Test thoroughly

### Phase 2: Add Firestore for Real-time (Optional)
1. Enable Firestore
2. Migrate Pulse Chat to real-time
3. Add real-time feed updates
4. Keep backend API for other features

### Phase 3: Add FCM for Notifications (Optional)
1. Enable FCM
2. Request permissions in app
3. Handle tokens in backend
4. Send test notifications
5. Roll out to users

### Phase 4: Add Analytics (Optional)
1. Enable Analytics
2. Add event tracking
3. Set up dashboards
4. Monitor usage

---

## Cost Comparison

### Current Setup (No Firebase)
- **Cloud Run:** $0-$50/month (based on usage)
- **Cloud Storage:** $0.02/GB/month
- **Data Transfer:** $0.12/GB
- **Total:** ~$10-100/month depending on scale

### With Firebase Added
- **Authentication:** Free up to 50,000 MAU, then $0.0055/MAU
- **Firestore:** Free up to 1GB + 50K reads/day
- **Cloud Storage:** Same as above
- **FCM:** Free!
- **Analytics:** Free!
- **Total:** ~$10-150/month with Firebase features

---

## Recommendation

### For Your Current State

**Don't add Firebase yet if:**
- ✅ Current auth works fine
- ✅ Polling is acceptable (no real-time needed)
- ✅ No push notifications needed
- ✅ Want to keep architecture simple

**Do add Firebase if:**
- 🎯 Users want Google/Apple login
- 🎯 Need real-time Pulse Chat updates
- 🎯 Want push notifications for engagement
- 🎯 Need better analytics

### My Suggestion

**Start without Firebase**, since:
1. Your current setup works
2. tRPC + AsyncStorage is simpler
3. You can add Firebase later easily
4. Focus on core features first

**Add Firebase later** when you need:
- Social login (Google, Apple)
- Real-time messaging
- Push notifications
- Advanced analytics

---

## Quick Test: Firebase vs Current

| Feature | Current (No Firebase) | With Firebase |
|---------|---------------------|---------------|
| **Auth** | Custom tokens via tRPC | Firebase Auth + social login |
| **Database** | Backend API + AsyncStorage | Firestore real-time |
| **Storage** | Cloud Storage direct | Firebase Storage wrapper |
| **Messaging** | Polling | Real-time onSnapshot |
| **Notifications** | None | FCM push |
| **Analytics** | Manual | Firebase Analytics |
| **Complexity** | Lower | Higher |
| **Setup Time** | Already done | 2-3 hours |

---

## Summary

**Current Status:**
- ✅ Backend running on Google Cloud Run
- ✅ Using Cloud Storage (GCS)
- ✅ tRPC API working
- ❌ Firebase NOT enabled

**To Add Firebase:**
1. Enable in console (5 min)
2. Install SDK (1 min)
3. Configure (30 min)
4. Test (1 hour)
5. Migrate features (optional, over time)

**Recommendation:**
**Keep current setup for now.** Add Firebase only when you specifically need:
- Social login
- Real-time sync
- Push notifications

Your current architecture is solid and working!

---

**Questions?** 
- Stick with current setup? ✅ Good choice, simpler and working
- Add Firebase? Follow steps above, can be done anytime
- Need help deciding? Check which features you actually need

**Related Docs:**
- `FIXES_COMPLETE.md` - System status
- `QUICK_START_GUIDE.md` - How to use current setup
- `SYSTEM_STATUS.md` - Architecture details
