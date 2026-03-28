# Backend Endpoint Testing Report

## Overview
This document provides a comprehensive overview of all backend endpoints in the R3AL application.

## How to Test All Endpoints

### Quick Test
```bash
node scripts/check-all-endpoints.js
```

### Test Against Different Backend
```bash
BACKEND_URL=https://your-backend-url.run.app node scripts/check-all-endpoints.js
```

## Endpoint Categories

### 1. Core Hono Routes

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/` | GET | Root endpoint - API status | ✓ |
| `/health` | GET | Health check | ✓ |
| `/api/routes` | GET | List all tRPC routes | ✓ |
| `/probe/gateway` | GET | Check AI gateway connectivity | ✓ |
| `/ai/memory` | POST | Update AI memory | - |

### 2. Marketing/Lead Routes

| Endpoint | Method | Description | Required Fields |
|----------|--------|-------------|-----------------|
| `/api/founding-member` | POST | Founding member registration | email, name?, message? |
| `/api/investor` | POST | Investor inquiry | email, name?, message? |
| `/api/contact` | POST | Contact form | email, name?, message? |

### 3. tRPC Routes

#### Example Routes
- `example.hi` - Test endpoint

#### Auth Routes
- `auth.login` - User login
- `auth.register` - User registration
- `health` - Backend health check

#### R3AL Routes (Comprehensive)

##### Profile Management
- `r3al.profile.getProfile` - Get user profile
- `r3al.profile.updateProfile` - Update user profile
- `r3al.profile.uploadPhoto` - Upload profile photo
- `r3al.profile.deletePhoto` - Delete profile photo
- `r3al.profile.endorse` - Endorse another user

##### Token System
- `r3al.tokens.getBalance` - Get token balance
- `r3al.tokens.earnTokens` - Earn tokens
- `r3al.tokens.spendTokens` - Spend tokens
- `r3al.tokens.getTransactions` - Get transaction history

##### Feed & Content
- `r3al.feed.createPost` - Create new post
- `r3al.feed.getTrending` - Get trending posts
- `r3al.feed.getLocal` - Get local feed
- `r3al.feed.likePost` - Like a post
- `r3al.feed.resonatePost` - Resonate with a post
- `r3al.feed.unresonatePost` - Remove resonance
- `r3al.feed.amplifyPost` - Amplify a post
- `r3al.feed.witnessPost` - Witness a post
- `r3al.feed.commentPost` - Comment on a post

##### NFT System
- `r3al.createNFT` - Create NFT
- `r3al.listNFTForSale` - List NFT for sale
- `r3al.purchaseNFT` - Purchase NFT
- `r3al.giftNFT` - Gift NFT to another user

##### Question of the Day (QOTD)
- `r3al.qotd.getDaily` - Get daily question
- `r3al.qotd.submitAnswer` - Submit answer
- `r3al.qotd.getStats` - Get QOTD statistics

##### Pulse Chat
- `r3al.pulseChat.startSession` - Start chat session
- `r3al.pulseChat.sendMessage` - Send message
- `r3al.pulseChat.startVideo` - Start video chat
- `r3al.pulseChat.startRealification` - Start realification process
- `r3al.pulseChat.finishRealification` - Finish realification
- `r3al.pulseChat.startHonestyCheck` - Start honesty check
- `r3al.pulseChat.finishHonestyCheck` - Finish honesty check

##### Direct Messaging
- `r3al.dm.sendMessage` - Send DM
- `r3al.dm.getConversations` - Get all conversations
- `r3al.dm.markRead` - Mark messages as read
- `r3al.dm.getMessages` - Get messages from conversation

##### Verification System
- `r3al.verification.sendEmail` - Send email verification
- `r3al.verification.confirmEmail` - Confirm email
- `r3al.verification.sendSms` - Send SMS verification
- `r3al.verification.confirmSms` - Confirm SMS
- `r3al.verification.verifyId` - Verify ID document
- `r3al.verification.getStatus` - Get verification status
- `r3al.verification.updateStatus` - Update verification status

##### Matching System
- `r3al.match.suggest` - Get match suggestions
- `r3al.match.compare` - Compare two users
- `r3al.match.learn` - Record feedback for ML
- `r3al.match.history` - Get match history
- `r3al.match.insights` - Get match insights

##### Market Pulse
- `r3al.market.getSummary` - Get market summary
- `r3al.market.getTrendingSymbols` - Get trending symbols
- `r3al.market.getNews` - Get market news

##### AI Insights
- `r3al.ai.getInsights` - Get AI insights
- `r3al.ai.getPersonalizedSummary` - Get personalized summary
- `r3al.ai.analyzeTrends` - Analyze trends

##### Location Services
- `r3al.location.getLocalNews` - Get local news
- `r3al.location.getLocalEvents` - Get local events
- `r3al.location.getNearbyUsers` - Get nearby users

##### Machine Learning
- `r3al.ml.getRecommendations` - Get ML recommendations

##### Activity Tracking
- `r3al.activity.track` - Track user activity
- `r3al.activity.getHistory` - Get activity history
- `r3al.activity.getStats` - Get activity statistics

##### Social Features
- `r3al.social.followUser` - Follow a user
- `r3al.social.unfollowUser` - Unfollow a user
- `r3al.social.getFollowers` - Get followers
- `r3al.social.getFollowing` - Get following list
- `r3al.social.isFollowing` - Check if following
- `r3al.social.getSuggestedUsers` - Get suggested users

##### Pulse System
- `r3al.pulse.getState` - Get pulse state
- `r3al.pulse.updateState` - Update pulse state
- `r3al.pulse.sharePulse` - Share pulse

##### History Tracking
- `r3al.history.logEvent` - Log history event
- `r3al.history.getHistory` - Get user history
- `r3al.history.deleteHistory` - Delete history
- `r3al.history.getSummary` - Get history summary

##### Hive Connections
- `r3al.hive.getConnections` - Get hive connections
- `r3al.hive.requestConnection` - Request connection
- `r3al.hive.respondConnection` - Respond to connection request
- `r3al.hive.generateNFT` - Generate hive NFT
- `r3al.hive.getNFT` - Get hive NFT

##### Optima Integration
- `r3al.optima.health` - Optima health check
- `r3al.optima.logPulse` - Log pulse to Optima
- `r3al.optima.submitHive` - Submit hive data
- `r3al.optima.createNFT` - Create NFT via Optima

##### Testing Suite
- `r3al.testing.generateProfiles` - Generate test profiles
- `r3al.testing.generateFeed` - Generate feed content
- `r3al.testing.generateInteractions` - Generate interactions
- `r3al.testing.testMatching` - Test matching algorithm
- `r3al.testing.cleanup` - Cleanup test data
- `r3al.testing.runFullSuite` - Run full test suite

##### Legacy Routes
- `r3al.verifyIdentity` - Verify user identity
- `r3al.riseNAnalyze` - RiseN analysis
- `r3al.optimaOptimize` - Optima optimization

## Testing Strategy

### 1. Automated Testing
Run the comprehensive test script:
```bash
node scripts/check-all-endpoints.js
```

### 2. Manual Testing
Use tools like:
- **Postman/Insomnia** - For REST endpoints
- **tRPC Panel** - For tRPC routes (if enabled)
- **cURL** - For quick command-line tests

### 3. Example cURL Commands

#### Test Health Endpoint
```bash
curl https://optima-core-271493276620.us-central1.run.app/health
```

#### Test Founding Member Registration
```bash
curl -X POST https://optima-core-271493276620.us-central1.run.app/api/founding-member \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","message":"Test message"}'
```

#### Test tRPC Route
```bash
curl "https://optima-core-271493276620.us-central1.run.app/api/trpc/r3al.qotd.getDaily" \
  -H "Content-Type: application/json" \
  -H "x-trpc-source: curl-test"
```

## Expected Responses

### Successful Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Troubleshooting

### Common Issues

1. **404 Not Found**
   - Check if backend is running
   - Verify URL is correct
   - Check route is registered in hono.ts

2. **CORS Errors**
   - Verify origin is allowed in CORS config
   - Check headers are being sent correctly

3. **500 Internal Server Error**
   - Check backend logs
   - Verify database connection
   - Check environment variables

4. **tRPC Errors**
   - Verify procedure exists in router
   - Check input validation
   - Ensure context is properly created

## Monitoring

### Check Backend Health
```bash
curl https://optima-core-271493276620.us-central1.run.app/health
```

### Check Available Routes
```bash
curl https://optima-core-271493276620.us-central1.run.app/api/routes
```

### View Logs
```bash
gcloud logging read "resource.labels.service_name=r3al-app" --limit=50
```

## Next Steps

1. Run the comprehensive test script
2. Review failed tests
3. Fix any broken endpoints
4. Verify database connections
5. Test critical user flows
6. Monitor error rates in production

## Status Summary

Total Endpoints: **100+**
- Hono Routes: 8
- tRPC Procedures: 90+
- Marketing Routes: 3

Last Updated: 2025-11-10
