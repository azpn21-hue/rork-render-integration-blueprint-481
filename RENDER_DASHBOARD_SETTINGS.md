# 🎛️ RENDER DASHBOARD - EXACT SETTINGS

Copy these EXACT values into your Render dashboard settings.

---

## 🔨 BUILD FILTERS

### Included Paths
Leave **EMPTY** (or add specific paths if needed)

### Ignored Paths  
Leave **EMPTY** (or add paths like `*.md`, `docs/*` if needed)

---

## 🏗️ BUILD COMMAND

```
npm install --legacy-peer-deps
```

**Important:**
- Must include `--legacy-peer-deps` flag
- This resolves React 19 vs lucide-react-native conflict
- Don't use `--force` instead

---

## 🚀 PRE-DEPLOY COMMAND (Optional)

Leave **EMPTY**

Or if you want logs:
```
echo "Starting R3AL Connection deployment..."
```

**Note:** Pre-deploy is for migrations, asset uploads, etc. Not needed for this app.

---

## ▶️ START COMMAND

```
npm run server
```

**Critical:**
- DO NOT use `node index.js`
- DO NOT use `bunx rork start`
- DO NOT use `npx expo start`
- MUST be exactly: `npm run server`

This runs the script defined in package.json which starts server.js

---

## 🌍 ENVIRONMENT VARIABLES

Click "+ Add Environment Variable" for each of these:

### 1. NODE_ENV
```
production
```

### 2. PORT
```
10000
```

### 3. EXPO_PUBLIC_RORK_API_BASE_URL
```
https://rork-r3al-connection.onrender.com
```
**Note:** Replace with your actual Render URL if different

### 4. RENDER_API_KEY
```
rnd_w0obVzrvycssNp2SbIA3q2sbZZW0
```
**Security:** Mark as "secret" (toggle sync off)

### 5. RENDER_SERVICE_NAME
```
rork-r3al-connection
```

### 6. RENDER_REGION
```
virginia
```

### 7. WHITELISTED_IPS
```
216.24.60.0/24,74.220.49.0/24,74.220.57.0/24
```

### 8. JWT_SECRET
```
UltraSecureKey123!
```
**Security:** Mark as "secret" (toggle sync off)
**Production:** Change to a secure random string

---

## 🏥 HEALTH CHECK PATH

```
/health
```

**Important:**
- Must start with `/`
- Render pings this endpoint every 30 seconds
- Returns 200 status when healthy
- If it fails 3 times, service is restarted

---

## 🔄 AUTO-DEPLOY

```
On Commit
```

Select: **On Commit** (recommended)
This auto-deploys when you push to main branch.

Alternative: **Manual** (you trigger deploys manually)

---

## 📍 REGION

```
Virginia (US East)
```

**Options:**
- Virginia (US East) ✅ Recommended
- Oregon (US West)
- Frankfurt (EU)
- Singapore (Asia)

Choose the region closest to your users.

---

## 💻 RUNTIME

```
Node
```

**Critical:** Must be Node, not:
- Docker
- Python  
- Static Site
- etc.

---

## 📦 PLAN

```
Standard
```

Your current plan. Free tier also works for testing.

---

## 🔐 SECRETS (Advanced)

If you're using Render Environment Groups:

### RENDER_ENV_GROUP_ID
```
evg-d3pgdv8dl3ps73b5j7v0
```

**Note:** Only needed if you're syncing env vars across services

---

## ✅ FINAL VERIFICATION

Before clicking "Save Changes", verify:

1. **Build Command** = `npm install --legacy-peer-deps`
2. **Start Command** = `npm run server`
3. **Health Check** = `/health`
4. **Runtime** = Node
5. **Region** = Virginia
6. **All 8 environment variables** are set

---

## 🚨 COMMON MISTAKES TO AVOID

### ❌ WRONG:
```
Start Command: node index.js
Start Command: bunx rork start
Start Command: npm start
Build Command: npm install (without --legacy-peer-deps)
Health Check: /api/health (should be /health)
```

### ✅ CORRECT:
```
Start Command: npm run server
Build Command: npm install --legacy-peer-deps
Health Check: /health
```

---

## 📸 SCREENSHOT GUIDE

Your Render dashboard should look like this:

```
┌─────────────────────────────────────────────────┐
│ Build & Deploy                                  │
├─────────────────────────────────────────────────┤
│ Build Filters                                   │
│   Included Paths: [empty]                       │
│   Ignored Paths: [empty]                        │
│                                                  │
│ Build Command                                   │
│   $ npm install --legacy-peer-deps              │
│                                                  │
│ Pre-Deploy Command (Optional)                   │
│   $                                              │
│                                                  │
│ Start Command                                   │
│   $ npm run server                              │
│                                                  │
│ Auto-Deploy                                     │
│   ⚫ On Commit                                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Environment Variables                           │
├─────────────────────────────────────────────────┤
│ NODE_ENV                 = production           │
│ PORT                     = 10000                │
│ EXPO_PUBLIC_RORK_API...  = https://rork...     │
│ RENDER_API_KEY          = rnd_w0obVz... 🔒     │
│ RENDER_SERVICE_NAME     = rork-r3al-connection │
│ RENDER_REGION           = virginia             │
│ WHITELISTED_IPS         = 216.24.60.0/24...    │
│ JWT_SECRET              = UltraSecur... 🔒     │
│                                                  │
│ + Add Environment Variable                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Health Check                                    │
├─────────────────────────────────────────────────┤
│ Health Check Path                               │
│   /health                                        │
└─────────────────────────────────────────────────┘
```

---

## 🎯 NEXT STEPS

After configuring all settings:

1. Click **"Save Changes"** at the bottom
2. Go to **"Manual Deploy"** → **"Deploy latest commit"**
3. Watch the **Logs** tab for:
   - Dependencies installed
   - Build complete
   - Server started successfully
4. Check **"Events"** tab for health check status
5. Test the endpoints listed in DEPLOYMENT_CHECKLIST.md

---

**Last Updated:** 2025-10-27
**Configuration Version:** 2.0
