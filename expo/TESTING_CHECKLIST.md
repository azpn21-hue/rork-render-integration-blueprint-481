# 🧪 R3AL Connection - Testing Checklist

## Pre-Deployment Testing (Local)

### Backend Health
- [ ] Server starts without errors: `npm start`
- [ ] Backend accessible at `http://localhost:10000`
- [ ] Root endpoint responds: `curl http://localhost:10000`
- [ ] Health endpoint responds: `curl http://localhost:10000/health`
- [ ] No console errors in terminal

### Frontend Connectivity
- [ ] Frontend loads in browser
- [ ] No "URI empty" errors in console
- [ ] API base URL logged correctly in console
- [ ] Console shows `[API Config] Base URL: http://localhost:10000`

### Authentication Flow
- [ ] Login screen displays correctly
- [ ] Register screen displays correctly
- [ ] Guest screen displays correctly
- [ ] Email input accepts text
- [ ] Password input accepts text (hidden)
- [ ] All buttons are clickable (not disabled)

### Login Functionality
- [ ] Can enter email and password
- [ ] Login button shows loading state
- [ ] Successful login navigates to NDA screen
- [ ] Console logs: `[Auth] Login successful: [email]`
- [ ] User data stored in AsyncStorage
- [ ] Token stored in AsyncStorage

### Registration Functionality
- [ ] Can enter name, email, and password
- [ ] Register button shows loading state
- [ ] Validation works (password min 6 chars)
- [ ] Successful registration navigates to NDA screen
- [ ] Console logs: `[Auth] Registration successful: [email]`
- [ ] User data stored correctly

### Guest Mode
- [ ] Guest button works
- [ ] Guest login successful
- [ ] Navigates to NDA screen
- [ ] Console logs: `[Auth] Guest login successful: [guest_id]`

### NDA Screen
- [ ] NDA screen displays after login
- [ ] Accept button works
- [ ] Navigates to home screen after acceptance
- [ ] NDA acceptance stored in AsyncStorage

### Home Screen
- [ ] Home screen loads
- [ ] User profile displays
- [ ] Navigation works
- [ ] Logout works and returns to login

---

## Post-Deployment Testing (Render)

### Service Health
- [ ] Render dashboard shows "Live" status
- [ ] Service URL accessible
- [ ] Health check passes
- [ ] No build errors in logs
- [ ] No runtime errors in logs

### API Endpoints
Test each endpoint:

#### Root Endpoint
```bash
curl https://rork-r3al-connection.onrender.com
```
- [ ] Returns 200 OK
- [ ] Response includes `{ "status": "ok" }`
- [ ] Response includes version info

#### Health Endpoint
```bash
curl https://rork-r3al-connection.onrender.com/health
```
- [ ] Returns 200 OK
- [ ] Response includes `{ "status": "healthy" }`
- [ ] Response includes timestamp

### Frontend (Browser Testing)

#### Desktop Browser
- [ ] Open `https://rork-r3al-connection.onrender.com`
- [ ] Login screen loads
- [ ] No console errors
- [ ] Styling renders correctly
- [ ] Images/icons load
- [ ] Gradients render correctly

#### Mobile Browser
- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] Keyboard appears for inputs
- [ ] Scrolling works smoothly

#### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

### Authentication (Production)

#### Login Flow
- [ ] Enter test credentials
- [ ] Click login button
- [ ] Loading spinner appears
- [ ] Request sent to backend (check console)
- [ ] Response received successfully
- [ ] Navigation to NDA screen
- [ ] No errors in console

#### Register Flow
- [ ] Fill out registration form
- [ ] Submit registration
- [ ] Backend processes request
- [ ] Account created successfully
- [ ] Navigation to NDA screen

#### Guest Flow
- [ ] Click "Continue as Guest"
- [ ] Guest account created
- [ ] Navigation to NDA screen

### Data Persistence
- [ ] Login state persists on page refresh
- [ ] NDA acceptance persists
- [ ] User data retrieves correctly
- [ ] Logout clears all data

### Performance
- [ ] Initial page load < 5 seconds
- [ ] Login request < 2 seconds
- [ ] Navigation transitions smooth
- [ ] No memory leaks (check browser tools)
- [ ] Images optimized and load quickly

### Error Handling

#### Network Errors
- [ ] Offline mode shows appropriate message
- [ ] Failed requests show error message
- [ ] Retry mechanisms work

#### Validation Errors
- [ ] Empty fields show validation
- [ ] Invalid email format rejected
- [ ] Short password rejected
- [ ] Error messages clear and helpful

---

## Automated Testing

### Backend Verification Script
```bash
npm run verify-backend
```
- [ ] All endpoint tests pass
- [ ] Response formats correct
- [ ] Status codes correct

### Console Log Checks
Look for these logs (should have no errors):

```
✅ [API Config] Base URL: https://...
✅ [Auth] Attempting login for: ...
✅ [Auth] Login successful: ...
✅ [API] POST .../api/trpc/auth.login
✅ [API] Response 200 from ...
```

---

## Security Testing

### Environment Variables
- [ ] Secrets not exposed in frontend
- [ ] JWT_SECRET is secure (not default)
- [ ] API keys not in console logs
- [ ] No sensitive data in URL params

### Authentication
- [ ] Tokens expire appropriately
- [ ] Logout clears all tokens
- [ ] Protected routes require auth
- [ ] Guest mode has limited access

### CORS
- [ ] CORS headers present
- [ ] Cross-origin requests work
- [ ] Preflight requests handled

---

## Regression Testing

After any code changes, verify:
- [ ] All previous tests still pass
- [ ] New features don't break old ones
- [ ] No new console errors introduced
- [ ] Performance hasn't degraded

---

## User Acceptance Testing

### Real User Scenarios

#### New User
1. [ ] Opens app for first time
2. [ ] Sees login screen
3. [ ] Clicks "Create Account"
4. [ ] Fills out form
5. [ ] Submits registration
6. [ ] Sees NDA screen
7. [ ] Accepts NDA
8. [ ] Reaches home screen
9. [ ] Explores app features

#### Returning User
1. [ ] Opens app
2. [ ] Already logged in (persisted)
3. [ ] Directly sees home screen
4. [ ] Can navigate freely
5. [ ] Can logout

#### Guest User
1. [ ] Opens app
2. [ ] Clicks "Continue as Guest"
3. [ ] Immediately accesses app
4. [ ] Limited features (as designed)
5. [ ] Can upgrade to full account

---

## Issue Reporting Template

If you find issues, document:

```
Issue: [Brief description]
Environment: [Local/Render, Browser/Device]
Steps to Reproduce:
1. 
2. 
3. 
Expected: [What should happen]
Actual: [What actually happened]
Console Errors: [Paste any errors]
Screenshots: [If applicable]
```

---

## Sign-Off

### Local Development
- [ ] All local tests pass
- [ ] No console errors
- [ ] Ready for deployment

**Tester**: ________________  
**Date**: ________________

### Production Deployment
- [ ] All production tests pass
- [ ] Real users can log in
- [ ] Performance acceptable

**Tester**: ________________  
**Date**: ________________

---

**Last Updated**: 2025-10-27  
**Version**: 1.0.0
