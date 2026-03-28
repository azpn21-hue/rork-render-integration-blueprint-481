# Rate Limit Error Fix (HTTP 429)

## Issue
The app was receiving HTTP 429 (Too Many Requests) errors when trying to access the `r3al.tokens.getBalance` endpoint. This is caused by rate limiting on the hosting platform (rorktest.dev).

## Root Cause
1. The home screen was making frequent API calls to fetch token balance
2. The query had a 30-second refetch interval
3. Multiple page loads or refreshes triggered multiple simultaneous requests
4. The hosting provider's rate limits were being exceeded

## Fixes Applied

### 1. Updated Query Configuration (`app/r3al/home.tsx`)
Changed the balance query to:
- Disabled automatic refetching on mount and window focus
- Disabled periodic refetch interval (was 30 seconds)
- Added retry logic with exponential backoff (3 retries, doubling delay)
- Set 60-second stale time to cache results
- Only enabled when not loading

```typescript
const balanceQuery = trpc.r3al.tokens.getBalance.useQuery(undefined, {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchInterval: false,  // Disabled automatic refetch
  retry: 3,                // Retry 3 times on failure
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  staleTime: 60000,        // Cache for 60 seconds
  enabled: !isLoading,     // Only run when not loading
});
```

### 2. Enhanced Error Handling (`lib/trpc.ts`)
Added specific handling for 429 errors:
- Logs clear warning messages for rate limit errors
- Provides context about why the error occurred
- Lets React Query's retry logic handle the backoff automatically

## Fallback Behavior
The app now:
1. Uses local state from `R3alContext` as the primary data source
2. Attempts to sync with backend only when necessary
3. Falls back gracefully if backend is unavailable or rate limited
4. Default token balance is 100 (as set in R3alContext)

## Backend Route Status
The `r3al.tokens.getBalance` route is properly configured:
- ✅ Route exists in `backend/trpc/routes/r3al/tokens/get-balance.ts`
- ✅ Registered in `backend/trpc/routes/r3al/router.ts`
- ✅ Available at `/api/trpc/r3al.tokens.getBalance`

## Testing
To verify the fix:
1. Open the app and navigate to the R3AL home screen
2. Check console logs for `[tRPC]` messages
3. Token balance should display correctly using local state
4. Backend sync will happen once, with retries on failure
5. No more excessive API calls

## Prevention
- Avoid using `refetchInterval` for data that doesn't change frequently
- Use local state as primary source of truth
- Only sync with backend when necessary (user actions, manual refresh)
- Implement exponential backoff for all API queries
- Set appropriate `staleTime` to cache results

## Future Improvements
Consider implementing:
1. Request debouncing for frequently called endpoints
2. Client-side request queue with rate limiting
3. Service worker for offline-first architecture
4. WebSocket for real-time updates instead of polling
