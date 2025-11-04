import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function Index() {
  const router = useRouter();
  const r3alContext = useR3al();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    console.log("[Index] Mounting, isLoading:", r3alContext.isLoading);
    setDebugInfo(`Loading: ${r3alContext.isLoading}`);
  }, [r3alContext.isLoading]);

  useEffect(() => {
    console.log("[Index] Effect triggered:", { 
      hasNavigated, 
      isLoading: r3alContext.isLoading 
    });

    const timeoutId = setTimeout(() => {
      if (!hasNavigated) {
        console.log("[Index] Force navigation after timeout");
        setHasNavigated(true);
        try {
          router.replace("/r3al/splash");
          console.log("[Index] Navigation initiated (forced)");
        } catch (error) {
          console.error("[Index] Navigation error:", error);
          setDebugInfo(`Nav error: ${error}`);
        }
      }
    }, 1500);

    if (!hasNavigated && !r3alContext.isLoading) {
      console.log("[Index] Conditions met, navigating to splash");
      setHasNavigated(true);
      clearTimeout(timeoutId);
      
      try {
        router.replace("/r3al/splash");
        console.log("[Index] Navigation initiated");
      } catch (error) {
        console.error("[Index] Navigation error:", error);
        setDebugInfo(`Nav error: ${error}`);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [router, r3alContext.isLoading, hasNavigated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={tokens.colors.gold} />
      {__DEV__ && (
        <Text style={styles.debugText}>
          {debugInfo}
        </Text>
      )}
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
