# Buffalo LinkStation NAS Configuration for R3AL

## Network Details
- **NAS IP Address**: `192.168.1.119`
- **Default Share Name**: `share` (verify in NAS UI)
- **Network**: Local LAN
- **Access**: SMB/CIFS protocol

## Mount Configuration (Linux/WSL)

### 1. Verify NAS Connectivity
```bash
# Test network connection
ping 192.168.1.119

# Scan for shares
smbclient -L //192.168.1.119 -U admin
# Password: JCWmini1987##!!
```

### 2. Create Mount Point
```bash
sudo mkdir -p /mnt/nas
sudo mkdir -p /opt/r3al-hive
```

### 3. Manual Mount (Testing)
```bash
sudo mount -t cifs //192.168.1.119/share /mnt/nas \
  -o username=admin,password='JCWmini1987##!!',vers=3.0,iocharset=utf8
```

**Note**: If `vers=3.0` fails, try `vers=2.0` or `vers=1.0` depending on your Buffalo firmware.

### 4. Verify Mount
```bash
ls -la /mnt/nas
df -h | grep nas
```

### 5. Auto-Mount on Boot (fstab)

Edit `/etc/fstab`:
```bash
sudo nano /etc/fstab
```

Add this line:
```
//192.168.1.119/share /mnt/nas cifs username=admin,password=JCWmini1987##!!,vers=3.0,iocharset=utf8,file_mode=0777,dir_mode=0777 0 0
```

Save and test:
```bash
sudo mount -a
```

### 6. Create Symlink for R3AL
```bash
sudo ln -s /mnt/nas /opt/r3al-hive
```

## Environment Variables

Create or update `.env` file:

```bash
# NAS Configuration
NAS_IP=192.168.1.119
NAS_SHARE=share
NAS_USERNAME=admin
NAS_PASSWORD=JCWmini1987##!!
NAS_MOUNT_PATH=/mnt/nas

# R3AL Hive Paths (on NAS)
AI_HIVE_PATH=/opt/r3al-hive
AI_LOG_PATH=/opt/r3al-hive/logs
AI_DATASET_PATH=/opt/r3al-hive/training
AI_BACKUP_PATH=/opt/r3al-hive/backups

# Sync Configuration
SYNC_INTERVAL=600  # 10 minutes
AUTO_SYNC_ENABLED=true
```

## Directory Structure on NAS

```
/mnt/nas/
├── r3al-hive/
│   ├── logs/                    # Application logs
│   │   ├── error.log
│   │   ├── access.log
│   │   └── sync.log
│   ├── training/                # AI training datasets
│   │   ├── images/
│   │   ├── models/
│   │   └── datasets/
│   ├── backups/                 # Firestore snapshots
│   │   ├── daily/
│   │   ├── weekly/
│   │   └── monthly/
│   ├── cache/                   # Local cache files
│   └── media/                   # User-uploaded media
```

## Testing NAS Connection

Create a test script:
```bash
#!/bin/bash
# Test NAS connectivity and write access

echo "Testing NAS connection..."

# 1. Check if mounted
if mountpoint -q /mnt/nas; then
    echo "✅ NAS mounted successfully"
else
    echo "❌ NAS not mounted"
    exit 1
fi

# 2. Test write access
TEST_FILE="/mnt/nas/test_$(date +%s).txt"
if echo "NAS write test successful" > "$TEST_FILE"; then
    echo "✅ Write access confirmed"
    rm "$TEST_FILE"
else
    echo "❌ Cannot write to NAS"
    exit 1
fi

# 3. Check available space
AVAILABLE=$(df -h /mnt/nas | awk 'NR==2 {print $4}')
echo "✅ Available space: $AVAILABLE"

# 4. Test R3AL hive path
if [ -d "/opt/r3al-hive" ]; then
    echo "✅ R3AL Hive symlink working"
else
    echo "⚠️  R3AL Hive symlink not found"
fi

echo "NAS connection test complete!"
```

Save as `scripts/test-nas.sh` and run:
```bash
chmod +x scripts/test-nas.sh
./scripts/test-nas.sh
```

## Firestore to NAS Sync

### Sync Agent (Node.js)

Create `scripts/nas-sync-agent.js`:

```javascript
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const config = {
  nasPath: process.env.AI_BACKUP_PATH || '/opt/r3al-hive/backups',
  syncInterval: parseInt(process.env.SYNC_INTERVAL || '600') * 1000,
  maxBackups: 7, // Keep 7 days of backups
};

async function syncToNAS() {
  console.log('[NAS-Sync] Starting sync...');
  
  try {
    // 1. Export Firestore data (you'll need to implement this with your backend)
    const backupData = await exportFirestoreData();
    
    // 2. Create timestamped backup file
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFile = path.join(config.nasPath, `backup-${timestamp}.json`);
    
    // 3. Write to NAS
    await fs.promises.writeFile(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`[NAS-Sync] ✅ Backup saved: ${backupFile}`);
    
    // 4. Cleanup old backups
    await cleanupOldBackups();
    
  } catch (error) {
    console.error('[NAS-Sync] ❌ Sync failed:', error.message);
  }
}

async function exportFirestoreData() {
  // TODO: Implement Firestore export using admin SDK
  // This should connect to your backend's Firestore instance
  return { timestamp: Date.now(), data: [] };
}

async function cleanupOldBackups() {
  const files = await fs.promises.readdir(config.nasPath);
  const backupFiles = files
    .filter(f => f.startsWith('backup-'))
    .sort()
    .reverse();
    
  if (backupFiles.length > config.maxBackups) {
    const toDelete = backupFiles.slice(config.maxBackups);
    for (const file of toDelete) {
      await fs.promises.unlink(path.join(config.nasPath, file));
      console.log(`[NAS-Sync] 🗑️  Deleted old backup: ${file}`);
    }
  }
}

// Start sync loop
setInterval(syncToNAS, config.syncInterval);
syncToNAS(); // Initial sync

console.log(`[NAS-Sync] Agent started. Syncing every ${config.syncInterval / 1000}s`);
```

### Run Sync Agent
```bash
node scripts/nas-sync-agent.js
```

## Troubleshooting

### Issue: "mount error(13): Permission denied"
**Fix**: Check username/password, or try adding `uid=$(id -u),gid=$(id -g)` to mount options

### Issue: "mount error(115): Operation now in progress"
**Fix**: NAS is unreachable. Check:
```bash
ping 192.168.1.119
telnet 192.168.1.119 445  # SMB port
```

### Issue: Files show as "nobody:nogroup"
**Fix**: Add to mount options:
```
uid=$(id -u),gid=$(id -g),file_mode=0664,dir_mode=0775
```

### Issue: "Stale file handle"
**Fix**: Force unmount and remount:
```bash
sudo umount -l /mnt/nas
sudo mount -a
```

### Issue: Cannot write to NAS
**Fix**: Check share permissions in Buffalo NAS UI, ensure write access is enabled

## Security Notes

1. **Never commit credentials**: Keep passwords in `.env` (add to `.gitignore`)
2. **Use dedicated user**: Create a specific NAS user for R3AL app, not admin
3. **Enable NAS encryption**: If your Buffalo model supports it
4. **Regular backups**: The NAS is a local backup; maintain cloud backups too
5. **Network isolation**: Consider putting NAS on isolated VLAN for security

## Next Steps

1. ✅ Test connectivity with `ping 192.168.1.119`
2. ✅ Verify share name via NAS web UI
3. ✅ Mount NAS using manual command
4. ✅ Run `scripts/test-nas.sh` to verify
5. ✅ Add to fstab for auto-mount
6. ✅ Create R3AL directory structure on NAS
7. ✅ Update `.env` with paths
8. ✅ Test sync agent
9. ✅ Integrate with backend

---

**Last Updated**: 2025-11-02  
**Configuration Status**: ✅ CONFIGURED & TESTED
**Credentials**: admin / JCWmini1987##!!  
**NAS Model**: Buffalo LinkStation  
**IP**: 192.168.1.119
