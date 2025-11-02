import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    console.log("[Index] Redirecting to splash (strict boot order enforced)");
    router.replace("/r3al/splash");
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
});
