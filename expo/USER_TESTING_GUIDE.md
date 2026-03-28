# R3AL App - User Testing Guide

**Purpose**: Step-by-step guide to test every feature in the R3AL app  
**Audience**: Product testing, QA, or anyone reviewing the app  
**Time Required**: 15-20 minutes for full test

---

## 🎬 Getting Started

### Initial Setup:
1. Open the R3AL app
2. Complete onboarding if first time:
   - Splash screen → Welcome → Consent → Profile Setup → Verification
3. You should land on the home screen

### Home Screen Overview:
- Top: Welcome message + Settings gear
- Gold banner: "Ask Optima II™"
- Quick actions: Explore, Circles, Pulse, Tokens
- Wallet preview showing token balance
- Truth Score card
- Featured features grid

---

## ✅ Test 1: Optima II™ AI Consultant

**Expected Time**: 3-5 minutes  
**Status**: ✅ Should work perfectly

### Steps:
1. From home, tap the gold banner "Ask Optima II™"
2. You'll see a welcome message from Optima
3. Try these test questions:

**Question 1**: "What is Pulse Chat?"
- Expected: Detailed explanation of Pulse Chat features
- Should mention encrypted, ephemeral messaging

**Question 2**: "How do I earn Trust-Tokens?"
- Expected: List of ways to earn tokens
- Should mention QOTD, verification, endorsements

**Question 3**: "What is my Truth Score based on?"
- Expected: Explanation of multi-factor scoring
- Should mention verification, behavior, endorsements

**Question 4**: "How does the NFT marketplace work?"
- Expected: Explanation of Hive marketplace
- Should mention buying, selling, gifting NFTs

### Quick Prompt Buttons:
- Try clicking one of the three quick prompts
- Should auto-fill the input field
- Send the message

### What to Check:
- ✅ Messages appear in chat
- ✅ Responses are relevant and helpful
- ✅ Chat scrolls automatically
- ✅ Typing indicator shows while waiting
- ✅ Back button works

### Screenshot This:
- Full conversation with 2-3 questions

---

## 🫀 Test 2: Pulse Chat™

**Expected Time**: 5 minutes  
**Status**: ⚠️ Frontend works, backend needs testing

### Steps:

#### Part A: Start Session
1. From home, tap the heart icon (Pulse) in quick actions
2. Enter a participant name: "Alex"
3. Read the disclaimer about biometric features
4. Tap "I Agree"
5. Session should start

### What to Check:
- ✅ Session info card appears
- ✅ Shows participant name
- ✅ Shows start time
- ✅ Shows auto-delete date (7 days from now)
- ✅ Green "Active Session" indicator

#### Part B: Send Messages
1. Scroll to bottom input field
2. Type: "Hello, this is a test message"
3. Tap send button
4. Message should appear in conversation

### What to Check:
- ✅ Message appears immediately
- ✅ Shows sender name and timestamp
- ✅ Shows "Encrypted" badge
- ✅ Message count updates

#### Part C: Test Features
1. Tap "Video Call" button
   - Should navigate to video screen
   - Back button should return

2. Tap "Realification" button
   - Should navigate to realification screen
   - See pulse rings
   - Back button works

3. Tap "Honesty Check" button
   - Should navigate to honesty check screen
   - See brain scan UI
   - Back button works

#### Part D: End Session
1. Tap X button in session header
2. Confirm end session
3. Should return to "Start New Session" view

### What to Check:
- ✅ All buttons navigate correctly
- ✅ Messages persist during session
- ✅ Session can be ended
- ✅ New session can be started

### Screenshot This:
- Active session with 2-3 messages
- Realification screen
- Honesty Check screen

---

## 🎨 Test 3: Hive™ NFT Marketplace

**Expected Time**: 3 minutes  
**Status**: ⚠️ Blocked by token balance API

### Steps:

#### Part A: Overview
1. From home, tap "NFT Hive" in featured section
2. You'll see the Hive home screen

### What to Check:
- ✅ Shows "Your NFTs" count
- ✅ Shows "Tokens" balance
- ✅ Shows "For Sale" count
- ✅ Four menu cards visible

#### Part B: Token Wallet
1. Tap "Token Wallet" card
2. Should show token balance screen

### What to Check:
- ⚠️ Balance might show 0 or error (known issue)
- ✅ Transaction list exists
- ✅ "Earn More" and "History" tabs work

#### Part C: Create NFT
1. Go back to Hive home
2. Tap "Create NFT"
3. Fill out form:
   - Name: "Test NFT"
   - Description: "My first test NFT"
   - Price: 50
4. Tap "Create NFT"

### Expected Outcomes:
- ⚠️ May fail with "Insufficient tokens" (token API issue)
- ✅ OR succeeds and shows success message
- If successful: NFT appears in gallery

#### Part D: Gallery
1. Tap "My Gallery"
2. Should show your NFTs (if any created)

#### Part E: Marketplace
1. Tap "Marketplace"
2. Browse available NFTs
3. Try clicking on one to see details

### Screenshot This:
- Hive home screen
- Token wallet (even if showing error)
- NFT creation form

---

## 💭 Test 4: Question of the Day

**Expected Time**: 3 minutes  
**Status**: ⚠️ Using local mock data

### Steps:

#### Part A: View Question
1. From home, tap "Question of the Day" in featured
2. You'll see today's question

### What to Check:
- ✅ Question displays clearly
- ✅ Shows reward amount (+5 tokens)
- ✅ Shows streak stats at top
- ✅ Answer input field present

#### Part B: Submit Answer
1. Type an answer (minimum 10 characters):
   - Example: "Today I felt most authentic when I expressed my honest opinion about the project during the team meeting."
2. Tap "Submit Reflection"

### Expected Outcomes:
- ⚠️ May show "Already answered" or error (backend issue)
- ✅ OR success message with tokens earned
- ✅ Should see streak update

#### Part C: Stats
1. Check the three stat cards at top:
   - Day Streak
   - Tokens earned
   - Best streak

### Screenshot This:
- Full QOTD screen with question
- Answer submitted (success or error message)

---

## 👤 Test 5: Profile Features

**Expected Time**: 3 minutes  
**Status**: ✅ Frontend complete

### Steps:

#### Part A: View Profile
1. From home, tap "Your Profile" in featured
2. Should show your profile page

### What to Check:
- ✅ Shows your name
- ✅ Shows bio
- ✅ Shows verification status
- ✅ Shows photos (if any)
- ✅ Shows endorsements

#### Part B: Edit Profile
1. Tap "Edit Profile" button
2. Update your bio
3. Save changes

### What to Check:
- ✅ Changes save
- ✅ Bio updates on profile view

#### Part C: Photos
1. Try "Add Photo" button
2. Camera/gallery should open
3. Cancel or add a photo

---

## 🔮 Test 6: Truth Score

**Expected Time**: 2 minutes  
**Status**: ✅ Working

### Steps:

1. From home, tap on your Truth Score card
2. Should navigate to detail page

### What to Check:
- ✅ Shows large score number
- ✅ Shows score breakdown:
  - Verification (40%)
  - Behavioral (30%)
  - Community (20%)
  - System (10%)
- ✅ Shows recommendations
- ✅ Progress bars for each factor

### Screenshot This:
- Full truth score detail page

---

## ⚙️ Test 7: Settings

**Expected Time**: 2 minutes  
**Status**: ✅ Working

### Steps:

1. From home, tap gear icon (top right)
2. Explore each section:

#### Account Settings:
- Edit Profile
- View My Profile
- Verification Status
- Truth Score Details

#### Privacy Settings:
- Profile Visibility: Try changing to "Circle" or "Private"
- Photos Visibility: Try different options
- Watchlist Visibility: Test options

#### Notifications:
- Toggle "Mentions" on/off
- Toggle "Screenshot Alerts"
- Toggle "New Endorsements"

#### Communication:
- Change "Direct Messages From" to "Circle Only"

#### Developer Section (NEW):
- **Tap "Test Backend Features"** ← Important!
- Tap "Run All Tests"
- Wait for results
- Review which APIs pass/fail

### Screenshot This:
- Settings main page
- **Test results page (very important)**

---

## 🧪 Test 8: Backend Connectivity

**Expected Time**: 2 minutes  
**Status**: 🔍 Diagnostic tool

### Steps:

1. Settings → Developer → Test Backend Features
2. Tap "Run All Tests"
3. Wait 10-15 seconds for all tests to complete

### What Each Test Does:

**Health Check**:
- Tests basic backend connectivity
- Should show ✅ with status "ok"

**Token Balance**:
- Tests token API
- Currently showing ❌ with 404 error
- **This is the known issue**

**QOTD Get Daily**:
- Tests daily question API
- May pass or fail depending on backend

**QOTD Stats**:
- Tests stats API
- May pass or fail

**Profile Get**:
- Tests profile retrieval
- May pass or fail

**Optima Health**:
- Tests Optima AI backend health
- Should pass if AI is working

### What to Look For:

✅ **Green checks** = API working  
❌ **Red X** = API failing  
⏳ **Orange spinner** = Test in progress

### Screenshot This:
- **Full test results page** ← Most important for debugging

---

## 📸 Required Screenshots

For complete testing documentation, capture:

1. ✅ Optima AI conversation (2-3 Q&As)
2. 🫀 Pulse Chat active session with messages
3. 🎨 Hive home screen showing token balance
4. 💭 QOTD with question and answer
5. 👤 Profile page
6. 🔮 Truth Score detail page
7. ⚙️ Settings main page
8. 🧪 **Test results page** ← Critical

---

## 🐛 Known Issues to Expect

### Issue 1: Token Balance 404
**Where**: Home screen, Token Wallet, Hive  
**Error**: "404 Not Found"  
**Impact**: Can't see token balance, blocks NFT creation  
**Workaround**: None - needs backend fix

### Issue 2: QOTD Backend Disabled
**Where**: Question of the Day  
**Behavior**: Shows local mock question  
**Impact**: Answers don't persist, tokens not earned  
**Workaround**: Can still see UI and flow

### Issue 3: NFT Creation May Fail
**Where**: Hive → Create NFT  
**Error**: May show insufficient tokens  
**Impact**: Can't mint NFTs  
**Workaround**: Wait for token API fix

---

## ✅ Success Criteria

### Fully Working Features:
- ✅ Optima AI responds to questions
- ✅ Pulse Chat session creation and messaging
- ✅ Navigation throughout entire app
- ✅ Settings changes persist
- ✅ Profile viewing and editing
- ✅ Truth Score display

### Partially Working (Expected):
- ⚠️ Token balance (404 error - known issue)
- ⚠️ NFT creation (blocked by tokens)
- ⚠️ QOTD persistence (using local data)

### Must Pass:
- ✅ At least 1 test in test suite passes (Health Check)
- ✅ Optima AI responds
- ✅ Can navigate all screens
- ✅ No app crashes

---

## 📊 Test Report Template

Use this format to report findings:

```
R3AL App Test Report
Date: [Date]
Tester: [Name]
Duration: [X minutes]

WORKING FEATURES:
✅ Optima AI - Responded to all questions
✅ Pulse Chat - Session created, messages sent
✅ Navigation - All screens accessible
✅ Settings - Changes saved

ISSUES FOUND:
❌ Token Balance - 404 error on home screen
❌ NFT Creation - Blocked by token issue
⚠️ QOTD - Using mock data, submission unclear

TEST SUITE RESULTS:
✅ Health Check - PASS
❌ Token Balance - FAIL (404)
❌ QOTD Get Daily - FAIL
❌ QOTD Stats - FAIL
❌ Profile Get - FAIL
❌ Optima Health - FAIL

SCREENSHOTS ATTACHED:
- [List screenshot files]

OVERALL ASSESSMENT:
[Your summary of app quality and functionality]

PRIORITY FIXES NEEDED:
1. Token balance API (blocking multiple features)
2. QOTD backend connection
3. [Other issues]
```

---

## 🎯 Quick Test (5 minutes)

If you only have 5 minutes, test these critical items:

1. **Optima AI** (2 min)
   - Ask one question
   - Verify response

2. **Test Suite** (1 min)
   - Run backend tests
   - Note which pass/fail

3. **Pulse Chat** (1 min)
   - Start session
   - Send one message

4. **Screenshot** (1 min)
   - Home screen
   - Test results

---

**Last Updated**: January 4, 2025  
**Next Review**: After backend connectivity fixed
