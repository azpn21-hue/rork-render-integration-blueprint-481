import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Shield } from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import locales from "@/schemas/r3al/locale_tokens.json";

export default function VerificationIntro() {
  const router = useRouter();
  const t = locales.en;

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Shield size={80} color={tokens.colors.gold} strokeWidth={1.5} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{t.verify_id_title}</Text>
            <Text style={styles.instructions}>{t.verify_id_instructions}</Text>
          </View>

          <View style={styles.steps}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>{t.document_capture_title}</Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>{t.biometric_capture_title}</Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Verify & Secure</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.log("[VerificationIntro] Begin verification → /r3al/verification/index");
              router.replace("/r3al/verification/index");
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t.begin_verification}</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 16,
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  steps: {
    gap: 24,
  },
  step: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.secondary,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: tokens.colors.text,
  },
  button: {
    backgroundColor: tokens.colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: tokens.colors.secondary,
  },
});
