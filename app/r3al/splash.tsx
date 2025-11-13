import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function R3alSplash() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  const handleContinue = () => {
    router.replace("/r3al/home");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0F172A", "#1E293B", "#0F172A"]}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.title}>R3AL</Text>
          <Text style={styles.subtitle}>Reality Verification System</Text>
          
          {isReady && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 64,
    fontWeight: "700",
    color: "#F59E0B",
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#94A3B8",
    letterSpacing: 2,
  },
  button: {
    marginTop: 40,
    paddingHorizontal: 40,
    paddingVertical: 16,
    backgroundColor: "#F59E0B",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: 1,
  },
});
