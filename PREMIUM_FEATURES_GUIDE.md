# R3AL Platform - Premium Features Implementation Guide

## Overview
This guide documents the implementation of premium features including unrestricted AI content, Writers Guild, Optima SR tactical variant, and unlimited chat/image generation.

## Features Implemented

### 1. **Subscription & Payment Tiers**

#### Database Schema
Location: `backend/db/subscription-schema.sql`

**Tiers:**
- **Free**: 50 chats/month, 10 images/month, basic features
- **Premium ($14.99/mo)**: Unlimited chat/images, Writers Guild, unrestricted AI
- **Tactical ($29.99/mo)**: All premium features + Optima SR + R3AL HQ access

#### Backend API
- `r3al.subscription.getUserTier` - Get user's subscription info
- `r3al.subscription.checkFeatureAccess` - Check access to specific features
- `r3al.subscription.trackUsage` - Track feature usage
- `r3al.subscription.upgradeTier` - Upgrade subscription tier

---

### 2. **AI Ethics Engine Updates**

#### Location
`ai-gateway/src/core/ethics.ts`

#### Content Policies
```typescript
type ContentPolicy = 'default' | 'unrestricted' | 'tactical'
```

- **default**: Basic content filtering
- **unrestricted**: For premium users, minimal restrictions for writing assistance
- **tactical**: Professional mode for first responders/military

#### Key Methods
- `setPolicy(policy, userTier)` - Set content policy based on user tier
- `validateIntent(text)` - Validate content based on policy
- `isUnrestricted()` - Check if unrestricted mode is active

---

### 3. **Writers Guild**

#### Database Schema
Location: `backend/db/writers-guild-schema.sql`

**Tables:**
- `writing_projects` - User writing projects
- `writing_sessions` - Active writing sessions
- `writing_ai_chats` - AI assistance conversations
- `guild_members` - Writers Guild member profiles
- `guild_feedback` - Peer feedback system

#### Backend API
- `r3al.writersGuild.createProject` - Create new writing project
- `r3al.writersGuild.getProjects` - Get user's projects
- `r3al.writersGuild.startSession` - Start writing session
- `r3al.writersGuild.getMember` - Get guild member profile

#### Frontend
Location: `app/r3al/writers-guild/index.tsx`

**Features:**
- Project management (novels, short stories, screenplays, poetry)
- Writing session tracking
- Embedded AI writing assistant
- Mature content support (18+)
- Word count tracking
- Genre categorization

---

### 4. **AI Chat with Context**

#### Backend API
- `r3al.aiChat.sendMessage` - Send message to AI with context
- `r3al.aiChat.getSessionHistory` - Get chat history

#### Contexts
- **writing**: Professional writing assistance, unrestricted content
- **general**: Standard AI assistant
- **tactical**: Optima SR for first responders/military

#### System Prompts
Each context has a tailored system prompt:
- Writing: "You are a professional writing assistant helping with creative writing, including mature themes..."
- Tactical: "You are Optima SR, a tactical AI assistant for military and first responder personnel..."

---

### 5. **Optima SR - Tactical Variant**

#### Database Schema
Location: `backend/db/tactical-schema.sql`

**Tables:**
- `tactical_users` - Verified tactical users
- `tactical_teams` - Operational teams
- `tactical_incidents` - Active incidents
- `tactical_comms` - Encrypted communications
- `tactical_resources` - Equipment/vehicle tracking
- `tactical_training` - Training courses

#### Backend API
- `r3al.tactical.register` - Register as tactical user
- `r3al.tactical.getDashboard` - Get tactical dashboard
- `r3al.tactical.sendComm` - Send tactical communication
- `r3al.tactical.getOptimaSRAnalysis` - AI situation analysis

#### Frontend
Location: `app/r3al/tactical-hq.tsx`

**Features:**
- Real-time situational awareness
- AI risk assessment
- Incident tracking
- Team coordination
- Encrypted communications
- Resource management
- Operational status tracking

#### Optima SR Analysis Types
- **Situational**: Overall threat assessment
- **Risk**: Risk scoring with mitigation steps
- **Resource**: Unit allocation optimization
- **Tactical**: Operational approach recommendations

---

### 6. **Premium Image Generation**

#### Backend API
- `r3al.premium.generateImage` - Generate AI images
- `r3al.premium.getImageHistory` - Get generation history
- `r3al.premium.getUsageSummary` - Get usage statistics

#### Features
- Unlimited image generation for premium users
- Multiple size options (1024x1024, 1024x1792, 1792x1024)
- Style control (vivid, natural)
- Usage tracking
- Image history

---

## User Tier Access Matrix

| Feature | Free | Premium | Tactical |
|---------|------|---------|----------|
| Chat Messages | 50/month | Unlimited | Unlimited |
| Image Generation | 10/month | Unlimited | Unlimited |
| AI Writing Assistant | ❌ | ✅ | ✅ |
| Unrestricted Content | ❌ | ✅ | ✅ |
| Writers Guild | ❌ | ✅ | ✅ |
| Tactical Features | ❌ | ❌ | ✅ |
| Optima SR | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

---

## Integration Notes

### For AI Gateway
When making AI requests, check user tier and set appropriate policy:

```typescript
const userTier = await getTierForUser(userId);
const ethicsEngine = new EthicsEngine({
  policy: userTier === 'premium' || userTier === 'tactical' ? 'unrestricted' : 'default',
  userTier,
});
```

### For Feature Access
Before allowing access to premium features:

```typescript
const access = await trpc.r3al.subscription.checkFeatureAccess.query({
  userId,
  feature: 'writers_guild',
});

if (!access.hasAccess) {
  // Show upgrade prompt
}
```

### Usage Tracking
Track usage for rate limiting:

```typescript
await trpc.r3al.subscription.trackUsage.mutate({
  userId,
  featureType: 'chat',
  count: 1,
});
```

---

## Next Steps for Production

1. **Payment Integration**
   - Integrate Stripe/Apple Pay/Google Pay
   - Implement subscription webhooks
   - Handle payment failures and renewals

2. **Verification System**
   - Tactical user verification workflow
   - Document upload and review
   - Badge/credential verification

3. **Content Moderation**
   - Implement reporting system
   - AI-powered content scanning
   - Trust & Safety team tools

4. **Rate Limiting**
   - Implement Redis-based rate limiting
   - Usage quota enforcement
   - Graceful degradation for free users

5. **Analytics**
   - User engagement metrics
   - Feature usage tracking
   - Conversion funnel analysis

---

## Security Considerations

- All tactical communications are encrypted
- User verification required for tactical tier
- Audit logs for sensitive operations
- Content policy enforcement by tier
- Data retention policies (60-day auto-purge)

---

## Support & Documentation

For questions or issues:
- Review API endpoints in `backend/trpc/routes/r3al/`
- Check database schemas in `backend/db/`
- Frontend implementations in `app/r3al/`

All features are currently using mock data for development. Replace mock implementations with actual database queries and API calls for production.
