# R3AL Terminology Quick Reference Card

## 🎨 The R3AL Vocabulary

R3AL isn't just another social platform - it's a movement toward authentic human connection. Our unique terminology reflects this mission.

---

## 📖 Core Interactions

### Resonate 🌊
**Generic Term**: Like  
**R3AL Meaning**: Content that deeply resonates with your truth  
**Usage**: "I resonated with your post about authenticity"  
**Icon**: Glowing heart with ripple effect  
**API**: `trpc.r3al.feed.resonatePost`  
**Activity Type**: `resonate`

---

### Amplify 📢
**Generic Term**: Share/Repost  
**R3AL Meaning**: Boost the signal of important truth  
**Usage**: "This message deserves amplification"  
**Icon**: Megaphone or sound waves  
**API**: `trpc.r3al.feed.amplifyPost`  
**Activity Type**: `amplify`

---

### Witness 👁️
**Generic Term**: Verify/Attest  
**R3AL Meaning**: Personally attest to authenticity  
**Usage**: "I can witness the truth of this statement"  
**Icon**: Eye or verification badge  
**API**: `trpc.r3al.feed.witnessPost`  
**Activity Type**: `witness`

---

## 🔍 User Journey Terms

### Trailblaze™ 🗺️
**Generic Term**: Activity Log  
**R3AL Meaning**: Your digital truth trail through R3AL  
**Usage**: "Check your Trailblaze to see your journey"  
**Feature**: Complete activity tracking system  
**Context**: `TrailblazeContext`  
**Screen**: `/r3al/trailblaze`

---

### Witnesses 👥
**Generic Term**: Followers  
**R3AL Meaning**: People who witness your truth journey  
**Usage**: "You have 245 witnesses"  
**API**: `trpc.r3al.social.getFollowers`  
**Activity Type**: `follow_user`

---

### Witnessing 🌟
**Generic Term**: Following  
**R3AL Meaning**: Truth journeys you're actively witnessing  
**Usage**: "You're witnessing 180 truth seekers"  
**API**: `trpc.r3al.social.getFollowing`  
**Activity Type**: `follow_user`

---

## 💫 Community Terms

### Circles ⭕
**Generic Term**: Groups/Communities  
**R3AL Meaning**: Communities of aligned truth seekers  
**Usage**: "Join the 'Conscious Living' circle"  
**API**: Various circle endpoints  
**Activity Type**: `circle_join`, `circle_leave`

---

### Pulse 💓
**Generic Term**: Live Chat  
**R3AL Meaning**: Real-time heartbeat of authentic connection  
**Usage**: "Let's connect on Pulse"  
**Feature**: Live chat with verification  
**Screen**: `/r3al/pulse-chat`

---

### Realification ✓
**Generic Term**: Verification  
**R3AL Meaning**: Process of proving your real identity  
**Usage**: "Complete your Realification to unlock features"  
**API**: `trpc.r3al.pulseChat.startRealification`  
**Activity Type**: `realification_completed`

---

## 🎯 Engagement Terms

### Truth Score 📊
**Generic Term**: Reputation Score  
**R3AL Meaning**: Measure of honesty and authenticity  
**Usage**: "Your truth score increased by 5 points"  
**Range**: 0-100  
**Context**: `R3alContext` → `truthScore`

---

### Trust Tokens 🪙
**Generic Term**: Points/Currency  
**R3AL Meaning**: Rewards for authentic engagement  
**Usage**: "Earn Trust Tokens by completing daily questions"  
**API**: `trpc.r3al.tokens.*`  
**Activity Types**: `tokens_earned`, `tokens_spent`

---

### Hive 🏛️
**Generic Term**: Marketplace  
**R3AL Meaning**: Community-owned NFT marketplace  
**Usage**: "Create and trade in the Hive"  
**Feature**: NFT creation and trading  
**Screen**: `/r3al/hive`

---

## 📱 App Features

### QOTD (Question of the Day) 🌅
**Generic Term**: Daily Challenge  
**R3AL Meaning**: Daily truth-seeking question  
**Usage**: "Answer today's QOTD to earn tokens"  
**API**: `trpc.r3al.qotd.*`  
**Activity Type**: `qotd_answered`

---

### Truth Timeline 📅
**Generic Term**: Feed/Timeline  
**R3AL Meaning**: Chronological stream of authentic moments  
**Usage**: "Check your Truth Timeline for updates"  
**Screen**: `/r3al/feed`  
**API**: `trpc.r3al.feed.*`

---

### Truth Glimpses 👀
**Generic Term**: Profile Views  
**R3AL Meaning**: Moments when others view your truth  
**Usage**: "You had 42 truth glimpses this week"  
**API**: Profile view tracking  
**Activity Type**: `profile_view`

---

## 🛡️ Security & Privacy

### Capture Shield 🛡️
**Generic Term**: Screenshot Protection  
**R3AL Meaning**: Protection against unauthorized content capture  
**Usage**: "Capture Shield detected a screenshot attempt"  
**Feature**: Screenshot detection  
**Hook**: `useScreenshotDetection`  
**Screen**: `/r3al/security/capture-history`

---

### Privacy Vault 🔐
**Generic Term**: Private Content  
**R3AL Meaning**: Securely stored personal moments  
**Usage**: "Add this to your Privacy Vault"  
**Feature**: Encrypted personal storage  
**Activity Type**: `photo_uploaded`

---

## 🎨 Content Types

### Truth Moment 📸
**Generic Term**: Post with Photo  
**R3AL Meaning**: Authentic moment captured and shared  
**Usage**: "Share your truth moment"  
**Activity Type**: `post_created`

---

### Truth Drop 💧
**Generic Term**: Text Post  
**R3AL Meaning**: Brief authentic insight or thought  
**Usage**: "Drop some truth"  
**Activity Type**: `post_created`

---

### Resonance Wave 🌊
**Generic Term**: Trending Topic  
**R3AL Meaning**: Truth that's spreading through the community  
**Usage**: "This truth is creating resonance waves"  
**API**: `trpc.r3al.feed.getTrending`

---

## 🔗 Connection Types

### Mutual Witness 🤝
**Generic Term**: Mutual Follow  
**R3AL Meaning**: Two people witnessing each other's journeys  
**Usage**: "You're now mutual witnesses"  
**Badge**: Special indicator on profiles

---

### Circle Kin 👨‍👩‍👧‍👦
**Generic Term**: Group Members  
**R3AL Meaning**: Fellow members of your circles  
**Usage**: "Your circle kin are active today"  
**Feature**: Shared circle membership

---

### Truth Network 🕸️
**Generic Term**: Social Graph  
**R3AL Meaning**: Web of authentic connections  
**Usage**: "Expand your truth network"  
**Feature**: Follow system and recommendations

---

## 📊 Analytics & Insights

### Resonance Metrics 📈
**Generic Term**: Engagement Stats  
**R3AL Meaning**: Measure of how much your truth resonates  
**Usage**: "Your resonance metrics are improving"  
**Includes**: Resonates, amplifies, witnesses

---

### Truth Trajectory 📉📈
**Generic Term**: Growth Chart  
**R3AL Meaning**: Your journey toward greater authenticity  
**Usage**: "Your truth trajectory is trending upward"  
**Feature**: Truth score over time

---

### Authenticity Index 🎯
**Generic Term**: Engagement Rate  
**R3AL Meaning**: Ratio of authentic interactions to activity  
**Usage**: "High authenticity index means genuine engagement"  
**Calculation**: Quality interactions / Total activity

---

## 🎁 Rewards & Recognition

### Truth Badge 🏅
**Generic Term**: Achievement  
**R3AL Meaning**: Recognition for authentic behavior  
**Usage**: "You earned the 'Consistent Witness' badge"  
**Types**: Various authenticity achievements

---

### Endorsement 🌟
**Generic Term**: Recommendation  
**R3AL Meaning**: Personal attestation of someone's authenticity  
**Usage**: "Give an endorsement to vouch for their truth"  
**API**: `trpc.r3al.profile.endorse`  
**Activity Types**: `endorsement_given`, `endorsement_received`

---

## 🎯 Quick Translation Guide

| Say This (Generic) | Not This (R3AL) |
|-------------------|-----------------|
| Like | Resonate |
| Share | Amplify |
| Verify | Witness |
| Followers | Witnesses |
| Following | Witnessing |
| Activity Log | Trailblaze |
| Profile Views | Truth Glimpses |
| Post | Truth Drop / Truth Moment |
| Trending | Resonance Wave |
| Mutual Follow | Mutual Witness |
| Group Members | Circle Kin |
| Reputation | Truth Score |
| Points | Trust Tokens |
| Marketplace | Hive |
| Feed | Truth Timeline |

---

## 💬 Example Conversations

### Before R3AL:
> "I liked your post and shared it with my followers. You should join our group!"

### With R3AL:
> "I resonated with your truth drop and amplified it to my witnesses. You should join our circle!"

---

### Before R3AL:
> "Check your activity log to see your engagement stats and profile views."

### With R3AL:
> "Check your Trailblaze to see your resonance metrics and truth glimpses."

---

## 🎨 Brand Voice Guidelines

When writing for R3AL:
- ✅ Emphasize authenticity, truth, genuine connection
- ✅ Use warm, human language
- ✅ Avoid corporate jargon
- ✅ Be transparent and honest
- ✅ Celebrate vulnerability
- ❌ Don't use manipulative growth-hacking language
- ❌ Avoid generic social media terms
- ❌ Don't be preachy or self-righteous

---

## 🔤 Capitalization Rules

- **Trailblaze™**: Always capitalize, include trademark on first use
- **Circles**: Capitalize when referring to the feature
- **Truth Score**: Capitalize both words
- **Trust Tokens**: Capitalize both words
- **Hive**: Capitalize when referring to marketplace
- **Pulse**: Capitalize when referring to chat feature
- **Realification**: Capitalize when standalone

Activity types in code: always lowercase (`resonate`, `amplify`, `witness`)

---

## 📱 In-App Copy Examples

### Buttons:
- "Resonate with this" (not "Like")
- "Amplify to witnesses" (not "Share")
- "Witness this truth" (not "Verify")
- "View Trailblaze" (not "Activity Log")

### Notifications:
- "Sarah resonated with your truth drop"
- "Mark amplified your post to 145 witnesses"
- "You earned 10 Trust Tokens"
- "New question in QOTD"

### Empty States:
- "No resonances yet - be the first!"
- "Your Trailblaze is empty - start exploring!"
- "No witnesses yet - share your truth!"

---

## 🎯 Remember

R3AL terminology isn't just different words - it's a different philosophy:
- **Connection** over collection
- **Quality** over quantity  
- **Authenticity** over performance
- **Truth** over trends

Every word choice reinforces our mission: building a platform for real human connection.

---

**Last Updated**: November 2025  
**Version**: 2.0.0  
**For**: Internal team use and user education
