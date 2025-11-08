# 🗄️ PostgreSQL Cloud SQL Integration

## 🎯 Your Database is Ready!

**Cloud SQL Instance**: `system32-fdc` (r3al-app-1:us-central1:system32-fdc)  
**Backend URL**: https://r3al-app-271493276620.us-central1.run.app  
**Database**: `r3al` with 9 tables for all R3AL features

---

## ⚡ Quick Start (3 Commands)

```bash
# 1. Make scripts executable
chmod +x scripts/make-scripts-executable.sh && ./scripts/make-scripts-executable.sh

# 2. Deploy with database (will prompt for setup)
./scripts/deploy-backend-with-db.sh

# 3. Test everything works
./scripts/test-cloudsql-integration.sh
```

---

## 📚 Documentation Hub

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[START_HERE_CLOUD_SQL.md](START_HERE_CLOUD_SQL.md)** | Quick start guide | First time setup |
| **[CLOUD_SQL_QUICK_REF.md](CLOUD_SQL_QUICK_REF.md)** | Command reference | Daily operations |
| **[CLOUD_SQL_VISUAL_SUMMARY.md](CLOUD_SQL_VISUAL_SUMMARY.md)** | Architecture overview | Understanding setup |
| **[CLOUD_SQL_DEPLOYMENT_GUIDE.md](CLOUD_SQL_DEPLOYMENT_GUIDE.md)** | Complete deployment | Step-by-step guide |
| **[CLOUD_SQL_DOCUMENTATION_INDEX.md](CLOUD_SQL_DOCUMENTATION_INDEX.md)** | Full index | Finding specific info |

---

## 🗄️ What's Included

### Database Tables (Auto-Created)
✅ **users** - Accounts with truth scores  
✅ **profiles** - User profiles & settings  
✅ **verifications** - Email/SMS/ID verification  
✅ **tokens** - TrustToken balances  
✅ **token_transactions** - Token history  
✅ **circles** - User groups  
✅ **circle_members** - Group membership  
✅ **posts** - User content  
✅ **sessions** - Authentication  

### Backend Integration
✅ Database connection & pooling  
✅ Automatic schema creation  
✅ User registration with database  
✅ Login authentication from database  
✅ Session management  
✅ Fallback to mock data if DB unavailable  

---

## 🚀 Deployment Scripts

```bash
# Deploy backend to Cloud Run with Cloud SQL
./scripts/deploy-backend-with-db.sh

# Configure database environment variables
./scripts/setup-cloudsql-env.sh

# Test the integration end-to-end
./scripts/test-cloudsql-integration.sh
```

---

## ✅ Verify It's Working

```bash
# Health check - should show "database": "connected"
curl https://r3al-app-271493276620.us-central1.run.app/health | jq

# View backend logs
gcloud run logs read r3al-app --region us-central1 --limit 50

# Test user registration
curl -X POST https://r3al-app-271493276620.us-central1.run.app/api/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{"json":{"email":"test@example.com","password":"test123","name":"Test User"}}'
```

---

## 🔧 Configuration

### Environment Variables (Set in Cloud Run)
```
CLOUD_SQL_CONNECTION_NAME=r3al-app-1:us-central1:system32-fdc
DB_USER=postgres
DB_PASSWORD=<your-password>
DB_NAME=r3al
NODE_ENV=production
```

### Your .env File (Already Configured)
```
EXPO_PUBLIC_RORK_API_BASE_URL=https://r3al-app-271493276620.us-central1.run.app
```

---

## 📦 Files Added/Modified

### New Files
- `backend/db/config.ts` - Database connection
- `backend/db/queries.ts` - Database operations
- `scripts/deploy-backend-with-db.sh` - Deployment
- `scripts/setup-cloudsql-env.sh` - Configuration
- `scripts/test-cloudsql-integration.sh` - Testing
- Complete documentation suite (8+ docs)

### Updated Files
- `backend/hono.ts` - Initialize DB on startup
- `backend/Dockerfile` - Cloud SQL support
- `backend/trpc/routes/auth/login/route.ts` - DB login
- `backend/trpc/routes/auth/register/route.ts` - DB registration
- `package.json` - Added pg, @types/pg

---

## 🎯 What You Can Do Now

✅ **Persistent users** - Real registration & login  
✅ **Truth scores** - Track & update user scores  
✅ **Verifications** - Store verification records  
✅ **TrustTokens** - Real token economy  
✅ **User profiles** - Photos, bio, settings  
✅ **Circles** - User groups & communities  
✅ **Posts** - User-generated content  
✅ **Sessions** - Secure authentication  

---

## 🐛 Troubleshooting

### Database Not Connected?
```bash
# Check Cloud SQL status
gcloud sql instances describe system32-fdc --project=r3al-app-1

# Re-configure environment
./scripts/setup-cloudsql-env.sh

# View logs for errors
gcloud run logs read r3al-app --region us-central1 --limit 50
```

### Getting 404 Errors?
```bash
# Check routes are registered
curl https://r3al-app-271493276620.us-central1.run.app/api/routes | jq

# Verify backend URL in .env
cat .env | grep RORK_API_BASE_URL
```

### Mock Data Being Returned?
This means database isn't connected. Run:
```bash
./scripts/setup-cloudsql-env.sh
```

---

## 📊 Monitoring

```bash
# Watch logs in real-time
gcloud run logs tail r3al-app --region us-central1

# Check Cloud SQL status
gcloud sql instances describe system32-fdc --project=r3al-app-1

# Connect to database directly
cloud_sql_proxy -instances=r3al-app-1:us-central1:system32-fdc=tcp:5432
psql -h 127.0.0.1 -U postgres -d r3al

# Query users table
SELECT id, username, email, truth_score FROM users;
```

---

## 🎯 Next Steps

1. ✅ **Deploy**: Run `./scripts/deploy-backend-with-db.sh`
2. ✅ **Configure**: Run `./scripts/setup-cloudsql-env.sh`
3. ✅ **Test**: Run `./scripts/test-cloudsql-integration.sh`
4. ⬜ **Use**: Register users in your app
5. ⬜ **Expand**: Add more routes using database
6. ⬜ **Secure**: Set up Cloud SQL backups
7. ⬜ **Monitor**: Configure alerts & dashboards

---

## 💡 Pro Tips

1. **Save your database password** securely
2. **Test before production** with integration script
3. **Monitor logs** for database connection issues
4. **Set up automatic backups** in Cloud SQL
5. **Use Secret Manager** for sensitive data
6. **Enable SSL/TLS** for Cloud SQL connections

---

## 🔗 Quick Links

- **Backend**: https://r3al-app-271493276620.us-central1.run.app
- **Health**: https://r3al-app-271493276620.us-central1.run.app/health
- **Routes**: https://r3al-app-271493276620.us-central1.run.app/api/routes
- **Cloud Run Console**: https://console.cloud.google.com/run/detail/us-central1/r3al-app
- **Cloud SQL Console**: https://console.cloud.google.com/sql/instances/system32-fdc

---

**🎉 Your database integration is complete and ready to deploy!**

Run the quick start commands above to get everything live.
