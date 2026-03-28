# Backend Setup Guide

## 🎯 Overview
The R3AL Connection app uses an integrated backend with:
- **Hono**: Fast web framework
- **tRPC**: Type-safe API layer
- **React Query**: Data fetching and caching

## 📁 Backend Structure

```
backend/
├── hono.ts                    # Main Hono app
└── trpc/
    ├── create-context.ts      # tRPC context
    ├── app-router.ts          # Main router
    └── routes/
        ├── auth/
        │   ├── login/
        │   │   └── route.ts   # Login endpoint
        │   └── register/
        │       └── route.ts   # Register endpoint
        ├── health/
        │   └── route.ts       # Health check
        └── example/
            └── hi/
                └── route.ts   # Example endpoint
```

## 🔧 How It Works

### 1. Backend Entry Point
The backend starts in `backend/hono.ts`:
```typescript
import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/app-router";

const app = new Hono();

app.use("/trpc/*", trpcServer({
  endpoint: "/api/trpc",
  router: appRouter,
  createContext,
}));
```

### 2. Adding New Routes

#### Step 1: Create Route File
Create a new file in `backend/trpc/routes/`:
```typescript
// backend/trpc/routes/users/profile/route.ts
import { z } from "zod";
import { protectedProcedure } from "../../../create-context";

const profileInput = z.object({
  userId: z.string(),
});

export const profileProcedure = protectedProcedure
  .input(profileInput)
  .query(async ({ input }) => {
    return {
      id: input.userId,
      name: "John Doe",
      email: "john@example.com",
    };
  });

export default profileProcedure;
```

#### Step 2: Add to Router
Update `backend/trpc/app-router.ts`:
```typescript
import profileRoute from "./routes/users/profile/route";

export const appRouter = createTRPCRouter({
  users: createTRPCRouter({
    profile: profileRoute,
  }),
});
```

#### Step 3: Use in Frontend
```typescript
// In your component
const { data } = trpc.users.profile.useQuery({ userId: "123" });
```

## 🔐 Authentication Flow

### Current Setup
1. User submits login/register form
2. Frontend calls tRPC mutation (`trpc.auth.login.useMutation()`)
3. Backend validates credentials (currently mock)
4. Backend returns user data + JWT token
5. Frontend stores token in AsyncStorage
6. Token included in future requests

### Upgrading to Real Auth
To connect to a real database:

1. **Install Database Client**:
```bash
npm install @prisma/client
# or
npm install mongoose
```

2. **Update Login Route**:
```typescript
// backend/trpc/routes/auth/login/route.ts
import { db } from "@/backend/db";

export const loginProcedure = publicProcedure
  .input(loginInput)
  .mutation(async ({ input }) => {
    const user = await db.user.findUnique({
      where: { email: input.email }
    });
    
    // Verify password, create JWT, etc.
  });
```

## 📡 API Endpoints

### Authentication
- `POST /api/trpc/auth.login` - Login
- `POST /api/trpc/auth.register` - Register

### Health Checks
- `GET /` - Root check
- `GET /health` - Health status
- `GET /api/trpc/health` - tRPC health

### Example
- `GET /api/trpc/example.hi` - Test endpoint

## 🧪 Testing Backend

### Using cURL
```bash
# Health check
curl http://localhost:10000/health

# tRPC health
curl http://localhost:10000/api/trpc/health
```

### Using Frontend
The frontend automatically connects to the backend:
```typescript
// lib/trpc.ts determines the base URL
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin; // Same origin in production
  }
  return "http://localhost:10000"; // Local development
};
```

## 🔄 Frontend Integration

### Setting Up tRPC Client
Already configured in `app/_layout.tsx`:
```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Your app */}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### Using tRPC in Components

#### Query (GET)
```typescript
const { data, isLoading, error } = trpc.users.profile.useQuery({
  userId: "123"
});
```

#### Mutation (POST/PUT/DELETE)
```typescript
const mutation = trpc.auth.login.useMutation({
  onSuccess: (data) => {
    console.log("Login successful:", data);
  },
  onError: (error) => {
    console.error("Login failed:", error);
  }
});

// Trigger mutation
mutation.mutate({ email: "user@example.com", password: "pass123" });
```

## 🌐 Environment Configuration

### Local Development
```bash
# .env
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:10000
```

### Production (Render)
```bash
# Render Environment Variables
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-r3al-connection.onrender.com
```

## 🐛 Common Issues

### Issue: "tRPC endpoint not found"
**Fix**: Check that route is exported in `app-router.ts`

### Issue: "CORS error"
**Fix**: Ensure `cors()` middleware is enabled in `backend/hono.ts`

### Issue: "Type error in frontend"
**Fix**: Restart TypeScript server to reload tRPC types

## 📚 Learn More
- [tRPC Documentation](https://trpc.io)
- [Hono Documentation](https://hono.dev)
- [React Query Documentation](https://tanstack.com/query)

---

**Last Updated**: 2025-10-27
