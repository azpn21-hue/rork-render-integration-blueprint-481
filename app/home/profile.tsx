import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Animated, Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, Settings, Share2, Edit3, Shield, Award, Heart, TrendingUp, Users } from "lucide-react-native";
import { useAuth } from "@/app/contexts/AuthContext";
import { APP_CONFIG } from "@/app/config/constants";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoggingOut } = useAuth();
  const { theme, pulse } = useTheme();
  const insets = useSafeAreaInsets();
  const [showPhotos, setShowPhotos] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const userPhotos = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80",
  ];

  const stats = [
    { label: "Likes", value: "2.4K", icon: Heart, color: "#FF4757" },
    { label: "Views", value: "12.8K", icon: TrendingUp, color: theme.accent },
    { label: "Matches", value: "143", icon: Users, color: "#00D4FF" },
    { label: "Score", value: "96", icon: Award, color: "#FCD34D" },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LinearGradient colors={theme.gradient} style={[styles.gradient, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: Math.max(20, insets.bottom) }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <Pressable
              onPress={() => router.back()}
              style={[styles.iconButton, { backgroundColor: theme.surface }]}
            >
              <Text style={[styles.backText, { color: theme.text }]}>←</Text>
            </Pressable>

            <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>

            <Pressable
              onPress={() => console.log("Settings")}
              style={[styles.iconButton, { backgroundColor: theme.surface }]}
            >
              <Settings size={20} color={theme.text} />
            </Pressable>
          </Animated.View>

          <Animated.View
            style={[
              styles.profileCard,
              { backgroundColor: theme.surface, borderColor: theme.border, opacity: fadeAnim, transform: [{ scale: pulse }] },
            ]}
          >
            <View style={styles.avatarSection}>
              <View style={[styles.avatarContainer, { borderColor: theme.accent }]}>
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" }}
                  style={styles.avatar}
                />
                <Pressable style={[styles.cameraButton, { backgroundColor: theme.accent }]}>
                  <Camera size={18} color="#FFFFFF" />
                </Pressable>
              </View>

              <View style={styles.nameSection}>
                <View style={styles.nameRow}>
                  <Text style={[styles.userName, { color: theme.text }]}>{user?.name || "Guest"}</Text>
                  <Pressable style={[styles.editButton, { backgroundColor: theme.surfaceHover }]}>
                    <Edit3 size={16} color={theme.accent} />
                  </Pressable>
                </View>
                <Text style={[styles.userHandle, { color: theme.textMuted }]}>@{user?.name?.toLowerCase() || "guest"}</Text>
                {user?.isGuest && (
                  <View style={[styles.guestBadge, { backgroundColor: theme.surfaceHover, borderColor: theme.accent }]}>
                    <Shield size={14} color={theme.accent} />
                    <Text style={[styles.guestBadgeText, { color: theme.accent }]}>Guest</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={[styles.bio, { color: theme.textSecondary }]}>
              Exploring connections, one swipe at a time ✨{"\n"}Living life with intention and authenticity
            </Text>

            <View style={styles.statsRow}>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <View key={index} style={[styles.statItem, { backgroundColor: theme.backgroundSecondary }]}>
                    <Icon size={18} color={stat.color} strokeWidth={2.5} />
                    <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                    <Text style={[styles.statLabel, { color: theme.textMuted }]}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.actionRow}>
              <Pressable
                style={[styles.actionButton, styles.actionButtonPrimary, { backgroundColor: theme.accent }]}
                onPress={() => console.log("Edit profile")}
              >
                <Edit3 size={18} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Edit Profile</Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, { backgroundColor: theme.surfaceHover, borderColor: theme.border }]}
                onPress={() => console.log("Share")}
              >
                <Share2 size={18} color={theme.text} />
              </Pressable>
            </View>
          </Animated.View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Photos</Text>
              <Pressable onPress={() => console.log("Add photo")}>
                <Text style={[styles.addPhoto, { color: theme.accent }]}>+ Add</Text>
              </Pressable>
            </View>

            <View style={styles.photoGrid}>
              {userPhotos.map((photo, index) => (
                <Pressable key={index} style={styles.photoItem} onPress={() => console.log("View photo", index)}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <View style={[styles.photoOverlay, { backgroundColor: theme.photoOverlay }]} />
                </Pressable>
              ))}
              <Pressable style={[styles.photoItem, styles.addPhotoItem, { backgroundColor: theme.surfaceHover, borderColor: theme.border }]}>
                <Camera size={32} color={theme.textMuted} />
              </Pressable>
            </View>
          </View>

          {user?.isGuest && (
            <Animated.View
              style={[
                styles.upgradeCard,
                { backgroundColor: theme.surface, borderColor: theme.accent, opacity: fadeAnim },
              ]}
            >
              <View style={[styles.upgradeIcon, { backgroundColor: theme.accent + "20" }]}>
                <Award size={28} color={theme.accent} />
              </View>
              <Text style={[styles.upgradeTitle, { color: theme.text }]}>Unlock Full Experience</Text>
              <Text style={[styles.upgradeText, { color: theme.textSecondary }]}>
                Create an account to save your matches, access premium features, and connect with more people.
              </Text>
              <Pressable
                style={[styles.upgradeButton, { backgroundColor: theme.accent }]}
                onPress={() => {
                  logout();
                  router.replace("/register");
                }}
                testID="profile-upgrade-button"
              >
                <Text style={styles.upgradeButtonText}>Create Account</Text>
              </Pressable>
            </Animated.View>
          )}

          <Pressable
            style={[styles.logoutButton, { backgroundColor: theme.surface, borderColor: "#FF4757" }]}
            onPress={handleLogout}
            disabled={isLoggingOut}
            testID="profile-logout-button"
          >
            <Text style={[styles.logoutButtonText, { color: "#FF4757" }]}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Text>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 28,
    fontWeight: "300" as const,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    gap: 20,
    borderWidth: 1,
  },
  avatarSection: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    borderWidth: 3,
    borderRadius: 50,
    padding: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  nameSection: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 26,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  userHandle: {
    fontSize: 15,
    fontWeight: "500" as const,
  },
  guestBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1.5,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  actionButtonPrimary: {
    flex: 1,
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
  },
  addPhoto: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  photoItem: {
    width: "31.5%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  addPhotoItem: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed" as const,
  },
  upgradeCard: {
    borderRadius: 20,
    padding: 24,
    gap: 14,
    alignItems: "center",
    borderWidth: 2,
  },
  upgradeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    textAlign: "center",
  },
  upgradeText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  upgradeButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  logoutButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
