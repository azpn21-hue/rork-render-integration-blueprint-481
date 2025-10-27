import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { User, Mail, Shield, LogOut, Info } from "lucide-react-native";
import { useAuth } from "@/app/contexts/AuthContext";
import { APP_CONFIG } from "@/app/config/constants";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoggingOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => logout(),
        },
      ]
    );
  };

  const profileItems = [
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "Not set",
      color: "#3B82F6",
    },
    {
      icon: Shield,
      label: "Account Type",
      value: user?.isGuest ? "Guest" : "Registered",
      color: "#10B981",
    },
    {
      icon: Info,
      label: "App Version",
      value: APP_CONFIG.version,
      color: "#8B5CF6",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Profile",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#F1F5F9",
        }}
      />
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#3B82F6", "#8B5CF6"]}
                style={styles.avatar}
              >
                <User color="#FFFFFF" size={48} />
              </LinearGradient>
            </View>
            <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
            {user?.isGuest && (
              <View style={styles.guestBadge}>
                <Text style={styles.guestBadgeText}>Guest Account</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            {profileItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <View key={index} style={styles.infoCard}>
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                    <Icon color={item.color} size={20} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {user?.isGuest && (
            <View style={styles.upgradeSection}>
              <Text style={styles.upgradeTitle}>Upgrade Your Account</Text>
              <Text style={styles.upgradeText}>
                Create a full account to save your progress and access all features.
              </Text>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => {
                  logout();
                  router.replace("/register");
                }}
                testID="profile-upgrade-button"
              >
                <Text style={styles.upgradeButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoggingOut}
            testID="profile-logout-button"
          >
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutButtonText}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Text>
          </TouchableOpacity>
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
    padding: 20,
    gap: 24,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#F1F5F9",
    marginBottom: 8,
  },
  guestBadge: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  guestBadgeText: {
    color: "#FDE68A",
    fontSize: 13,
    fontWeight: "600" as const,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#F1F5F9",
    marginBottom: 4,
  },
  infoCard: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#F1F5F9",
  },
  upgradeSection: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    gap: 12,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#F1F5F9",
  },
  upgradeText: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  logoutButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FCA5A5",
  },
});
