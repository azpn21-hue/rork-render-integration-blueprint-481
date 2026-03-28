# 📚 Cloud SQL Integration - Documentation Index

## 🎯 Where to Start

1. **👉 START HERE**: [`START_HERE_CLOUD_SQL.md`](START_HERE_CLOUD_SQL.md)
   - Quick 3-command deployment
   - TL;DR of what was done
   - Verification steps

2. **📘 Quick Reference**: [`CLOUD_SQL_QUICK_REF.md`](CLOUD_SQL_QUICK_REF.md)
   - All important commands
   - Your database details
   - Common troubleshooting

## 📖 Complete Documentation

### For Deployment
- **[Deployment Guide](CLOUD_SQL_DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- **[Setup Details](CLOUD_SQL_SETUP.md)** - Environment variables and configuration
- **[Integration Summary](CLOUD_SQL_INTEGRATION_COMPLETE.md)** - What was added/changed

### Scripts Available

All scripts in `scripts/` directory:

```bash
# Deploy backend with Cloud SQL connection
./scripts/deploy-backend-with-db.sh

# Configure environment variables
./scripts/setup-cloudsql-env.sh

# Test the integration
./scripts/test-cloudsql-integration.sh
```

## 🗄️ Database Information

**Your Cloud SQL Instance**:
- Instance Name: `system32-fdc`
- Connection Name: `r3al-app-1:us-central1:system32-fdc`
- IP Address: `34.59.125.192`
- Region: `us-central1`
- Database: `r3al`

**Tables Created** (9 total):
1. users
2. profiles
3. verifications
4. tokens
5. token_transactions
6. circles
7. circle_members
8. posts
9. sessions

## 🔍 Code Changes

### New Files
- `backend/db/config.ts` - Database connection & initialization
- `backend/db/queries.ts` - Database operations (users, profiles, tokens, etc.)

### Updated Files
- `backend/hono.ts` - Database initialization on startup
- `backend/Dockerfile` - Cloud SQL support
- `backend/trpc/routes/auth/login/route.ts` - Database-backed login
- `backend/trpc/routes/auth/register/route.ts` - Database-backed registration

## 🚀 Quick Commands

```bash
# Health check
curl https://r3al-app-271493276620.us-central1.run.app/health | jq

# View logs
gcloud run logs read r3al-app --region us-central1 --limit 50

# Test registration
curl -X POST https://r3al-app-271493276620.us-central1.run.app/api/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{"json":{"email":"test@example.com","password":"test123","name":"Test"}}'

# Update environment variables
gcloud run services update r3al-app --region us-central1 \
  --set-env-vars "DB_PASSWORD=newpassword"

# Force redeploy
gcloud run deploy r3al-app --source . --region us-central1 --project r3al-app-1
```

## 🐛 Common Issues & Solutions

### Database Not Connected
**Problem**: Health check shows `"database": "disconnected"`

**Solutions**:
1. Run `./scripts/setup-cloudsql-env.sh`
2. Check: `gcloud sql instances describe system32-fdc`
3. Verify environment variables are set
4. Check logs for connection errors

### 404 Errors
**Problem**: Frontend getting 404 from backend

**Solutions**:
1. Check routes: `curl .../api/routes`
2. Verify `.env` has correct URL
3. Ensure backend is deployed and running
4. Check backend logs

### Mock Data Returned
**Problem**: API returns `"mock": true` in responses

**Cause**: Database not connected (fallback mode)

**Solution**: Fix database connection, redeploy

## 📊 Monitoring

```bash
# Watch logs in real-time
gcloud run logs tail r3al-app --region us-central1

# Cloud SQL status
gcloud sql instances describe system32-fdc --project=r3al-app-1

# Connect to database directly
cloud_sql_proxy -instances=r3al-app-1:us-central1:system32-fdc=tcp:5432
psql -h 127.0.0.1 -U postgres -d r3al
```

## 🎯 Document Purpose Guide

| When you need... | Read this... |
|-----------------|--------------|
| **Quick start** | `START_HERE_CLOUD_SQL.md` |
| **Command reference** | `CLOUD_SQL_QUICK_REF.md` |
| **Full deployment** | `CLOUD_SQL_DEPLOYMENT_GUIDE.md` |
| **Configuration** | `CLOUD_SQL_SETUP.md` |
| **What changed** | `CLOUD_SQL_INTEGRATION_COMPLETE.md` |
| **All docs** | `CLOUD_SQL_DOCUMENTATION_INDEX.md` (this file) |

## 📞 Support Resources

### Check Status
1. Health endpoint: `/health`
2. Routes list: `/api/routes`
3. Backend logs
4. Cloud SQL instance status

### Debug Tools
- `scripts/test-cloudsql-integration.sh` - Full integration test
- Cloud Console logs
- Cloud SQL Proxy for direct database access

### Documentation Links
- [Google Cloud SQL](https://cloud.google.com/sql)
- [Cloud Run](https://cloud.google.com/run)
- [Node.js pg client](https://node-postgres.com/)

---

**Backend URL**: https://r3al-app-271493276620.us-central1.run.app  
**Database**: r3al-app-1:us-central1:system32-fdc  
**Status**: Ready to deploy
