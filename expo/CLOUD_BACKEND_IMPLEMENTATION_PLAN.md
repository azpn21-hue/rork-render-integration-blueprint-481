# R3AL Cloud Backend Implementation Plan

## Base Endpoint
```
https://optima-core-712497593637.us-central1.run.app
```

## Features Requiring Cloud Backend Development

### ✅ Already Implemented (tRPC Routes Exist)
These features have tRPC routes defined and need cloud backend implementation:

1. **R3AL Studio / Music Lab** (`/r3al/studio`)
   - ✅ `studio.createProject` - Create music project
   - ✅ `studio.generateMusic` - Generate music using AI
   - ✅ `studio.getProjects` - List user projects
   - ✅ `studio.shareMusic` - Share to social platforms

2. **Writers Guild** (`/r3al/writers-guild`)
   - ✅ `writersGuild.createProject` - Create writing project
   - ✅ `writersGuild.getProjects` - List projects
   - ✅ `writersGuild.startSession` - Start writing session
   - ✅ `writersGuild.getMember` - Get member profile
   - ✅ `writersGuild.getAssistance` - AI writing assistance
   - ✅ `writersGuild.upgradeMember` - Upgrade membership tier

3. **Tactical HQ** (`/r3al/tactical-hq`)
   - ✅ `tactical.register` - Register tactical user
   - ✅ `tactical.getDashboard` - Get dashboard data
   - ✅ `tactical.sendComm` - Send communication
   - ✅ `tactical.getOptimaSRAnalysis` - Get Optima SR analysis
   - ✅ `tactical.sendSecureComm` - Send encrypted comm
   - ✅ `tactical.getComms` - Get communications

4. **Premium Features** (`/r3al/premium`)
   - ✅ `premium.generateImage` - AI image generation (DALL-E 3)
   - ✅ `premium.getImageHistory` - Get generation history
   - ✅ `premium.getUsageSummary` - Get usage stats

5. **Subscription Management** (`/r3al/subscription`)
   - ✅ `subscription.getUserTier` - Get user tier (Free/Premium/Unlimited)
   - ✅ `subscription.checkFeatureAccess` - Check if user can access feature
   - ✅ `subscription.trackUsage` - Track feature usage
   - ✅ `subscription.upgradeTier` - Upgrade subscription

6. **AI Chat** (`/r3al/ai-chat`)
   - ✅ `aiChat.sendMessage` - Send message to AI
   - ✅ `aiChat.getSessionHistory` - Get chat history

## Cloud Storage Requirements

### 1. Music Studio Storage
**Bucket**: `r3al-studio-music`
```
Structure:
/users/{userId}/projects/{projectId}/
  - stems/{stemId}.wav
  - mixed/{versionId}.mp3
  - preview/{projectId}_preview.mp3
  - metadata.json
```

**Operations Needed**:
- Upload generated music files
- Store MIDI files and project metadata
- Version control for mixes
- CDN delivery for playback

### 2. Writers Guild Storage
**Bucket**: `r3al-writers-guild`
```
Structure:
/users/{userId}/projects/{projectId}/
  - manuscript.txt
  - versions/{versionId}.txt
  - notes.json
  - metadata.json
```

**Operations Needed**:
- Auto-save document versions
- Store revision history
- Export functionality (PDF, DOCX, etc.)

### 3. Premium Image Storage
**Bucket**: `r3al-premium-images`
```
Structure:
/users/{userId}/generations/{generationId}/
  - original.png
  - thumbnail.png
  - metadata.json
```

**Operations Needed**:
- Store AI-generated images
- Generate thumbnails
- Track generation metadata
- CDN delivery

### 4. Tactical HQ Storage
**Bucket**: `r3al-tactical-secure`
```
Structure:
/departments/{deptId}/comms/{commId}/
  - message.enc (encrypted)
  - attachments/{fileId}.enc
  - metadata.json
```

**Operations Needed**:
- Encrypted file storage
- Access control by clearance level
- Audit logging
- Secure deletion

### 5. Profile & Media Storage
**Bucket**: `r3al-user-media`
```
Structure:
/users/{userId}/
  - profile/
    - avatar.jpg
    - photos/{photoId}.jpg
  - nfts/{nftId}.png
```

**Operations Needed**:
- Photo upload and optimization
- Image resizing
- NFT generation and storage
- CDN delivery

## Database Schema Requirements

### Music Studio Tables
```sql
CREATE TABLE music_projects (
  project_id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  bpm INTEGER,
  mood VARCHAR(100),
  status VARCHAR(50), -- draft, generating, completed, published
  storage_path TEXT,
  stem_count INTEGER DEFAULT 0,
  total_plays INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE music_stems (
  stem_id UUID PRIMARY KEY,
  project_id UUID REFERENCES music_projects(project_id),
  instrument VARCHAR(100),
  storage_url TEXT,
  duration REAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE music_shares (
  share_id UUID PRIMARY KEY,
  project_id UUID REFERENCES music_projects(project_id),
  platform VARCHAR(50), -- facebook, twitter, soundcloud
  share_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Writers Guild Tables
```sql
CREATE TABLE guild_members (
  member_id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  pen_name VARCHAR(255),
  bio TEXT,
  tier VARCHAR(50), -- novice, wordsmith, master
  total_words_written INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  specialties TEXT[], -- array of genres
  joined_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE writing_projects (
  project_id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  content_type VARCHAR(50), -- novel, short_story, screenplay, poetry
  description TEXT,
  word_count INTEGER DEFAULT 0,
  mature_content BOOLEAN DEFAULT FALSE,
  storage_path TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE writing_sessions (
  session_id UUID PRIMARY KEY,
  project_id UUID REFERENCES writing_projects(project_id),
  user_id VARCHAR(255) NOT NULL,
  words_written INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);
```

### Tactical HQ Tables
```sql
CREATE TABLE tactical_users (
  user_id VARCHAR(255) PRIMARY KEY,
  rank VARCHAR(100),
  department VARCHAR(100),
  service_branch VARCHAR(100),
  clearance_level VARCHAR(50), -- public, confidential, secret, top_secret
  verified_status VARCHAR(50), -- pending, verified, denied
  operational_status VARCHAR(50), -- off_duty, on_duty, deployed
  team_id UUID,
  registered_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tactical_comms (
  comm_id UUID PRIMARY KEY,
  from_user_id VARCHAR(255) REFERENCES tactical_users(user_id),
  to_user_id VARCHAR(255),
  team_id UUID,
  message_type VARCHAR(50), -- standard, secure, emergency
  content TEXT,
  encrypted_content TEXT,
  is_encrypted BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tactical_incidents (
  incident_id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  severity VARCHAR(50), -- low, medium, high, critical
  status VARCHAR(50), -- active, resolved, escalated
  reported_by VARCHAR(255) REFERENCES tactical_users(user_id),
  reported_at TIMESTAMP DEFAULT NOW()
);
```

### Premium Features Tables
```sql
CREATE TABLE premium_image_generations (
  generation_id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  size VARCHAR(20), -- 1024x1024, etc.
  storage_url TEXT,
  thumbnail_url TEXT,
  model VARCHAR(50) DEFAULT 'dall-e-3',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscription_tiers (
  user_id VARCHAR(255) PRIMARY KEY,
  tier VARCHAR(50) DEFAULT 'free', -- free, premium, unlimited
  image_generations_used INTEGER DEFAULT 0,
  music_generations_used INTEGER DEFAULT 0,
  ai_chat_messages_used INTEGER DEFAULT 0,
  reset_at TIMESTAMP,
  upgraded_at TIMESTAMP
);
```

## API Routes to Implement in Optima Cloud

### 1. Music Studio Routes
```
POST   /api/music/generate
POST   /api/music/project/create
GET    /api/music/project/:projectId
PUT    /api/music/project/:projectId
POST   /api/music/stem/upload
GET    /api/music/user/:userId/projects
POST   /api/music/share/:projectId
```

### 2. Writers Guild Routes
```
POST   /api/writers/member/register
GET    /api/writers/member/:userId
PUT    /api/writers/member/:userId/upgrade
POST   /api/writers/project/create
GET    /api/writers/project/:projectId
PUT    /api/writers/project/:projectId
POST   /api/writers/session/start
PUT    /api/writers/session/:sessionId/end
POST   /api/writers/ai/assist
```

### 3. Tactical HQ Routes
```
POST   /api/tactical/register
GET    /api/tactical/dashboard/:userId
POST   /api/tactical/comm/send
POST   /api/tactical/comm/secure
GET    /api/tactical/comm/:userId
POST   /api/tactical/incident/report
GET    /api/tactical/analysis/sr
```

### 4. Premium Routes
```
POST   /api/premium/image/generate
GET    /api/premium/image/history/:userId
GET    /api/premium/usage/:userId
```

### 5. Subscription Routes
```
GET    /api/subscription/tier/:userId
POST   /api/subscription/upgrade
POST   /api/subscription/track-usage
GET    /api/subscription/check-access/:userId/:feature
```

## Implementation Steps

### Phase 1: Storage Setup (Week 1)
1. Create Cloud Storage buckets with proper IAM
2. Set up CDN for media delivery
3. Implement signed URL generation for uploads
4. Create storage helper functions

### Phase 2: Database Setup (Week 1)
1. Create all required tables
2. Set up indexes for performance
3. Create database migration scripts
4. Test database connections

### Phase 3: Music Studio (Week 2)
1. Implement music generation integration (MusicGen or Mubert)
2. Build project management endpoints
3. Add file upload/download logic
4. Implement social sharing connectors

### Phase 4: Writers Guild (Week 2)
1. Build member management system
2. Implement project CRUD operations
3. Add AI writing assistance
4. Create auto-save functionality

### Phase 5: Tactical HQ (Week 3)
1. Build user registration and verification
2. Implement communication system
3. Add Optima SR analysis integration
4. Create incident management

### Phase 6: Premium & Subscriptions (Week 3)
1. Implement subscription tier logic
2. Add usage tracking
3. Integrate AI image generation
4. Build feature access gates

### Phase 7: Testing & Optimization (Week 4)
1. Load testing
2. Security audits
3. Performance optimization
4. Documentation

## Feature Access Gates

### Free Tier
- 3 AI chat messages/day
- 1 image generation/week
- Profile creation
- Feed access

### Premium Tier ($9.99/month)
- 100 AI chat messages/day
- 20 image generations/month
- 5 music projects
- 10 writing projects
- Standard AI assistance

### Unlimited Tier ($29.99/month)
- Unlimited AI chat
- Unlimited image generation
- Unlimited music & writing projects
- Advanced AI assistance
- Priority processing
- Tactical HQ access

## Next Steps

1. ✅ Frontend already has tRPC calls implemented
2. 🚧 Add cloud storage functions to frontend
3. 🚧 Implement backend routes in Optima Cloud
4. 🚧 Set up Cloud Storage buckets
5. 🚧 Create database tables
6. 🚧 Deploy and test

---

**Status**: Ready for cloud backend implementation
**Last Updated**: 2025-01-12
