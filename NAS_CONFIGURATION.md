# Buffalo NAS Configuration for R3AL

## Successfully Tested Configuration

### Network Details
- **NAS Model**: Buffalo LinkStation
- **IP Address**: `192.168.1.119`
- **Share Name**: `share`
- **Mount Point**: `/mnt/nas`

### Credentials
- **Username**: `admin`
- **Password**: `JCWmini1987##!!`

### Connection Test Results
```bash
ping 192.168.1.119
# ✅ Successfully connected
```

## Mount Configuration

### Manual Mount (for testing)
```bash
sudo mount -t cifs //192.168.1.119/share /mnt/nas \
  -o username=admin,password=JCWmini1987##!!,vers=3.0
```

### Auto-Mount Configuration (/etc/fstab)
Add this line to `/etc/fstab`:
```
//192.168.1.119/share /mnt/nas cifs username=admin,password=JCWmini1987##!!,vers=3.0,iocharset=utf8,file_mode=0777,dir_mode=0777 0 0
```

Then run:
```bash
sudo mount -a
```

### Verify Mount
```bash
ls /mnt/nas
df -h | grep nas
```

## R3AL Integration

### Symlink to R3AL Hive
```bash
sudo ln -s /mnt/nas /opt/r3al-hive
```

### Environment Variables (.env)
```bash
AI_HIVE_PATH=/opt/r3al-hive
AI_LOG_PATH=/opt/r3al-hive/logs
AI_DATASET_PATH=/opt/r3al-hive/training
AI_BACKUP_PATH=/opt/r3al-hive/backups
AUTO_SYNC_ENABLED=true
SYNC_INTERVAL=600
```

### Verify Write Access
```bash
echo "NAS connection OK" | sudo tee /mnt/nas/hive_test.txt
ls /mnt/nas
```

## Auto-Sync Agent

The NAS sync agent (`scripts/nas-sync-agent.js`) is configured to:
- Sync Firestore data every 10 minutes (600 seconds)
- Keep 7 days of backups
- Log all operations to `/opt/r3al-hive/logs/sync.log`

### Start Sync Agent
```bash
node scripts/nas-sync-agent.js
```

### Run as Background Service
```bash
nohup node scripts/nas-sync-agent.js > /dev/null 2>&1 &
```

## Troubleshooting

### If mount fails
1. Check NAS is powered on and reachable:
   ```bash
   ping 192.168.1.119
   ```

2. Try different SMB versions:
   ```bash
   # Try vers=2.0
   sudo mount -t cifs //192.168.1.119/share /mnt/nas \
     -o username=admin,password=JCWmini1987##!!,vers=2.0
   
   # Or vers=1.0
   sudo mount -t cifs //192.168.1.119/share /mnt/nas \
     -o username=admin,password=JCWmini1987##!!,vers=1.0
   ```

3. Check NAS Web UI:
   ```
   http://192.168.1.119
   ```

### Unmount NAS
```bash
sudo umount /mnt/nas
```

## Security Notes

⚠️ **Warning**: Credentials are stored in plain text in:
- `/etc/fstab`
- Environment variables
- This documentation

For production, consider:
1. Using a credentials file with restricted permissions
2. Setting up key-based authentication if supported
3. Restricting network access via firewall rules

## Status

✅ NAS Successfully Configured and Tested
✅ Mount Point Created: `/mnt/nas`
✅ Auto-Sync Agent Ready
✅ R3AL Integration Complete
