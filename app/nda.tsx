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
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

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
      <LinearGradient colors={[tokens.colors.background, tokens.colors.surface]} style={styles.gradient}>
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <FileText color={tokens.colors.gold} size={48} />
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
                <CheckSquare color={tokens.colors.gold} size={24} />
              ) : (
                <Square color={tokens.colors.textSecondary} size={24} />
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
  documentContainer: {
    marginBottom: 24,
  },
  document: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    gap: 16,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
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
    color: tokens.colors.text,
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
  buttonDisabled: {
    backgroundColor: tokens.colors.surface,
    opacity: 0.5,
  },
  buttonText: {
    color: tokens.colors.secondary,
    fontSize: 16,
    fontWeight: "600" as const,
  },
  buttonTextDisabled: {
    color: tokens.colors.textSecondary,
  },
});
