import { pool } from './config';

export async function createUser(data: {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}) {
  const result = await pool.query(
    `INSERT INTO users (id, username, email, password_hash) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, username, email, truth_score, verification_level, created_at`,
    [data.id, data.username, data.email, data.passwordHash]
  );
  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  const result = await pool.query(
    `SELECT id, username, email, password_hash, truth_score, verification_level, created_at 
     FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

export async function getUserById(id: string) {
  const result = await pool.query(
    `SELECT id, username, email, truth_score, verification_level, created_at 
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function updateUserTruthScore(userId: string, score: number) {
  const result = await pool.query(
    `UPDATE users SET truth_score = $1, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING truth_score`,
    [score, userId]
  );
  return result.rows[0];
}

export async function createProfile(userId: string, data: {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
}) {
  const result = await pool.query(
    `INSERT INTO profiles (user_id, display_name, bio, avatar_url, location) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [userId, data.displayName, data.bio, data.avatarUrl, data.location]
  );
  return result.rows[0];
}

export async function getProfile(userId: string) {
  const result = await pool.query(
    `SELECT * FROM profiles WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

export async function updateProfile(userId: string, data: Partial<{
  displayName: string;
  bio: string;
  avatarUrl: string;
  location: string;
  badges: any[];
  settings: any;
}>) {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.displayName !== undefined) {
    updates.push(`display_name = $${paramIndex++}`);
    values.push(data.displayName);
  }
  if (data.bio !== undefined) {
    updates.push(`bio = $${paramIndex++}`);
    values.push(data.bio);
  }
  if (data.avatarUrl !== undefined) {
    updates.push(`avatar_url = $${paramIndex++}`);
    values.push(data.avatarUrl);
  }
  if (data.location !== undefined) {
    updates.push(`location = $${paramIndex++}`);
    values.push(data.location);
  }
  if (data.badges !== undefined) {
    updates.push(`badges = $${paramIndex++}`);
    values.push(JSON.stringify(data.badges));
  }
  if (data.settings !== undefined) {
    updates.push(`settings = $${paramIndex++}`);
    values.push(JSON.stringify(data.settings));
  }

  if (updates.length === 0) {
    return await getProfile(userId);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(userId);

  const result = await pool.query(
    `UPDATE profiles SET ${updates.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function createVerification(userId: string, data: {
  type: string;
  status: string;
  data?: any;
}) {
  const result = await pool.query(
    `INSERT INTO verifications (user_id, type, status, data) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [userId, data.type, data.status, JSON.stringify(data.data || {})]
  );
  return result.rows[0];
}

export async function getVerifications(userId: string) {
  const result = await pool.query(
    `SELECT * FROM verifications WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function updateVerification(id: number, status: string, verifiedAt?: Date) {
  const result = await pool.query(
    `UPDATE verifications SET status = $1, verified_at = $2 WHERE id = $3 RETURNING *`,
    [status, verifiedAt, id]
  );
  return result.rows[0];
}

export async function getTokenBalance(userId: string) {
  const result = await pool.query(
    `SELECT * FROM tokens WHERE user_id = $1`,
    [userId]
  );
  
  if (result.rows.length === 0) {
    const newBalance = await pool.query(
      `INSERT INTO tokens (user_id, balance) VALUES ($1, 0) RETURNING *`,
      [userId]
    );
    return newBalance.rows[0];
  }
  
  return result.rows[0];
}

export async function updateTokenBalance(userId: string, amount: number, type: string, description?: string) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const balance = await client.query(
      `SELECT balance, earned, spent FROM tokens WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );
    
    let currentBalance = balance.rows[0]?.balance || 0;
    let earned = balance.rows[0]?.earned || 0;
    let spent = balance.rows[0]?.spent || 0;
    
    currentBalance = parseFloat(currentBalance) + amount;
    
    if (amount > 0) {
      earned = parseFloat(earned) + amount;
    } else {
      spent = parseFloat(spent) + Math.abs(amount);
    }
    
    await client.query(
      `UPDATE tokens SET balance = $1, earned = $2, spent = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $4`,
      [currentBalance, earned, spent, userId]
    );
    
    await client.query(
      `INSERT INTO token_transactions (user_id, type, amount, description) 
       VALUES ($1, $2, $3, $4)`,
      [userId, type, amount, description]
    );
    
    await client.query('COMMIT');
    
    return { balance: currentBalance, earned, spent };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getTokenTransactions(userId: string, limit = 50) {
  const result = await pool.query(
    `SELECT * FROM token_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

export async function createPost(userId: string, data: {
  id: string;
  content: string;
  media?: any;
}) {
  const result = await pool.query(
    `INSERT INTO posts (id, user_id, content, media) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [data.id, userId, data.content, JSON.stringify(data.media || {})]
  );
  return result.rows[0];
}

export async function getPosts(limit = 50, offset = 0) {
  const result = await pool.query(
    `SELECT p.*, u.username, u.truth_score, pr.avatar_url 
     FROM posts p 
     JOIN users u ON p.user_id = u.id 
     LEFT JOIN profiles pr ON u.id = pr.user_id 
     ORDER BY p.created_at DESC 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

export async function createSession(userId: string, token: string, expiresAt: Date) {
  const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const result = await pool.query(
    `INSERT INTO sessions (id, user_id, token, expires_at) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [id, userId, token, expiresAt]
  );
  return result.rows[0];
}

export async function getSessionByToken(token: string) {
  const result = await pool.query(
    `SELECT * FROM sessions WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP`,
    [token]
  );
  return result.rows[0];
}

export async function deleteSession(token: string) {
  await pool.query(`DELETE FROM sessions WHERE token = $1`, [token]);
}
