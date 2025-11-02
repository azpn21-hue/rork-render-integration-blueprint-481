import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AlertCircle } from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Not Found", headerShown: false }} />
      <LinearGradient colors={[tokens.colors.background, tokens.colors.surface]} style={styles.gradient}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <AlertCircle color={tokens.colors.gold} size={64} />
          </View>
          <Text style={styles.title}>Page Not Found</Text>
          <Text style={styles.description}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.log("[NotFound] Navigating back or to home...");
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/r3al/splash");
              }
            }}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
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
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: tokens.colors.secondary,
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
