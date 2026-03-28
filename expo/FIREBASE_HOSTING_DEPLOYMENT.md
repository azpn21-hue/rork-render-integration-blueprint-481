# Firebase Hosting Deployment for r3al.app

## Current Status
✅ Firebase project initialized: `civic-origin-476705-j8 (optima-core-dev)`
✅ Coming soon page created in `public/index.html`
✅ Domain owned: r3al.app (via GoDaddy)

## Complete Firebase Setup

### 1. Finish Firebase Init (Continue from where you stopped)

For the Remote Config question, just press **Enter** to accept the default:
```
? What file should be used for your Remote Config template? (remoteconfig.template.json)
```
Just press Enter ↵

Continue through the remaining prompts accepting defaults.

---

## 2. Deploy to Firebase Hosting

Once the Firebase init completes, deploy:

```bash
firebase deploy --only hosting
```

This will:
- Upload your `public/` folder
- Deploy to Firebase's default domain: `civic-origin-476705-j8.web.app`

---

## 3. Connect Custom Domain (r3al.app)

### In Firebase Console:

1. Go to https://console.firebase.google.com/
2. Select your project: **civic-origin-476705-j8**
3. Navigate to **Hosting** in the left sidebar
4. Click **Add custom domain**
5. Enter: `r3al.app`
6. Firebase will provide DNS records

### In GoDaddy:

1. Log in to GoDaddy
2. Go to **My Products** → **Domains**
3. Click on **r3al.app** → **DNS**
4. Add the DNS records Firebase provides (typically):
   - **Type**: A
   - **Name**: @
   - **Value**: (Firebase IP addresses)
   
   and
   
   - **Type**: TXT
   - **Name**: @
   - **Value**: (Firebase verification code)

5. **Save** changes

⚠️ DNS propagation can take 24-48 hours but often works within minutes.

---

## 4. Add www Subdomain (Optional but Recommended)

In Firebase console:
1. Click **Add custom domain** again
2. Enter: `www.r3al.app`
3. Add the DNS records to GoDaddy

This ensures both `r3al.app` and `www.r3al.app` work.

---

## 5. SSL Certificate

Firebase automatically provisions and renews SSL certificates for custom domains.
Once DNS is configured, your site will be available at `https://r3al.app`

---

## 6. Verify Deployment

After DNS propagation:

```bash
# Check Firebase default domain (immediate)
curl https://civic-origin-476705-j8.web.app

# Check custom domain (after DNS propagation)
curl https://r3al.app
```

Or open in browser:
- https://civic-origin-476705-j8.web.app
- https://r3al.app

---

## Quick Commands Reference

```bash
# Deploy only hosting
firebase deploy --only hosting

# View hosting status
firebase hosting:list

# View custom domains
firebase hosting:channel:list

# Check Firebase project
firebase projects:list
```

---

## Coming Soon Page Features

Your deployed page includes:
✅ SEO-optimized meta tags
✅ Open Graph tags for social sharing
✅ Structured data (Schema.org)
✅ Responsive design
✅ Email signup form (currently logs to console)
✅ Animated background
✅ Platform badges (Apple, Android, Web)
✅ Social media links

---

## Next Steps

1. **Complete Firebase init** (press Enter through remaining prompts)
2. **Run**: `firebase deploy --only hosting`
3. **Connect domain** in Firebase Console
4. **Update DNS** in GoDaddy
5. **Wait for DNS propagation** (check with `dig r3al.app`)

---

## Email Signup Integration (Future)

To capture email signups, you'll need to:
1. Set up Firebase Functions
2. Connect to email service (SendGrid, Mailchimp, etc.)
3. Store emails in Firestore or external database

Example Firebase Function:
```javascript
exports.signupEmail = functions.https.onRequest(async (req, res) => {
  const email = req.body.email;
  // Store in Firestore or send to email service
  await admin.firestore().collection('signups').add({
    email,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  res.json({ success: true });
});
```

---

## Troubleshooting

**Issue**: Custom domain not working
- Check DNS propagation: `dig r3al.app`
- Verify DNS records in GoDaddy match Firebase exactly
- Wait 24-48 hours for full propagation

**Issue**: SSL certificate pending
- This is automatic once DNS is configured
- Can take up to 24 hours

**Issue**: Deployment fails
- Run: `firebase login --reauth`
- Verify project: `firebase use civic-origin-476705-j8`

---

## Support

Firebase Hosting Documentation: https://firebase.google.com/docs/hosting
Custom Domain Setup: https://firebase.google.com/docs/hosting/custom-domain
