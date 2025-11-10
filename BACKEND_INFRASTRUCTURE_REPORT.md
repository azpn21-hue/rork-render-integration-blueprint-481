# 🏗️ R3AL Backend Infrastructure Report
**Complete Cross-Reference for Google Cloud Platform**

Generated: January 10, 2025  
Status: Production Active

---

## 📊 Executive Summary

| Component | Status | Environment |
|-----------|--------|-------------|
| **r3al-app** (Main Backend) | ✅ Active | Production |
| **optima-core** (AI Gateway) | ✅ Active | Production |
| **Cloud SQL** | ⚠️ Partial | Missing DB_PASSWORD |
| **Firebase Hosting** | ✅ Active | Landing Page Live |
| **Frontend** | ⚠️ Needs Verification | API Connection Pending |

---

## 🌐 Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    r3al.app (Firebase)                       │
│              Static Landing Page (port: N/A)                 │
│           Firebase Hosting → public/index.html               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│         r3al-app-271493276620.us-central1.run.app           │
│                  Main Backend (Cloud Run)                    │
│                     Port: 8080 (0.0.0.0)                     │
│              Image: gcr.io/PROJECT_ID/r3al-app              │
│                   Node.js 20 + Hono + tRPC                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│        optima-core-712497593637.us-central1.run.app         │
│                  AI Gateway (Cloud Run)                      │
│                     Port: 8080 (0.0.0.0)                     │
│            Image: gcr.io/PROJECT_ID/optima-core             │
│                   Node.js 20 + AI Inference                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Cloud SQL PostgreSQL Database                   │
│          Instance: r3al-app-1:us-central1:system32-fdc      │
│                  Host: 34.59.125.192:5432                    │
│                     Database: r3al                           │
│                      User: postgres                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Port Configuration

### r3al-app (Main Backend)
```yaml
Service Name: r3al-app
Cloud Run Port: 8080
Container Port: 8080
Host Binding: 0.0.0.0
Protocol: HTTP/1.1 (Hono)
Health Check: /health
Route List: /api/routes
```

**Server Configuration** (backend/server.js):
```javascript
Port: process.env.PORT || 8080
Hostname: '0.0.0.0'
Server: @hono/node-server
```

**Dockerfile Exposure**:
```dockerfile
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]
```

### optima-core (AI Gateway)
```yaml
Service Name: optima-core
Cloud Run Port: 8080
Container Port: 8080
Host Binding: 0.0.0.0
Protocol: HTTP/1.1
Health Check: /probe/gateway
```

### Firebase Hosting
```yaml
Service: r3al.app
Type: Static Site
Port: N/A (CDN)
Public Directory: public/
Entry Point: index.html
```

---

## 🛣️ Route Structure

### Core Routes (Hono)

| Path | Method | Purpose | Location |
|------|--------|---------|----------|
| `/` | GET | Status check | backend/hono.ts:81 |
| `/health` | GET | Health endpoint | backend/hono.ts:92 |
| `/api/routes` | GET | List all tRPC routes | backend/hono.ts:102 |
| `/api/trpc/*` | GET/POST | Main tRPC handler | backend/hono.ts:49 |
| `/ai/memory` | POST | AI memory proxy | backend/hono.ts:126 |
| `/probe/gateway` | GET | AI gateway health | backend/hono.ts:146 |

### tRPC Routes (r3al Router)

**Total Routes**: 70+ procedures across 17 namespaces

```typescript
// Main Router Structure (backend/trpc/app-router.ts)
appRouter {
  example: {
    hi: procedure
  },
  auth: {
    login: procedure,
    register: procedure
  },
  health: procedure,
  r3al: { // 🔥 Main Application Router
    // 17 sub-routers with 70+ procedures
  }
}
```

#### R3AL Sub-Routers

| Namespace | Routes | Purpose |
|-----------|--------|---------|
| `r3al.qotd.*` | 3 | Question of the Day |
| `r3al.profile.*` | 5 | User profiles & photos |
| `r3al.pulseChat.*` | 7 | Real-time chat & video |
| `r3al.tokens.*` | 4 | Token wallet & transactions |
| `r3al.dm.*` | 4 | Direct messaging |
| `r3al.optima.*` | 4 | AI gateway integration |
| `r3al.feed.*` | 7 | Social feed (create, like, resonate) |
| `r3al.market.*` | 3 | Market data & trends |
| `r3al.ai.*` | 3 | AI insights & analysis |
| `r3al.location.*` | 3 | Location-based discovery |
| `r3al.ml.*` | 1 | ML recommendations |
| `r3al.activity.*` | 3 | Activity tracking |
| `r3al.social.*` | 6 | Follow/unfollow system |
| `r3al.verification.*` | 7 | Email/SMS/ID verification |
| `r3al.match.*` | 5 | AI matching engine |
| `r3al.testing.*` | 6 | Test data generation |
| Root routes | 4 | NFT operations |

---

## 🔐 Environment Variables

### Required for r3al-app

```bash
# ✅ Currently Set
NODE_ENV=production
PORT=8080
CLOUD_SQL_CONNECTION_NAME=r3al-app-1:us-central1:system32-fdc
DB_USER=postgres
DB_NAME=r3al

# ⚠️ MISSING - Must be added
DB_PASSWORD=<SECRET_REQUIRED>

# Frontend API URLs
EXPO_PUBLIC_RORK_API_BASE_URL=https://r3al-app-271493276620.us-central1.run.app
EXPO_PUBLIC_AI_BASE_URL=https://optima-core-712497593637.us-central1.run.app
```

### Required for optima-core

```bash
# AI Gateway Configuration
NODE_ENV=production
PORT=8080
EXPO_PUBLIC_OPTIMA_CORE_URL=https://optima-core-712497593637.us-central1.run.app
EXPO_PUBLIC_OPTIMA_GCP_PROJECT_ID=civic-origin-476705-j8
EXPO_PUBLIC_OPTIMA_GCP_REGION=us-central1
GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8
GOOGLE_CLOUD_REGION=us-central1

# API Keys
RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
EXPO_PUBLIC_RORK_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
```

### Frontend Environment (.env)

```bash
# Client-side configuration
EXPO_PUBLIC_PROJECT_ID=9wjyl0e4hila7inz8ajca
EXPO_PUBLIC_RORK_API_BASE_URL=https://r3al-app-271493276620.us-central1.run.app
EXPO_PUBLIC_AI_BASE_URL=https://optima-core-712497593637.us-central1.run.app
EXPO_PUBLIC_OPTIMA_CORE_URL=https://optima-core-712497593637.us-central1.run.app
```

---

## 📦 Docker Configuration

### r3al-app Dockerfile

**Location**: `backend/Dockerfile`

```dockerfile
FROM node:20-slim
WORKDIR /usr/src/app

# Dependencies
COPY package*.json ./
COPY bun.lock* ./
RUN npm install --legacy-peer-deps || npm install

# Application Code
COPY backend ./backend
COPY lib ./lib
COPY tsconfig.json ./

# Backend as working directory
WORKDIR /usr/src/app/backend

# Environment
ENV NODE_ENV=production
ENV PORT=8080

# Health Check (every 30s)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080
CMD ["node", "server.js"]
```

**Key Characteristics**:
- Base Image: `node:20-slim`
- Working Directory: `/usr/src/app/backend`
- Startup: `node server.js` (uses ts-node for TypeScript)
- Health Check: Active (30s interval)
- Port: 8080 exposed

### Build Process (cloudbuild.yaml)

```yaml
# Location: cloudbuild.yaml (root)
steps:
  1. Install root dependencies (--legacy-peer-deps)
  2. Build Docker image from backend/Dockerfile
  3. Push to gcr.io/PROJECT_ID/r3al-app:latest
  4. Deploy to Cloud Run (us-central1)
  
# Deploy Configuration
Region: us-central1
Platform: managed
Memory: 2Gi
CPU: 2
Timeout: 300s
Max Instances: 10
Min Instances: 1
```

---

## 🔗 CORS Configuration

**Location**: `backend/hono.ts:14-40`

```typescript
// Allowed Origins
allowed = [
  "http://localhost:19006",  // Expo dev server
  "http://localhost:8081",   // Metro bundler
  "http://localhost:10000",  // Backend dev
  "https://rork-r3al-connection.onrender.com"
]

// Wildcard Domains
- *.rork.live
- *.rork.app
- *.rorktest.dev

// Configuration
credentials: true
allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
allowHeaders: ["Content-Type", "Authorization", "x-trpc-source"]
maxAge: 86400 (24 hours)
```

---

## 🗄️ Database Configuration

### Cloud SQL Instance

```yaml
Instance ID: r3al-app-1:us-central1:system32-fdc
Engine: PostgreSQL
Region: us-central1
Zone: us-central1-a
IP: 34.59.125.192
Port: 5432
Database: r3al
User: postgres
Connection: Private IP (VPC) + Public IP
```

### Connection Methods

**From Cloud Run** (via Unix Socket):
```bash
/cloudsql/r3al-app-1:us-central1:system32-fdc
```

**From External** (via Public IP):
```bash
Host: 34.59.125.192
Port: 5432
Database: r3al
User: postgres
Password: <REQUIRED>
```

**Environment Variable Configuration**:
```bash
# cloudbuild.yaml line 53
--add-cloudsql-instances=r3al-app-1:us-central1:system32-fdc
```

---

## 🧪 Testing Endpoints

### Health Checks

```bash
# Main Backend Health
curl https://r3al-app-271493276620.us-central1.run.app/health

# Expected Response:
{
  "status": "healthy",
  "message": "R3AL Connection API health check",
  "timestamp": "2025-01-10T...",
  "routes": 70
}

# AI Gateway Health
curl https://optima-core-712497593637.us-central1.run.app/probe/gateway

# Route List
curl https://r3al-app-271493276620.us-central1.run.app/api/routes

# Expected Response:
{
  "status": "ok",
  "routes": ["example.hi", "auth.login", "r3al.qotd.getDaily", ...],
  "count": 70,
  "r3alRoutes": ["r3al.qotd.getDaily", "r3al.profile.getProfile", ...],
  "r3alCount": 65
}
```

### tRPC Example

```bash
# Query Example
curl -X GET \
  'https://r3al-app-271493276620.us-central1.run.app/api/trpc/example.hi' \
  -H 'Content-Type: application/json'

# Mutation Example
curl -X POST \
  'https://r3al-app-271493276620.us-central1.run.app/api/trpc/auth.login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 🚨 Current Issues & Required Actions

### 🔴 CRITICAL - Must Fix Immediately

1. **Missing Database Password**
   - Location: Cloud Run environment variables
   - Variable: `DB_PASSWORD`
   - Action: Add secret via Cloud Run console
   - Impact: Database connections will fail

2. **Frontend API Connection Not Verified**
   - Check: `.env` file has correct URLs
   - Verify: `app/config/api.ts` using correct base URLs
   - Test: Frontend → Backend connectivity
   - Impact: App may not connect to backend

### 🟡 MEDIUM - Should Verify

3. **Route Count Verification**
   - Expected: 70+ routes
   - Check: `/api/routes` endpoint returns full list
   - Verify: All r3al.* routes are registered

4. **Cloud Logging Review**
   - Command: `gcloud logging read "resource.labels.service_name=r3al-app" --limit=50`
   - Look for: Startup errors, missing env vars, CORS issues

5. **Firebase Hosting Connection**
   - Domain: r3al.app
   - Status: Deployed
   - Issue: May need DNS propagation time
   - Check: `firebase hosting:channel:list`

### 🟢 LOW - Nice to Have

6. **Email Signup Backend**
   - Frontend calls: `r3al.signup` (line 549, public/index.html)
   - Backend: Route not found in r3alRouter
   - Action: Add signup procedure to backend

7. **CI/CD Automation**
   - Current: Manual `gcloud` commands
   - Suggestion: Set up Cloud Build triggers
   - Benefit: Auto-deploy on git push

---

## 📝 GCloud Cross-Reference Checklist

Use this checklist to verify your GCloud console settings:

### Cloud Run Services

**r3al-app**:
- [ ] Service name: `r3al-app`
- [ ] Region: `us-central1`
- [ ] Image: `gcr.io/PROJECT_ID/r3al-app:latest`
- [ ] Port: `8080`
- [ ] Memory: `2Gi`
- [ ] CPU: `2`
- [ ] Min instances: `1`
- [ ] Max instances: `10`
- [ ] Env var: `NODE_ENV=production`
- [ ] Env var: `PORT=8080`
- [ ] Env var: `CLOUD_SQL_CONNECTION_NAME=r3al-app-1:us-central1:system32-fdc`
- [ ] Env var: `DB_USER=postgres`
- [ ] Env var: `DB_NAME=r3al`
- [ ] ⚠️ Env var: `DB_PASSWORD=<YOUR_SECRET>`
- [ ] Cloud SQL connection: Added
- [ ] Allow unauthenticated: ✅ Yes

**optima-core**:
- [ ] Service name: `optima-core`
- [ ] Region: `us-central1`
- [ ] Port: `8080`
- [ ] Env var: `NODE_ENV=production`
- [ ] Env var: `EXPO_PUBLIC_OPTIMA_CORE_URL=https://optima-core-712497593637.us-central1.run.app`
- [ ] Env var: `GOOGLE_CLOUD_PROJECT=civic-origin-476705-j8`
- [ ] Allow unauthenticated: ✅ Yes

### Cloud SQL

- [ ] Instance: `system32-fdc`
- [ ] Database: `r3al` created
- [ ] User: `postgres` exists
- [ ] Password: Set (⚠️ must add to Cloud Run)
- [ ] Public IP: Enabled (34.59.125.192)
- [ ] Authorized networks: Configured
- [ ] Connections: Cloud Run connected

### Firebase

- [ ] Hosting: Active on `r3al.app`
- [ ] Deploy status: Complete
- [ ] Public directory: `public/`
- [ ] Custom domain: `r3al.app` connected
- [ ] SSL: Auto-provisioned

### Container Registry

- [ ] Repository: `gcr.io/PROJECT_ID/r3al-app`
- [ ] Latest tag: Present
- [ ] Image size: ~500MB (node:20-slim base)

---

## 🔧 Quick Commands Reference

### Deploy Backend
```bash
gcloud builds submit --config=cloudbuild.yaml
```

### View Logs
```bash
# Backend logs
gcloud logging read "resource.labels.service_name=r3al-app" --limit=50 --format=json

# Build logs
gcloud builds list --limit=5
```

### Update Environment Variables
```bash
gcloud run services update r3al-app \
  --region=us-central1 \
  --set-env-vars="DB_PASSWORD=YOUR_SECRET_HERE"
```

### Test Endpoints
```bash
# Health check
curl https://r3al-app-271493276620.us-central1.run.app/health | jq

# List routes
curl https://r3al-app-271493276620.us-central1.run.app/api/routes | jq
```

### Firebase Deploy
```bash
# From project root
firebase deploy --only hosting
```

---

## 📚 File Reference Map

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Backend Server | `backend/server.js` | Node.js entry point |
| Hono App | `backend/hono.ts` | Main HTTP server & routing |
| tRPC Router | `backend/trpc/app-router.ts` | Top-level router |
| R3AL Router | `backend/trpc/routes/r3al/router.ts` | Feature routes (70+ procs) |
| Dockerfile | `backend/Dockerfile` | Container build |
| Cloud Build | `cloudbuild.yaml` | GCP build pipeline |
| Frontend Config | `app/config/api.ts` | Client API base URLs |
| Environment | `.env` | Environment variables |
| Frontend HTML | `public/index.html` | Landing page |
| Firebase Config | `firebase.json` | Hosting settings |

---

## 🎯 Next Steps Recommendation

**Priority 1 (Do Now)**:
1. Add `DB_PASSWORD` to Cloud Run environment variables
2. Verify `/health` and `/api/routes` endpoints respond correctly
3. Check Cloud Logging for startup errors

**Priority 2 (Verify Today)**:
4. Test frontend → backend connectivity from Expo app
5. Confirm all 70+ tRPC routes are accessible
6. Review and fix any CORS issues in logs

**Priority 3 (Before Launch)**:
7. Add `r3al.signup` endpoint for landing page
8. Set up Cloud Build triggers for auto-deploy
9. Configure uptime monitoring and alerting
10. Enable Cloud SQL backups and point-in-time recovery

---

## 📞 Support Resources

**Cloud Run Documentation**: https://cloud.google.com/run/docs  
**Cloud SQL Documentation**: https://cloud.google.com/sql/docs  
**Firebase Hosting**: https://firebase.google.com/docs/hosting  
**tRPC Documentation**: https://trpc.io/docs

**Quick Status Check URL**:
```
https://r3al-app-271493276620.us-central1.run.app/health
```

---

*Last Updated: January 10, 2025*  
*Document Version: 1.0*  
*Project: R3AL Connection Platform*
