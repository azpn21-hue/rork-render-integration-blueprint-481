# R3AL NAS Backend Integration Guide

## Overview

This document describes how to integrate your Buffalo LinkStation NAS (192.169.1.119) with the R3AL backend for secure file storage.

**IMPORTANT:** NAS integration requires a **separate backend server**, not the mobile app itself.

---

## Architecture

```
Mobile App (Expo/RN)
    ↓ HTTP/tRPC
Backend Server (Hono + Node)
    ↓ SMB/CIFS
Buffalo NAS (192.169.1.119)
```

---

## 1. Backend Server Setup

### Requirements
- Linux/Unix server with Node.js
- Network access to 192.169.1.119
- `cifs-utils` package installed

### Install Dependencies

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install cifs-utils

# Create mount point
sudo mkdir -p /mnt/r3al_nas

# Create credentials file for security
echo "username=optima" | sudo tee /etc/r3al-nas-credentials
echo "password=YOUR_PASSWORD" | sudo tee -a /etc/r3al-nas-credentials
sudo chmod 600 /etc/r3al-nas-credentials
```

### Mount NAS Share

```bash
# Mount command
sudo mount -t cifs //192.169.1.119/R3AL_BACKEND /mnt/r3al_nas \
  -o credentials=/etc/r3al-nas-credentials,vers=3.0,iocharset=utf8,uid=1000,gid=1000

# Verify mount
df -h | grep r3al_nas

# Test write access
echo "R3AL NAS test $(date)" | sudo tee /mnt/r3al_nas/test_write.txt
```

### Auto-mount on Boot

Add to `/etc/fstab`:

```
//192.169.1.119/R3AL_BACKEND /mnt/r3al_nas cifs credentials=/etc/r3al-nas-credentials,vers=3.0,iocharset=utf8,uid=1000,gid=1000 0 0
```

---

## 2. Backend API Implementation

### Install File Upload Dependencies

```bash
cd backend
npm install multer @node-rs/argon2
```

### Create File Storage Service

**File:** `backend/services/nasStorage.ts`

```typescript
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const NAS_BASE_PATH = process.env.NAS_MOUNT_PATH || '/mnt/r3al_nas';
const ENCRYPTION_KEY = process.env.NAS_ENCRYPTION_KEY; // 32-byte hex string

export class NASStorage {
  private algorithm = 'aes-256-gcm';
  
  async saveFile(userId: string, fileBuffer: Buffer, category: 'photos' | 'videos' | 'documents'): Promise<string> {
    const fileId = crypto.randomBytes(16).toString('hex');
    const userDir = path.join(NAS_BASE_PATH, category, userId);
    
    // Create user directory if not exists
    await fs.mkdir(userDir, { recursive: true });
    
    // Encrypt file
    const encryptedData = this.encrypt(fileBuffer);
    
    // Save to NAS
    const filePath = path.join(userDir, `${fileId}.enc`);
    await fs.writeFile(filePath, encryptedData);
    
    console.log(`[NAS] Saved encrypted file: ${filePath}`);
    
    return fileId;
  }
  
  async getFile(userId: string, fileId: string, category: 'photos' | 'videos' | 'documents'): Promise<Buffer> {
    const filePath = path.join(NAS_BASE_PATH, category, userId, `${fileId}.enc`);
    
    const encryptedData = await fs.readFile(filePath);
    const decrypted = this.decrypt(encryptedData);
    
    return decrypted;
  }
  
  async deleteFile(userId: string, fileId: string, category: 'photos' | 'videos' | 'documents'): Promise<void> {
    const filePath = path.join(NAS_BASE_PATH, category, userId, `${fileId}.enc`);
    await fs.unlink(filePath);
    console.log(`[NAS] Deleted file: ${filePath}`);
  }
  
  private encrypt(buffer: Buffer): Buffer {
    if (!ENCRYPTION_KEY) throw new Error('NAS_ENCRYPTION_KEY not configured');
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    // Format: [iv(16) | authTag(16) | encrypted data]
    return Buffer.concat([iv, authTag, encrypted]);
  }
  
  private decrypt(buffer: Buffer): Buffer {
    if (!ENCRYPTION_KEY) throw new Error('NAS_ENCRYPTION_KEY not configured');
    
    const iv = buffer.subarray(0, 16);
    const authTag = buffer.subarray(16, 32);
    const encrypted = buffer.subarray(32);
    
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    decipher.setAuthTag(authTag);
    
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }
}

export const nasStorage = new NASStorage();
```

### Create Upload Endpoints

**File:** `backend/trpc/routes/r3al/storage/upload-photo.ts`

```typescript
import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { nasStorage } from "@/backend/services/nasStorage";

export const uploadPhotoToNASProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      photoBase64: z.string(),
      photoType: z.enum(["avatar", "cover", "gallery"]),
    })
  )
  .mutation(async ({ input }) => {
    console.log(`[NAS Upload] Processing ${input.photoType} for user ${input.userId}`);
    
    // Convert base64 to buffer
    const buffer = Buffer.from(input.photoBase64, 'base64');
    
    // Save to NAS with encryption
    const fileId = await nasStorage.saveFile(input.userId, buffer, 'photos');
    
    return {
      success: true,
      fileId,
      photoType: input.photoType,
      uploadedAt: new Date().toISOString(),
    };
  });
```

**File:** `backend/trpc/routes/r3al/storage/get-photo.ts`

```typescript
import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { nasStorage } from "@/backend/services/nasStorage";

export const getPhotoFromNASProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      fileId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const buffer = await nasStorage.getFile(input.userId, input.fileId, 'photos');
    const base64 = buffer.toString('base64');
    
    return {
      success: true,
      photoData: `data:image/jpeg;base64,${base64}`,
    };
  });
```

---

## 3. Environment Variables

Add to your backend `.env`:

```env
# NAS Configuration
NAS_MOUNT_PATH=/mnt/r3al_nas
NAS_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
RETENTION_DAYS=7
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 4. Mobile App Integration

Update `app/contexts/R3alContext.tsx` to use backend storage:

```typescript
import { trpcClient } from '@/lib/trpc';

const uploadPhoto = useCallback(async (photo: Omit<Photo, "id" | "uploadedAt">) => {
  try {
    // Upload to backend (which saves to NAS)
    const result = await trpcClient.r3al.storage.uploadPhoto.mutate({
      userId: state.userProfile?.name || 'user',
      photoBase64: photo.url.replace(/^data:image\/\w+;base64,/, ''),
      photoType: photo.type,
    });
    
    const newPhoto: Photo = {
      id: result.fileId,
      url: photo.url, // Keep local preview
      type: photo.type,
      safe: photo.safe,
      trustScore: photo.trustScore,
      uploadedAt: result.uploadedAt,
    };
    
    // Update local state
    const updatedProfile = {
      ...state.userProfile,
      photos: [...(state.userProfile?.photos || []), newPhoto],
      avatar: photo.type === "avatar" ? photo.url : state.userProfile?.avatar,
      cover: photo.type === "cover" ? photo.url : state.userProfile?.cover,
    } as UserProfile;
    
    saveState({ userProfile: updatedProfile });
    return newPhoto;
  } catch (error) {
    console.error('[Upload] Failed to upload to NAS:', error);
    throw error;
  }
}, [saveState, state.userProfile]);
```

---

## 5. Retention Policy (Auto-cleanup)

**File:** `backend/services/nasCleanup.ts`

```typescript
import fs from 'fs/promises';
import path from 'path';

const NAS_BASE_PATH = process.env.NAS_MOUNT_PATH || '/mnt/r3al_nas';
const RETENTION_DAYS = parseInt(process.env.RETENTION_DAYS || '7');

export async function cleanupOldFiles() {
  console.log('[NAS Cleanup] Starting...');
  
  const cutoffDate = Date.now() - (RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const categories = ['photos', 'videos', 'documents'];
  
  for (const category of categories) {
    const categoryPath = path.join(NAS_BASE_PATH, category);
    const users = await fs.readdir(categoryPath);
    
    for (const userId of users) {
      const userPath = path.join(categoryPath, userId);
      const files = await fs.readdir(userPath);
      
      for (const file of files) {
        const filePath = path.join(userPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtimeMs < cutoffDate) {
          await fs.unlink(filePath);
          console.log(`[NAS Cleanup] Deleted: ${filePath}`);
        }
      }
    }
  }
  
  console.log('[NAS Cleanup] Complete');
}

// Run daily
setInterval(cleanupOldFiles, 24 * 60 * 60 * 1000);
```

Add to `backend/hono.ts`:

```typescript
import { cleanupOldFiles } from './services/nasCleanup';

// Start cleanup scheduler
cleanupOldFiles();
```

---

## 6. Deployment Checklist

- [ ] Backend server has network access to 192.169.1.119
- [ ] NAS share mounted at `/mnt/r3al_nas`
- [ ] Write permissions verified
- [ ] Encryption key generated and set in `.env`
- [ ] Auto-mount configured in `/etc/fstab`
- [ ] Cleanup scheduler running
- [ ] Mobile app updated to use backend endpoints
- [ ] Test upload → verify file on NAS → test retrieval

---

## 7. Monitoring

### Check NAS Status

```bash
# Is NAS mounted?
df -h | grep r3al_nas

# Check disk usage
du -sh /mnt/r3al_nas/*

# Count files
find /mnt/r3al_nas -type f | wc -l
```

### Backend Health Endpoint

Add to `backend/hono.ts`:

```typescript
app.get("/health/nas", async (c) => {
  try {
    const testFile = '/mnt/r3al_nas/.health_check';
    await fs.writeFile(testFile, new Date().toISOString());
    await fs.unlink(testFile);
    
    return c.json({ 
      status: "healthy",
      nas_accessible: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({ 
      status: "unhealthy",
      nas_accessible: false,
      error: error.message
    }, 500);
  }
});
```

---

## Security Notes

1. **Never** expose NAS credentials in mobile app code
2. All file paths use `userId` to prevent unauthorized access
3. Files are encrypted before storage using AES-256-GCM
4. Backend validates user permissions before file operations
5. Regular audits of access logs recommended

---

## Troubleshooting

### NAS not mounting
```bash
# Check connectivity
ping 192.169.1.119

# Check SMB service
smbclient -L 192.169.1.119 -U optima

# Mount with debug
sudo mount.cifs //192.169.1.119/R3AL_BACKEND /mnt/r3al_nas -o credentials=/etc/r3al-nas-credentials,vers=3.0,debug
```

### Permission denied
```bash
# Check mount options
mount | grep r3al_nas

# Verify user ownership
ls -la /mnt/r3al_nas
```

### Out of space
```bash
# Check NAS capacity
df -h /mnt/r3al_nas

# Force cleanup
node -e "require('./backend/services/nasCleanup').cleanupOldFiles()"
```

---

## Summary

✅ NAS integration **must** happen at the backend server level  
✅ Mobile app communicates with backend via tRPC  
✅ Backend handles mounting, encryption, and file operations  
✅ 7-day retention policy keeps storage manageable  
✅ All files encrypted with AES-256-GCM before storage
