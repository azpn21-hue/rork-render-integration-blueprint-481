import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Activity, Settings, User, Zap, TrendingUp, MessageCircle } from "lucide-react-native";
import { useAuth } from "@/app/contexts/AuthContext";
import { APP_CONFIG } from "@/app/config/constants";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const stats = [
    { label: "Active Sessions", value: "12", icon: Activity, color: "#3B82F6" },
    { label: "Total Users", value: "248", icon: User, color: "#10B981" },
    { label: "API Calls", value: "1.2K", icon: Zap, color: "#F59E0B" },
    { label: "Uptime", value: "99.9%", icon: TrendingUp, color: "#8B5CF6" },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: APP_CONFIG.name,
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#F1F5F9",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/home/profile")} testID="home-profile-button">
              <Settings color="#94A3B8" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || "Guest"}</Text>
            {user?.isGuest && (
              <View style={styles.guestBadge}>
                <Text style={styles.guestBadgeText}>Guest Mode</Text>
              </View>
            )}
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusIndicator} />
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>System Status</Text>
              <Text style={styles.statusSubtitle}>All systems operational</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                    <Icon color={stat.color} size={24} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Connection Info</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Service</Text>
                <Text style={styles.infoValue}>{APP_CONFIG.optimaName}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mode</Text>
                <Text style={styles.infoValue}>{APP_CONFIG.optimaMode.toUpperCase()}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>{APP_CONFIG.version}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log("Test connection")}
              testID="home-test-connection-button"
            >
              <Zap color="#3B82F6" size={20} />
              <Text style={styles.actionButtonText}>Test API</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => router.push("/home/ai-chat")}
              testID="home-ai-chat-button"
            >
              <MessageCircle color="#fff" size={20} />
              <Text style={[styles.actionButtonText, styles.actionButtonPrimaryText]}>Chat with Optima II</Text>
            </TouchableOpacity>
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
    padding: 20,
    gap: 24,
  },
  header: {
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: "#94A3B8",
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#F1F5F9",
  },
  guestBadge: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  guestBadgeText: {
    color: "#FDE68A",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  statusCard: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#F1F5F9",
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#F1F5F9",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
  },
  infoSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#F1F5F9",
  },
  infoCard: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: "#94A3B8",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#F1F5F9",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  actionButtonPrimary: {
    backgroundColor: "#00d4ff",
    borderColor: "#00d4ff",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#60A5FA",
  },
  actionButtonPrimaryText: {
    color: "#0a0f1c",
  },
});
