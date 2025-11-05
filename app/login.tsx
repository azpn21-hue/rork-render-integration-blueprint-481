import { useState, useEffect } from "react";
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
import { LogIn, Mail, Lock, Code } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/app/contexts/AuthContext";
import { AUTH_STORAGE_KEYS, DEV_CREDENTIALS } from "@/app/config/constants";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const checkDevMode = async () => {
      const devMode = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.devMode);
      setIsDevMode(devMode === "true");
    };
    checkDevMode();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      console.warn("[Login] Email and password required");
      return;
    }
    login({ email, password });
  };

  const fillAdminCredentials = () => {
    setEmail(DEV_CREDENTIALS.adminEmail);
    setPassword(DEV_CREDENTIALS.adminPassword);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={[tokens.colors.background, tokens.colors.surface, tokens.colors.background]} style={styles.gradient}>
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
                  <LogIn color={tokens.colors.gold} size={48} />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to R3AL Connection</Text>
              </View>

              <View style={styles.form}>
                {isDevMode && (
                  <TouchableOpacity
                    style={styles.devBadge}
                    onPress={fillAdminCredentials}
                    activeOpacity={0.7}
                  >
                    <Code size={16} color={tokens.colors.gold} />
                    <View style={styles.devBadgeContent}>
                      <Text style={styles.devBadgeTitle}>Developer Mode</Text>
                      <Text style={styles.devBadgeText}>Tap to fill admin credentials</Text>
                    </View>
                  </TouchableOpacity>
                )}
                <View style={styles.inputGroup}>
                  <View style={styles.inputIcon}>
                    <Mail color={tokens.colors.gold} size={20} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={tokens.colors.textSecondary}
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
                    <Lock color={tokens.colors.gold} size={20} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={tokens.colors.textSecondary}
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
                    <ActivityIndicator color={tokens.colors.background} />
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
    backgroundColor: tokens.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "50",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: tokens.colors.text,
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
    backgroundColor: tokens.colors.gold,
  },
  buttonText: {
    color: tokens.colors.background,
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
    backgroundColor: tokens.colors.gold + "30",
  },
  dividerText: {
    color: tokens.colors.textSecondary,
    fontSize: 14,
    marginHorizontal: 16,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  secondaryButtonText: {
    color: tokens.colors.gold,
    fontSize: 16,
    fontWeight: "600" as const,
  },
  devBadge: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: 12,
    padding: 12,
  },
  devBadgeContent: {
    flex: 1,
    gap: 2,
  },
  devBadgeTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  devBadgeText: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
});
