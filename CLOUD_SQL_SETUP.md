# Cloud SQL Integration Guide

## Database Connection Details

Your Cloud SQL PostgreSQL instance has been set up with the following details:

- **Instance Name**: `system32-fdc`
- **Connection Name**: `r3al-app-1:us-central1:system32-fdc`
- **Primary IP Address**: `34.59.125.192`
- **Database Version**: PostgreSQL 15
- **Region**: us-central1
- **Zone**: us-central1-c

## Required Environment Variables

Add these environment variables to your backend deployment:

### For Cloud Run (Production)
```bash
CLOUD_SQL_CONNECTION_NAME=r3al-app-1:us-central1:system32-fdc
DB_USER=postgres
DB_PASSWORD=<your-database-password>
DB_NAME=r3al
NODE_ENV=production
```

### For Local Development
```bash
DB_HOST=34.59.125.192
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<your-database-password>
DB_NAME=r3al
NODE_ENV=development
```

## Setting Environment Variables in Cloud Run

1. **Via gcloud CLI**:
```bash
gcloud run services update r3al-app \
  --region us-central1 \
  --set-env-vars "CLOUD_SQL_CONNECTION_NAME=r3al-app-1:us-central1:system32-fdc,DB_USER=postgres,DB_PASSWORD=YOUR_PASSWORD,DB_NAME=r3al,NODE_ENV=production"
```

2. **Via Google Cloud Console**:
   - Go to Cloud Run → Select your service
   - Click "EDIT & DEPLOY NEW REVISION"
   - Under "Variables & Secrets" → "Environment Variables"
   - Add each variable listed above

## Enable Cloud SQL Connection in Cloud Run

You also need to add the Cloud SQL connection to your Cloud Run service:

```bash
gcloud run services update r3al-app \
  --region us-central1 \
  --add-cloudsql-instances r3al-app-1:us-central1:system32-fdc
```

Or via Console:
- Go to Cloud Run → Select your service
- Click "EDIT & DEPLOY NEW REVISION"
- Under "Cloud SQL connections"
- Click "ADD CONNECTION"
- Select `system32-fdc`

## Database Setup

The backend will automatically create the following tables on first run:
- `users` - User accounts
- `profiles` - User profiles
- `verifications` - Verification records
- `tokens` - Token balances
- `token_transactions` - Token transaction history
- `circles` - User circles/groups
- `circle_members` - Circle membership
- `posts` - User posts/content
- `sessions` - User sessions

## Testing the Connection

Once deployed with the environment variables:

1. Check the health endpoint:
```bash
curl https://r3al-app-271493276620.us-central1.run.app/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "...",
  "routes": ...
}
```

2. Check the logs:
```bash
gcloud run logs read r3al-app --region us-central1 --limit 50
```

Look for:
```
[Database] ✅ Connection test successful
[Database] ✅ Database initialization complete
```

## Redeploy Backend

After updating environment variables, redeploy your backend:

```bash
cd /home/user/rork-app
gcloud run deploy r3al-app \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

## Security Notes

1. **Never commit database passwords** to version control
2. Use **Secret Manager** for sensitive values in production
3. Ensure **Cloud SQL instance has SSL/TLS** enabled
4. Use **IAM authentication** for enhanced security (optional)

## Troubleshooting

### Connection Timeout
- Check that Cloud SQL instance is running
- Verify Cloud Run service has the Cloud SQL connection configured
- Check network configuration and firewall rules

### Authentication Failed
- Verify DB_USER and DB_PASSWORD are correct
- Check Cloud SQL user permissions

### Tables Not Created
- Check Cloud Run logs for database initialization errors
- Verify DB_NAME exists in your Cloud SQL instance
- Manually create database if needed:
  ```bash
  gcloud sql databases create r3al --instance=system32-fdc
  ```

### 404 Errors Persist
- Ensure backend is deployed and running
- Check EXPO_PUBLIC_RORK_API_BASE_URL in .env matches Cloud Run URL
- Verify tRPC routes are registered (check /api/routes endpoint)
