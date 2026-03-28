# R3AL App - Complete Feature Testing Plan

## 📋 Feature Categories

### 🔐 1. Authentication & Onboarding
- [ ] **Splash Screen** (`/r3al/splash`)
- [ ] **Welcome Screen** (`/r3al/onboarding/welcome`)
- [ ] **Consent/NDA** (`/r3al/onboarding/consent`)
- [ ] **User Registration** (`/register`)
- [ ] **User Login** (`/login`)

### ✅ 2. Verification System
- [ ] **Email Verification** (`/r3al/verification/email`)
- [ ] **SMS Verification** (`/r3al/verification/sms`)
- [ ] **ID Verification** (`/r3al/verification/id`)
- [ ] **Verification Status** (`/r3al/verification/status`)
- [ ] **Verification Intro** (`/r3al/verification/intro`)

### 👤 3. Profile Management
- [ ] **Profile Setup** (`/r3al/profile/setup`)
- [ ] **Profile View** (`/r3al/profile/view`)
- [ ] **Photo Gallery** (upload, view, delete)
- [ ] **Endorsements** (give/receive)
- [ ] **Truth Score Display**

### 🪙 4. Trust-Token Wallet
- [ ] **Token Balance** (available, earned, spent)
- [ ] **Transaction History**
- [ ] **Earning Methods**:
  - Complete Verification (+10 tokens)
  - Daily QOTD (+5 tokens)
  - Realification (+5 tokens)
  - Honesty Check (+1 token)
  - NFT Sales (variable)
  - Endorsements (+2 tokens)
  - Weekly Streaks (+25 tokens)
- [ ] **Spending Methods**:
  - Mint NFTs (-10 tokens default)
  - Purchase NFTs (variable)

### 💬 5. Pulse Chat System
- [ ] **Chat Hub** (`/r3al/pulse-chat`)
- [ ] **Direct Messages** (`/r3al/pulse-chat/dm-list`, `/dm`)
- [ ] **Contacts List** (`/r3al/pulse-chat/contacts`)
- [ ] **Video Calls** (`/r3al/pulse-chat/video`)
- [ ] **Realification Mode** (`/r3al/pulse-chat/realification`)
  - 5 rapid-fire questions
  - Pulse ring animation
  - Rewards 5 tokens
- [ ] **Honesty Check** (`/r3al/pulse-chat/honesty-check`)
  - 3 multiple-choice questions
  - Rewards 1 token
- [ ] **Message Persistence**
- [ ] **Unread Tracking**
- [ ] **Mark as Read**

### 🎨 6. NFT Hive System
- [ ] **Hive Hub** (`/r3al/hive`)
- [ ] **NFT Creator** (`/r3al/hive/nft-creator`)
  - Title & description input
  - Image URL input with preview
  - Custom mint cost
  - Token validation
- [ ] **NFT Gallery** (`/r3al/hive/nft-gallery`)
  - View owned NFTs
  - List for sale
  - Cancel listings
  - Gift NFTs
- [ ] **NFT Marketplace** (`/r3al/hive/nft-marketplace`)
  - Browse NFTs for sale
  - Purchase with tokens
  - View creator info
  - Balance checking
- [ ] **Token Wallet** (`/r3al/hive/token-wallet`)
  - Integrated with Hive

### 💭 7. Question of the Day (QOTD)
- [ ] **Daily Question** (`/r3al/qotd`)
- [ ] **Submit Answer** (min 10 chars)
- [ ] **Token Rewards** (+5 per answer)
- [ ] **Streak Tracking**:
  - 7-day streak: +10 bonus
  - 30-day streak: +25 bonus
  - 90-day streak: +50 bonus
- [ ] **Answer History**
- [ ] **User Statistics**
- [ ] **Question Categories**:
  - Ethics
  - Emotion
  - Decision
  - Professional
  - Relationship

### 🌐 8. Social Features
- [ ] **Circles** (`/r3al/circles`)
  - View circles
  - Join circles
  - Create circles (`/r3al/circles/create`)
  - Circle details (`/r3al/circles/[circleId]`)
  - Circle members (`/r3al/circles/[circleId]/members`)
- [ ] **Explore** (`/r3al/explore`)
  - Discover users
  - Filter by verification status
  - Filter by location
- [ ] **R3AL Feed** (`/r3al/feed`)
  - Create posts
  - Like posts (Resonate)
  - Comment on posts
  - View trending
  - View local feed

### 🤝 9. AI Matching System
- [ ] **Match Suggestions** (`/r3al/match`)
- [ ] **Compare Profiles** (`/r3al/match/compare`)
- [ ] **Match History** (`/r3al/match/history`)
- [ ] **Match Insights** (`/r3al/match/insights`)
- [ ] **Learning Algorithm**

### 🧠 10. AI Features
- [ ] **Optima II Assistant** (`/r3al/optima-ai`)
  - Chat interface
  - R3AL feature guidance
  - Trust Score analysis
  - Relationship advice
- [ ] **AI Insights** (`/r3al/ai-insights`)
  - Personalized growth analysis
  - Trend analysis
  - Community insights

### 📊 11. Market & Data
- [ ] **Market Pulse** (`/r3al/market-pulse`)
  - Live market data
  - Market summary
  - Trending symbols
  - Market news
- [ ] **Local Discovery** (`/r3al/local-discover`)
  - Local news
  - Local events
  - Nearby users

### 🎯 12. Truth Score System
- [ ] **Truth Score Display** (`/r3al/truth-score-detail`)
- [ ] **Detailed Breakdown**
- [ ] **History Tracking**
- [ ] **Score Components**:
  - Verification level
  - Community endorsements
  - Activity consistency
  - Interaction authenticity

### 📜 13. Questionnaire System
- [ ] **Questionnaire Index** (`/r3al/questionnaire`)
- [ ] **PsychEval Questions**
- [ ] **Results Display** (`/r3al/questionnaire/result`)
- [ ] **Score Calculation**

### 🔐 14. Security Features
- [ ] **Screenshot Detection**
- [ ] **Capture History** (`/r3al/security/capture-history`)
- [ ] **Appeal Form** (`/r3al/security/appeal-form`)
- [ ] **Privacy Controls**

### ⚡ 15. Pulse State & History
- [ ] **Pulse State** (`/r3al/pulse`)
  - Get current state
  - Update state
  - Share pulse
- [ ] **History** (`/r3al/history`)
  - Log events
  - View history
  - Delete history
  - Get summary

### 🔗 16. Hive Connections
- [ ] **Get Connections** (`/r3al/hive`)
- [ ] **Request Connection**
- [ ] **Respond to Connection**
- [ ] **Generate NFT**
- [ ] **Get NFT Data**

### 📱 17. App Features
- [ ] **Tutorial System**
  - Optima Assistant overlays
  - Feature walkthroughs
- [ ] **Settings** (`/r3al/settings`)
  - Account settings
  - Privacy settings
  - Notification preferences
- [ ] **Legal Info** (`/r3al/legal`)
  - Terms of Service
  - Privacy Policy
  - Trademarks
- [ ] **Learn More** (`/r3al/learn-more`)
- [ ] **Promo Beta** (`/r3al/promo-beta`)

### 🏠 18. Main Navigation
- [ ] **Home Screen** (`/r3al/home`)
- [ ] **Bottom Navigation**
- [ ] **Header Navigation**

---

## 🧪 Testing Methodology

### For Each Feature:
1. **Access Test**: Can the feature be reached?
2. **UI Test**: Does it display correctly?
3. **Functionality Test**: Do all buttons/interactions work?
4. **Data Test**: Does data persist correctly?
5. **Integration Test**: Does it integrate with other features?
6. **Error Handling**: How does it handle errors?
7. **Performance Test**: Does it load quickly?

### Backend Endpoints to Test:
```
✅ /api/trpc/r3al.tokens.getBalance
✅ /api/trpc/r3al.tokens.earnTokens
✅ /api/trpc/r3al.tokens.spendTokens
✅ /api/trpc/r3al.tokens.getTransactions

✅ /api/trpc/r3al.dm.sendMessage
✅ /api/trpc/r3al.dm.getMessages
✅ /api/trpc/r3al.dm.getConversations
✅ /api/trpc/r3al.dm.markRead

✅ /api/trpc/r3al.qotd.getDaily
✅ /api/trpc/r3al.qotd.submitAnswer
✅ /api/trpc/r3al.qotd.getStats

✅ /api/trpc/r3al.nft.create
✅ /api/trpc/r3al.nft.listForSale
✅ /api/trpc/r3al.nft.purchase
✅ /api/trpc/r3al.nft.gift

✅ /api/trpc/r3al.pulse.getState
✅ /api/trpc/r3al.pulse.updateState
✅ /api/trpc/r3al.pulse.sharePulse

✅ /api/trpc/r3al.history.logEvent
✅ /api/trpc/r3al.history.getHistory
✅ /api/trpc/r3al.history.deleteHistory

✅ /api/trpc/r3al.hive.getConnections
✅ /api/trpc/r3al.hive.requestConnection
✅ /api/trpc/r3al.hive.respondConnection

✅ /api/trpc/r3al.profile.updateProfile
✅ /api/trpc/r3al.profile.uploadPhoto
✅ /api/trpc/r3al.profile.deletePhoto
✅ /api/trpc/r3al.profile.getProfile
✅ /api/trpc/r3al.profile.endorse

✅ /api/trpc/r3al.verification.sendEmail
✅ /api/trpc/r3al.verification.confirmEmail
✅ /api/trpc/r3al.verification.sendSms
✅ /api/trpc/r3al.verification.confirmSms
✅ /api/trpc/r3al.verification.verifyId
✅ /api/trpc/r3al.verification.getStatus

✅ /api/trpc/r3al.match.suggest
✅ /api/trpc/r3al.match.compare
✅ /api/trpc/r3al.match.learn
✅ /api/trpc/r3al.match.history
✅ /api/trpc/r3al.match.insights

✅ /api/trpc/r3al.feed.createPost
✅ /api/trpc/r3al.feed.getTrending
✅ /api/trpc/r3al.feed.getLocal
✅ /api/trpc/r3al.feed.likePost
✅ /api/trpc/r3al.feed.commentPost
✅ /api/trpc/r3al.feed.resonatePost

✅ /api/trpc/r3al.market.getSummary
✅ /api/trpc/r3al.market.getTrendingSymbols
✅ /api/trpc/r3al.market.getNews

✅ /api/trpc/r3al.ai.getInsights
✅ /api/trpc/r3al.ai.getPersonalizedSummary
✅ /api/trpc/r3al.ai.analyzeTrends

✅ /api/trpc/r3al.location.getLocalNews
✅ /api/trpc/r3al.location.getLocalEvents
✅ /api/trpc/r3al.location.getNearbyUsers

✅ /api/founding-member (Hono route)
✅ /api/investor (Hono route)
✅ /api/contact (Hono route)
```

---

## 🚀 Testing Priority

### Priority 1 (Core Features):
1. Authentication & Onboarding
2. Token Wallet
3. Profile Management
4. Verification System

### Priority 2 (Social Features):
5. Pulse Chat
6. NFT Hive
7. QOTD
8. Circles

### Priority 3 (Advanced Features):
9. AI Matching
10. AI Insights
11. Market Pulse
12. Local Discovery

### Priority 4 (Supporting Features):
13. Truth Score
14. Settings
15. Security
16. Legal

---

## 📝 Test Results Template

For each feature, document:
```
Feature: [Feature Name]
Route: [App route]
Backend: [Backend endpoints used]

✅ Access: [Pass/Fail]
✅ UI Display: [Pass/Fail]
✅ Functionality: [Pass/Fail]
✅ Data Persistence: [Pass/Fail]
✅ Integration: [Pass/Fail]
✅ Error Handling: [Pass/Fail]
✅ Performance: [Pass/Fail]

Issues Found:
- [List any issues]

Notes:
- [Any additional notes]
```

---

## 🎯 Next Steps

1. Start with **Backend Health Check**
2. Test **Priority 1** features first
3. Document all issues found
4. Fix critical bugs
5. Continue with Priority 2-4
6. Final integration testing
7. Performance optimization

**Ready to begin testing? Let's start with the backend health check!**
