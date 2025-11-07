# R3AL App - AI/ML & Push Notifications Setup Guide

## Overview
This guide covers the new AI/ML recommendation engine, activity tracking ("Trailblaze"), push notifications, and follow functionality that have been added to R3AL.

---

## 🚀 New Features

### 1. **Trailblaze™ - Activity Tracking System**
A comprehensive user activity tracker with R3AL-themed naming:

- **Track Activities**: Resonate, Amplify, Witness, Circle joins, DMs, Posts, NFTs, Token transactions
- **View History**: See your complete digital trail with timestamps and metadata
- **Analytics**: Period-based stats (day/week/month/all) with visual breakdowns
- **Privacy First**: Users can enable/disable tracking at any time

**Access**: Navigate to `/r3al/trailblaze` in the app

**Key Interactions**:
- `resonate` - Like/appreciate content (replaces "likes")
- `amplify` - Share/boost content
- `witness` - Verify/attest to truth
- `follow_user` - Start following another user
- `tokens_earned` - Track token earnings

### 2. **ML/AI Recommendation Engine**
Intelligent matching system for users, circles, and content:

**Algorithm Features**:
- Interest overlap calculation (30% weight)
- Proximity/location scoring (15% weight)
- Truth score compatibility (25% weight)
- Activity similarity (15% weight)
- Circle alignment (15% weight)

**Backend Route**: `trpc.r3al.ml.getRecommendations`

**Usage**:
```typescript
const recommendations = await trpc.r3al.ml.getRecommendations.query({
  userId: 'user_id',
  type: 'matches', // or 'circles', 'posts'
  limit: 20,
  includeReasons: true,
});
```

### 3. **Follow System**
Complete social graph functionality:

**Features**:
- Follow/Unfollow users
- View followers and following lists
- Mutual follow detection
- Suggested users based on ML recommendations

**Backend Routes**:
- `trpc.r3al.social.followUser`
- `trpc.r3al.social.unfollowUser`
- `trpc.r3al.social.getFollowers`
- `trpc.r3al.social.getFollowing`
- `trpc.r3al.social.getSuggestedUsers`

### 4. **Push Notifications (FCM)**
Firebase Cloud Messaging integration:

**Capabilities**:
- Local and remote push notifications
- Notification scheduling
- Custom notification channels (Android)
- Deep linking support

**Service**: `app/services/push-notifications.ts`

**Usage**:
```typescript
import { registerForPushNotificationsAsync, schedulePushNotification } from '@/app/services/push-notifications';

// Register for push
const token = await registerForPushNotificationsAsync();

// Schedule notification
await schedulePushNotification(
  'New Resonance',
  'Someone resonated with your post!',
  { postId: '123' }
);
```

---

## 📦 Installation & Setup

### Step 1: Install Dependencies
```bash
bun install expo-notifications expo-device
```

### Step 2: Update Environment Variables

Edit your `.env` file:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBuoYuI-zZ12IlEXMfpmHaXR2l5YFoBx7s
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=r3al-app-1.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=r3al-app-1
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=r3al-app-1.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=271493276620
EXPO_PUBLIC_FIREBASE_APP_ID=1:271493276620:web:ee29525d1e8f168ad4b369
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-S5ZN6MRSE5

# Google Cloud Platform
GCP_PROJECT_ID=civic-origin-476705-j8
GCP_REGION=us-central1
GCP_PROJECT_NUMBER=712497593637

# Backend URLs
EXPO_PUBLIC_BACKEND_URL=https://optima-core-712497593637.us-central1.run.app
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-optima-api-prod-gq43sdrt-uc.a.run.app

# ML/AI Features
EXPO_PUBLIC_ML_ENABLED=true
EXPO_PUBLIC_RECOMMENDATIONS_ENABLED=true
```

### Step 3: Configure app.json

Add push notification permissions to `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "permissions": [
        "POST_NOTIFICATIONS"
      ],
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#D4AF37",
          "sounds": ["./assets/sounds/notification.wav"]
        }
      ]
    ]
  }
}
```

### Step 4: Deploy Backend Updates

Your backend on Google Cloud Run needs to be redeployed with the new routes:

```bash
cd backend
gcloud builds submit --config cloudbuild.yaml --project=civic-origin-476705-j8
```

The backend now includes:
- `/api/trpc/r3al.ml.getRecommendations`
- `/api/trpc/r3al.activity.*`
- `/api/trpc/r3al.social.*`

---

## 🎨 R3AL-Themed Naming Convention

We've moved away from generic social media terms:

| Old Term | New R3AL Term | Meaning |
|----------|---------------|---------|
| Like | **Resonate** | Content resonates with you |
| Share | **Amplify** | Boost signal of important content |
| Verify | **Witness** | Attest to truth/authenticity |
| Activity Log | **Trailblaze** | Your digital trail through R3AL |
| Followers | **Witnesses** | People who witness your journey |
| Following | **Witnessing** | Journeys you're witnessing |

---

## 🧪 Testing Guide

### Test Activity Tracking:
1. Navigate to any post/profile
2. Perform actions (resonate, amplify, follow)
3. Go to **Settings** → **Trailblaze**
4. Verify activities are logged with correct timestamps

### Test Recommendations:
1. Ensure you have interests set in your profile
2. Join some circles
3. Check `/r3al/explore` for recommended users
4. ML algorithm should show users with shared interests/circles

### Test Push Notifications:
1. Grant notification permissions when prompted
2. Register push token on login
3. Test local notification: trigger an in-app event
4. Verify notification appears with correct content and deep link

### Test Follow System:
1. Find a user profile
2. Tap "Follow" button
3. Go to profile → "Following" tab
4. Verify user appears in list
5. Check if it's a mutual follow

---

## 📊 Database Schema (For Future Cloud SQL Integration)

When you're ready to persist data:

### Activity Table
```sql
CREATE TABLE activities (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  target_id VARCHAR(255),
  target_type VARCHAR(50),
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_timestamp (user_id, timestamp),
  INDEX idx_activity_type (activity_type)
);
```

### Follows Table
```sql
CREATE TABLE follows (
  id VARCHAR(255) PRIMARY KEY,
  follower_id VARCHAR(255) NOT NULL,
  following_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id),
  INDEX idx_follower (follower_id),
  INDEX idx_following (following_id)
);
```

### Recommendations Cache
```sql
CREATE TABLE recommendation_cache (
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  recommendations JSONB NOT NULL,
  computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  PRIMARY KEY (user_id, type),
  INDEX idx_expires (expires_at)
);
```

---

## 🔧 Advanced Configuration

### Customize ML Weights

Edit `backend/trpc/routes/r3al/ml/get-recommendations.ts`:

```typescript
const weights = {
  interest: 0.3,      // 30% - Shared interests
  proximity: 0.15,    // 15% - Location proximity
  truth: 0.25,        // 25% - Truth score compatibility
  activity: 0.15,     // 15% - Similar activity patterns
  circle: 0.15,       // 15% - Common circles
};
```

### Configure Notification Behavior

Edit `app/services/push-notifications.ts`:

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});
```

---

## 🚨 Troubleshooting

### Push Notifications Not Working:
1. Check if device is physical (simulator won't work)
2. Verify permissions granted
3. Check `expo-device` is installed
4. Review Firebase project configuration

### Activities Not Being Tracked:
1. Ensure Trailblaze tracking is **enabled** in settings
2. Check context provider is wrapping app correctly
3. Verify backend route is accessible
4. Check console logs for errors

### Recommendations Seem Off:
1. Ensure user has filled out interests in profile
2. Check that user has joined circles
3. Verify enough activity data exists
4. Review ML algorithm weights

### Backend Routes Not Found:
1. Redeploy backend with latest changes
2. Verify `router.ts` includes new routes
3. Check Google Cloud Run logs
4. Test routes directly with tRPC panel

---

## 📱 Next Steps

1. **Enable Trailblaze** in your profile settings
2. **Follow some users** to build your social graph
3. **Join circles** to improve recommendations
4. **Enable push notifications** to stay updated
5. **Check your trail** regularly to see your journey

---

## 🎯 Future Enhancements

- [ ] Real-time activity streaming
- [ ] Advanced ML with Vertex AI integration
- [ ] Recommendation explanations with AI
- [ ] Activity heatmaps and visualizations
- [ ] Export activity data
- [ ] Notification preferences per activity type
- [ ] Group/Circle-based notifications
- [ ] Weekly Trailblaze summaries via email

---

## 📚 Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Expo Notifications API](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Google Cloud Vertex AI](https://cloud.google.com/vertex-ai)
- [tRPC Documentation](https://trpc.io/docs)

---

**Last Updated**: November 2025  
**Version**: 2.0.0  
**Maintainer**: R3AL Development Team
