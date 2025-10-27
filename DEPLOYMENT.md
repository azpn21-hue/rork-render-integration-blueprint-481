# 🚀 R3AL Connection - Complete Deployment Guide

## 📋 Overview

This guide walks you through deploying the complete RORK REAR microservice architecture to Render.com.

---

## 🏗️ Architecture Summary

**Frontend**: React Native + Expo mobile app  
**Backend**: 7 microservices (Node.js + Python)  
**Infrastructure**: Render.com (Virginia region)  
**Databases**: PostgreSQL + Redis  
**Security**: Zero-trust with JWT + IP whitelisting

---

## ✅ Pre-Deployment Checklist

- [ ] GitHub repository set up and connected
- [ ] Render account created
- [ ] All environment variables from `.env` available
- [ ] Backend microservice code ready
- [ ] Stripe account (for payments)
- [ ] Domain name (optional)

---

## 🔐 Environment Variables

Copy these to Render dashboard for each service:

### Core Variables (All Services)
```bash
RENDER_API_KEY=rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
RENDER_REGION=virginia
WHITELISTED_IPS=216.24.60.0/24,74.220.49.0/24,74.220.57.0/24
```

### Gateway Service
```bash
JWT_SECRET=UltraSecureKey123!
HIVE_CORE_URL=https://hive-core.onrender.com
VAULT_URL=https://vault-service.onrender.com
COMMS_URL=https://comms-gateway.onrender.com
PAYMENT_URL=https://monetization-engine.onrender.com
```

### Frontend (Expo App)
```bash
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-gateway.onrender.com
```

### Monetization Service
```bash
STRIPE_KEY=sk_test_RorkAIIntegration
```

---

## 🚀 Deployment Steps

### Option A: Using render.yaml (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial RORK REAR deployment"
   git push origin main
   ```

2. **Connect Render to GitHub**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create all services

3. **Configure Environment Variables**
   - For each service, go to "Environment" tab
   - Add the variables listed above
   - Click "Save Changes"

4. **Deploy**
   - Render will automatically build and deploy all services
   - Monitor the logs for each service
   - Wait for all services to show "Live" status

### Option B: Manual Deployment

For each microservice, repeat these steps:

1. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your repository
   - Select the service directory (e.g., `services/gateway`)

2. **Configure Service**
   - **Name**: Service name (e.g., `rork-gateway`)
   - **Region**: Virginia
   - **Branch**: main
   - **Runtime**: Node or Python
   - **Build Command**: `npm install` or `pip install -r requirements.txt`
   - **Start Command**: Service-specific (see below)

3. **Add Environment Variables**
   - Add variables from the section above
   - Click "Create Web Service"

#### Service-Specific Start Commands

```bash
# Gateway Service
node index.js

# Auth Service  
node server.js

# Hive Core
uvicorn main:app --host 0.0.0.0 --port 10000

# Vault Service
python app.py

# Comms Gateway
node server.js

# Monetization Engine
node payments.js

# Telemetry Daemon
uvicorn main:app --host 0.0.0.0 --port 10000
```

---

## 🗄️ Database Setup

### PostgreSQL

1. **Create Database**
   - In Render dashboard, click "New" → "PostgreSQL"
   - Name: `rork-postgres`
   - Region: Virginia
   - Plan: Starter (or higher)

2. **Connect to Services**
   - Copy the "Internal Database URL"
   - Add to each service that needs database access:
     ```bash
     DATABASE_URL=<internal-database-url>
     ```

### Redis

1. **Create Redis Instance**
   - Click "New" → "Redis"
   - Name: `rork-redis`
   - Region: Virginia
   - Plan: Starter

2. **Connect to Services**
   - Copy the "Internal Redis URL"
   - Add to Hive Core and Gateway:
     ```bash
     REDIS_URL=<internal-redis-url>
     ```

---

## 🧪 Testing Deployment

### 1. Test Backend Services

```bash
bun run test:render
```

Expected output:
```
✅ gateway service: ONLINE (200)
✅ hive service: ONLINE (200)
✅ vault service: ONLINE (200)
✅ comms service: ONLINE (200)
✅ payments service: ONLINE (200)
```

### 2. Test Mobile App

```bash
# Start Expo dev server
bun run start

# Scan QR code with Expo Go app
# Try logging in or creating an account
# Verify NDA screen appears
# Check home screen loads
```

### 3. Test Authentication Flow

1. Open app in Expo Go
2. Click "Create Account"
3. Fill in registration form
4. Should redirect to NDA screen
5. Accept NDA
6. Should load home screen with your name

---

## 🐛 Common Issues & Fixes

### Issue: "URI empty error"

**Cause**: Environment variable not set  
**Fix**:
```bash
# Ensure this is in .env
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-gateway.onrender.com

# Restart Expo
bun run start -- --clear
```

### Issue: Login/Register doesn't work

**Cause**: Backend not responding  
**Fix**:
1. Run `bun run test:render` to check services
2. Check Render dashboard - services may be cold starting (wait 60s)
3. Review service logs in Render dashboard
4. Verify environment variables are set

### Issue: Services show "Deploy failed"

**Cause**: Missing dependencies or config  
**Fix**:
1. Check build logs in Render dashboard
2. Verify `package.json` or `requirements.txt` exists
3. Ensure start command is correct
4. Check for port conflicts

### Issue: Database connection failed

**Cause**: Wrong connection string  
**Fix**:
1. Use "Internal Database URL" not external
2. Ensure service is in same region (Virginia)
3. Check PostgreSQL service is running
4. Verify `DATABASE_URL` environment variable

---

## 📊 Monitoring & Maintenance

### Health Checks

All services have health endpoints:
- Gateway: `https://rork-gateway.onrender.com/health`
- Hive: `https://hive-core.onrender.com/health`
- Vault: `https://vault-service.onrender.com/ping`
- Comms: `https://comms-gateway.onrender.com/health`
- Payments: `https://monetization-engine.onrender.com/health`

### Viewing Logs

1. Go to Render dashboard
2. Click on service name
3. Click "Logs" tab
4. Filter by severity: Info, Warning, Error

### Scaling Services

1. Go to service settings
2. Under "Instance Type", select plan:
   - **Starter**: 0.5 GB RAM, suitable for low traffic
   - **Standard**: 2 GB RAM, recommended for production
   - **Pro**: 4+ GB RAM, high traffic

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Render automatically deploys when you push to main:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Render will:
1. Detect changes
2. Rebuild affected services
3. Deploy with zero downtime
4. Run health checks

### Manual Deploy

To manually trigger deployment:
1. Go to service in Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

---

## 🔒 Security Hardening

### Before Going to Production

1. **Update Secrets**
   ```bash
   # Generate new secrets
   JWT_SECRET=<strong-random-string>
   STRIPE_KEY=sk_live_<your-live-key>
   ```

2. **Enable IP Whitelisting**
   - Only allow trusted IPs to access services
   - Configure in Render dashboard under "Settings"

3. **Add SSL/TLS**
   - Render provides free SSL certificates
   - Ensure all services use HTTPS

4. **Set Up Monitoring**
   - Enable Render metrics
   - Set up alerting for downtime
   - Configure log aggregation

5. **Database Backups**
   - Enable automatic backups in PostgreSQL settings
   - Set retention period (7-30 days)

---

## 📈 Production Readiness Checklist

- [ ] All services deployed and healthy
- [ ] Database connected and tested
- [ ] Redis cache operational
- [ ] Environment variables secured
- [ ] Health checks passing
- [ ] Logs accessible and monitored
- [ ] Auto-scaling configured
- [ ] Backups enabled
- [ ] SSL certificates active
- [ ] Custom domain configured (optional)
- [ ] Load testing completed
- [ ] Error tracking set up
- [ ] Documentation updated

---

## 🆘 Emergency Procedures

### Service Down
1. Check Render dashboard for service status
2. Review logs for errors
3. Restart service manually if needed
4. Roll back to previous version if necessary

### Database Issues
1. Check connection string
2. Verify database is running
3. Review connection pool settings
4. Contact Render support if persistent

### Complete Outage
1. Check Render status page
2. Verify DNS settings
3. Review recent deployments
4. Contact Render support

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Render Support**: support@render.com
- **Render Status**: https://status.render.com

---

## 🎯 Next Steps After Deployment

1. **Load Testing**: Use tools like k6 or Artillery
2. **Performance Monitoring**: Add New Relic or Datadog
3. **Error Tracking**: Integrate Sentry
4. **Analytics**: Add Mixpanel or Amplitude
5. **Push Notifications**: Configure FCM/APNS
6. **CI/CD Pipeline**: Set up GitHub Actions
7. **Staging Environment**: Create separate Render services
8. **API Documentation**: Generate with Swagger/OpenAPI

---

**Deployment successful? Time to build! 🎉**
