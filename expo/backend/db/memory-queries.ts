import { pool } from './config';

export interface MemoryNode {
  id: string;
  type: string;
  embedding?: number[];
  metadata?: any;
  timestamp: Date;
}

export interface MemoryEdge {
  id: string;
  type: string;
  fromNodeId: string;
  toNodeId: string;
  weight: number;
  metadata?: any;
  timestamp: Date;
}

export async function createUserNode(userId: string, profileVector: number[], personalityTraits: any) {
  console.log(`[MemoryGraph] Creating user node for ${userId}`);
  const result = await pool.query(
    `INSERT INTO memory_user_nodes (user_id, profile_vector, personality_traits)
     VALUES ($1, $2::vector, $3)
     RETURNING id, user_id, personality_traits, created_at`,
    [userId, JSON.stringify(profileVector), JSON.stringify(personalityTraits)]
  );
  console.log(`[MemoryGraph] ✅ User node created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function createEmotionNode(
  userId: string,
  valence: number,
  arousal: number,
  context: string,
  embedding: number[],
  confidence: number
) {
  console.log(`[MemoryGraph] Creating emotion node for ${userId}: valence=${valence}, arousal=${arousal}`);
  const result = await pool.query(
    `INSERT INTO memory_emotion_nodes (user_id, valence, arousal, context, embedding, confidence)
     VALUES ($1, $2, $3, $4, $5::vector, $6)
     RETURNING id, user_id, valence, arousal, context, timestamp`,
    [userId, valence, arousal, context, JSON.stringify(embedding), confidence]
  );
  console.log(`[MemoryGraph] ✅ Emotion node created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function createPulseNode(
  userId: string,
  pulseId: string,
  bpm: number,
  resonanceIndex: number,
  embedding: number[]
) {
  console.log(`[MemoryGraph] Creating pulse node for ${userId}: bpm=${bpm}, resonance=${resonanceIndex}`);
  const result = await pool.query(
    `INSERT INTO memory_pulse_nodes (user_id, pulse_id, bpm, resonance_index, embedding)
     VALUES ($1, $2, $3, $4, $5::vector)
     RETURNING id, user_id, pulse_id, bpm, resonance_index, timestamp`,
    [userId, pulseId, bpm, resonanceIndex, JSON.stringify(embedding)]
  );
  console.log(`[MemoryGraph] ✅ Pulse node created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function createInteractionNode(
  userId: string,
  type: string,
  contentRef: string,
  embedding: number[]
) {
  console.log(`[MemoryGraph] Creating interaction node for ${userId}: type=${type}`);
  const result = await pool.query(
    `INSERT INTO memory_interaction_nodes (user_id, type, content_ref, embedding)
     VALUES ($1, $2, $3, $4::vector)
     RETURNING id, user_id, type, content_ref, timestamp`,
    [userId, type, contentRef, JSON.stringify(embedding)]
  );
  console.log(`[MemoryGraph] ✅ Interaction node created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function createHiveEventNode(
  eventId: string,
  theme: string,
  avgResonance: number,
  embedding: number[]
) {
  console.log(`[MemoryGraph] Creating hive event node: ${eventId}, theme=${theme}`);
  const result = await pool.query(
    `INSERT INTO memory_hive_event_nodes (event_id, theme, avg_resonance, embedding)
     VALUES ($1, $2, $3, $4::vector)
     RETURNING id, event_id, theme, avg_resonance, timestamp`,
    [eventId, theme, avgResonance, JSON.stringify(embedding)]
  );
  console.log(`[MemoryGraph] ✅ Hive event node created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function createAIActionNode(
  actionId: string,
  intent: string,
  outcome: string,
  embedding: number[]
) {
  console.log(`[MemoryGraph] Creating AI action node: ${actionId}`);
  const result = await pool.query(
    `INSERT INTO memory_ai_action_nodes (action_id, intent, outcome, embedding)
     VALUES ($1, $2, $3, $4::vector)
     RETURNING id, action_id, intent, outcome, timestamp`,
    [actionId, intent, outcome, JSON.stringify(embedding)]
  );
  console.log(`[MemoryGraph] ✅ AI action node created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function createFeltEdge(
  userNodeId: string,
  emotionNodeId: string,
  confidence: number
) {
  console.log(`[MemoryGraph] Creating felt edge: ${userNodeId} -> ${emotionNodeId}`);
  const result = await pool.query(
    `INSERT INTO memory_edge_felt (user_node_id, emotion_node_id, confidence)
     VALUES ($1, $2, $3)
     RETURNING id, timestamp`,
    [userNodeId, emotionNodeId, confidence]
  );
  console.log(`[MemoryGraph] ✅ Felt edge created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function createPairedWithEdge(
  userNodeAId: string,
  userNodeBId: string,
  resonance: number,
  duration: number
) {
  console.log(`[MemoryGraph] Creating paired-with edge: ${userNodeAId} <-> ${userNodeBId}`);
  const result = await pool.query(
    `INSERT INTO memory_edge_paired_with (user_node_a_id, user_node_b_id, resonance, duration)
     VALUES ($1, $2, $3, $4)
     RETURNING id, timestamp`,
    [userNodeAId, userNodeBId, resonance, duration]
  );
  console.log(`[MemoryGraph] ✅ Paired-with edge created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function createJoinedEdge(
  userNodeId: string,
  hiveEventNodeId: string
) {
  console.log(`[MemoryGraph] Creating joined edge: ${userNodeId} -> ${hiveEventNodeId}`);
  const result = await pool.query(
    `INSERT INTO memory_edge_joined (user_node_id, hive_event_node_id)
     VALUES ($1, $2)
     RETURNING id, join_time`,
    [userNodeId, hiveEventNodeId]
  );
  console.log(`[MemoryGraph] ✅ Joined edge created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function createCausedEdge(
  emotionNodeId: string,
  aiActionNodeId: string,
  reasonWeight: number
) {
  console.log(`[MemoryGraph] Creating caused edge: ${emotionNodeId} -> ${aiActionNodeId}`);
  const result = await pool.query(
    `INSERT INTO memory_edge_caused (emotion_node_id, ai_action_node_id, reason_weight)
     VALUES ($1, $2, $3)
     RETURNING id, timestamp`,
    [emotionNodeId, aiActionNodeId, reasonWeight]
  );
  console.log(`[MemoryGraph] ✅ Caused edge created: ${result.rows[0].id}`);
  return result.rows[0];
}

export async function getUserNodeByUserId(userId: string) {
  const result = await pool.query(
    `SELECT id, user_id, personality_traits, created_at, updated_at
     FROM memory_user_nodes
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );
  return result.rows[0];
}

export async function getRecentEmotions(userId: string, limit: number = 10) {
  console.log(`[MemoryGraph] Fetching recent emotions for ${userId}`);
  const result = await pool.query(
    `SELECT id, user_id, valence, arousal, context, timestamp, confidence
     FROM memory_emotion_nodes
     WHERE user_id = $1
     ORDER BY timestamp DESC
     LIMIT $2`,
    [userId, limit]
  );
  console.log(`[MemoryGraph] Found ${result.rows.length} emotions`);
  return result.rows;
}

export async function getRecentPulses(userId: string, limit: number = 10) {
  console.log(`[MemoryGraph] Fetching recent pulses for ${userId}`);
  const result = await pool.query(
    `SELECT id, user_id, pulse_id, bpm, resonance_index, timestamp
     FROM memory_pulse_nodes
     WHERE user_id = $1
     ORDER BY timestamp DESC
     LIMIT $2`,
    [userId, limit]
  );
  console.log(`[MemoryGraph] Found ${result.rows.length} pulses`);
  return result.rows;
}

export async function getRecentInteractions(userId: string, limit: number = 10) {
  console.log(`[MemoryGraph] Fetching recent interactions for ${userId}`);
  const result = await pool.query(
    `SELECT id, user_id, type, content_ref, timestamp
     FROM memory_interaction_nodes
     WHERE user_id = $1
     ORDER BY timestamp DESC
     LIMIT $2`,
    [userId, limit]
  );
  console.log(`[MemoryGraph] Found ${result.rows.length} interactions`);
  return result.rows;
}

export async function getUserContext(userId: string) {
  console.log(`[MemoryGraph] Building context for ${userId}`);
  
  const [emotions, pulses, interactions] = await Promise.all([
    getRecentEmotions(userId, 5),
    getRecentPulses(userId, 5),
    getRecentInteractions(userId, 5)
  ]);

  const userNode = await getUserNodeByUserId(userId);
  
  console.log(`[MemoryGraph] ✅ Context built: ${emotions.length} emotions, ${pulses.length} pulses, ${interactions.length} interactions`);
  
  return {
    userNode,
    emotions,
    pulses,
    interactions
  };
}

export async function findSimilarEmotions(embedding: number[], limit: number = 5) {
  console.log(`[MemoryGraph] Finding similar emotions`);
  const result = await pool.query(
    `SELECT id, user_id, valence, arousal, context, timestamp,
            embedding <=> $1::vector as distance
     FROM memory_emotion_nodes
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    [JSON.stringify(embedding), limit]
  );
  console.log(`[MemoryGraph] Found ${result.rows.length} similar emotions`);
  return result.rows;
}

export async function findSimilarUsers(profileVector: number[], limit: number = 5, excludeUserId?: string) {
  console.log(`[MemoryGraph] Finding similar users`);
  const result = await pool.query(
    `SELECT id, user_id, personality_traits,
            profile_vector <=> $1::vector as distance
     FROM memory_user_nodes
     ${excludeUserId ? 'WHERE user_id != $3' : ''}
     ORDER BY profile_vector <=> $1::vector
     LIMIT $2`,
    excludeUserId ? [JSON.stringify(profileVector), limit, excludeUserId] : [JSON.stringify(profileVector), limit]
  );
  console.log(`[MemoryGraph] Found ${result.rows.length} similar users`);
  return result.rows;
}

export async function getUserPairings(userId: string) {
  console.log(`[MemoryGraph] Finding pairings for ${userId}`);
  
  const userNode = await getUserNodeByUserId(userId);
  if (!userNode) {
    console.log(`[MemoryGraph] No user node found for ${userId}`);
    return [];
  }

  const result = await pool.query(
    `SELECT p.*, 
            ua.user_id as user_a_id, 
            ub.user_id as user_b_id,
            p.resonance, p.duration, p.timestamp
     FROM memory_edge_paired_with p
     LEFT JOIN memory_user_nodes ua ON p.user_node_a_id = ua.id
     LEFT JOIN memory_user_nodes ub ON p.user_node_b_id = ub.id
     WHERE ua.user_id = $1 OR ub.user_id = $1
     ORDER BY p.timestamp DESC
     LIMIT 20`,
    [userId]
  );
  
  console.log(`[MemoryGraph] Found ${result.rows.length} pairings`);
  return result.rows;
}

export async function logMemoryAction(
  userId: string,
  actionType: string,
  nodeType?: string,
  nodeId?: string,
  edgeType?: string,
  edgeId?: string,
  metadata?: any
) {
  await pool.query(
    `INSERT INTO memory_graph_audit (user_id, action_type, node_type, node_id, edge_type, edge_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, actionType, nodeType, nodeId, edgeType, edgeId, JSON.stringify(metadata || {})]
  );
}

export async function getExplainableChain(actionId: string) {
  console.log(`[MemoryGraph] Building explainable chain for action ${actionId}`);
  
  const actionNode = await pool.query(
    `SELECT * FROM memory_ai_action_nodes WHERE action_id = $1`,
    [actionId]
  );

  if (actionNode.rows.length === 0) {
    return null;
  }

  const causedEdges = await pool.query(
    `SELECT c.*, e.valence, e.arousal, e.context, e.timestamp as emotion_timestamp
     FROM memory_edge_caused c
     JOIN memory_emotion_nodes e ON c.emotion_node_id = e.id
     WHERE c.ai_action_node_id = $1
     ORDER BY c.reason_weight DESC`,
    [actionNode.rows[0].id]
  );

  console.log(`[MemoryGraph] ✅ Found ${causedEdges.rows.length} causal edges`);
  
  return {
    action: actionNode.rows[0],
    causes: causedEdges.rows
  };
}

export async function decayOldEdges(daysOld: number = 60) {
  console.log(`[MemoryGraph] Starting decay process for edges older than ${daysOld} days`);
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const tables = [
    'memory_edge_felt',
    'memory_edge_paired_with',
    'memory_edge_joined',
    'memory_edge_caused',
    'memory_edge_derived_from'
  ];

  let totalDecayed = 0;

  for (const table of tables) {
    const result = await pool.query(
      `UPDATE ${table}
       SET weight = weight * 0.5
       WHERE timestamp < $1 AND weight > 0.1
       RETURNING id, weight`,
      [cutoffDate]
    );
    totalDecayed += result.rows.length;
    console.log(`[MemoryGraph] Decayed ${result.rows.length} edges in ${table}`);
  }

  console.log(`[MemoryGraph] ✅ Decay complete: ${totalDecayed} edges decayed`);
  return totalDecayed;
}
