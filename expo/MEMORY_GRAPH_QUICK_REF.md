# Memory Graph Engine - Quick Reference

## 🚀 Quick Start

### Access the Memory Graph UI
```
Navigate to: /r3al/memory-graph
```

### Initialize Database Schema
```bash
# Run the schema SQL file
psql -d r3al -f backend/db/memory-graph-schema.sql
```

---

## 📋 API Endpoints

### Create Node
```typescript
await trpc.r3al.memory.createNode.mutate({
  nodeType: 'emotion',
  data: {
    valence: 0.5,
    arousal: 0.3,
    context: 'Feeling calm',
    confidence: 0.8
  }
});
```

### Create Edge
```typescript
await trpc.r3al.memory.createEdge.mutate({
  edgeType: 'felt',
  data: {
    userNodeId: 'uuid',
    emotionNodeId: 'uuid',
    confidence: 0.9
  }
});
```

### Get Context
```typescript
const result = await trpc.r3al.memory.getContext.mutate({
  userId: 'optional-user-id' // defaults to current user
});

console.log(result.context.emotions);
console.log(result.context.pulses);
console.log(result.context.interactions);
```

### Query Similarity
```typescript
const result = await trpc.r3al.memory.querySimilarity.mutate({
  queryType: 'users',
  limit: 10
});

console.log(result.results); // Similar users
```

### Explain Action
```typescript
const result = await trpc.r3al.memory.explainAction.mutate({
  actionId: 'action_123'
});

console.log(result.chain.action);
console.log(result.chain.causes); // Causal emotional states
```

---

## 🎨 Frontend Usage

### Using the Context
```typescript
import { useMemoryGraph } from '@/app/contexts/MemoryGraphContext';

function MyComponent() {
  const { 
    emotions,
    pulses,
    interactions,
    isLoadingContext,
    refreshContext,
    logEmotion,
    logPulse,
    logInteraction,
    findSimilarUsers,
    getPairings,
    explainAction
  } = useMemoryGraph();

  // Log an emotion
  await logEmotion(0.8, 0.6, 'Feeling energized');

  // Log pulse data
  await logPulse(75, 0.82);

  // Log interaction
  await logInteraction('message', 'msg_123');

  // Find similar users
  const similar = await findSimilarUsers();

  // Get pairing history
  const pairings = await getPairings();

  // Explain AI action
  const explanation = await explainAction('action_123');
}
```

---

## 🗄️ Database Queries

### Direct Node Creation
```typescript
import { createEmotionNode } from '@/backend/db/memory-queries';

await createEmotionNode(
  userId: 'user_123',
  valence: 0.5,
  arousal: 0.3,
  context: 'Post-meditation calm',
  embedding: [/* 128D array */],
  confidence: 0.85
);
```

### Get User Context
```typescript
import { getUserContext } from '@/backend/db/memory-queries';

const context = await getUserContext('user_123');
console.log(context.emotions);  // Last 5 emotions
console.log(context.pulses);    // Last 5 pulses
console.log(context.interactions); // Last 5 interactions
```

### Find Similar Emotions
```typescript
import { findSimilarEmotions } from '@/backend/db/memory-queries';

const embedding = [/* 128D emotion vector */];
const similar = await findSimilarEmotions(embedding, 5);
```

### Find Similar Users
```typescript
import { findSimilarUsers } from '@/backend/db/memory-queries';

const profileVector = [/* 512D profile vector */];
const similar = await findSimilarUsers(profileVector, 10, 'exclude_user_id');
```

---

## 📊 Node Types & Data Structures

### User Node
```typescript
{
  nodeType: 'user',
  data: {
    personalityTraits: { openness: 0.8, ... }
  }
}
```

### Emotion Node
```typescript
{
  nodeType: 'emotion',
  data: {
    valence: -1 to 1,     // negative to positive
    arousal: -1 to 1,     // low to high energy
    context: 'string',
    confidence: 0 to 1
  }
}
```

### Pulse Node
```typescript
{
  nodeType: 'pulse',
  data: {
    pulseId: 'string',
    bpm: 60-180,
    resonanceIndex: 0 to 1
  }
}
```

### Interaction Node
```typescript
{
  nodeType: 'interaction',
  data: {
    type: 'message' | 'post' | 'comment' | ...,
    contentRef: 'id_reference'
  }
}
```

### Hive Event Node
```typescript
{
  nodeType: 'hive_event',
  data: {
    eventId: 'string',
    theme: 'calm' | 'focus' | 'gratitude' | ...,
    avgResonance: 0 to 1
  }
}
```

### AI Action Node
```typescript
{
  nodeType: 'ai_action',
  data: {
    actionId: 'string',
    intent: 'recommendation' | 'moderation' | ...,
    outcome: 'description'
  }
}
```

---

## 🔗 Edge Types

### Felt Edge (User → Emotion)
```typescript
{
  edgeType: 'felt',
  data: {
    userNodeId: 'uuid',
    emotionNodeId: 'uuid',
    confidence: 0.9
  }
}
```

### Paired With Edge (User ↔ User)
```typescript
{
  edgeType: 'paired_with',
  data: {
    userNodeAId: 'uuid',
    userNodeBId: 'uuid',
    resonance: 0.85,
    duration: 1200 // seconds
  }
}
```

### Joined Edge (User → HiveEvent)
```typescript
{
  edgeType: 'joined',
  data: {
    userNodeId: 'uuid',
    hiveEventNodeId: 'uuid'
  }
}
```

### Caused Edge (Emotion → AIAction)
```typescript
{
  edgeType: 'caused',
  data: {
    emotionNodeId: 'uuid',
    aiActionNodeId: 'uuid',
    reasonWeight: 0.75
  }
}
```

---

## 🎯 Common Use Cases

### 1. Log User Emotion After Action
```typescript
// User completes meditation
await logEmotion(0.8, -0.2, 'Post-meditation - very calm');
```

### 2. Track Pulse During Activity
```typescript
// Real-time pulse monitoring
await logPulse(bpm, resonanceIndex);
```

### 3. Find Compatible Users
```typescript
// Matching algorithm
const similar = await findSimilarUsers();
// Use similarity scores for recommendations
```

### 4. Explain AI Recommendation
```typescript
// User asks "Why did you suggest this?"
const explanation = await explainAction(actionId);
// Show causal chain in UI
```

### 5. View Emotional History
```typescript
// Dashboard view
await refreshContext();
// Display emotions, pulses, interactions
```

---

## 🔧 Maintenance

### Decay Old Edges
```typescript
import { decayOldEdges } from '@/backend/db/memory-queries';

// Run periodically (e.g., daily cron job)
await decayOldEdges(60); // Decay edges older than 60 days
```

### Audit Log Query
```sql
SELECT * FROM memory_graph_audit
WHERE user_id = 'user_123'
ORDER BY timestamp DESC
LIMIT 100;
```

---

## 📈 Vector Embeddings

### Emotion Vector (128D)
- Represents emotional state in semantic space
- Generated from valence, arousal, context

### User Profile Vector (512D)
- Represents user personality and preferences
- Updated based on behavior patterns

### Pulse Vector (64D)
- Represents physiological state
- Encoded from BPM, HRV, resonance

### Interaction Vector (256D)
- Represents communication style
- Encoded from message content

---

## 🎨 UI Color Coding

### Emotion Colors
- 🟢 **Green** (Positive + High arousal): Joy, Excitement
- 🔴 **Red** (Negative + High arousal): Anger, Stress
- 🔵 **Blue** (Negative + Low arousal): Sadness, Melancholy
- 🟠 **Orange** (Neutral): Calm, Neutral states

---

## 🔐 Security & Privacy

### Access Control
- All operations require authentication
- User can only access own memory graph
- Admin tools for moderation

### Audit Trail
- Every operation logged
- Transparent to user via Trust Vault
- Immutable audit log

### Data Decay
- Automatic edge weight decay after 60 days
- User can request full memory deletion
- GDPR compliant

---

## 🐛 Troubleshooting

### Connection Errors
```typescript
// Check database connection
import { testConnection } from '@/backend/db/config';
await testConnection();
```

### Vector Search Issues
```sql
-- Verify pgvector extension
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Check indexes
SELECT * FROM pg_indexes WHERE tablename LIKE 'memory_%';
```

### Context Not Loading
```typescript
// Check mutations are properly configured
const result = await getContextMutation.mutateAsync({});
console.log('Context result:', result);
```

---

## 📚 Related Documentation

- `MEMORY_GRAPH_COMPLETE.md` - Full implementation details
- `backend/db/memory-graph-schema.sql` - Database schema
- `backend/db/memory-queries.ts` - Query functions
- `app/r3al/memory-graph.tsx` - UI implementation

---

## ✅ Status

**Version**: v2.41  
**Status**: ✅ Fully Operational  
**Last Updated**: 2025-11-11

All systems operational and ready for production use.
