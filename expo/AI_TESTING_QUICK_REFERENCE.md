# AI Testing Suite - Quick Reference

## Quick Start
```bash
# Navigate to AI Testing in the app
/ai-testing

# Or use API directly
import { trpc } from '@/lib/trpc';
const test = trpc.r3al.testing.runFullSuite.useMutation();
```

## Main Commands

### Full Test Suite
```typescript
// Generate everything: profiles, posts, interactions, matches
await trpc.r3al.testing.runFullSuite.mutate({
  profileCount: 20,              // 5-50
  interactionDensity: 'moderate', // sparse | moderate | high
  cleanupFirst: true
});
```

### Individual Tests
```typescript
// 1. Profiles (required first)
await trpc.r3al.testing.generateProfiles.mutate({
  count: 20,
  profileTypes: ['high_truth', 'moderate_truth', 'low_truth']
});

// 2. Feed Content
await trpc.r3al.testing.generateFeed.mutate({
  forAllTestProfiles: true,
  count: 5
});

// 3. Interactions
await trpc.r3al.testing.generateInteractions.mutate({
  interactionDensity: 'moderate',
  includeComments: true
});

// 4. Matching
await trpc.r3al.testing.testMatching.mutate({
  testAllProfiles: true,
  minCompatibility: 60
});

// 5. Cleanup
await trpc.r3al.testing.cleanup.mutate({
  confirmDeletion: true,
  deleteProfiles: true,
  deletePosts: true
});
```

## Database Queries

### View Test Data
```sql
-- Statistics
SELECT * FROM test_data_stats;

-- Test users
SELECT id, username, truth_score FROM users WHERE id LIKE 'test_%';

-- Test posts
SELECT p.id, u.username, p.content 
FROM posts p 
JOIN users u ON p.user_id = u.id 
WHERE u.id LIKE 'test_%' 
LIMIT 10;

-- AI matches
SELECT * FROM matches WHERE created_by_ai = TRUE LIMIT 10;
```

### Cleanup Test Data
```sql
-- Using SQL function
SELECT * FROM cleanup_test_data();

-- Or manually
DELETE FROM users WHERE id LIKE 'test_%';
DELETE FROM posts WHERE id LIKE 'post_%';
DELETE FROM matches WHERE created_by_ai = TRUE;
```

## Profile Types

| Type | Truth Score | Verification | Description |
|------|-------------|--------------|-------------|
| `high_truth` | 85-100 | Verified/Premium | Ideal users, consistent |
| `moderate_truth` | 60-84 | Basic/Verified | Average users |
| `low_truth` | 40-59 | Basic/None | Some concerns |
| `problematic` | 0-39 | None | Red flags |
| `ideal_match` | 90-100 | Premium | Perfect for demos |

## Interaction Types

- **Resonate**: Like/agree (always included)
- **Amplify**: Share/boost (70% chance)
- **Witness**: Verify/attest (80% chance)
- **Comment**: AI-generated response (60% chance)

## Timing

| Operation | Time (20 profiles) |
|-----------|-------------------|
| Generate Profiles | ~60-90s |
| Generate Feed | ~30-45s |
| Generate Interactions | ~20-30s |
| Test Matching | ~40-60s |
| **Full Suite** | **~3-4 min** |

## Common Patterns

### Quick Demo Setup
```typescript
// 10 high-quality profiles with active feed
await trpc.r3al.testing.runFullSuite.mutate({
  profileCount: 10,
  interactionDensity: 'high',
  cleanupFirst: true
});
```

### Development Testing
```typescript
// 20 mixed profiles, moderate activity
await trpc.r3al.testing.runFullSuite.mutate({
  profileCount: 20,
  interactionDensity: 'moderate',
  cleanupFirst: false // preserve existing data
});
```

### QA/Staging
```typescript
// Large dataset for comprehensive testing
await trpc.r3al.testing.runFullSuite.mutate({
  profileCount: 50,
  interactionDensity: 'high',
  cleanupFirst: true
});
```

## Troubleshooting

### No profiles appearing?
```typescript
// Verify in database
SELECT COUNT(*) FROM users WHERE id LIKE 'test_%';
```

### No feed posts?
```typescript
// Run feed generation after profiles
await trpc.r3al.testing.generateFeed.mutate({
  forAllTestProfiles: true
});
```

### Matches not working?
```typescript
// Lower compatibility threshold
await trpc.r3al.testing.testMatching.mutate({
  minCompatibility: 50 // was 60
});
```

### Performance issues?
```typescript
// Reduce batch size
await trpc.r3al.testing.generateProfiles.mutate({
  count: 10 // instead of 50
});
```

## Security

⚠️ **Test profiles are marked with `test_` prefix**
⚠️ **Always cleanup before production deploy**
⚠️ **Restrict testing endpoints to admins only**

## URLs

- **Testing UI**: `/ai-testing`
- **Documentation**: `AI_TESTING_SUITE_GUIDE.md`
- **Schema**: `backend/db/ai-testing-schema.sql`

## Support

Check logs with tag: `[AI Testing]`

```bash
# View logs
tail -f logs/backend.log | grep "AI Testing"
```

---
**Version**: 1.0.0 | **Updated**: 2025-01-08
