/**
 * Buffalo NAS Sync Agent for R3AL
 * Automatically syncs Firestore data to local NAS for backup and offline access
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  nasPath: process.env.AI_BACKUP_PATH || '/opt/r3al-hive/backups',
  logPath: process.env.AI_LOG_PATH || '/opt/r3al-hive/logs',
  syncInterval: parseInt(process.env.SYNC_INTERVAL || '600') * 1000, // Default: 10 minutes
  maxBackups: 7, // Keep 7 days of backups
  enabled: process.env.AUTO_SYNC_ENABLED !== 'false',
};

// Ensure directories exist
function ensureDirectories() {
  const dirs = [config.nasPath, config.logPath];
  
  for (const dir of dirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log(`Created directory: ${dir}`);
      }
    } catch (error) {
      console.error(`Failed to create directory ${dir}:`, error.message);
    }
  }
}

// Logging
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  
  console.log(logMessage);
  
  try {
    const logFile = path.join(config.logPath, 'sync.log');
    fs.appendFileSync(logFile, logMessage + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error.message);
  }
}

// Export Firestore data (stub - implement with your backend)
async function exportFirestoreData() {
  log('Exporting Firestore data...');
  
  // TODO: Implement actual Firestore export
  // Options:
  // 1. Use Firestore Admin SDK to fetch collections
  // 2. Call your backend API that exports data
  // 3. Use gcloud firestore export command
  
  const mockData = {
    timestamp: Date.now(),
    version: '1.0.0',
    collections: {
      users: [],
      truthScores: [],
      questionnaires: [],
      verifications: [],
    },
    metadata: {
      exportedAt: new Date().toISOString(),
      recordCount: 0,
    },
  };
  
  log('Export complete (mock data)', 'DEBUG');
  return mockData;
}

// Save backup to NAS
async function saveBackup(data) {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupFile = path.join(config.nasPath, `backup-${timestamp}.json`);
    
    await fs.promises.writeFile(backupFile, JSON.stringify(data, null, 2));
    
    const fileSize = fs.statSync(backupFile).size;
    log(`✅ Backup saved: ${backupFile} (${(fileSize / 1024).toFixed(2)} KB)`);
    
    return backupFile;
  } catch (error) {
    log(`❌ Failed to save backup: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Cleanup old backups
async function cleanupOldBackups() {
  try {
    const files = await fs.promises.readdir(config.nasPath);
    const backupFiles = files
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(config.nasPath, f),
        stats: fs.statSync(path.join(config.nasPath, f)),
      }))
      .sort((a, b) => b.stats.mtime - a.stats.mtime); // Sort by modified time, newest first
    
    if (backupFiles.length > config.maxBackups) {
      const toDelete = backupFiles.slice(config.maxBackups);
      
      for (const file of toDelete) {
        await fs.promises.unlink(file.path);
        log(`🗑️  Deleted old backup: ${file.name}`, 'DEBUG');
      }
      
      log(`Cleaned up ${toDelete.length} old backup(s)`);
    } else {
      log(`Keeping ${backupFiles.length} backup(s) (max: ${config.maxBackups})`, 'DEBUG');
    }
  } catch (error) {
    log(`⚠️  Cleanup warning: ${error.message}`, 'WARN');
  }
}

// Main sync function
async function syncToNAS() {
  const startTime = Date.now();
  log('========================================');
  log('Starting NAS sync...');
  
  try {
    // 1. Export data from Firestore
    const data = await exportFirestoreData();
    
    // 2. Save to NAS
    await saveBackup(data);
    
    // 3. Cleanup old backups
    await cleanupOldBackups();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`✅ Sync completed successfully in ${duration}s`);
    log('========================================');
    
  } catch (error) {
    log(`❌ Sync failed: ${error.message}`, 'ERROR');
    log(error.stack, 'DEBUG');
    log('========================================');
  }
}

// Health check
function checkNASHealth() {
  try {
    // Test write access
    const testFile = path.join(config.nasPath, '.health_check');
    fs.writeFileSync(testFile, Date.now().toString());
    fs.unlinkSync(testFile);
    
    return true;
  } catch (error) {
    log(`⚠️  NAS health check failed: ${error.message}`, 'WARN');
    return false;
  }
}

// Graceful shutdown
function setupShutdownHandlers() {
  const shutdown = () => {
    log('Shutting down sync agent...');
    process.exit(0);
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Main
function main() {
  log('========================================');
  log('R3AL NAS Sync Agent Starting...');
  log('========================================');
  log(`Config: ${JSON.stringify(config, null, 2)}`);
  
  if (!config.enabled) {
    log('⚠️  Auto-sync is disabled in config', 'WARN');
    log('Set AUTO_SYNC_ENABLED=true to enable');
    return;
  }
  
  // Setup
  ensureDirectories();
  setupShutdownHandlers();
  
  // Initial health check
  if (!checkNASHealth()) {
    log('❌ NAS health check failed. Is NAS mounted?', 'ERROR');
    log('Run: ./scripts/test-nas.sh', 'INFO');
    process.exit(1);
  }
  
  log('✅ NAS health check passed');
  
  // Initial sync
  syncToNAS();
  
  // Schedule periodic syncs
  setInterval(() => {
    if (checkNASHealth()) {
      syncToNAS();
    } else {
      log('⚠️  Skipping sync - NAS health check failed', 'WARN');
    }
  }, config.syncInterval);
  
  log(`🔄 Sync agent running. Syncing every ${config.syncInterval / 1000}s`);
  log('Press Ctrl+C to stop');
}

// Start agent
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { syncToNAS, exportFirestoreData, cleanupOldBackups };
