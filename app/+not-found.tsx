import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AlertCircle } from "lucide-react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found", headerShown: false }} />
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.gradient}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <AlertCircle color="#F59E0B" size={64} />
          </View>
          <Text style={styles.title}>Page Not Found</Text>
          <Text style={styles.description}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </Text>

          <Link href="/login" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#F1F5F9",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
