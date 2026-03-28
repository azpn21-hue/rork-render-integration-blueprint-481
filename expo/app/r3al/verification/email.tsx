import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVerification } from "@/app/contexts/VerificationContext";
import { Mail, CheckCircle } from "lucide-react-native";

export default function EmailVerificationScreen() {
  const router = useRouter();
  const { 
    sendEmail, 
    confirmEmail, 
    isSendingEmail, 
    isConfirmingEmail, 
    emailError,
    emailDevCode,
    status 
  } = useVerification();

  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [codeSent, setCodeSent] = useState<boolean>(false);

  const handleSendCode = () => {
    if (!email.trim()) return;
    sendEmail({ email }, {
      onSuccess: () => {
        setCodeSent(true);
      },
    });
  };

  const handleVerify = () => {
    if (code.length !== 6) return;
    confirmEmail({ email, code }, {
      onSuccess: (data) => {
        if (data.verified) {
          router.push("/r3al/verification/sms");
        }
      },
    });
  };

  if (status.emailVerified) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Email Verification", headerShown: true }} />
        <View style={styles.successContainer}>
          <CheckCircle size={80} color="#00D4AA" />
          <Text style={styles.successText}>Email Already Verified</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/r3al/verification/sms")}
          >
            <Text style={styles.buttonText}>Continue to SMS Verification</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Email Verification", headerShown: true }} />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={60} color="#00D4AA" />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We'll send a 6-digit code to your email address
        </Text>

        {!codeSent ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSendingEmail}
            />

            {isSendingEmail ? (
              <ActivityIndicator size="large" color="#00D4AA" style={styles.loader} />
            ) : (
              <TouchableOpacity
                style={[styles.primaryButton, !email.trim() && styles.disabledButton]}
                onPress={handleSendCode}
                disabled={!email.trim()}
              >
                <Text style={styles.buttonText}>Send Verification Code</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <View style={styles.codeInputContainer}>
              <TextInput
                style={styles.codeInput}
                placeholder="000000"
                placeholderTextColor="#888"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isConfirmingEmail}
              />
            </View>

            {emailDevCode && (
              <View style={styles.devCodeBox}>
                <Text style={styles.devCodeText}>Dev Code: {emailDevCode}</Text>
              </View>
            )}

            {emailError && (
              <Text style={styles.errorText}>{emailError.message}</Text>
            )}

            {isConfirmingEmail ? (
              <ActivityIndicator size="large" color="#00D4AA" style={styles.loader} />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.primaryButton, code.length !== 6 && styles.disabledButton]}
                  onPress={handleVerify}
                  disabled={code.length !== 6}
                >
                  <Text style={styles.buttonText}>Verify Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleSendCode}
                >
                  <Text style={styles.secondaryButtonText}>Resend Code</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  codeInputContainer: {
    marginBottom: 16,
  },
  codeInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  devCodeBox: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  devCodeText: {
    color: "#00D4AA",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600" as const,
  },
  primaryButton: {
    backgroundColor: "#00D4AA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#00D4AA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#00D4AA",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  successText: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginTop: 24,
    marginBottom: 32,
  },
});
