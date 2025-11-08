# 🧪 R3AL Backend Testing - Quick Start

## Run All Tests Now

```bash
node scripts/comprehensive-test.js
```

## What This Does

Tests **all 14 major systems** in your R3AL backend:

1. ✅ Health checks & infrastructure
2. ✅ Verification system
3. ✅ Profile management
4. ✅ Token/wallet system
5. ✅ Social feed
6. ✅ QOTD (Question of the Day)
7. ✅ Market data
8. ✅ AI insights
9. ✅ Match system
10. ✅ Social features
11. ✅ Optima integration
12. ✅ Location services
13. ✅ ML recommendations
14. ✅ Database connectivity

## Test Files Created

| File | Purpose |
|------|---------|
| `scripts/comprehensive-test.js` | Main test suite (Node.js) |
| `scripts/run-all-tests.sh` | Bash version with jq |
| `scripts/test-all.sh` | Simple wrapper script |
| `scripts/test-database.sh` | Database connectivity test |
| `TEST_SUITE_GUIDE.md` | Complete documentation |
| `TEST_STATUS.md` | Current system status |

## Expected Output

```
═══════════════════════════════════════════════════════════════
  R3AL Comprehensive Backend Test Suite
═══════════════════════════════════════════════════════════════

Backend URL: https://r3al-app-271493276620.us-central1.run.app
Timestamp: 2025-11-08T...

═══════════════════════════════════════════════════════════════
  SECTION 1: Basic Health Checks
═══════════════════════════════════════════════════════════════

─ Test 1: Root Endpoint

URL: https://r3al-app-271493276620.us-central1.run.app/
✅ PASSED - Status: 200
Response: {
  "status": "ok",
  "message": "R3AL Connection API is running",
  ...
}

[... 24 more tests ...]

═══════════════════════════════════════════════════════════════
  Test Summary
═══════════════════════════════════════════════════════════════

Total Tests:  25
Passed:       25 (100.0%)
Failed:       0 (0.0%)

🎉 All tests passed!
```

## What Success Looks Like

- ✅ All tests return 200 status
- ✅ All routes return valid JSON
- ✅ No 404 errors
- ✅ Database shows "connected"
- ✅ All systems operational

## If Tests Fail

### 1. Check Backend is Running
```bash
curl https://r3al-app-271493276620.us-central1.run.app/health
```

### 2. Check Routes are Registered
```bash
curl https://r3al-app-271493276620.us-central1.run.app/api/routes
```

### 3. Test Database
```bash
bash scripts/test-database.sh
```

### 4. Review Logs
Check Google Cloud Console → Cloud Run → r3al-app → Logs

## Alternative Test Commands

### Quick health check only
```bash
bun scripts/test-backend-health.ts
```

### Full bash version (needs jq)
```bash
bash scripts/run-all-tests.sh
```

### Custom backend URL
```bash
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-url.com node scripts/comprehensive-test.js
```

## Configuration

Your backend is configured at:
```
EXPO_PUBLIC_RORK_API_BASE_URL=https://r3al-app-271493276620.us-central1.run.app
```

This is set in your `.env` file and matches your deployed Cloud Run service.

## Next Steps After Testing

1. ✅ **All Pass**: Backend is ready → Start testing frontend
2. ⚠️ **Some Fail**: Review specific errors → Fix and redeploy
3. ❌ **All Fail**: Check deployment → Verify backend is running

## Support Files

- `TEST_SUITE_GUIDE.md` - Full testing documentation
- `TEST_STATUS.md` - System status and configuration
- `BACKEND_TROUBLESHOOTING.md` - Common issues and fixes

---

**Ready to test?** Run:
```bash
node scripts/comprehensive-test.js
```

This will test all 25+ endpoints and give you a complete system health report in 2-3 minutes.
