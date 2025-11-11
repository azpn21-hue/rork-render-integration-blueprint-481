# Temporal Hive Events - Implementation Complete ✅

## Blueprint #4 – v2.41 IQ Implementation

### Overview
Temporal Hive Events are scheduled, collective "energy sessions" where users experience synchronized emotion, focus, or reflection. Each event blends:
- **Pulse data** (live bio-signals)
- **Sensory pairing streams**
- **AI orchestration** (240IQ engine curates theme, sound, and timing)

At the end, the AI logs group resonance metrics and generates a narrative summary.

---

## Database Schema ✅

Location: `backend/db/hive-events-schema.sql`

### Tables Created:
1. **hive_events** - Main events table
2. **event_participants** - Tracks user participation
3. **event_metrics** - Stores aggregated event analytics
4. **event_live_data** - Temporary storage for real-time data streams

### Key Features:
- UUID primary keys
- JSONB fields for flexible data storage
- Automatic timestamp management
- Cascade deletion for data integrity
- Performance indexes on frequently queried fields
- Utility functions for cleanup and auto-completion

---

## Backend Implementation ✅

### tRPC Routes
Location: `backend/trpc/routes/r3al/hive-events/`

#### Event Management:
1. **create.ts** - Create new events with AI curator notes
2. **get-circle-events.ts** - List all events for a circle
3. **get-detail.ts** - Get detailed event information
4. **complete.ts** - Finalize event and generate metrics

#### Participation:
1. **join.ts** - Join event (auto-starts if scheduled)
2. **leave.ts** - Leave event
3. **submit-live-data.ts** - Submit real-time pulse/resonance data
4. **get-live-stream.ts** - Poll aggregated live metrics

### Event Scheduler Service ✅
Location: `backend/services/event-scheduler.ts`

**Runs every 30 seconds** to:
- Auto-start scheduled events when start time arrives
- Auto-complete active events when end time passes
- Generate metrics for completed events
- Cleanup old live data (7+ days)

Integrated into `backend/hono.ts` - starts automatically on server boot.

---

## AI Integration ✅

### Theme Curation
**Location:** `backend/trpc/routes/r3al/hive-events/create.ts`

AI generates:
- **Mood**: Desired emotional state
- **Soundscape**: Ambient sound recommendations
- **Color Scheme**: 2-3 hex colors for UI theming
- **Guidance**: Short participant guidance phrase

### Event Summary Generation
**Location:** `backend/trpc/routes/r3al/hive-events/complete.ts`

AI analyzes:
- Participant count
- Average resonance
- Peak coherence
- Duration
- Theme

Generates warm, authentic 2-3 sentence summary.

---

## Frontend Components ✅

### Core Components

#### 1. ResonanceVisualizer
**Location:** `components/ResonanceVisualizer.tsx`

**Features:**
- Animated pulsing core with ripple effects
- Participant dots arranged in circle
- Coherence indicator bar
- Color-coded by resonance level
- Smooth React Native Animated API

#### 2. Event Screens

##### Create Event Screen
**Location:** `app/r3al/hive-events/create.tsx`

**Features:**
- Theme selection (7 themes: calm, focus, gratitude, energy, empathy, mindful, celebration)
- Duration picker (15, 30, 45, 60, 90 minutes)
- Description input
- AI curator preview
- Validation and error handling

##### Event List Screen
**Location:** `app/r3al/hive-events/index.tsx`

**Features:**
- Separate sections for upcoming/live and past events
- Live badge with pulsing indicator
- Theme-based color coding
- Participant count
- Empty state with create CTA
- Auto-refresh every 30 seconds

##### Event Lobby Screen
**Location:** `app/r3al/hive-events/lobby.tsx`

**Features:**
- Event details with gradient header
- AI curator notes display
- Participant list
- Event metrics (for completed events)
- Join button (15 minutes before start)
- Waiting state with countdown

##### Live Event Screen
**Location:** `app/r3al/hive-events/live.tsx`

**Features:**
- Full-screen immersive experience
- Live status indicator
- Real-time ResonanceVisualizer
- Group stats (resonance, active participants, time remaining)
- AI guidance display
- Breathing guide
- Auto-submits pulse data every 5 seconds
- Leave confirmation dialog

---

## Event Themes & Colors

| Theme | Color | Icon | Use Case |
|-------|-------|------|----------|
| Calm | #06b6d4 | 🌊 | Relaxation, meditation |
| Focus | #8b5cf6 | 🎯 | Concentration, productivity |
| Gratitude | #10b981 | 🙏 | Thankfulness, reflection |
| Energy | #f59e0b | ⚡ | Motivation, activation |
| Empathy | #ec4899 | ❤️ | Connection, compassion |
| Mindful | #6366f1 | 🧘 | Awareness, presence |
| Celebration | #f97316 | 🎉 | Joy, achievement |

---

## User Flow

### Creating an Event
1. Navigate to circle → Events tab
2. Tap "Create Event" (+)
3. Enter title, select theme, set duration
4. Optional description
5. AI generates curator notes
6. Event scheduled → Circle members notified

### Joining an Event
1. View event list (upcoming/live)
2. Tap event card → Event lobby
3. Read AI curator notes
4. Tap "Join" (15 min before start or during live)
5. Enter live event screen
6. Experience synchronized session
7. Real-time metrics update
8. Leave or auto-complete at end

### After Event Completion
1. Metrics auto-generated
2. AI summary created
3. View in event lobby
4. See coherence score, resonance, participant count

---

## Technical Architecture

### Real-Time Data Flow
```
Client → Submit Live Data (every 5s)
       ↓
Backend → Store in event_live_data
       ↓
Aggregation → Calculate avg resonance, BPM, active users
       ↓
Client Polling → Get Live Stream (every 2s)
       ↓
UI Update → ResonanceVisualizer animates
```

### Scheduler Flow
```
Cron (30s) → Check scheduled events
            ↓
         start_time <= NOW?
            ↓
         Set status = 'active'
            ↓
         end_time <= NOW?
            ↓
         Set status = 'completed'
            ↓
         Generate metrics + AI summary
            ↓
         Cleanup old live data
```

---

## API Endpoints Summary

### POST `/api/trpc/r3al.hiveEvents.create`
Create new event with AI curation

### GET `/api/trpc/r3al.hiveEvents.getCircleEvents`
List events for a circle

### GET `/api/trpc/r3al.hiveEvents.getDetail`
Get event details + participants + metrics

### POST `/api/trpc/r3al.hiveEvents.join`
Join event (auto-starts if needed)

### POST `/api/trpc/r3al.hiveEvents.leave`
Leave event

### POST `/api/trpc/r3al.hiveEvents.submitLiveData`
Submit real-time pulse/resonance

### GET `/api/trpc/r3al.hiveEvents.getLiveStream`
Poll aggregated live metrics

### POST `/api/trpc/r3al.hiveEvents.complete`
Manually complete event + generate metrics

---

## Security & Privacy

1. **Anonymized Aggregation**: Only group-level metrics broadcast
2. **Opt-in Per Event**: Users choose to share pulse data
3. **Data Retention**: Live data auto-purged after 7 days
4. **Trust Vault Logging**: All metrics logged for transparency
5. **Authentication Required**: Protected tRPC procedures

---

## Performance Considerations

1. **Polling Intervals**:
   - Event list: 30 seconds
   - Event detail: 10 seconds
   - Live stream: 2 seconds
   - Submit data: 5 seconds

2. **Database Indexes**: Optimized for frequent queries
3. **Cleanup Jobs**: Prevent database bloat
4. **Efficient Animations**: React Native Animated API (no Reanimated)

---

## Testing Checklist

### Backend
- [ ] Create event with valid data
- [ ] Create event with invalid data (validation)
- [ ] Auto-start scheduled event
- [ ] Auto-complete active event
- [ ] Generate metrics on completion
- [ ] Join event (before start, during, after)
- [ ] Leave event
- [ ] Submit live data
- [ ] Poll live stream
- [ ] Cleanup old data

### Frontend
- [ ] Navigate to events list
- [ ] Create new event
- [ ] View event lobby
- [ ] Join event
- [ ] Live event screen renders
- [ ] ResonanceVisualizer animates
- [ ] Leave event with confirmation
- [ ] View completed event metrics
- [ ] AI summary displays

---

## Future Enhancements

1. **Push Notifications**: 15-min before event start
2. **Voice/Video**: Integrated WebRTC streams
3. **Biometric Integration**: Heart rate from wearables
4. **Advanced Soundscapes**: Adaptive audio engine
5. **Social Features**: Post-event chat, sharing
6. **Analytics Dashboard**: Circle-level event insights
7. **Recurring Events**: Weekly/monthly schedules
8. **Event Templates**: Pre-configured themes

---

## Database Migration

To apply the schema:

```sql
-- Connect to your database
psql -h <host> -U <user> -d <database>

-- Run the schema file
\i backend/db/hive-events-schema.sql
```

Or use your migration tool:

```bash
# If using Prisma
npx prisma db push

# If using Drizzle
npm run db:push
```

---

## Deployment Notes

### Environment Variables
No new env vars required - uses existing:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `EXPO_PUBLIC_TOOLKIT_URL` (for AI generation)

### Server Restart
Event Scheduler starts automatically with backend.

### Monitoring
Watch for:
```
[EventScheduler] Running scheduled tasks...
[EventScheduler] Auto-started events: [...]
[EventScheduler] Auto-completed events: [...]
```

---

## Support & Documentation

### Related Files
- Database: `backend/db/hive-events-schema.sql`
- Routes: `backend/trpc/routes/r3al/hive-events/*.ts`
- Scheduler: `backend/services/event-scheduler.ts`
- Screens: `app/r3al/hive-events/*.tsx`
- Component: `components/ResonanceVisualizer.tsx`

### Key Concepts
- **Resonance**: Similarity between user's emotional state and group average
- **Coherence**: Overall group synchronization score
- **Theme**: Emotional/energetic focus of the event
- **Curator Notes**: AI-generated guidance and atmosphere settings

---

## Status: COMPLETE ✅

All components implemented and integrated:
- ✅ Database schema with indexes
- ✅ Backend tRPC routes (8 endpoints)
- ✅ Event scheduler service
- ✅ AI curation integration
- ✅ ResonanceVisualizer component
- ✅ 4 frontend screens
- ✅ Real-time data streaming
- ✅ Metrics generation
- ✅ Router integration

**Ready for testing and deployment!**
