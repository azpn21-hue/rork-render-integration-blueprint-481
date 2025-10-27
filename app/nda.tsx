import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FileText, CheckSquare, Square } from "lucide-react-native";
import { useAuth } from "@/app/contexts/AuthContext";

export default function NdaScreen() {
  const { acceptNda, isAcceptingNda } = useAuth();
  const [agreed, setAgreed] = useState<boolean>(false);

  const handleAccept = () => {
    if (agreed) {
      acceptNda();
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <FileText color="#60A5FA" size={48} />
              </View>
              <Text style={styles.title}>Terms & Agreement</Text>
              <Text style={styles.subtitle}>Please review and accept to continue</Text>
            </View>

            <View style={styles.documentContainer}>
              <View style={styles.document}>
                <Text style={styles.documentTitle}>Non-Disclosure Agreement</Text>
                
                <Text style={styles.sectionTitle}>1. Confidential Information</Text>
                <Text style={styles.paragraph}>
                  By using R3AL Connection, you agree to maintain the confidentiality of any
                  proprietary information shared within the platform. This includes but is not
                  limited to user data, API endpoints, and system architecture.
                </Text>

                <Text style={styles.sectionTitle}>2. Usage Terms</Text>
                <Text style={styles.paragraph}>
                  You agree to use this application in accordance with all applicable laws and
                  regulations. Misuse of the platform or unauthorized access to restricted areas
                  is strictly prohibited.
                </Text>

                <Text style={styles.sectionTitle}>3. Data Privacy</Text>
                <Text style={styles.paragraph}>
                  We are committed to protecting your privacy. Your personal information will be
                  handled in accordance with our Privacy Policy and will not be shared with third
                  parties without your explicit consent.
                </Text>

                <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
                <Text style={styles.paragraph}>
                  All content, features, and functionality of R3AL Connection are owned by the
                  company and are protected by international copyright, trademark, and other
                  intellectual property laws.
                </Text>

                <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
                <Text style={styles.paragraph}>
                  The service is provided "as is" without warranties of any kind. We shall not be
                  liable for any indirect, incidental, or consequential damages arising from your
                  use of the platform.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreed(!agreed)}
              testID="nda-checkbox"
            >
              {agreed ? (
                <CheckSquare color="#3B82F6" size={24} />
              ) : (
                <Square color="#64748B" size={24} />
              )}
              <Text style={styles.checkboxText}>
                I have read and agree to the terms and conditions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                !agreed && styles.buttonDisabled,
              ]}
              onPress={handleAccept}
              disabled={!agreed || isAcceptingNda}
              testID="nda-accept-button"
            >
              {isAcceptingNda ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.buttonText, !agreed && styles.buttonTextDisabled]}>
                  Accept and Continue
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
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
  documentContainer: {
    marginBottom: 24,
  },
  document: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    gap: 16,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#F1F5F9",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#E2E8F0",
    marginTop: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#CBD5E1",
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    paddingVertical: 8,
  },
  checkboxText: {
    flex: 1,
    fontSize: 15,
    color: "#E2E8F0",
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
  buttonDisabled: {
    backgroundColor: "#1E293B",
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  buttonTextDisabled: {
    color: "#64748B",
  },
});
