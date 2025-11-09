# Monorepo Deployment Guide

## Overview
Your project is a monorepo with two separate deployment targets:
1. **Frontend (Static Landing Page)** → Firebase Hosting
2. **Backend (API Server)** → Google Cloud Run

## Project Structure
```
/home/user/rork-app/
├── public/              # Static landing page for Firebase Hosting
│   └── index.html       # Your "Coming Soon" page
├── backend/             # Backend API server
│   ├── Dockerfile       # Backend container configuration
│   └── server.js        # Backend entry point
├── cloudbuild.yaml      # Cloud Build config for backend
├── firebase.json        # Firebase Hosting config
└── package.json         # Root dependencies
```

## Deployment Instructions

### Deploy Frontend (Static Landing Page)

Your landing page deploys to: **https://r3al.app**

**Current Issue:** Firebase is incorrectly trying to use the root directory as "firebase deploy --only hosting"

**Fix Required in Firebase Console:**

1. Go to: https://console.firebase.google.com
2. Select your project
3. Navigate to: **Hosting** → **Settings** → **Deployment**
4. Change **App root directory** from `firebase deploy --only hosting` to:
   ```
   public
   ```
   Or leave it empty (blank) to use the root directory

5. Save the changes

**Then deploy from your terminal:**
```bash
# From project root directory
firebase deploy --only hosting
```

This will deploy ONLY the static files in the `public/` folder to r3al.app.

### Deploy Backend (Cloud Run)

Your backend deploys to Google Cloud Run.

**Deploy using Cloud Build:**
```bash
# From project root directory
gcloud builds submit --config=cloudbuild.yaml
```

**What happens:**
1. Cloud Build reads `cloudbuild.yaml`
2. Installs dependencies
3. Builds Docker image from `backend/Dockerfile`
4. Pushes image to Google Container Registry
5. Deploys to Cloud Run at: `https://r3al-app-<random>.a.run.app`

## Configuration Files

### 1. cloudbuild.yaml (Root)
Located at: `/home/user/rork-app/cloudbuild.yaml`

This file explicitly tells Cloud Build:
- Where the backend code lives (`backend/`)
- Which Dockerfile to use (`backend/Dockerfile`)
- How to deploy to Cloud Run
- Separated from frontend deployment

### 2. firebase.json (Root)
Located at: `/home/user/rork-app/firebase.json`

This file tells Firebase:
- Deploy the `public/` directory
- Serve `index.html` for all routes
- Set caching headers for assets

### 3. backend/Dockerfile
Located at: `/home/user/rork-app/backend/Dockerfile`

This file:
- Uses Node.js 20
- Copies only necessary files
- Exposes port 8080
- Runs the backend server

## Common Errors & Solutions

### Error: "Invalid root directory specified"
**Problem:** Firebase is trying to build from wrong directory

**Solution:** 
1. In Firebase Console → Hosting → Settings
2. Set App root directory to `public` or leave blank
3. Never put command text like "firebase deploy --only hosting" in the directory field

### Error: "Buildpack failed detection"
**Problem:** Firebase/Cloud Build trying to auto-detect wrong project type

**Solution:**
- Frontend: Use `firebase deploy --only hosting` (static files only)
- Backend: Use explicit `cloudbuild.yaml` with Dockerfile (no buildpack auto-detection)

### Error: "Failed to fetch" or 404 on deployed site
**Problem:** Landing page not showing after deployment

**Check:**
1. Is `public/index.html` present in your project?
2. Did Firebase deployment succeed?
3. Check Firebase Console → Hosting → Releases to see deployment status
4. Try accessing: https://r3al.app directly in browser

## Quick Commands Reference

```bash
# Check if public/index.html exists
ls -la public/index.html

# Deploy frontend only
firebase deploy --only hosting

# Deploy backend only
gcloud builds submit --config=cloudbuild.yaml

# Check Firebase deployment status
firebase hosting:channel:list

# Check Cloud Run services
gcloud run services list --region=us-central1

# View Cloud Build logs
gcloud builds list --limit=5
```

## Separation of Concerns

### Frontend Deployment
- **Trigger:** Manual command `firebase deploy --only hosting`
- **Source:** `public/` directory
- **Output:** Static HTML/CSS/JS served by Firebase CDN
- **URL:** https://r3al.app
- **No build process needed** - just uploads files

### Backend Deployment
- **Trigger:** Manual command `gcloud builds submit --config=cloudbuild.yaml`
- **Source:** `backend/` directory
- **Output:** Docker container running on Cloud Run
- **URL:** Assigned by Cloud Run (e.g., https://r3al-app-xyz.a.run.app)
- **Build process:** Docker containerization with Node.js

## Next Steps

1. **Fix Firebase Console Settings:**
   - Go to Firebase Console
   - Change App root directory to `public`
   - Remove any command text from the directory field

2. **Deploy Frontend:**
   ```bash
   firebase deploy --only hosting
   ```

3. **Verify Deployment:**
   - Visit https://r3al.app
   - You should see your landing page

4. **Deploy Backend (Optional):**
   ```bash
   gcloud builds submit --config=cloudbuild.yaml
   ```

## Support

If you continue to see errors:
1. Check that `public/index.html` exists
2. Run `firebase login` to ensure you're authenticated
3. Run `firebase use --add` to link the correct Firebase project
4. Check Firebase Console → Hosting → Settings for correct root directory
