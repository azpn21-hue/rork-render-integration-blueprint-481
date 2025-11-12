# R3AL Hybrid Age-Gated System - Backend Integration Guide

## Overview
This document outlines the backend routes created for the hybrid age-gated social ecosystem. Each route includes database integration points marked with `// TODO` comments that need to be connected to your actual database.

---

## Routes Created

### 1. Age Verification & Management Routes

#### `r3al.age.verifyAge`
**File**: `backend/trpc/routes/r3al/age/verify-age.ts`

**Purpose**: Verifies user's age and assigns appropriate tier (adult/teen/kid)

**Input**:
```typescript
{
  userId: string (UUID),
  birthDate: string (YYYY-MM-DD),
  verificationMethod: 'id_upload' | 'credit_card' | 'educational_email' | 'parent_verified',
  verificationData?: object
}
```

**Output**:
```typescript
{
  success: boolean,
  ageTier: 'adult' | 'teen' | 'kid',
  actualAge: number,
  requiresParentalConsent: boolean,
  message: string
}
```

**Database Integration Needed**:
- Insert into `user_age_profiles` table
- Store verification data (encrypted)

---

#### `r3al.age.requestParentalConsent`
**File**: `backend/trpc/routes/r3al/age/request-parental-consent.ts`

**Purpose**: Sends parental consent request email (COPPA compliance)

**Input**:
```typescript
{
  childUserId: string (UUID),
  childEmail: string,
  childBirthDate: string,
  parentEmail: string,
  parentName: string
}
```

**Output**:
```typescript
{
  success: boolean,
  message: string,
  verificationCode: string // Only for testing
}
```

**Integration Needed**:
- Insert into `parental_consent_log` table
- Email service integration (SendGrid, AWS SES, etc.)
- Generate secure verification code

---

#### `r3al.age.grantParentalConsent`
**File**: `backend/trpc/routes/r3al/age/grant-parental-consent.ts`

**Purpose**: Processes parent's consent approval

**Input**:
```typescript
{
  verificationCode: string,
  parentUserId: string (UUID),
  childUserId: string (UUID),
  consentMethod: 'credit_card_verification' | 'id_upload' | 'video_call',
  ipAddress?: string,
  userAgent?: string
}
```

**Output**:
```typescript
{
  success: boolean,
  message: string,
  consentTimestamp: string
}
```

**Database Integration Needed**:
- Verify and update `parental_consent_log`
- Update `user_age_profiles` (set consent given)
- Create default `parental_controls` entry

---

### 2. Parental Control Routes

#### `r3al.parent.linkChildAccount`
**File**: `backend/trpc/routes/r3al/parent/link-child-account.ts`

**Purpose**: Establishes parental control relationship

**Input**:
```typescript
{
  parentUserId: string (UUID),
  childUserId: string (UUID),
  monitoringSettings?: {
    monitorMessages: boolean,
    monitorPosts: boolean,
    monitorConnections: boolean,
    requireContactApproval: boolean,
    screenTimeLimitMinutes: number,
    alertOnNewContact: boolean,
    alertOnFlaggedContent: boolean
  }
}
```

**Output**:
```typescript
{
  success: boolean,
  message: string,
  settings: object
}
```

**Database Integration Needed**:
- Verify child's age tier
- Insert/update `parental_controls` table

---

#### `r3al.parent.getChildActivity`
**File**: `backend/trpc/routes/r3al/parent/get-child-activity.ts`

**Purpose**: Retrieves child's activity log for parent review

**Input**:
```typescript
{
  parentUserId: string (UUID),
  childUserId: string (UUID),
  limit: number (1-100, default 50),
  offset: number (default 0),
  flaggedOnly: boolean (default false),
  unreviewedOnly: boolean (default false)
}
```

**Output**:
```typescript
{
  success: boolean,
  activities: Array<{
    id: string,
    activityType: string,
    activityDescription: string,
    flagged: boolean,
    flagReason?: string,
    flagSeverity?: string,
    reviewedByParent: boolean,
    createdAt: string
  }>,
  totalCount: number,
  hasMore: boolean
}
```

**Database Integration Needed**:
- Verify parent-child relationship
- Query `child_activity_log` with filters
- Pagination support

---

#### `r3al.parent.updateControls`
**File**: `backend/trpc/routes/r3al/parent/update-controls.ts`

**Purpose**: Updates parental control settings

**Input**:
```typescript
{
  parentUserId: string (UUID),
  childUserId: string (UUID),
  controls: {
    monitorMessages?: boolean,
    monitorPosts?: boolean,
    monitorConnections?: boolean,
    requireContactApproval?: boolean,
    screenTimeLimitMinutes?: number (0-480),
    dailyLimitEnabled?: boolean,
    quietHoursStart?: string (HH:MM),
    quietHoursEnd?: string (HH:MM),
    quietHoursEnabled?: boolean,
    allowedFeatures?: string[],
    restrictedFeatures?: string[],
    alertOnNewContact?: boolean,
    alertOnFlaggedContent?: boolean,
    weeklyActivityReport?: boolean
  }
}
```

**Output**:
```typescript
{
  success: boolean,
  message: string,
  updatedControls: object
}
```

**Database Integration Needed**:
- Verify parent-child relationship
- Dynamic UPDATE query on `parental_controls`
- Log change in `child_activity_log`

---

#### `r3al.parent.approveContact`
**File**: `backend/trpc/routes/r3al/parent/approve-contact.ts`

**Purpose**: Approves or denies child's contact requests

**Input**:
```typescript
{
  parentUserId: string (UUID),
  childUserId: string (UUID),
  requesterId: string (UUID),
  approved: boolean,
  notes?: string
}
```

**Output**:
```typescript
{
  success: boolean,
  message: string,
  approved: boolean
}
```

**Database Integration Needed**:
- Verify parent-child relationship
- Update `child_contact_requests` table
- Add to `approved_contact_ids` array if approved
- Create connection in social graph
- Log decision in `child_activity_log`

---

#### `r3al.parent.emergencyPause`
**File**: `backend/trpc/routes/r3al/parent/emergency-pause.ts`

**Purpose**: Immediately pauses/unpauses child's account

**Input**:
```typescript
{
  parentUserId: string (UUID),
  childUserId: string (UUID),
  pause: boolean,
  reason?: string
}
```

**Output**:
```typescript
{
  success: boolean,
  message: string,
  paused: boolean
}
```

**Database Integration Needed**:
- Verify parent-child relationship
- Update `account_paused` in `parental_controls`
- Terminate active sessions if pausing
- Log action in `child_activity_log`
- Send notification to parent/child

---

### 3. Content Filtering Routes

#### `r3al.filter.checkContent`
**File**: `backend/trpc/routes/r3al/filter/check-content.ts`

**Purpose**: Validates content before posting (age-appropriate filtering)

**Input**:
```typescript
{
  userId: string (UUID),
  contentType: 'post' | 'message' | 'comment' | 'media',
  content: string,
  mediaUrls?: string[]
}
```

**Output**:
```typescript
{
  success: boolean,
  allowed: boolean,
  blocked: boolean,
  flagged: boolean,
  flaggedKeywords: string[],
  message: string,
  ageTier: 'adult' | 'teen' | 'kid'
}
```

**Database Integration Needed**:
- Query user's age tier from `user_age_profiles`
- Fetch active filters from `content_filter_rules`
- Log blocked attempts to `child_activity_log`
- AI vision API for media analysis (optional)

---

## Required Router Integration

Add these routes to your main tRPC router in `backend/trpc/app-router.ts`:

```typescript
import { verifyAge } from './routes/r3al/age/verify-age';
import { requestParentalConsent } from './routes/r3al/age/request-parental-consent';
import { grantParentalConsent } from './routes/r3al/age/grant-parental-consent';
import { linkChildAccount } from './routes/r3al/parent/link-child-account';
import { getChildActivity } from './routes/r3al/parent/get-child-activity';
import { updateControls } from './routes/r3al/parent/update-controls';
import { approveContact } from './routes/r3al/parent/approve-contact';
import { emergencyPause } from './routes/r3al/parent/emergency-pause';
import { checkContent } from './routes/r3al/filter/check-content';

export const appRouter = router({
  // ... existing routes
  
  r3al: router({
    // ... existing r3al routes
    
    age: router({
      verifyAge,
      requestParentalConsent,
      grantParentalConsent,
    }),
    
    parent: router({
      linkChildAccount,
      getChildActivity,
      updateControls,
      approveContact,
      emergencyPause,
    }),
    
    filter: router({
      checkContent,
    }),
  }),
});
```

---

## Database Setup

1. **Run the schema**: Execute `backend/db/hybrid-age-system-schema.sql` on your database
2. **Environment variables**: Add these to your `.env`:
   ```
   EMAIL_SERVICE_API_KEY=your_sendgrid_or_ses_key
   AGE_VERIFICATION_PARTNER_API_KEY=your_jumio_or_yoti_key
   ```
3. **Test data**: The schema includes sample filter rules and helper functions

---

## Middleware Needed

### Age-Based Access Control Middleware
Create middleware to check user's age tier before allowing feature access:

```typescript
// backend/trpc/middleware/ageGate.ts
export const ageGate = (minimumTier: 'kid' | 'teen' | 'adult') => {
  return async ({ ctx, next }) => {
    const userTier = await getUserAgeTier(ctx.userId);
    
    const tierRank = { kid: 1, teen: 2, adult: 3 };
    
    if (tierRank[userTier] < tierRank[minimumTier]) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `This feature requires ${minimumTier} tier access.`
      });
    }
    
    return next();
  };
};

// Usage in routes:
export const adultOnlyFeature = publicProcedure
  .use(ageGate('adult'))
  .mutation(async ({ input }) => {
    // Only adults can access this
  });
```

---

## Testing Checklist

### Age Verification
- [ ] Test age calculation for edge cases (leap years, timezone differences)
- [ ] Verify parental consent email delivery
- [ ] Test verification code expiration (7 days)
- [ ] Test COPPA compliance for under-13 users

### Parental Controls
- [ ] Test parent-child linking
- [ ] Verify activity log captures all interactions
- [ ] Test contact approval workflow
- [ ] Verify emergency pause terminates sessions
- [ ] Test screen time limit enforcement
- [ ] Test quiet hours enforcement

### Content Filtering
- [ ] Test keyword filtering for each age tier
- [ ] Test with various languages (if international)
- [ ] Test media content analysis
- [ ] Verify flagged content is logged
- [ ] Test filter rule updates propagate correctly

### Cross-Feature Integration
- [ ] Verify age tier affects feed content
- [ ] Test DM restrictions for kids
- [ ] Verify location sharing is disabled for kids
- [ ] Test NFT marketplace restrictions
- [ ] Verify video chat is blocked for kids

---

## Security Considerations

1. **Data Encryption**:
   - Encrypt `verification_data` in `user_age_profiles`
   - Encrypt sensitive parental control settings
   - Use HTTPS for all API calls

2. **Access Control**:
   - Verify parent-child relationships on every request
   - Implement rate limiting on consent requests
   - Log all access to child data

3. **Privacy**:
   - Minimal data collection for kids
   - Allow parents to export/delete child data
   - No third-party data sharing for minors
   - Clear privacy policy per age tier

4. **Compliance**:
   - COPPA: Verifiable parental consent for under-13
   - GDPR Article 8: Parental consent for under-16 (EU)
   - UK Age Appropriate Design Code compliance
   - Regular privacy audits

---

## Next Steps

1. **Immediate**: 
   - Run database schema
   - Add routes to app-router
   - Set up email service integration

2. **Week 1**:
   - Connect database queries (remove TODOs)
   - Implement age gate middleware
   - Set up age verification partner API

3. **Week 2**:
   - Create parent dashboard UI
   - Build kid-safe zone UI
   - Implement content filtering AI

4. **Week 3**:
   - Comprehensive testing
   - Beta with parent volunteers
   - Legal review

5. **Week 4**:
   - Deploy to production
   - Monitor and iterate
   - Community guidelines rollout

---

## Support & Resources

- **Database Schema**: `backend/db/hybrid-age-system-schema.sql`
- **Architecture Doc**: `HYBRID_AGE_SYSTEM_ARCHITECTURE.md`
- **COPPA Guidelines**: https://www.ftc.gov/tips-advice/business-center/guidance/childrens-online-privacy-protection-rule-six-step-compliance
- **GDPR Article 8**: https://gdpr-info.eu/art-8-gdpr/
- **UK Design Code**: https://ico.org.uk/for-organisations/guide-to-data-protection/ico-codes-of-practice/age-appropriate-design-code/

---

**Status**: Ready for Database Integration  
**Priority**: High - Foundation for Safe Community Growth  
**Estimated Time to Production**: 4 weeks
