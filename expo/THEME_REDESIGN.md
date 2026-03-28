# 🎨 Private & Interactive Theme Redesign

## Overview

Complete theme overhaul focused on **privacy**, **interactivity**, and **photo-centric** design — perfect for social/dating apps that prioritize user experience and visual storytelling.

---

## 🌑 New Theme System

### Five Distinctive Moods

| Theme | Vibe | Colors | Use Case |
|-------|------|--------|----------|
| **Midnight** | Intense & Passionate | Red accent on deep black | High energy, bold interactions |
| **Carbon** | Sleek & Modern | Cyan accent on pure black | Professional, tech-forward |
| **Obsidian** | Mysterious & Deep | Purple accent on navy | Sophisticated, premium feel |
| **Velvet** | Intimate & Warm | Pink accent on dark purple | Romance, personal connections |
| **Ink** | Elegant & Refined | Gold accent on deep blue | Luxury, exclusive experiences |

### Key Features

- **Private aesthetic**: Dark backgrounds with subtle gradients
- **Photo overlays**: Optimized transparency layers for image content
- **Interactive animations**: Pulse, glow, and spring animations
- **Gesture-ready**: Built for swipe interactions and touch feedback
- **Cross-platform**: Works seamlessly on iOS, Android, and Web

---

## 🎯 Interactive Components

### 1. **ProfileCard** (`components/ProfileCard.tsx`)
Swipeable card interface with:
- Pan gesture support (swipe left/right)
- Dynamic badges ("LIKE" / "NOPE")
- Smooth animations and rotation
- Photo-first design with gradient overlays
- Quick action buttons

```tsx
<ProfileCard
  imageUrl="..."
  name="Emma"
  age={26}
  location="New York, NY"
  bio="Adventure seeker..."
  onSwipeLeft={() => handlePass()}
  onSwipeRight={() => handleMatch()}
/>
```

### 2. **PhotoGallery** (`components/PhotoGallery.tsx`)
Full-screen photo viewer with:
- Horizontal scrolling pagination
- Like/share actions
- Animated indicators
- Gesture controls
- Backdrop overlay

```tsx
<PhotoGallery
  photos={userPhotos}
  initialIndex={0}
  onClose={() => setShowGallery(false)}
/>
```

### 3. **ThemeSelector** (`components/ThemeSelector.tsx`)
Interactive mood switcher:
- Animated pill selection
- Spring-based interactions
- Visual feedback on press
- Syncs with app theme state

---

## 🏠 Redesigned Screens

### Home Screen (`app/home/index.tsx`)
- **Profile-centric layout**: Avatar, stats, and quick actions
- **Discovery section**: Swipeable profile cards
- **Live stats**: Active users, matches, views, likes
- **Quick actions**: Chat, Truth Pays, Explore
- **Theme-aware**: All colors adapt to selected mood

### Profile Screen (`app/home/profile.tsx`)
- **Hero section**: Large avatar with camera button
- **Interactive stats**: Likes, views, matches, score
- **Photo grid**: 3-column layout with add button
- **Edit controls**: Inline profile editing
- **Premium upsell**: For guest users

---

## 🎨 Design Principles

### 1. **Privacy-First**
- Dark backgrounds reduce eye strain
- Subtle borders maintain separation
- Overlay transparency protects content
- Muted colors for secondary elements

### 2. **Photo-Centric**
- Images are primary content
- Optimized overlays don't compete
- Gesture-based photo interactions
- Full-screen viewing experience

### 3. **Interactive by Default**
- All buttons have press states
- Spring animations on interactions
- Haptic feedback ready (mobile)
- Smooth transitions between states

### 4. **Mobile-Native Feel**
- Card-based layouts
- Swipe gestures
- Bottom sheet patterns
- Safe area aware

---

## 🚀 Usage

### Accessing Theme

```tsx
import { useTheme } from "@/app/contexts/ThemeContext";

function MyComponent() {
  const { theme, themeName, setThemeName, pulse, glow } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello</Text>
    </View>
  );
}
```

### Theme Properties

```typescript
interface PrivateTheme {
  background: string;           // Main background
  backgroundSecondary: string;  // Secondary surfaces
  surface: string;              // Card backgrounds
  surfaceHover: string;         // Interactive states
  accent: string;               // Primary actions
  accentGlow: string;           // Hover/active accent
  text: string;                 // Primary text
  textSecondary: string;        // Secondary text
  textMuted: string;            // Tertiary text
  border: string;               // Dividers
  borderLight: string;          // Subtle borders
  overlay: string;              // Modal/sheet overlays
  gradient: [string, string];   // Background gradients
  photoOverlay: string;         // Photo tint layers
}
```

### Animations

```tsx
// Pulse animation (1 → 1.05 → 1)
<Animated.View style={{ transform: [{ scale: pulse }] }}>
  {/* Content */}
</Animated.View>

// Glow animation (shadow opacity/radius)
const shadowOpacity = glow.interpolate({
  inputRange: [0, 1],
  outputRange: [0.08, 0.3]
});
```

---

## 📱 Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Themes | ✅ | ✅ | ✅ |
| Swipe gestures | ✅ | ✅ | ✅ |
| Spring animations | ✅ | ✅ | ✅ |
| Photo gallery | ✅ | ✅ | ✅ |
| Gradient backgrounds | ✅ | ✅ | ✅ |

---

## 🎯 Next Steps

1. **Add haptic feedback** for mobile interactions
2. **Implement photo upload** with camera/gallery access
3. **Add match animations** for profile card swipes
4. **Create onboarding flow** showcasing theme selection
5. **Build settings panel** for theme customization
6. **Add dark mode toggle** (currently all themes are dark)

---

## 🔧 Technical Notes

- Uses React Native's `Animated` API (not Reanimated for web compatibility)
- All animations use `useNativeDriver` where possible
- Theme state managed via `@nkzw/create-context-hook`
- Safe area insets handled properly
- TypeScript strict mode compatible

---

Built with ❤️ for modern, privacy-focused social experiences.
