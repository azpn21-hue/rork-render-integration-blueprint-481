# Cloud SQL Integration - Complete Setup Guide

## ✅ What Has Been Done

1. **Database Layer Created**:
   - `backend/db/config.ts` - Database connection configuration
   - `backend/db/queries.ts` - Database query functions
   - Automatic table creation on first run

2. **Backend Integration**:
   - Updated `backend/hono.ts` to initialize database
   - Updated authentication routes to use PostgreSQL
   - Added database health checks

3. **Deployment Scripts**:
   - `scripts/deploy-backend-with-db.sh` - Deploy with Cloud SQL
   - `scripts/setup-cloudsql-env.sh` - Configure environment variables

## 🚀 Quick Start Deployment

### Step 1: Create Database (If Not Exists)

```bash
gcloud sql databases create r3al \
  --instance=system32-fdc \
  --project=r3al-app-1
```

### Step 2: Set Database Password

Set a password for the PostgreSQL 'postgres' user:

```bash
gcloud sql users set-password postgres \
  --instance=system32-fdc \
  --password=YOUR_SECURE_PASSWORD \
  --project=r3al-app-1
```

**Important**: Save this password securely!

### Step 3: Deploy Backend with Cloud SQL

Run the deployment script:

```bash
cd /home/user/rork-app
chmod +x scripts/deploy-backend-with-db.sh
./scripts/deploy-backend-with-db.sh
```

### Step 4: Configure Environment Variables

Run the environment setup script:

```bash
chmod +x scripts/setup-cloudsql-env.sh
./scripts/setup-cloudsql-env.sh
```

This will prompt you for the database password and configure all necessary environment variables.

### Step 5: Verify Deployment

Test the health endpoint:

```bash
curl https://r3al-app-271493276620.us-central1.run.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-11-08T...",
  "routes": 50+
}
```

## 📋 Manual Configuration Steps

If you prefer manual configuration:

### 1. Update Cloud Run Service

```bash
gcloud run services update r3al-app \
  --region us-central1 \
  --project r3al-app-1 \
  --add-cloudsql-instances r3al-app-1:us-central1:system32-fdc \
  --set-env-vars "\
CLOUD_SQL_CONNECTION_NAME=r3al-app-1:us-central1:system32-fdc,\
DB_USER=postgres,\
DB_PASSWORD=YOUR_PASSWORD,\
DB_NAME=r3al,\
NODE_ENV=production"
```

### 2. Redeploy Application

```bash
cd /home/user/rork-app

gcloud run deploy r3al-app \
  --source . \
  --region us-central1 \
  --project r3al-app-1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --add-cloudsql-instances r3al-app-1:us-central1:system32-fdc
```

## 🗄️ Database Schema

The following tables will be automatically created:

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  truth_score DECIMAL(5,2) DEFAULT 0.0,
  verification_level VARCHAR(50) DEFAULT 'none',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Profiles Table
```sql
CREATE TABLE profiles (
  user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id),
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  location VARCHAR(255),
  badges JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Plus 7 more tables for:
- Verifications
- Tokens & Transactions
- Circles & Members
- Posts
- Sessions

## 🔍 Testing & Verification

### Check Cloud Run Logs

```bash
gcloud run logs read r3al-app \
  --region us-central1 \
  --project r3al-app-1 \
  --limit 100
```

Look for:
```
[Database] ✅ Connection test successful
[Database] ✅ Database initialization complete
[Backend] ✅ Backend initialization complete
```

### Test Authentication

Register a new user:
```bash
curl -X POST https://r3al-app-271493276620.us-central1.run.app/api/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{
    "json": {
      "email": "test@example.com",
      "password": "password123",
      "name": "Test User"
    }
  }'
```

Login:
```bash
curl -X POST https://r3al-app-271493276620.us-central1.run.app/api/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{
    "json": {
      "email": "test@example.com",
      "password": "password123"
    }
  }'
```

### Check Database Directly

Connect via Cloud SQL Proxy:
```bash
cloud_sql_proxy -instances=r3al-app-1:us-central1:system32-fdc=tcp:5432
```

Then in another terminal:
```bash
psql -h 127.0.0.1 -U postgres -d r3al
```

Query users:
```sql
SELECT id, username, email, truth_score FROM users;
```

## 🔐 Security Best Practices

1. **Use Secret Manager** for database passwords:
   ```bash
   gcloud secrets create db-password \
     --data-file=- \
     --project=r3al-app-1
   ```

2. **Enable SSL/TLS** for Cloud SQL connections

3. **Use IAM authentication** (optional advanced feature)

4. **Restrict Cloud SQL network access** to only Cloud Run service

## 🐛 Troubleshooting

### Database Connection Failed
- Check Cloud SQL instance is running:
  ```bash
  gcloud sql instances describe system32-fdc --project=r3al-app-1
  ```
- Verify Cloud Run has Cloud SQL connection configured
- Check environment variables are set correctly

### Tables Not Created
- Check logs for initialization errors
- Verify database 'r3al' exists
- Check user permissions

### 404 Errors Still Occurring
- Ensure backend is deployed and running
- Verify `.env` has correct backend URL
- Check tRPC routes are registered: visit `/api/routes`

### Mock Data Being Returned
- This is a fallback when database is unavailable
- Check database connection in logs
- Verify environment variables

## 📊 Monitoring

### Enable Cloud SQL Monitoring

1. Go to Cloud SQL → system32-fdc → Monitoring
2. Set up alerts for:
   - CPU usage
   - Connection count
   - Disk usage

### Cloud Run Metrics

1. Go to Cloud Run → r3al-app → Metrics
2. Monitor:
   - Request count
   - Request latency
   - Error rate

## 🎯 Next Steps

1. **Test all features** to ensure database integration works
2. **Monitor logs** for any errors during initial usage
3. **Set up automated backups** for Cloud SQL
4. **Configure Cloud SQL read replicas** if needed for scaling
5. **Implement caching layer** (Redis) for frequently accessed data

## 📞 Support

If you encounter issues:

1. Check logs: `gcloud run logs read r3al-app --region us-central1 --limit 200`
2. Test health endpoint: `curl https://r3al-app-271493276620.us-central1.run.app/health`
3. Verify database: Connect via Cloud SQL Proxy and check tables

---

**Database Connection Details**:
- Instance: `system32-fdc`
- Connection Name: `r3al-app-1:us-central1:system32-fdc`
- Primary IP: `34.59.125.192`
- Region: `us-central1`
