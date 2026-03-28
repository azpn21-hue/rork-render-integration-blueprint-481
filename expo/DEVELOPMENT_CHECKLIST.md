# R3AL Development Checklist
**Quick Reference for Immediate Tasks**

---

## 🔴 CRITICAL: Do These First

### 1. Get Baseline Status from Rork ⏱️ 5 min
Copy-paste this message to Rork:

```
R3AL Deployment Baseline - Need Status Confirmation

Can you provide these 5 things:

1. Environment variables currently set for r3al-app and optima-core 
   (just list names, redact secrets)

2. Output of these API calls:
   curl https://r3al-app-271493276620.us-central1.run.app/api/routes
   curl https://optima-core-712497593637.us-central1.run.app/api/routes

3. Database connection status:
   - Can backend connect to Cloud SQL?
   - Have migrations been run?
   - What tables exist?

4. Confirm these frontend API URLs are correct:
   EXPO_PUBLIC_RORK_API_BASE_URL=https://r3al-app-271493276620.us-central1.run.app
   EXPO_PUBLIC_AI_BASE_URL=https://optima-core-712497593637.us-central1.run.app

5. Any recent errors from Cloud Logging for both services
```

---

### 2. Fix Missing DB_PASSWORD ⏱️ 10 min

**Problem**: Your `.env` has `DB_PASSWORD=` (empty)

**Solution**:
```bash
# Option A: Set in Cloud Run directly
gcloud run services update r3al-app \
  --region=us-central1 \
  --set-env-vars="DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE"

# Option B: Use Secret Manager (more secure)
gcloud secrets create db-password --data-file=- <<< "YOUR_PASSWORD"
gcloud run services update r3al-app \
  --region=us-central1 \
  --set-secrets=DB_PASSWORD=db-password:latest
```

**Get your password**:
```bash
# Check Cloud SQL instance
gcloud sql users list --instance=system32-fdc

# If you forgot password, reset it:
gcloud sql users set-password postgres \
  --instance=system32-fdc \
  --password=NEW_PASSWORD_HERE
```

---

### 3. Test Current Deployment ⏱️ 5 min

Run these commands to verify what's working:

```bash
# Health check
curl https://r3al-app-271493276620.us-central1.run.app/health

# Should return:
# {"status":"healthy","message":"R3AL Connection API health check","timestamp":"...","routes":90}

# List all routes
curl https://r3al-app-271493276620.us-central1.run.app/api/routes | jq

# Test a specific route
curl -X POST https://r3al-app-271493276620.us-central1.run.app/api/trpc/r3al.tokens.getBalance \
  -H "Content-Type: application/json" \
  -d '{"json":null}'
```

**Expected Result**: You should see mock data returned (because DB not connected yet).

---

## 🟡 HIGH PRIORITY: Week 1 Tasks

### Task 1: Implement Firebase Authentication ⏱️ 2-3 days

**Why**: App has no real user sessions. Backend uses `'anonymous'` for all users.

**Files to Create/Update**:

1. **Setup Firebase project** (if not already done)
   - Go to https://console.firebase.google.com
   - Create project or use existing
   - Enable Authentication → Email/Password
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

2. **Update `app/config/firebase.ts`**:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

3. **Update `app/contexts/AuthContext.tsx`**:
```typescript
import { auth } from '@/app/config/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged 
} from 'firebase/auth';

// Implement actual auth functions
```

4. **Update backend to verify Firebase tokens**:
```typescript
// backend/trpc/create-context.ts
import admin from 'firebase-admin';

export async function createContext({ req }) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  let user = null;
  
  if (token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      user = { id: decodedToken.uid, email: decodedToken.email };
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }
  
  return { user };
}
```

**Testing Checklist**:
- [ ] User can sign up with email/password
- [ ] User can sign in
- [ ] User session persists on app restart
- [ ] Backend receives valid user ID
- [ ] User can sign out

---

### Task 2: Connect Backend to Cloud SQL ⏱️ 4-5 days

**Why**: All data is currently in-memory Maps. Needs real database.

**Step-by-Step**:

#### Step 2.1: Create Database Schema ⏱️ 2 hours

Create `backend/db/schema.sql`:
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  pronouns VARCHAR(50),
  location VARCHAR(100),
  verification_level INT DEFAULT 0,
  trust_score DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Token balances table
CREATE TABLE token_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  available INT DEFAULT 100,
  earned INT DEFAULT 100,
  spent INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- NFTs table
CREATE TABLE nfts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id),
  owner_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  for_sale BOOLEAN DEFAULT FALSE,
  sale_price INT,
  token_cost INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add more tables as needed:
-- verification_status, capture_events, circles, messages, etc.
```

Run migration:
```bash
# Connect to Cloud SQL
gcloud sql connect system32-fdc --user=postgres --quiet

# Run schema
\i backend/db/schema.sql
```

#### Step 2.2: Update Database Queries ⏱️ 1 day

Update `backend/db/queries.ts`:
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || '/cloudsql/r3al-app-1:us-central1:system32-fdc',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
});

export async function getTokenBalance(userId: string) {
  const result = await pool.query(
    'SELECT * FROM token_balances WHERE user_id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

export async function updateTokenBalance(userId: string, changes: Partial<TokenBalance>) {
  const result = await pool.query(
    `UPDATE token_balances 
     SET available = $1, earned = $2, spent = $3, last_updated = NOW()
     WHERE user_id = $4
     RETURNING *`,
    [changes.available, changes.earned, changes.spent, userId]
  );
  return result.rows[0];
}

// Add more query functions...
```

#### Step 2.3: Replace Mock Data with Real Queries ⏱️ 2-3 days

**Priority files to update** (in order):

1. `backend/trpc/routes/r3al/tokens/get-balance.ts`
```typescript
// BEFORE:
const tokenBalances = new Map<string, TokenBalance>();

// AFTER:
import { getTokenBalance } from '@/backend/db/queries';

export const getBalanceProcedure = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.user?.id;
  if (!userId) throw new Error('Unauthorized');
  
  const balance = await getTokenBalance(userId);
  return { success: true, balance };
});
```

2. `backend/trpc/routes/r3al/profile/get-profile.ts`
3. `backend/trpc/routes/r3al/nft/create.ts`
4. `backend/trpc/routes/r3al/verification/get-status.ts`
5. ... (continue for all 90+ routes)

**Testing Checklist**:
- [ ] Backend can connect to Cloud SQL
- [ ] Token balance persists across server restarts
- [ ] Profile data saved to database
- [ ] NFT creation works
- [ ] No more in-memory Map usage

---

## 🟢 MEDIUM PRIORITY: Week 2-3 Tasks

### Task 3: Implement File Upload ⏱️ 2 days

**Why**: Photos currently stored as data URLs. Need real storage.

**Steps**:
1. Enable Google Cloud Storage
2. Create bucket: `r3al-app-photos`
3. Update `upload-photo.ts` to upload to GCS
4. Return public URLs

**Code Example**:
```typescript
import { Storage } from '@google-cloud/storage';
const storage = new Storage();
const bucket = storage.bucket('r3al-app-photos');

export async function uploadPhoto(file: Buffer, filename: string) {
  const blob = bucket.file(filename);
  await blob.save(file);
  await blob.makePublic();
  return blob.publicUrl();
}
```

---

### Task 4: Add Push Notifications ⏱️ 1 day

**Why**: Users need alerts for messages, endorsements, etc.

**Steps**:
1. Setup Firebase Cloud Messaging
2. Update `app/services/push-notifications.ts`
3. Request permission on app start
4. Send test notification from backend

---

### Task 5: Implement Settings Screen ⏱️ 1 day

**File**: `app/r3al/settings.tsx` (already exists, needs backend sync)

**Add**:
- Privacy controls (profile visibility, photo visibility)
- Notification preferences
- Account management (delete account, export data)
- App version, terms, privacy policy links

---

## 📊 Progress Tracking

### Current Status: **75% Complete**

**What's Done**:
- ✅ UI/UX (54 screens)
- ✅ Backend routes (90+ procedures)
- ✅ Infrastructure (Cloud Run + Cloud SQL)
- ✅ State management (React Context + Query)

**What's Missing**:
- 🔴 Authentication (0%)
- 🔴 Database integration (0%)
- 🟡 File uploads (0%)
- 🟡 Push notifications (50% - config done)
- 🟢 Testing (20%)
- 🟢 Analytics (0%)

---

## 🎯 Weekly Goals

### Week 1
- [ ] Get baseline status from Rork
- [ ] Fix DB_PASSWORD
- [ ] Implement Firebase Auth
- [ ] Test auth flow end-to-end

### Week 2
- [ ] Create database schema
- [ ] Update top 10 backend routes to use SQL
- [ ] Test data persistence

### Week 3
- [ ] Complete all route migrations
- [ ] Add file upload system
- [ ] Implement push notifications
- [ ] Add settings screen

### Week 4
- [ ] Testing and bug fixes
- [ ] Add analytics
- [ ] Performance optimization
- [ ] Launch preparation

---

## ⚡ Quick Commands Reference

### Deploy Backend
```bash
gcloud builds submit --config cloudbuild.yaml
```

### View Logs
```bash
gcloud logging read "resource.type=cloud_run_revision" --limit=50
```

### Connect to Database
```bash
gcloud sql connect system32-fdc --user=postgres
```

### Test API
```bash
curl https://r3al-app-271493276620.us-central1.run.app/health
```

### Run Locally
```bash
# Frontend
bun start

# Backend (if needed)
cd backend && bun run dev
```

---

## 📞 Need Help?

1. **Check logs first**: `gcloud logging read ...`
2. **Test API endpoints**: Use curl or Postman
3. **Review this checklist**: Most answers are here
4. **Ask Rork**: Provide specific error messages and context

---

**Last Updated**: January 2025  
**Next Review**: After Week 1 tasks complete
