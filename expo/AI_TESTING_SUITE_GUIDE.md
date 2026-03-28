# AI Testing Suite - Complete Guide

## Overview

The R3AL app now includes a comprehensive AI-powered testing system that generates realistic test profiles, feed content, interactions, and matches using AI. This enables thorough testing of all app features with realistic data.

## Features

### 1. **AI Profile Generation**
- Generates fully provisioned test profiles from start to finish
- Includes complete user data:
  - Basic info (username, email, display name, bio, location)
  - Truth scores (0-100)
  - Verification levels (none, basic, verified, premium)
  - Questionnaire responses
  - Activity patterns
  - Interests and relationship goals
- Profile types:
  - **high_truth**: 85-100 score, verified, consistent answers
  - **moderate_truth**: 60-84 score, some verification
  - **low_truth**: 40-59 score, minimal verification
  - **problematic**: <40 score, red flags
  - **ideal_match**: Perfect compatibility indicators
  - **mixed**: Random distribution

### 2. **Feed Content Generation**
- Generates authentic social media posts for test profiles
- Content types:
  - Authentic sharing
  - Questions
  - Achievements
  - Vulnerability
  - Humor
  - Philosophical thoughts
  - Daily life updates
  - Relationship insights
- Posts reflect user's truth score and personality

### 3. **Interaction Generation**
- Generates realistic user interactions:
  - **Resonates** (likes)
  - **Amplifies** (shares)
  - **Witnesses** (verification)
  - **Comments** (AI-generated contextual responses)
- Configurable density (sparse, moderate, high)
- Natural interaction patterns based on user profiles

### 4. **Matching Algorithm Testing**
- AI-powered compatibility analysis
- Factors considered:
  - Truth score compatibility
  - Personality alignment
  - Geographic proximity
  - Shared values
  - Authenticity markers
- Generates:
  - Compatibility scores (0-100)
  - Match reasons
  - Potential concerns
  - Ice-breaker questions
- Optional conversation generation

### 5. **Full Test Suite**
- Runs all tests in sequence:
  1. Cleanup existing test data (optional)
  2. Generate test profiles
  3. Generate feed content
  4. Generate interactions
  5. Run matching algorithm
- Provides comprehensive statistics and timing

## API Endpoints

### Backend tRPC Routes

All routes are under `r3al.testing.*`:

```typescript
// Generate test profiles
r3al.testing.generateProfiles.mutate({
  count: 20,
  profileTypes: ['high_truth', 'moderate_truth', 'low_truth'],
  demographicMix: true,
  includeMatching: false
})

// Generate feed content
r3al.testing.generateFeed.mutate({
  count: 5,
  forAllTestProfiles: true,
  contentTypes: ['authentic_sharing', 'questions']
})

// Generate interactions
r3al.testing.generateInteractions.mutate({
  testProfilesOnly: true,
  interactionDensity: 'moderate',
  includeComments: true,
  naturalPatterns: true
})

// Test matching
r3al.testing.testMatching.mutate({
  testAllProfiles: true,
  minCompatibility: 60,
  generateConversations: false
})

// Cleanup test data
r3al.testing.cleanup.mutate({
  confirmDeletion: true,
  deleteProfiles: true,
  deletePosts: true,
  deleteInteractions: true,
  deleteMatches: true
})

// Run full suite
r3al.testing.runFullSuite.mutate({
  profileCount: 20,
  includeMatching: true,
  includeFeed: true,
  includeInteractions: true,
  interactionDensity: 'moderate',
  cleanupFirst: true
})
```

## Usage

### Using the UI

1. Navigate to `/ai-testing` in the app
2. Configure settings:
   - Profile count (5-50)
   - Interaction density (sparse, moderate, high)
3. Click "Run Full Test Suite" to generate everything
4. Or use individual test buttons for specific features
5. View results in the stats dashboard
6. Use "Cleanup Test Data" to remove all test data

### Using the API Directly

```typescript
import { trpc } from '@/lib/trpc';

// In a React component
const generateProfiles = trpc.r3al.testing.generateProfiles.useMutation();

const handleGenerate = async () => {
  const result = await generateProfiles.mutateAsync({
    count: 20,
    profileTypes: ['high_truth', 'moderate_truth'],
    demographicMix: true
  });
  
  console.log(`Created ${result.count} profiles`);
  console.log('Average truth score:', result.summary.averageTruthScore);
};
```

### Backend Scripts

You can also call these functions directly from backend scripts:

```typescript
// backend/scripts/seed-test-data.ts
import { generateTestProfilesProcedure } from './trpc/routes/r3al/testing/generate-profiles';

// Call the procedure with mock context
const result = await generateTestProfilesProcedure({
  input: { count: 50, demographicMix: true },
  ctx: { user: adminUser },
  type: 'mutation',
  path: 'r3al.testing.generateProfiles',
  getRawInput: async () => ({})
});
```

## Test Data Structure

### Test Profile Example
```json
{
  "userId": "test_abc123...",
  "username": "sarah_chen_2024",
  "email": "sarah.chen.test@example.com",
  "displayName": "Sarah Chen",
  "truthScore": 87,
  "verificationLevel": "verified",
  "bio": "Product designer passionate about authentic connections...",
  "location": "San Francisco, CA",
  "interests": ["design", "hiking", "philosophy"],
  "relationshipGoals": "Looking for genuine connection...",
  "questionnaireAnswers": {
    "identityIntegrity": {...},
    "relationshipHistory": {...},
    "boundariesSafety": {...}
  }
}
```

### Feed Post Example
```json
{
  "postId": "post_xyz789...",
  "userId": "test_abc123...",
  "content": "Sometimes the most honest thing you can say is 'I don't know.'",
  "type": "thought",
  "tone": "vulnerable",
  "hashtags": ["#authenticity", "#growthmindset"]
}
```

### Match Example
```json
{
  "matchId": "match_def456...",
  "user1": "sarah_chen_2024",
  "user2": "mike_rodriguez_2024",
  "score": 89,
  "reasons": [
    "Both value authenticity highly",
    "Similar truth scores (87 vs 85)",
    "Shared interest in philosophy"
  ],
  "icebreaker": "What does authenticity mean to you in relationships?"
}
```

## Database Tables Used

The testing system interacts with:
- `users` - Test user accounts
- `profiles` - User profile data
- `verifications` - Verification records
- `tokens` - Token balances
- `token_transactions` - Token history
- `posts` - Feed posts
- `post_comments` - Post comments
- `post_resonances` - Post likes
- `post_amplifications` - Post shares
- `post_witnesses` - Post verifications
- `matches` - Match suggestions
- `sessions` - User sessions

## Best Practices

### For Development
1. Run cleanup before generating new test data
2. Use moderate interaction density for realistic testing
3. Generate 20-30 profiles for comprehensive testing
4. Include matching to test compatibility features

### For QA/Testing
1. Use full test suite with default settings
2. Test individual features separately first
3. Verify all interactions appear in UI correctly
4. Check truth scores align with user behavior

### For Demos
1. Generate 10-15 high-quality profiles
2. Use high interaction density for active feed
3. Pre-generate conversations for matching demos
4. Cleanup after demo to reset state

## Troubleshooting

### Common Issues

**Issue**: Profiles not appearing in feed
- **Solution**: Make sure to run `generateFeed` after `generateProfiles`

**Issue**: No matches found
- **Solution**: Ensure `minCompatibility` isn't set too high (60-70 is good)

**Issue**: Cleanup fails
- **Solution**: Set `confirmDeletion: true` and check database permissions

**Issue**: AI generation slow
- **Solution**: Reduce profile count or disable conversation generation

**Issue**: Out of memory
- **Solution**: Process profiles in smaller batches (10-15 at a time)

## Performance

### Timing Estimates
- Generate 20 profiles: ~60-90 seconds
- Generate feed content: ~30-45 seconds
- Generate interactions: ~20-30 seconds
- Test matching: ~40-60 seconds
- **Full suite (20 profiles)**: ~3-4 minutes

### Resource Usage
- AI tokens: ~10-15k per full suite
- Database: ~5-10 MB per 20 profiles
- Memory: ~100-200 MB during generation

## Future Enhancements

Planned features:
- [ ] Bulk profile import from CSV
- [ ] Custom profile templates
- [ ] A/B testing for matching algorithms
- [ ] Performance benchmarking tools
- [ ] Automated regression testing
- [ ] Profile relationship graphs
- [ ] Sentiment analysis on generated content
- [ ] Behavioral pattern simulation
- [ ] Load testing with concurrent users

## Security Notes

⚠️ **Important Security Considerations**:
1. Test profiles are marked with `id LIKE 'test_%'` prefix
2. Test data should never mix with production data
3. Always cleanup test data before production deployment
4. Test profiles use fixed password hash (not secure)
5. Restrict testing endpoints to admin users only in production

## Contributing

To add new test generation features:
1. Create new procedure in `backend/trpc/routes/r3al/testing/`
2. Add to `router.ts` under `testing` namespace
3. Update UI in `app/ai-testing.tsx`
4. Document in this file
5. Add tests for the test generator 😄

## Support

For issues or questions:
- Check logs with `[AI Testing]` prefix
- Review database state with test queries
- Verify AI toolkit connection
- Check backend health endpoints

---

**Last Updated**: 2025-01-08
**Version**: 1.0.0
**Maintainer**: R3AL Development Team
