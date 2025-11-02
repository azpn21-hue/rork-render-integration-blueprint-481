import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Linking } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import locales from "@/schemas/r3al/locale_tokens.json";

export default function Consent() {
  const router = useRouter();
  const { giveConsent } = useR3al();
  const t = locales.en;
  const [agreedToTerms, setAgreedToTerms] = useState(false as boolean);

  const handleContinue = () => {
    if (agreedToTerms) {
      console.log("[Consent] Agreement accepted, marking consent...");
      giveConsent();
      console.log("[Consent] → /r3al/verification/intro");
      router.replace("/r3al/verification/intro");
    }
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.consent_title}</Text>
            <Text style={styles.message}>{t.consent_message}</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.bodyText}>
              We collect and process your data in accordance with the Privacy Act of 1974, GDPR, and CCPA.
            </Text>
            <Text style={styles.bodyText}>
              Your identity verification data is encrypted and stored securely.
            </Text>
            <Text style={styles.bodyText}>
              You have the right to access, modify, and delete your data at any time.
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(t.terms_url)}
            >
              <Text style={styles.linkText}>{t.view_terms}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(t.privacy_url)}
            >
              <Text style={styles.linkText}>{t.view_privacy}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{t.consent_agree}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, !agreedToTerms && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={!agreedToTerms}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t.next}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    lineHeight: 24,
  },
  body: {
    flex: 1,
    gap: 16,
  },
  bodyText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
  linkButton: {
    marginTop: 8,
  },
  linkText: {
    fontSize: 16,
    color: tokens.colors.goldLight,
    textDecorationLine: "underline" as const,
  },
  checkboxContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    marginTop: 24,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: tokens.colors.gold,
  },
  checkmark: {
    color: tokens.colors.secondary,
    fontSize: 16,
    fontWeight: "bold" as const,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
  },
  footer: {
    marginTop: 32,
  },
  button: {
    backgroundColor: tokens.colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: tokens.colors.secondary,
  },
});
