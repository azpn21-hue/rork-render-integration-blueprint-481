import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { UserCircle, CheckCircle } from "lucide-react-native";
import { useAuth } from "@/app/contexts/AuthContext";

export default function GuestScreen() {
  const router = useRouter();
  const { guestLogin, isGuestLoggingIn } = useAuth();

  const handleContinueAsGuest = () => {
    guestLogin();
  };

  const features = [
    "Limited access to app features",
    "No data synchronization",
    "Session expires on app close",
    "Create an account anytime",
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <UserCircle color="#60A5FA" size={48} />
              </View>
              <Text style={styles.title}>Guest Mode</Text>
              <Text style={styles.subtitle}>Explore without signing up</Text>
            </View>

            <View style={styles.content}>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Guest Access Includes:</Text>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <CheckCircle color="#60A5FA" size={20} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Note: Your progress and data will not be saved. Create an account for full access
                  and data persistence.
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleContinueAsGuest}
                disabled={isGuestLoggingIn}
                testID="guest-continue-button"
              >
                <Text style={styles.buttonText}>
                  {isGuestLoggingIn ? "Loading..." : "Continue as Guest"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => router.back()}
                testID="guest-back-button"
              >
                <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(96, 165, 250, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#F1F5F9",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
  },
  content: {
    gap: 24,
    marginBottom: 48,
  },
  infoBox: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    gap: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#F1F5F9",
    marginBottom: 4,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: "#CBD5E1",
  },
  warningBox: {
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  warningText: {
    fontSize: 14,
    color: "#FDE68A",
    lineHeight: 20,
  },
  actions: {
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  secondaryButtonText: {
    color: "#60A5FA",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
