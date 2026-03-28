# 🚀 START HERE - Cloud SQL Database Integration

## ⚡ TL;DR - What Just Happened

Your R3AL backend now has **full PostgreSQL database integration** via Google Cloud SQL!

**Database**: `system32-fdc` at `r3al-app-1:us-central1:system32-fdc`  
**Backend**: `https://r3al-app-271493276620.us-central1.run.app`

## 🎯 Quick Deploy (Copy & Paste)

```bash
# Set your database password (REPLACE YOUR_PASSWORD)
gcloud sql users set-password postgres \
  --instance=system32-fdc \
  --password=YOUR_SECURE_PASSWORD \
  --project=r3al-app-1

# Deploy backend with database
cd /home/user/rork-app
chmod +x scripts/deploy-backend-with-db.sh
./scripts/deploy-backend-with-db.sh

# Configure environment (will prompt for password)
chmod +x scripts/setup-cloudsql-env.sh
./scripts/setup-cloudsql-env.sh

# Test everything
chmod +x scripts/test-cloudsql-integration.sh
./scripts/test-cloudsql-integration.sh
```

That's it! Your backend will now persist data to PostgreSQL.

## ✅ Verify It Worked

```bash
# Should show "database": "connected"
curl https://r3al-app-271493276620.us-central1.run.app/health | jq
```

## 📋 What Was Done

### Files Created
- `backend/db/config.ts` - Database connection
- `backend/db/queries.ts` - All database operations
- `scripts/deploy-backend-with-db.sh` - Deployment script
- `scripts/setup-cloudsql-env.sh` - Environment setup
- `scripts/test-cloudsql-integration.sh` - Integration tests
- Full documentation suite

### Files Updated
- `backend/hono.ts` - Initialize database
- `backend/Dockerfile` - Cloud SQL support
- `backend/trpc/routes/auth/login/route.ts` - Database login
- `backend/trpc/routes/auth/register/route.ts` - Database registration
- `package.json` - Added `pg` and `@types/pg`

### Database Tables (Auto-Created)
9 tables for: users, profiles, verifications, tokens, transactions, circles, members, posts, sessions

## 🗂️ Documentation

- **📘 Quick Reference**: `CLOUD_SQL_QUICK_REF.md` ← Start here
- **📗 Complete Guide**: `CLOUD_SQL_DEPLOYMENT_GUIDE.md`
- **📙 Setup Details**: `CLOUD_SQL_SETUP.md`
- **📕 Summary**: `CLOUD_SQL_INTEGRATION_COMPLETE.md`

## 🐛 Troubleshooting

### Database not connected?
```bash
# Check Cloud SQL status
gcloud sql instances describe system32-fdc --project=r3al-app-1

# Re-run environment setup
./scripts/setup-cloudsql-env.sh

# View logs
gcloud run logs read r3al-app --region us-central1 --limit 50
```

### Still getting 404 errors?
```bash
# Check routes
curl https://r3al-app-271493276620.us-central1.run.app/api/routes | jq

# Verify .env has correct URL
cat .env | grep RORK_API_BASE_URL
```

## 🎯 Next Steps

1. ✅ Run deployment scripts (commands above)
2. ✅ Test integration
3. ✅ Try registering a user in your app
4. ⬜ Add more database operations to other routes
5. ⬜ Set up Cloud SQL backups

---

**Need Help?**
- Read: `CLOUD_SQL_QUICK_REF.md` for commands
- Check: `CLOUD_SQL_DEPLOYMENT_GUIDE.md` for troubleshooting
- Test: Run `./scripts/test-cloudsql-integration.sh`
