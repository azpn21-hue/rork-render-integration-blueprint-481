# R3AL Backend Test Suite - Complete Guide

## Quick Test Command

Run all tests with a single command:

```bash
node scripts/comprehensive-test.js
```

Or with a custom backend URL:

```bash
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-backend-url.com node scripts/comprehensive-test.js
```

## Available Test Scripts

### 1. Comprehensive Test Suite (Recommended)
```bash
node scripts/comprehensive-test.js
```

This tests:
- ✅ Basic health checks (root, /health, /api/routes)
- ✅ tRPC core routes
- ✅ R3AL Verification system
- ✅ R3AL Profile system
- ✅ R3AL Token/Wallet system
- ✅ R3AL Feed system
- ✅ R3AL QOTD system
- ✅ R3AL Market system
- ✅ R3AL AI Insights
- ✅ R3AL Match system
- ✅ R3AL Social system
- ✅ R3AL Optima integration
- ✅ R3AL Location system
- ✅ R3AL ML recommendations

### 2. Backend Health Test
```bash
bun scripts/test-backend-health.ts
```

Tests basic backend connectivity and key tRPC routes.

### 3. Database Connection Test
```bash
bash scripts/test-database.sh
```

Tests Cloud SQL database connectivity.

### 4. Shell Script Test Suite
```bash
bash scripts/run-all-tests.sh
```

Bash version of the comprehensive test suite (requires `jq` for JSON formatting).

## Current Configuration

Your backend is configured at:
- **Backend URL**: https://r3al-app-271493276620.us-central1.run.app
- **AI Gateway**: https://optima-core-712497593637.us-central1.run.app
- **Database**: Cloud SQL PostgreSQL at r3al-app-1:us-central1:system32-fdc

## What Gets Tested

### Section 1: Basic Health
- Root endpoint (/)
- Health check (/health)
- Routes list (/api/routes)

### Section 2: Core tRPC
- Health route
- Example routes

### Section 3: Verification
- Get verification status
- Email/SMS verification endpoints
- ID verification

### Section 4: Profile
- Get user profile
- Update profile
- Photo management
- Endorsements

### Section 5: Tokens
- Get token balance
- Earn/spend tokens
- Transaction history

### Section 6: Feed
- Trending feed
- Local feed
- Create/like/resonate posts
- Comments

### Section 7: QOTD
- Get daily question
- Submit answers
- View stats

### Section 8: Market
- Market summary
- Trending symbols
- Market news

### Section 9: AI
- Get insights
- Personalized summaries
- Trend analysis

### Section 10: Match
- Suggest matches
- Compare users
- Match insights

### Section 11: Social
- Follow/unfollow
- Get followers/following
- Suggested users

### Section 12: Optima
- Health check
- Log pulse
- Submit hive data

### Section 13: Location
- Local news
- Local events
- Nearby users

### Section 14: ML
- Get personalized recommendations

## Expected Results

All tests should return either:
- ✅ **200 OK** - Endpoint working correctly
- ✅ **Mock data returned** - Backend returning test data

## Troubleshooting

### All tests return 404
- Check backend is deployed and running
- Verify EXPO_PUBLIC_RORK_API_BASE_URL in .env
- Ensure backend has latest code deployed

### Some tests fail with errors
- Check backend logs for specific errors
- Verify database connection (run database test)
- Check authentication requirements

### Network errors
- Verify backend URL is accessible
- Check firewall/CORS settings
- Ensure SSL certificate is valid

## Next Steps After Testing

1. ✅ **All tests pass** - Backend is fully operational
2. ⚠️ **Some tests fail** - Review failed endpoints and fix issues
3. ❌ **All tests fail** - Check backend deployment and configuration

## Running Tests in CI/CD

Add to your deployment pipeline:

```yaml
- name: Test Backend
  run: node scripts/comprehensive-test.js
  env:
    EXPO_PUBLIC_RORK_API_BASE_URL: ${{ secrets.BACKEND_URL }}
```

## Test Output Format

The test suite provides:
- Color-coded results (green = pass, red = fail)
- Response previews for each endpoint
- Summary statistics at the end
- Exit code 0 for success, 1 for failures

## Support

If you encounter issues:
1. Check backend logs in Google Cloud Console
2. Verify database connectivity
3. Review .env configuration
4. Check tRPC router setup in backend/trpc/app-router.ts
