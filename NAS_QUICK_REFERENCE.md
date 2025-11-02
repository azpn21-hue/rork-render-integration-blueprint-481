# NAS Integration - Quick Reference

## Your NAS Details
- **IP:** 192.169.1.119
- **Share:** R3AL_BACKEND
- **Username:** optima
- **Type:** Buffalo LinkStation

---

## ⚠️ Critical Understanding

### ❌ What You CANNOT Do
**Mobile apps (React Native/Expo) cannot:**
- Mount SMB/CIFS shares
- Access network file systems directly
- Run `sudo mount` commands
- Execute Linux file operations

### ✅ What You MUST Do
**Set up a backend server that:**
- Runs Linux/Unix (Ubuntu, Debian, CentOS, etc.)
- Has network access to 192.169.1.119
- Mounts your NAS using `mount.cifs`
- Exposes HTTP/tRPC endpoints to mobile app
- Handles encryption and file operations

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│  Mobile App (iOS/Android/Web)           │
│  - React Native + Expo                  │
│  - Takes photos with camera             │
│  - Shows user interface                 │
└──────────────┬──────────────────────────┘
               │
               │ HTTP/tRPC API calls
               │
┌──────────────▼──────────────────────────┐
│  Backend Server (Node.js + Hono)        │
│  - Receives photo from mobile           │
│  - Encrypts with AES-256-GCM            │
│  - Writes to mounted NAS                │
│  - Reads/deletes files on request       │
│  - Runs cleanup jobs                    │
└──────────────┬──────────────────────────┘
               │
               │ SMB/CIFS protocol
               │
┌──────────────▼──────────────────────────┐
│  Buffalo NAS (192.169.1.119)            │
│  - Share: R3AL_BACKEND                  │
│  - Stores encrypted files               │
│  - 7-day retention                      │
└─────────────────────────────────────────┘
```

---

## Quick Setup (Backend Server)

### 1. Install Tools
```bash
sudo apt-get update
sudo apt-get install cifs-utils
```

### 2. Create Mount Point
```bash
sudo mkdir -p /mnt/r3al_nas
```

### 3. Create Credentials File
```bash
sudo nano /etc/r3al-nas-credentials
```

Add these lines:
```
username=optima
password=YOUR_NAS_PASSWORD
```

Secure it:
```bash
sudo chmod 600 /etc/r3al-nas-credentials
```

### 4. Mount NAS
```bash
sudo mount -t cifs //192.169.1.119/R3AL_BACKEND /mnt/r3al_nas \
  -o credentials=/etc/r3al-nas-credentials,vers=3.0,iocharset=utf8,uid=1000,gid=1000
```

### 5. Test Access
```bash
# Check if mounted
df -h | grep r3al_nas

# Test write
echo "test" | sudo tee /mnt/r3al_nas/test.txt

# Test read
cat /mnt/r3al_nas/test.txt

# Clean up
sudo rm /mnt/r3al_nas/test.txt
```

### 6. Auto-mount on Boot
Add to `/etc/fstab`:
```
//192.169.1.119/R3AL_BACKEND /mnt/r3al_nas cifs credentials=/etc/r3al-nas-credentials,vers=3.0,iocharset=utf8,uid=1000,gid=1000 0 0
```

---

## Backend Code Summary

### File: `backend/services/nasStorage.ts`
Handles:
- File encryption (AES-256-GCM)
- Saving to NAS
- Reading from NAS
- Deleting from NAS

### File: `backend/trpc/routes/r3al/storage/upload-photo.ts`
API endpoint that:
- Receives base64 photo from mobile
- Calls `nasStorage.saveFile()`
- Returns `fileId` to mobile

### File: `backend/services/nasCleanup.ts`
Scheduled job that:
- Runs daily
- Deletes files older than 7 days
- Logs cleanup activity

---

## Mobile App Changes

### Current Behavior (Local Storage)
```typescript
const uploadPhoto = (photo) => {
  const newPhoto = {
    id: generateId(),
    url: photo.url,  // base64 or file://
    type: photo.type,
  };
  
  // Save to AsyncStorage
  saveToLocalState(newPhoto);
};
```

### New Behavior (NAS Storage)
```typescript
const uploadPhoto = async (photo) => {
  // Send to backend
  const result = await trpcClient.r3al.storage.uploadPhoto.mutate({
    userId: userProfile.name,
    photoBase64: photo.url,
    photoType: photo.type,
  });
  
  const newPhoto = {
    id: result.fileId,          // NAS file identifier
    url: photo.url,             // Keep thumbnail locally
    type: photo.type,
    uploadedAt: result.uploadedAt,
  };
  
  // Save metadata to AsyncStorage
  saveToLocalState(newPhoto);
};
```

---

## Testing Checklist

### Backend Server Tests
- [ ] NAS mounted at `/mnt/r3al_nas`
- [ ] Can write files to NAS
- [ ] Can read files from NAS
- [ ] Can delete files from NAS
- [ ] Mount persists after reboot
- [ ] Encryption key configured in `.env`
- [ ] Backend API running and accessible
- [ ] Health check endpoint responds

### Mobile App Tests
- [ ] Can capture photos
- [ ] Upload API call succeeds
- [ ] Receives `fileId` from backend
- [ ] Photo thumbnail shows in gallery
- [ ] Can retrieve full photo from backend
- [ ] Error handling works (network failure)
- [ ] Loading states display correctly

---

## Common Issues

### "Permission denied" when mounting
```bash
# Check NAS is accessible
ping 192.169.1.119

# Verify share exists
smbclient -L 192.169.1.119 -U optima

# Check credentials file
sudo cat /etc/r3al-nas-credentials
```

### "Mount point does not exist"
```bash
# Create it
sudo mkdir -p /mnt/r3al_nas
```

### "CIFS not supported"
```bash
# Install cifs-utils
sudo apt-get install cifs-utils
```

### Photos not appearing in app
1. Check backend logs for upload errors
2. Verify `fileId` is returned to app
3. Check AsyncStorage for photo metadata
4. Test retrieval API separately

---

## Security Notes

1. **Never** put NAS credentials in mobile app code
2. **Always** encrypt files before storing on NAS
3. **Use HTTPS** for backend API in production
4. **Validate** user permissions before file operations
5. **Sanitize** file paths to prevent directory traversal
6. **Rotate** encryption keys periodically
7. **Monitor** NAS access logs for anomalies
8. **Backup** NAS data regularly

---

## Cost Considerations

### Free (Current Setup)
- Buffalo NAS (already owned)
- Local network access
- Self-hosted backend server

### Paid Alternatives (If Needed)
- **AWS S3:** ~$0.023/GB/month
- **Google Cloud Storage:** ~$0.020/GB/month
- **Azure Blob:** ~$0.018/GB/month
- **Cloudflare R2:** $0.015/GB/month (no egress fees)

---

## Performance Metrics

Expected response times:
- **Photo upload (2MB):** 1-3 seconds
- **Photo retrieval:** 500ms - 2 seconds
- **Thumbnail load:** < 100ms (cached locally)
- **Gallery scroll:** Smooth (local thumbnails)

Optimize by:
- Compress photos before upload (JPEG 80% quality)
- Generate thumbnails on backend
- Cache frequently accessed photos
- Use CDN for popular content

---

## Documentation Files

- **NAS_BACKEND_INTEGRATION.md** - Complete setup guide
- **FIXES_SUMMARY.md** - Recent changes and fixes
- **NAS_QUICK_REFERENCE.md** - This file (quick overview)

---

## Decision Time

### Option 1: Local Storage Only (Current)
✅ No backend setup needed  
✅ Works immediately  
✅ Good for development/testing  
❌ No sync across devices  
❌ Lost if user deletes app  
❌ Limited by device storage

### Option 2: NAS Storage (Requires Setup)
✅ Centralized storage  
✅ Sync across devices  
✅ Survives app reinstall  
✅ Backup possible  
❌ Requires backend server  
❌ Network dependent  
❌ More complex setup

### Option 3: Cloud Storage (S3, etc.)
✅ Fully managed  
✅ Global CDN  
✅ Auto-scaling  
✅ Built-in backups  
❌ Ongoing costs  
❌ Vendor lock-in  
❌ Requires internet

---

## Recommendation

For **production deployment:**
1. Start with **local storage** (already working)
2. Add **backend server** when you have dedicated hardware
3. Mount **NAS** for data persistence
4. Consider **cloud storage** if user base grows significantly

For **current development:**
- Keep using local storage
- Focus on app features
- Set up NAS backend when ready for beta testing

---

## Summary

🎯 **Your NAS config is documented and ready**  
📱 **Mobile app works locally right now**  
🖥️ **Backend setup guide is complete**  
✅ **No immediate action required** unless you want NAS storage

The app is functional with local storage. NAS integration is an enhancement you can add when you're ready to set up a backend server.
