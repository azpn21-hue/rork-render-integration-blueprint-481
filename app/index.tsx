import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    console.log("[Index] Navigating to r3al/splash");
    const timeoutId = setTimeout(() => {
      router.replace("/r3al/splash");
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={tokens.colors.gold} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tokens.colors.background,
  },
  debugText: {
    marginTop: 20,
    color: tokens.colors.gold,
    fontSize: 12,
  },
});
