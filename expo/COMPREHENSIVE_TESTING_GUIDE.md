# R3AL App - Comprehensive Testing & Validation Guide

## 🎯 Testing Phase Overview

This guide will walk you through testing all new and existing features of the R3AL app as you prepare for beta and production deployment.

---

## 📋 Pre-Testing Checklist

### Environment Setup
- [ ] Backend deployed to Google Cloud Run (https://optima-core-712497593637.us-central1.run.app)
- [ ] Firebase project configured with proper API keys
- [ ] `.env` file updated with all credentials
- [ ] Dependencies installed (`bun install`)
- [ ] App builds without errors (`bunx rork start`)

### Test Devices
- [ ] iOS physical device (for push notifications)
- [ ] Android physical device (for push notifications)
- [ ] Web browser (Chrome/Safari)
- [ ] Multiple test user accounts created

---

## 🧪 Feature Testing Matrix

### 1. **Trailblaze™ (Activity Tracking)**

#### Test Scenarios:
| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| TB-01 | Enable Tracking | Go to Trailblaze → Toggle ON | Tracking enabled, status shows "Recording" |
| TB-02 | Record Activity | Perform any action (resonate, follow, etc.) | Activity appears in history with timestamp |
| TB-03 | View History | Open Trailblaze page | List of recent activities with metadata |
| TB-04 | Change Period | Toggle between Day/Week/Month/All | Stats update accordingly |
| TB-05 | Disable Tracking | Toggle tracking OFF | No new activities recorded |
| TB-06 | Activity Persistence | Close app, reopen | History remains intact |

#### Manual Test Script:
```bash
# Test 1: Basic tracking
1. Open app → Settings → Enable Trailblaze
2. Go to Feed → Resonate with a post
3. Go back to Trailblaze → Verify activity logged
4. Check timestamp is accurate

# Test 2: Stats accuracy
1. Perform 10 different activities
2. Go to Trailblaze → View Week stats
3. Verify total activities count = 10
4. Check top activities match your actions

# Test 3: Privacy
1. Disable Trailblaze
2. Perform 5 activities
3. Re-enable Trailblaze → Check count
4. Should not include activities from disabled period
```

---

### 2. **ML/AI Recommendations**

#### Test Scenarios:
| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|---|
| ML-01 | Get User Recommendations | Call ML API with user ID | Returns scored recommendations |
| ML-02 | Interest Matching | Set interests, request matches | High scores for shared interests |
| ML-03 | Location Proximity | Update location, get nearby users | Higher scores for closer users |
| ML-04 | Truth Compatibility | Check matches with similar truth scores | Compatible users ranked higher |
| ML-05 | Circle Alignment | Join circles, get recommendations | Users in same circles appear |

#### API Test Script:
```typescript
// Test with tRPC client
const recommendations = await trpc.r3al.ml.getRecommendations.query({
  userId: 'test_user_1',
  type: 'matches',
  limit: 10,
  includeReasons: true,
});

console.log('Recommendations:', recommendations);
// Verify: 
// - scores are 0-100
// - reasons array populated
// - matchFactors present
```

#### Manual Test:
```bash
1. Create 2 test users with overlapping interests
2. User 1 joins "Tech" circle
3. User 2 joins "Tech" circle
4. Check recommendations for User 1
5. User 2 should appear with high score
6. Check "Common circles" in reasons
```

---

### 3. **Follow System**

#### Test Scenarios:
| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|---|
| FS-01 | Follow User | Click "Follow" on profile | Button changes to "Following" |
| FS-02 | Unfollow User | Click "Following" button | Reverts to "Follow" |
| FS-03 | View Followers | Go to Profile → Followers tab | List of followers displayed |
| FS-04 | View Following | Go to Profile → Following tab | List of followed users displayed |
| FS-05 | Mutual Follow Detection | Check if follow is mutual | Badge/indicator shows mutual status |
| FS-06 | Suggested Users | View "Discover" page | ML-powered suggestions appear |
| FS-07 | Self-Follow Prevention | Try to follow yourself | Error or disabled button |

#### E2E Test Flow:
```bash
# User A & User B
1. User A: Follow User B
2. User B: Check notifications (should see follow notification)
3. User B: Go to Followers → See User A
4. User B: Follow User A back
5. User A: Check profile → Should show "Mutual" badge
6. User A: Unfollow User B
7. User B: Verify "Mutual" badge removed
```

---

### 4. **Push Notifications**

#### Test Scenarios:
| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|---|
| PN-01 | Request Permissions | First launch, request permissions | System prompt appears |
| PN-02 | Register Token | After permission grant | Token logged to console |
| PN-03 | Local Notification | Trigger in-app event | Notification displays |
| PN-04 | Deep Link | Tap notification | Opens correct screen |
| PN-05 | Background Notifications | App in background, send notification | Notification received |
| PN-06 | Notification Sound | Receive notification | Sound plays (if enabled) |
| PN-07 | Custom Data | Send notification with metadata | Data accessible in handler |

#### Test Script:
```typescript
// Test local notifications
import { schedulePushNotification } from '@/app/services/push-notifications';

// Schedule immediate notification
await schedulePushNotification(
  'Test Notification',
  'This is a test message',
  { testData: 'value' }
);

// Schedule delayed notification (5 seconds)
await schedulePushNotification(
  'Delayed Test',
  'This appears after 5 seconds',
  {},
  { seconds: 5 }
);
```

#### Platform-Specific Tests:

**iOS:**
- [ ] Permission prompt appears
- [ ] Notification center displays notification
- [ ] Badge count updates
- [ ] Haptic feedback works
- [ ] Notification sound plays

**Android:**
- [ ] Permission prompt (Android 13+)
- [ ] Notification channel created
- [ ] Notification LED/vibration works
- [ ] Notification actions work
- [ ] Foreground notifications show

**Web:**
- [ ] Gracefully handles lack of support
- [ ] Console message about web limitations
- [ ] No crashes or errors

---

### 5. **R3AL-Themed Interactions**

#### Test Scenarios:
| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|---|
| RI-01 | Resonate (Like) | Tap heart icon on post | Icon fills, count increases |
| RI-02 | Amplify (Share) | Tap amplify button | Share options appear |
| RI-03 | Witness (Verify) | Tap witness button | Witness count increases |
| RI-04 | Un-Resonate | Tap resonated heart again | Icon empties, count decreases |
| RI-05 | Visual Feedback | Perform any interaction | Animation/haptic feedback occurs |
| RI-06 | Count Accuracy | Check interaction counts | Numbers accurate across app |

#### API Endpoint Tests:
```bash
# Test resonate endpoint
POST /api/trpc/r3al.feed.resonatePost
{
  "postId": "post_123",
  "userId": "user_456"
}
# Expected: { success: true, resonances: X, userResonated: true }

# Test amplify endpoint
POST /api/trpc/r3al.feed.amplifyPost
{
  "postId": "post_123",
  "userId": "user_456",
  "message": "This is important!"
}
# Expected: { success: true, amplifications: X }

# Test witness endpoint
POST /api/trpc/r3al.feed.witnessPost
{
  "postId": "post_123",
  "userId": "user_456"
}
# Expected: { success: true, witnesses: X }
```

---

### 6. **End-to-End User Flows**

#### Flow 1: New User Onboarding
```bash
1. Launch app for first time
2. See splash screen → Onboarding
3. Accept consent/terms
4. Complete ID verification
5. Fill out questionnaire
6. View truth score result
7. Setup profile (name, photo, bio)
8. Arrive at home screen
VERIFY: All data persists after app restart
```

#### Flow 2: Social Interaction Journey
```bash
1. User logs in
2. Enables Trailblaze tracking
3. Goes to Explore/Feed
4. Resonates with 3 posts
5. Amplifies 1 post
6. Follows 2 users
7. Joins 1 circle
8. Views Trailblaze history
9. Checks stats for the week
VERIFY: All 7 activities logged correctly
```

#### Flow 3: Content Creation & Engagement
```bash
1. User creates a post
2. Post appears in feed
3. Another user resonates with post
4. Creator receives notification
5. Creator views resonances count
6. Creator checks who resonated
7. Creator follows resonator
VERIFY: Full notification → interaction flow works
```

#### Flow 4: ML-Powered Discovery
```bash
1. User A: Sets interests (Tech, Fitness)
2. User A: Joins "Tech Enthusiasts" circle
3. User B: Sets same interests
4. User B: Joins same circle
5. User A: Goes to Discover
6. User B appears in recommendations
7. Check recommendation score & reasons
VERIFY: ML algorithm correctly identified match
```

---

## 🐛 Bug Tracking Template

Use this format to report bugs during testing:

```markdown
**Bug ID**: BUG-XXX
**Feature**: [Feature Name]
**Severity**: Critical / High / Medium / Low
**Platform**: iOS / Android / Web
**Device**: [Device Model & OS Version]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots/Logs**:
[Attach if available]

**Workaround**:
[If known]
```

---

## ✅ Sign-Off Checklist

Before moving to production, ensure all tests pass:

### Core Features
- [ ] User authentication (login/register)
- [ ] Profile creation and editing
- [ ] Questionnaire completion
- [ ] Truth score calculation
- [ ] Photo upload and gallery

### New Features
- [ ] Trailblaze tracking (enable/disable/view)
- [ ] ML recommendations (matches/circles/posts)
- [ ] Follow/Unfollow functionality
- [ ] Push notifications (local & remote)
- [ ] R3AL interactions (resonate/amplify/witness)

### Backend Integration
- [ ] All tRPC routes accessible
- [ ] Google Cloud Run backend responsive
- [ ] Firebase FCM configured
- [ ] Error handling working
- [ ] Rate limiting functional

### Cross-Platform
- [ ] iOS native builds and runs
- [ ] Android native builds and runs
- [ ] Web version renders correctly
- [ ] Consistent UX across platforms

### Performance
- [ ] App launches in < 3 seconds
- [ ] Smooth scrolling in feeds
- [ ] Image loading optimized
- [ ] No memory leaks detected
- [ ] Network requests efficient

### Security
- [ ] API keys not exposed in client
- [ ] User data encrypted
- [ ] Permissions properly requested
- [ ] No sensitive logs in production

---

## 🚀 Deployment Readiness

### Backend Deployment (Google Cloud Run)
```bash
# Deploy backend with new features
cd backend
gcloud builds submit \
  --config cloudbuild.yaml \
  --project=civic-origin-476705-j8

# Verify deployment
curl https://optima-core-712497593637.us-central1.run.app/health

# Check logs
gcloud logging read \
  "resource.type=cloud_run_revision" \
  --project=civic-origin-476705-j8 \
  --limit=50
```

### Frontend Build
```bash
# Test build locally
bunx rork start

# Build for iOS
eas build --platform ios

# Build for Android  
eas build --platform android

# Deploy web
bunx rork build:web
# Upload to hosting
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track:
1. **User Engagement**
   - Trailblaze adoption rate
   - Average activities per user/day
   - Most popular interaction type

2. **ML Performance**
   - Recommendation acceptance rate
   - Average match score
   - Time to first follow from recommendation

3. **Push Notifications**
   - Opt-in rate
   - Open rate
   - Click-through rate

4. **Technical Health**
   - API response times
   - Error rates
   - Crash rates per platform

### Logging Best Practices:
```typescript
// Use structured logging
console.log('[Feature]', 'Action', { metadata });

// Examples:
console.log('[Trailblaze]', 'Tracking enabled', { userId });
console.log('[ML]', 'Recommendations fetched', { count, avgScore });
console.log('[Push]', 'Notification sent', { type, userId });
```

---

## 🎓 Training Materials

Create these docs for your team:
- [ ] User guide for Trailblaze
- [ ] Admin guide for ML tuning
- [ ] Push notification best practices
- [ ] R3AL terminology glossary
- [ ] API documentation
- [ ] Troubleshooting guide

---

## 🔄 Continuous Testing

Set up automated testing:

### Unit Tests
```bash
# Create tests for core functions
- Trailblaze: Activity tracking logic
- ML: Recommendation scoring
- Interactions: Resonate/Amplify/Witness
```

### Integration Tests
```bash
# Test backend routes
- Activity tracking endpoints
- ML recommendation endpoints
- Social graph endpoints
- Feed interaction endpoints
```

### E2E Tests (Future)
Consider Detox or Maestro for:
- Full user flows
- Cross-platform testing
- Regression testing

---

**Happy Testing! 🚀**

For issues or questions, refer to:
- `AI_ML_PUSH_SETUP_GUIDE.md`
- Backend logs on Google Cloud Console
- Firebase console for push notification debugging
