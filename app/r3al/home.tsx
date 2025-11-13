import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Award, 
  MessageCircle, 
  Settings,
  Users
} from "lucide-react-native";

export default function R3alHome() {
  const router = useRouter();

  const menuItems = [
    { 
      icon: MessageCircle, 
      label: "Pulse Chat", 
      route: "/r3al/pulse-chat/index",
      color: "#F59E0B" 
    },
    { 
      icon: Users, 
      label: "Circles", 
      route: "/r3al/circles",
      color: "#10B981" 
    },
    { 
      icon: Award, 
      label: "Truth Score", 
      route: "/r3al/truth-score-detail",
      color: "#8B5CF6" 
    },
    { 
      icon: Settings, 
      label: "Settings", 
      route: "/r3al/settings",
      color: "#64748B" 
    },
  ];

  return (
    <LinearGradient
      colors={["#0F172A", "#1E293B"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>R3AL Home</Text>
          <Text style={styles.subtitle}>Welcome to the Reality Verification System</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.menuCard}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
                    <Icon size={32} color={item.color} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F59E0B",
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  menuCard: {
    width: "47%",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
    textAlign: "center",
  },
});
