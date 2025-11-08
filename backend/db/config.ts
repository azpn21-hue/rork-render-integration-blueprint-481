import { Pool } from 'pg';

console.log('[Database] Initializing PostgreSQL connection...');

const isProduction = process.env.NODE_ENV === 'production';

const dbConfig = isProduction ? {
  host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'r3al',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
} : {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'r3al',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

console.log('[Database] Configuration:', {
  ...dbConfig,
  password: dbConfig.password ? '***' : undefined,
  isProduction,
});

export const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  console.error('[Database] ❌ Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('[Database] ✅ New client connected to pool');
});

pool.on('remove', () => {
  console.log('[Database] ℹ️  Client removed from pool');
});

export async function testConnection() {
  // Skip database if no connection info provided
  if (!process.env.DB_PASSWORD) {
    console.log('[Database] ⚠️  No database password found - skipping connection');
    return false;
  }
  
  try {
    console.log('[Database] Attempting to connect...');
    const client = await Promise.race([
      pool.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 3000))
    ]) as any;
    console.log('[Database] Connection acquired, testing query...');
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('[Database] ✅ Connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('[Database] ❌ Connection test failed:', error);
    return false;
  }
}

export async function initializeDatabase() {
  console.log('[Database] Initializing database schema...');
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        truth_score DECIMAL(5,2) DEFAULT 0.0,
        verification_level VARCHAR(50) DEFAULT 'none',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[Database] ✅ Users table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        display_name VARCHAR(255),
        bio TEXT,
        avatar_url TEXT,
        location VARCHAR(255),
        badges JSONB DEFAULT '[]'::jsonb,
        settings JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[Database] ✅ Profiles table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS verifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        data JSONB,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[Database] ✅ Verifications table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tokens (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        balance DECIMAL(20,2) DEFAULT 0.0,
        earned DECIMAL(20,2) DEFAULT 0.0,
        spent DECIMAL(20,2) DEFAULT 0.0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[Database] ✅ Tokens table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS token_transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(20,2) NOT NULL,
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[Database] ✅ Token transactions table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS circles (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        privacy VARCHAR(50) DEFAULT 'public',
        member_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[Database] ✅ Circles table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS circle_members (
        circle_id VARCHAR(255) REFERENCES circles(id) ON DELETE CASCADE,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (circle_id, user_id)
      );
    `);
    console.log('[Database] ✅ Circle members table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        media JSONB,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        resonates INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[Database] ✅ Posts table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[Database] ✅ Sessions table ready');

    console.log('[Database] ✅ Database initialization complete');
    return true;
  } catch (error) {
    console.error('[Database] ❌ Failed to initialize database:', error);
    throw error;
  }
}

export default pool;
