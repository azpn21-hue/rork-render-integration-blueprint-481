#!/bin/bash
# Buffalo NAS Connection Test Script
# Tests connectivity, mount status, and write permissions
# Credentials: admin / JCWmini1987##!!
# IP: 192.168.1.119

echo "=========================================="
echo "Buffalo NAS Connection Test"
echo "=========================================="
echo ""

NAS_IP="192.168.1.119"
NAS_MOUNT="/mnt/nas"
HIVE_PATH="/opt/r3al-hive"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Network connectivity
echo "Test 1: Network Connectivity"
echo "Pinging $NAS_IP..."
if ping -c 3 $NAS_IP > /dev/null 2>&1; then
    echo -e "${GREEN}✅ NAS is reachable${NC}"
else
    echo -e "${RED}❌ Cannot reach NAS at $NAS_IP${NC}"
    echo "   Check network connection and NAS power"
    exit 1
fi
echo ""

# Test 2: Mount status
echo "Test 2: Mount Status"
if mountpoint -q $NAS_MOUNT; then
    echo -e "${GREEN}✅ NAS is mounted at $NAS_MOUNT${NC}"
    
    # Show mount info
    MOUNT_INFO=$(mount | grep $NAS_MOUNT)
    echo "   Mount details: $MOUNT_INFO"
else
    echo -e "${YELLOW}⚠️  NAS not mounted${NC}"
    echo "   Run: sudo mount -t cifs //$NAS_IP/share $NAS_MOUNT -o username=admin,password=YOUR_PASSWORD,vers=3.0"
    exit 1
fi
echo ""

# Test 3: Read access
echo "Test 3: Read Access"
if ls $NAS_MOUNT > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Read access confirmed${NC}"
    FILE_COUNT=$(ls -1 $NAS_MOUNT 2>/dev/null | wc -l)
    echo "   Files/folders found: $FILE_COUNT"
else
    echo -e "${RED}❌ Cannot read from NAS${NC}"
    exit 1
fi
echo ""

# Test 4: Write access
echo "Test 4: Write Access"
TEST_FILE="$NAS_MOUNT/rork_test_$(date +%s).txt"
if echo "RORK NAS write test - $(date)" > $TEST_FILE 2>/dev/null; then
    echo -e "${GREEN}✅ Write access confirmed${NC}"
    rm $TEST_FILE 2>/dev/null
else
    echo -e "${RED}❌ Cannot write to NAS${NC}"
    echo "   Check share permissions in NAS UI"
    exit 1
fi
echo ""

# Test 5: Available space
echo "Test 5: Available Space"
SPACE_INFO=$(df -h $NAS_MOUNT 2>/dev/null | awk 'NR==2 {print $2" total, "$3" used, "$4" available"}')
if [ -n "$SPACE_INFO" ]; then
    echo -e "${GREEN}✅ Space: $SPACE_INFO${NC}"
else
    echo -e "${YELLOW}⚠️  Could not determine space${NC}"
fi
echo ""

# Test 6: R3AL Hive symlink
echo "Test 6: R3AL Hive Path"
if [ -L "$HIVE_PATH" ] || [ -d "$HIVE_PATH" ]; then
    if [ -L "$HIVE_PATH" ]; then
        LINK_TARGET=$(readlink -f $HIVE_PATH)
        echo -e "${GREEN}✅ Hive symlink exists${NC}"
        echo "   Points to: $LINK_TARGET"
    else
        echo -e "${GREEN}✅ Hive directory exists${NC}"
    fi
    
    # Test write to hive
    HIVE_TEST="$HIVE_PATH/hive_test.txt"
    if echo "Hive test" > $HIVE_TEST 2>/dev/null; then
        echo -e "${GREEN}✅ Hive path writable${NC}"
        rm $HIVE_TEST 2>/dev/null
    fi
else
    echo -e "${YELLOW}⚠️  R3AL Hive path not found${NC}"
    echo "   Create with: sudo ln -s $NAS_MOUNT $HIVE_PATH"
fi
echo ""

# Test 7: Directory structure
echo "Test 7: R3AL Directory Structure"
REQUIRED_DIRS=("logs" "training" "backups" "cache" "media")
MISSING_DIRS=()

for dir in "${REQUIRED_DIRS[@]}"; do
    FULL_PATH="$NAS_MOUNT/$dir"
    if [ -d "$FULL_PATH" ]; then
        echo -e "   ${GREEN}✅${NC} $dir/"
    else
        echo -e "   ${YELLOW}⚠️${NC}  $dir/ (missing)"
        MISSING_DIRS+=("$dir")
    fi
done

if [ ${#MISSING_DIRS[@]} -gt 0 ]; then
    echo ""
    echo "   Create missing directories:"
    for dir in "${MISSING_DIRS[@]}"; do
        echo "   mkdir -p $NAS_MOUNT/$dir"
    done
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}✅ All critical tests passed!${NC}"
echo ""
echo "NAS Status: READY"
echo "Mount Point: $NAS_MOUNT"
echo "Hive Path: $HIVE_PATH"
echo ""
echo "Next steps:"
echo "1. Create missing directories (if any)"
echo "2. Update .env with NAS paths"
echo "3. Start sync agent: node scripts/nas-sync-agent.js"
echo ""
