# 🚀 Cloud SQL Integration - Quick Reference

## Your Cloud SQL Details
```
Instance Name:     system32-fdc
Connection Name:   r3al-app-1:us-central1:system32-fdc
IP Address:        34.59.125.192
Database:          r3al
User:              postgres
Region:            us-central1
```

## 🎯 Quick Deploy (3 Commands)

```bash
# 1. Create database (if needed)
gcloud sql databases create r3al --instance=system32-fdc --project=r3al-app-1

# 2. Deploy backend with Cloud SQL
cd /home/user/rork-app
chmod +x scripts/deploy-backend-with-db.sh && ./scripts/deploy-backend-with-db.sh

# 3. Configure environment
chmod +x scripts/setup-cloudsql-env.sh && ./scripts/setup-cloudsql-env.sh
```

## ✅ Verify It's Working

```bash
# Health check (should show database: "connected")
curl https://r3al-app-271493276620.us-central1.run.app/health | jq

# View logs
gcloud run logs read r3al-app --region us-central1 --limit 50

# Test registration
curl -X POST https://r3al-app-271493276620.us-central1.run.app/api/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{"json":{"email":"test@example.com","password":"test123","name":"Test"}}'
```

## 📋 Environment Variables Needed

Add these to Cloud Run:
```
CLOUD_SQL_CONNECTION_NAME=r3al-app-1:us-central1:system32-fdc
DB_USER=postgres
DB_PASSWORD=<your-password>
DB_NAME=r3al
NODE_ENV=production
```

## 🗄️ Database Tables (Auto-Created)

- ✅ users (accounts)
- ✅ profiles (user data)
- ✅ verifications (identity checks)
- ✅ tokens (TrustToken balances)
- ✅ token_transactions (token history)
- ✅ circles (user groups)
- ✅ circle_members (membership)
- ✅ posts (content)
- ✅ sessions (auth sessions)

## 🐛 Common Issues

**Issue**: Database connection failed
```bash
# Fix: Check instance is running
gcloud sql instances describe system32-fdc --project=r3al-app-1

# Fix: Verify Cloud Run has connection
gcloud run services describe r3al-app --region us-central1 | grep cloudsql
```

**Issue**: 404 errors
```bash
# Fix: Check routes are registered
curl https://r3al-app-271493276620.us-central1.run.app/api/routes | jq

# Fix: Verify .env has correct URL
cat .env | grep RORK_API_BASE_URL
```

**Issue**: Mock data returned
- Database not connected
- Check logs for connection errors
- Verify environment variables set

## 🔧 Useful Commands

```bash
# Update environment variables only
gcloud run services update r3al-app --region us-central1 \
  --set-env-vars "DB_PASSWORD=newpassword"

# Force new deployment
gcloud run deploy r3al-app --source . --region us-central1 --project r3al-app-1

# Connect to database directly
cloud_sql_proxy -instances=r3al-app-1:us-central1:system32-fdc=tcp:5432
psql -h 127.0.0.1 -U postgres -d r3al

# View all environment variables
gcloud run services describe r3al-app --region us-central1 --format="value(spec.template.spec.containers[0].env)"
```

## 📊 Monitor Health

```bash
# Watch logs in real-time
gcloud run logs tail r3al-app --region us-central1

# Check Cloud SQL metrics
gcloud sql operations list --instance=system32-fdc --limit=10

# Cloud Run metrics
gcloud run services describe r3al-app --region us-central1 --format="value(status.url)"
```

## 🎯 What Changed

### Backend Files Created:
- `backend/db/config.ts` - Database connection
- `backend/db/queries.ts` - Database operations

### Backend Files Updated:
- `backend/hono.ts` - Initialize database
- `backend/trpc/routes/auth/login/route.ts` - Use database
- `backend/trpc/routes/auth/register/route.ts` - Use database
- `backend/Dockerfile` - Cloud SQL support

### New Dependencies:
- `pg` - PostgreSQL client
- `@types/pg` - TypeScript types

## 📖 Documentation

- Full guide: `CLOUD_SQL_DEPLOYMENT_GUIDE.md`
- Setup details: `CLOUD_SQL_SETUP.md`

## 🔗 Links

- Cloud Run: https://console.cloud.google.com/run/detail/us-central1/r3al-app
- Cloud SQL: https://console.cloud.google.com/sql/instances/system32-fdc
- Backend URL: https://r3al-app-271493276620.us-central1.run.app
