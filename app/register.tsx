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
import { UserPlus, Mail, Lock, User } from "lucide-react-native";
import { useAuth } from "@/app/contexts/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleRegister = () => {
    setError("");
    
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    register({ name, email, password });
  };

  const displayError = error || (registerError instanceof Error ? registerError.message : "");

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
                  <UserPlus color="#60A5FA" size={48} />
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join R3AL Connection</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <View style={styles.inputIcon}>
                    <User color="#94A3B8" size={20} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#64748B"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    testID="register-name-input"
                  />
                </View>

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
                    testID="register-email-input"
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
                    testID="register-password-input"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputIcon}>
                    <Lock color="#94A3B8" size={20} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#64748B"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    testID="register-confirm-password-input"
                  />
                </View>

                {displayError && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{displayError}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleRegister}
                  disabled={isRegistering}
                  testID="register-submit-button"
                >
                  {isRegistering ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => router.back()}
                  testID="register-back-button"
                >
                  <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
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
});
