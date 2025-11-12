# Backend Routes Needed for Optima Cloud

**Base URL**: `https://optima-core-712497593637.us-central1.run.app`

## ✅ Frontend Implementation Complete

The following features have **complete frontend implementation** with tRPC calls and storage services. They need cloud backend implementation:

---

## 🎵 **1. Music Studio (R3AL Studio)**

### Frontend Files:
- `app/r3al/studio.tsx` - Main UI (COMPLETE)
- `app/services/storage.ts` - Storage helpers (COMPLETE)

### tRPC Calls Used:
```typescript
trpc.r3al.studio.createProject.useMutation()
trpc.r3al.studio.generateMusic.useMutation()  
trpc.r3al.studio.getProjects.useQuery()
trpc.r3al.studio.shareMusic.useMutation()
```

### Cloud Routes Needed:
```
POST   /api/music/project/create
  Input: { userId, title, genre, bpm, mood }
  Output: { projectId, status }

POST   /api/music/generate
  Input: { projectId, userId, prompt, duration, style }
  Output: { stemUrls[], mixUrl, status }

GET    /api/music/projects/:userId
  Output: { projects: [...] }

POST   /api/music/share/:projectId
  Input: { platform, projectId }
  Output: { shareUrl, platform }

POST   /api/storage/upload
  Input: FormData(file, bucket, path)
  Output: { url }
```

### AI Integration Needed:
- **MusicGen** (Meta) - text-to-audio generation
- **Mubert API** - alternative commercial option
- Store generated audio in Cloud Storage bucket `r3al-studio-music`

---

## ✍️ **2. Writers Guild**

### Frontend Files:
- `app/r3al/writers-guild/index.tsx` - Main UI (COMPLETE)
- `app/services/storage.ts` - Storage helpers (COMPLETE)

### tRPC Calls Used:
```typescript
trpc.r3al.writersGuild.createProject.useMutation()
trpc.r3al.writersGuild.getProjects.useQuery()
trpc.r3al.writersGuild.startSession.useMutation()
trpc.r3al.writersGuild.getMember.useQuery()
trpc.r3al.writersGuild.getAssistance.useMutation()
```

### Cloud Routes Needed:
```
POST   /api/writers/project/create
  Input: { userId, title, genre, contentType, description, matureContent }
  Output: { projectId, status }

GET    /api/writers/projects/:userId
  Output: { projects: [...] }

POST   /api/writers/session/start
  Input: { userId, projectId }
  Output: { sessionId, startedAt }

GET    /api/writers/member/:userId
  Output: { member: { penName, bio, tier, stats, ... } }

POST   /api/writers/assist
  Input: { userId, projectId, prompt, context }
  Output: { suggestion, type }
```

### AI Integration Needed:
- **GPT-4** or **Claude** for writing assistance
- Auto-save functionality with version control
- Store manuscripts in Cloud Storage bucket `r3al-writers-guild`

---

## 🛡️ **3. Tactical HQ**

### Frontend Files:
- `app/r3al/tactical-hq.tsx` - Main UI (COMPLETE)

### tRPC Calls Used:
```typescript
trpc.r3al.tactical.getDashboard.useQuery()
trpc.r3al.tactical.getOptimaSRAnalysis.useQuery()
trpc.r3al.tactical.sendComm.useMutation()
trpc.r3al.tactical.getComms.useQuery()
trpc.r3al.tactical.sendSecureComm.useMutation()
```

### Cloud Routes Needed:
```
POST   /api/tactical/register
  Input: { userId, rank, department, serviceBranch, clearanceLevel }
  Output: { registered, status }

GET    /api/tactical/dashboard/:userId
  Output: { user, activeIncidents, team, recentComms, aiInsights }

POST   /api/tactical/comm/send
  Input: { fromUserId, toUserId, teamId, content, messageType }
  Output: { commId, sentAt }

GET    /api/tactical/comms/:userId
  Output: { conversations: [...] }

POST   /api/tactical/comm/secure
  Input: { fromUserId, toUserId, encryptedContent }
  Output: { commId, encrypted: true }

GET    /api/tactical/analysis/sr
  Input: { userId, analysisType }
  Output: { overallThreatLevel, activeSituations, recommendations }
```

### AI Integration Needed:
- **Optima SR Analysis** - situational awareness AI
- End-to-end encryption for secure comms
- Store encrypted files in Cloud Storage bucket `r3al-tactical-secure`

---

## 🎨 **4. Premium Image Generation**

### Frontend Files:
- Various screens use image generation
- `app/services/storage.ts` - Storage helpers (COMPLETE)

### tRPC Calls Used:
```typescript
trpc.r3al.premium.generateImage.useMutation()
trpc.r3al.premium.getImageHistory.useQuery()
trpc.r3al.premium.getUsageSummary.useQuery()
```

### Cloud Routes Needed:
```
POST   /api/premium/image/generate
  Input: { userId, prompt, size }
  Output: { generationId, imageUrl, thumbnailUrl }

GET    /api/premium/image/history/:userId
  Output: { generations: [...] }

GET    /api/premium/usage/:userId
  Output: { imagesGenerated, musicGenerated, aiChatMessages, tier }
```

### AI Integration Needed:
- **DALL-E 3** via OpenAI API
- Store images in Cloud Storage bucket `r3al-premium-images`
- Generate thumbnails automatically

---

## 💎 **5. Subscription Management**

### tRPC Calls Used:
```typescript
trpc.r3al.subscription.getUserTier.useQuery()
trpc.r3al.subscription.checkFeatureAccess.useQuery()
trpc.r3al.subscription.trackUsage.useMutation()
trpc.r3al.subscription.upgradeTier.useMutation()
```

### Cloud Routes Needed:
```
GET    /api/subscription/tier/:userId
  Output: { tier, limits, usage, resetAt }

POST   /api/subscription/check-access
  Input: { userId, feature }
  Output: { hasAccess, reason, upgradeRequired }

POST   /api/subscription/track-usage
  Input: { userId, feature, amount }
  Output: { newUsage, limitReached }

POST   /api/subscription/upgrade
  Input: { userId, newTier, paymentMethod }
  Output: { success, tier, receipt }
```

### Tiers:
- **Free**: 3 AI chats/day, 1 image/week
- **Premium** ($9.99/mo): 100 AI chats/day, 20 images/month, 5 music projects
- **Unlimited** ($29.99/mo): Unlimited everything + Tactical HQ access

---

## 💬 **6. AI Chat**

### tRPC Calls Used:
```typescript
trpc.r3al.aiChat.sendMessage.useMutation()
trpc.r3al.aiChat.getSessionHistory.useQuery()
```

### Cloud Routes Needed:
```
POST   /api/ai/chat/send
  Input: { userId, sessionId, message, context }
  Output: { response, messageId, usage }

GET    /api/ai/chat/history/:sessionId
  Output: { messages: [...] }
```

### AI Integration Needed:
- **GPT-4** or **Claude** for chat
- Track token usage per user
- Store chat history in database

---

## 📦 **Cloud Storage Buckets Needed**

Create these Google Cloud Storage buckets:

1. **r3al-studio-music** - Music projects, stems, mixes
2. **r3al-writers-guild** - Manuscripts, versions
3. **r3al-premium-images** - AI-generated images
4. **r3al-tactical-secure** - Encrypted tactical files
5. **r3al-user-media** - Profile pics, photos, NFTs

### Storage Route:
```
POST   /api/storage/upload
  Input: FormData(file, bucket, path, contentType)
  Output: { url, cdnUrl, size }

DELETE /api/storage/delete
  Input: { url }
  Output: { success }

GET    /cdn/:bucket/:path
  Output: File (with CDN headers)
```

---

## 🗄️ **Database Tables Needed**

### Music Studio:
- `music_projects`
- `music_stems`
- `music_shares`

### Writers Guild:
- `guild_members`
- `writing_projects`
- `writing_sessions`

### Tactical HQ:
- `tactical_users`
- `tactical_comms`
- `tactical_incidents`
- `tactical_teams`

### Premium:
- `premium_image_generations`
- `subscription_tiers`
- `usage_tracking`

### AI Chat:
- `ai_chat_sessions`
- `ai_chat_messages`

See `CLOUD_BACKEND_IMPLEMENTATION_PLAN.md` for full schema details.

---

## 🚀 **Implementation Priority**

### Week 1: Infrastructure
1. Set up Cloud Storage buckets
2. Create database tables
3. Implement storage API routes
4. Set up CDN

### Week 2: Core Features
1. Music Studio generation endpoint
2. Writers Guild AI assistance
3. Premium image generation
4. Subscription logic

### Week 3: Advanced Features
1. Tactical HQ complete implementation
2. Social sharing connectors (Facebook, Twitter, SoundCloud)
3. Encryption for secure comms
4. Real-time features (WebSocket for live updates)

### Week 4: Polish
1. Performance optimization
2. Security audits
3. Load testing
4. Documentation

---

## 📝 **Next Steps for You**

1. **Create Cloud Storage buckets** in Google Cloud Console
2. **Set up database tables** using the schema in `CLOUD_BACKEND_IMPLEMENTATION_PLAN.md`
3. **Implement API routes** listed above in your Optima Cloud backend
4. **Add AI integrations**:
   - OpenAI API (DALL-E 3, GPT-4)
   - MusicGen or Mubert API
   - Any custom Optima SR analysis endpoints
5. **Test each feature** with curl commands to verify endpoints work
6. **Update environment variables** in frontend if needed

---

## 🧪 **Testing Commands**

### Test Music Generation:
```bash
curl -X POST https://optima-core-712497593637.us-central1.run.app/api/music/generate \
  -H "Content-Type: application/json" \
  -d '{"projectId":"test","userId":"user1","prompt":"energetic electronic track","duration":30,"style":"electronic"}'
```

### Test Image Generation:
```bash
curl -X POST https://optima-core-712497593637.us-central1.run.app/api/premium/image/generate \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","prompt":"a futuristic city at sunset","size":"1024x1024"}'
```

### Test Storage Upload:
```bash
curl -X POST https://optima-core-712497593637.us-central1.run.app/api/storage/upload \
  -F "file=@test.mp3" \
  -F "bucket=music" \
  -F "path=users/test/projects/p1/test.mp3"
```

---

**Frontend is ready to use these endpoints once you implement them in the cloud backend!**

All tRPC routes are defined, storage services are complete, and UI is built. Just need the backend implementation now.
