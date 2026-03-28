# R3AL Connection - Multi-Service Deployment Guide

## Architecture Overview

The R3AL Connection app uses a three-service architecture:

1. **Backend** (`rork-r3al-backend`) - Node.js API server with tRPC
2. **Frontend** (`rork-r3al-frontend`) - Expo React Native Web app
3. **AI Gateway** (`optima-ai-gateway`) - Sonet 4.5 / Anthropic inference service

## Service Endpoints

- **Backend**: `https://rork-r3al-backend.onrender.com` (Port 10000)
- **Frontend**: `https://rork-r3al-frontend.onrender.com` (Port 8080)
- **AI Gateway**: `https://optima-ai-gateway.onrender.com` (Port 9000)

## Deployment Order

Deploy services in this order to ensure proper connectivity:

### 1. Backend Service First

```bash
Service: rork-r3al-backend
Build: npm install --legacy-peer-deps
Start: node server.js
Health: /health
```

**Required Environment Variables:**
- `NODE_ENV=production`
- `PORT=10000`
- `JWT_SECRET` (secure, sync from environment group)
- `DATABASE_URL` (if using database)

### 2. AI Gateway Service Second

```bash
Service: optima-ai-gateway
Root: ./ai-gateway
Build: npm install && npm run build
Start: node dist/index.js
Health: /healthz
```

**Required Environment Variables:**
- `NODE_ENV=production`
- `PORT=9000`
- `AI_PROVIDER=anthropic`
- `MODEL_ID=claude-3-5-sonnet-20241022`
- `ANTHROPIC_API_KEY` (secure, sync from environment group)
- `CORS_ALLOW_ORIGIN=*`

### 3. Frontend Service Last

```bash
Service: rork-r3al-frontend
Build: npm install --legacy-peer-deps && npx expo export:web
Start: npx serve web-build -p 8080
Health: /
```

**Required Environment Variables:**
- `NODE_ENV=production`
- `EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-r3al-backend.onrender.com`
- `EXPO_PUBLIC_AI_BASE_URL=https://optima-ai-gateway.onrender.com`

## Known Issues & Solutions

### React 19 Peer Dependency Conflicts

**Issue:** `lucide-react-native@0.475.0` requires React ^16.5.1 || ^17.0.0 || ^18.0.0, but the project uses React 19.1.0

**Solution:** Use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

This is already configured in `render.yaml` for all services.

### Build Command Notes

- Backend builds fastest (basic TypeScript transpilation)
- AI Gateway requires TypeScript compilation (~30s)
- Frontend build takes longest (Expo web bundling, ~2-3 min)

## Environment Variables Setup

### Backend Service
```
NODE_ENV=production
PORT=10000
JWT_SECRET=<your-secure-secret>
DATABASE_URL=<your-db-connection-string>
```

### AI Gateway Service
```
NODE_ENV=production
PORT=9000
AI_PROVIDER=anthropic
MODEL_ID=claude-3-5-sonnet-20241022
ANTHROPIC_API_KEY=<your-anthropic-key>
CORS_ALLOW_ORIGIN=*
REQUEST_TIMEOUT_MS=45000
MAX_TOKENS=1024
TEMPERATURE=0.3
```

### Frontend Service
```
NODE_ENV=production
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-r3al-backend.onrender.com
EXPO_PUBLIC_AI_BASE_URL=https://optima-ai-gateway.onrender.com
```

## Testing Deployment

### 1. Test Backend Health
```bash
curl https://rork-r3al-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "R3AL Connection API health check",
  "timestamp": "2025-10-27T..."
}
```

### 2. Test AI Gateway Health
```bash
curl https://optima-ai-gateway.onrender.com/healthz
```

Expected response:
```json
{
  "ok": true,
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022",
  "timestamp": "2025-10-27T..."
}
```

### 3. Test AI Chat Stream
```bash
curl -N -X POST https://optima-ai-gateway.onrender.com/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are Optima II, precise and helpful."},
      {"role": "user", "content": "Hello"}
    ],
    "stream": true
  }'
```

Expected response: Server-sent events stream with `data:` prefixed chunks

### 4. Test Frontend
```bash
curl https://rork-r3al-frontend.onrender.com
```

Expected response: HTML page with Expo web bundle

## Monitoring

### Backend Logs
```bash
Server started successfully on port 10000
📡 TRPC endpoint: /api/trpc
💚 Health check: /health
```

### AI Gateway Logs
```bash
🤖 Optima-AI-Gateway listening on :9000
🧠 Provider: anthropic
📡 Model: claude-3-5-sonnet-20241022
```

### Frontend Logs
```bash
[API] Backend Base URL: https://rork-r3al-backend.onrender.com
[API] AI Gateway Base URL: https://optima-ai-gateway.onrender.com
```

## Troubleshooting

### Backend Not Starting
- Check `server.js` exists in root
- Verify `backend/hono.ts` compiles correctly
- Check environment variables are set

### AI Gateway Build Fails
- Ensure TypeScript version compatibility
- Check all provider files exist in `ai-gateway/src/providers/`
- Verify `tsconfig.json` is correct

### Frontend Build Timeout
- Increase Render build timeout to 15 minutes
- Check all dependencies install with `--legacy-peer-deps`
- Verify Expo CLI is available

### Cross-Service Communication Fails
- Verify CORS settings in backend and AI gateway
- Check environment variables point to correct URLs
- Ensure all services are running and healthy

## Rollback Plan

If deployment fails:

1. Revert to previous commit in GitHub
2. Trigger manual redeploy in Render dashboard
3. Check service logs for specific errors
4. Verify environment variables match this guide

## Security Checklist

- [ ] All API keys stored in Render Environment Groups
- [ ] JWT_SECRET is unique and secure
- [ ] DATABASE_URL uses SSL connection
- [ ] CORS configured correctly for production
- [ ] Rate limiting enabled on backend
- [ ] HTTPS enforced on all services

## Performance Optimization

### Backend
- Enable response caching for static endpoints
- Use connection pooling for database
- Monitor tRPC query performance

### AI Gateway
- Implement request queuing for high traffic
- Add response caching for repeated queries
- Monitor token usage and costs

### Frontend
- Enable code splitting in Expo
- Optimize bundle size
- Use CDN for static assets

## Next Steps

1. Set up monitoring with Render metrics
2. Configure custom domains
3. Enable auto-scaling for high traffic
4. Set up CI/CD pipelines
5. Add error tracking (Sentry, etc.)

## Support

For deployment issues, check:
- [Render Deployment Logs](https://dashboard.render.com)
- [GitHub Actions](https://github.com/azpn21-hue/rork-render-integration-blueprint/actions)
- Project documentation files in repo root
