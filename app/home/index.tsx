import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Users, Sparkles, Heart, MessageCircle, TrendingUp, Eye } from "lucide-react-native";
import ThemeSelector from "@/components/ThemeSelector";
import ProfileCard from "@/components/ProfileCard";
import { useAuth } from "@/app/contexts/AuthContext";
import { APP_CONFIG } from "@/app/config/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useState, useRef } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme, pulse } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const profiles = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      name: "Emma",
      age: 26,
      location: "New York, NY",
      bio: "Adventure seeker, coffee enthusiast, and photography lover. Always looking for the next great story.",
      occupation: "Photographer",
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
      name: "Alex",
      age: 28,
      location: "Los Angeles, CA",
      bio: "Tech entrepreneur with a passion for innovation. Weekend hiker and amateur chef.",
      occupation: "Founder",
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
      name: "Sophie",
      age: 24,
      location: "San Francisco, CA",
      bio: "Designer by day, artist by night. Love exploring new places and meeting interesting people.",
      occupation: "Designer",
    },
  ];

  const currentProfile = profiles[activeIndex];

  const handleSwipeLeft = () => {
    console.log("Swiped left on", currentProfile.name);
    setActiveIndex((prev) => (prev + 1) % profiles.length);
  };

  const handleSwipeRight = () => {
    console.log("Swiped right on", currentProfile.name);
    setActiveIndex((prev) => (prev + 1) % profiles.length);
  };

  const stats = [
    { label: "Active", value: "2.4K", icon: Users, color: theme.accent },
    { label: "Matches", value: "143", icon: Heart, color: "#FF4757" },
    { label: "Views", value: "892", icon: Eye, color: "#00D4FF" },
    { label: "Likes", value: "321", icon: Sparkles, color: "#FCD34D" },
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
          <View style={styles.header}>
            <View>
              <Text style={[styles.welcomeText, { color: theme.textMuted }]}>Welcome back,</Text>
              <Text style={[styles.userName, { color: theme.text }]}>{user?.name || "Guest"}</Text>
            </View>
            <Pressable
              onPress={() => router.push("/home/profile")}
              style={[styles.profileButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              testID="home-profile-button"
            >
              <Text style={[styles.profileInitial, { color: theme.accent }]}>
                {(user?.name?.[0] || "G").toUpperCase()}
              </Text>
            </Pressable>
          </View>

          <ThemeSelector />

          <View style={styles.statsRow}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.statCard,
                    { backgroundColor: theme.surface, borderColor: theme.borderLight, transform: [{ scale: pulse }] },
                  ]}
                >
                  <Icon color={stat.color} size={20} strokeWidth={2} />
                  <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>{stat.label}</Text>
                </Animated.View>
              );
            })}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Discover</Text>
              <Pressable>
                <Text style={[styles.seeAll, { color: theme.accent }]}>Filters</Text>
              </Pressable>
            </View>

            <View style={styles.cardContainer}>
              <ProfileCard
                {...currentProfile}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onInfoPress={() => console.log("Info pressed")}
              />
            </View>
          </View>

          <View style={[styles.quickActions, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable
              onPress={() => router.push("/home/ai-chat")}
              style={[styles.quickAction, { backgroundColor: theme.surfaceHover }]}
              testID="home-ai-chat-button"
            >
              <MessageCircle color={theme.accent} size={22} strokeWidth={2} />
              <Text style={[styles.quickActionText, { color: theme.text }]}>Chat</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/home/truth-pays")}
              style={[styles.quickAction, { backgroundColor: theme.surfaceHover }]}
              testID="home-truth-pays-button"
            >
              <TrendingUp color={theme.accent} size={22} strokeWidth={2} />
              <Text style={[styles.quickActionText, { color: theme.text }]}>Truth Pays</Text>
            </Pressable>

            <Pressable
              onPress={() => console.log("Explore")}
              style={[styles.quickAction, { backgroundColor: theme.accent }]}
            >
              <Sparkles color="#FFFFFF" size={22} strokeWidth={2} />
              <Text style={[styles.quickActionText, { color: "#FFFFFF" }]}>Explore</Text>
            </Pressable>
          </View>
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
  welcomeText: {
    fontSize: 14,
    fontWeight: "500" as const,
    marginBottom: 2,
  },
  userName: {
    fontSize: 32,
    fontWeight: "800" as const,
    letterSpacing: -1,
  },
  profileButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  profileInitial: {
    fontSize: 22,
    fontWeight: "700" as const,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  cardContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
});
