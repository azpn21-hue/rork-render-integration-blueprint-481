import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function Index() {
  const router = useRouter();
  const r3alContext = useR3al();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!hasNavigated && !r3alContext.isLoading) {
      console.log("[Index] R3AL loaded, redirecting to splash");
      setHasNavigated(true);
      const timer = setTimeout(() => {
        router.replace("/r3al/splash");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [router, r3alContext.isLoading, hasNavigated]);

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
