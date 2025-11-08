# R3AL Feature Testing Checklist

## ✅ Completed Features

### 1. Navigation & Back Buttons
- ✅ All screens have proper back navigation via Stack.Screen headers
- ✅ NFT Creator has custom back button
- ✅ Verification flow has sequential navigation
- ✅ Match screens have proper navigation hierarchy

### 2. Camera Feature
- ✅ PhotoCameraModal component working
- ✅ Native camera support (mobile)
- ✅ Web fallback to image picker
- ✅ Camera permissions handling
- ✅ Image preview and confirmation
- ✅ Photo capture in NFT creator
- ✅ Photo upload in profile

### 3. Backend Integration - AI Features

#### Match & Suggestion System
- ✅ `/r3al/match/suggest` - AI match suggestions
- ✅ `/r3al/match/compare` - User compatibility analysis
- ✅ `/r3al/match/learn` - Feedback learning
- ✅ `/r3al/match/history` - Match history
- ✅ `/r3al/match/insights` - Personality insights

#### AI Insights
- ✅ `/r3al/ai/getInsights` - Activity & engagement insights
- ✅ `/r3al/ai/getPersonalizedSummary` - User summary
- ✅ `/r3al/ai/analyzeTrends` - Trend analysis

#### Verification System
- ✅ `/r3al/verification/sendEmail` - Email verification
- ✅ `/r3al/verification/confirmEmail` - Email confirmation
- ✅ `/r3al/verification/sendSms` - SMS verification
- ✅ `/r3al/verification/confirmSms` - SMS confirmation
- ✅ `/r3al/verification/verifyId` - ID photo verification
- ✅ `/r3al/verification/getStatus` - Verification status

### 4. Backend Integration - Core Features

#### Profile System
- ✅ Get/Update profile
- ✅ Upload/Delete photos
- ✅ Endorsements

#### Pulse Chat
- ✅ Start sessions
- ✅ Send messages
- ✅ Video calls
- ✅ Realification process
- ✅ Honesty checks

#### Token System
- ✅ Get balance
- ✅ Earn tokens
- ✅ Spend tokens
- ✅ Transaction history

#### NFT & Hive
- ✅ Create NFT (with AI image transformation)
- ✅ List for sale
- ✅ Purchase
- ✅ Gift NFTs

#### Feed System
- ✅ Create posts
- ✅ Get trending
- ✅ Get local feed
- ✅ Like/Resonate/Amplify
- ✅ Comments

#### Social Features
- ✅ Follow/Unfollow
- ✅ Get followers/following
- ✅ Suggested users

#### Location Features
- ✅ Local news
- ✅ Local events
- ✅ Nearby users

## 🧪 Features to Test

### Priority 1: Core User Flows
1. **Onboarding & Verification**
   - [ ] Complete questionnaire
   - [ ] Email verification flow
   - [ ] SMS verification flow
   - [ ] ID verification with camera
   - [ ] Check verification status

2. **Profile Creation**
   - [ ] Take profile photo with camera
   - [ ] Upload photos
   - [ ] Update profile info
   - [ ] Delete photos

3. **NFT Creation**
   - [ ] Take/select photo
   - [ ] Choose art style
   - [ ] Transform with AI (uses Toolkit API)
   - [ ] Add title/description
   - [ ] Mint NFT
   - [ ] View in gallery

### Priority 2: Social Features
4. **Match & Discovery**
   - [ ] View AI suggestions
   - [ ] Like/skip matches
   - [ ] Compare compatibility
   - [ ] View match insights
   - [ ] Check match history

5. **Pulse Chat**
   - [ ] Start chat session
   - [ ] Send messages
   - [ ] Initiate video call
   - [ ] Complete realification
   - [ ] Honesty check

6. **Feed & Social**
   - [ ] Create post
   - [ ] View trending
   - [ ] Resonate with posts
   - [ ] Follow users
   - [ ] View local discover

### Priority 3: Advanced Features
7. **AI Insights**
   - [ ] View personalized insights
   - [ ] Check metrics
   - [ ] See recommendations

8. **Tokens & Marketplace**
   - [ ] Check token balance
   - [ ] Earn tokens
   - [ ] Spend tokens
   - [ ] View transactions
   - [ ] Buy/sell NFTs

9. **Location Features**
   - [ ] View local news
   - [ ] Browse events
   - [ ] See nearby users

## 🔧 Technical Testing

### Camera Feature Tests
- [x] Camera permissions
- [x] Take photo
- [x] Flip camera
- [x] Gallery picker
- [x] Photo preview
- [x] Confirm/retake
- [x] Web fallback

### Backend Connection Tests
- [ ] Health check: `/trpc/r3al.optima.health`
- [ ] Verification: `/trpc/r3al.verification.getStatus`
- [ ] Match: `/trpc/r3al.match.suggest`
- [ ] AI: `/trpc/r3al.ai.getInsights`
- [ ] Profile: `/trpc/r3al.profile.getProfile`

### AI Integration Tests
1. **Image Transformation (NFT Creator)**
   - API: `https://toolkit.rork.com/images/edit/`
   - Input: Photo + style prompt
   - Output: Transformed NFT art
   - Styles: Cartoon, Pixel, Anime, Cyberpunk, Vaporwave

2. **Match AI**
   - Mock data working
   - Real AI integration pending

3. **Insights AI**
   - Mock data working
   - Real AI integration pending

## 🚀 Backend Routes Summary

All routes are mounted at: `https://dev-9wjyl0e4hila7inz8ajca.rorktest.dev/api/trpc/`

### Authentication
- Health check
- Verification flows

### AI-Powered Features
- Match suggestions (uses AI scoring)
- Compatibility analysis (uses AI insights)
- Personalized insights (uses AI metrics)
- Trend analysis

### Media Processing
- NFT image transformation (uses Toolkit API)
- Photo uploads

### Real-time Features
- Pulse chat
- DM system
- Feed updates

## 📝 Known Issues & Notes

1. **Push Notifications**: Expected error in Expo Go SDK 53+ (requires dev build)
2. **Camera Web**: Falls back to image picker (expected behavior)
3. **Backend Mock Data**: Many endpoints use mock data for testing
4. **AI Integration**: Image transformation working via Toolkit API
5. **Backend URL**: Dev backend at rorktest.dev

## 🎯 Next Steps

1. Test all Priority 1 flows end-to-end
2. Verify backend connections are live
3. Test camera in all contexts
4. Test AI image transformation in NFT creator
5. Connect real AI for match/insights features
6. Monitor backend logs for errors
7. Test on both iOS and Android
8. Test web compatibility

## 🔗 Important Links
- Backend: https://dev-9wjyl0e4hila7inz8ajca.rorktest.dev
- Toolkit API: https://toolkit.rork.com
- Health Check: /api/trpc/r3al.optima.health
