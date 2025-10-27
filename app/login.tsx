import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { LogIn, Mail, Lock } from "lucide-react-native";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    if (!email || !password) {
      console.warn("[Login] Email and password required");
      return;
    }
    login({ email, password });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <LogIn color="#60A5FA" size={48} />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to R3AL Connection</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <View style={styles.inputIcon}>
                    <Mail color="#94A3B8" size={20} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#64748B"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    testID="login-email-input"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputIcon}>
                    <Lock color="#94A3B8" size={20} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#64748B"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    testID="login-password-input"
                  />
                </View>

                {loginError && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                      {loginError instanceof Error ? loginError.message : "Login failed. Please try again."}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleLogin}
                  disabled={isLoggingIn}
                  testID="login-submit-button"
                >
                  {isLoggingIn ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => router.push("/register")}
                  testID="login-register-button"
                >
                  <Text style={styles.secondaryButtonText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => router.push("/guest")}
                  testID="login-guest-button"
                >
                  <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardView: {
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
  form: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#F1F5F9",
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 14,
    textAlign: "center",
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
  },
  dividerText: {
    color: "#64748B",
    fontSize: 14,
    marginHorizontal: 16,
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
  guestButton: {
    marginTop: 8,
    alignItems: "center",
  },
  guestButtonText: {
    color: "#94A3B8",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
