import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Platform } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, User } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import locales from "@/schemas/r3al/locale_tokens.json";

export default function IdentityVerification() {
  const router = useRouter();
  const { setVerified } = useR3al();
  const t = locales.en;
  const [step, setStep] = useState<"document" | "biometric" | "processing">("document");

  const handleDocumentCapture = () => {
    if (Platform.OS === "web") {
      Alert.alert("Demo Mode", "Document capture simulated for web");
    }
    setStep("biometric");
  };

  const handleBiometricCapture = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Demo Mode", "Biometric capture simulated for web");
    }
    setStep("processing");
    
    setTimeout(() => {
      const mockToken = `verify_${Date.now()}`;
      setVerified(mockToken);
      Alert.alert(
        t.verification_success,
        "Identity verified successfully!",
        [
          {
            text: "Continue",
            onPress: () => router.push("/r3al/questionnaire/index"),
          },
        ]
      );
    }, 2000);
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {step === "document" && (
            <>
              <View style={styles.header}>
                <Camera size={60} color={tokens.colors.gold} strokeWidth={1.5} />
                <Text style={styles.title}>{t.document_capture_title}</Text>
                <Text style={styles.instructions}>{t.document_capture_instructions}</Text>
              </View>

              <View style={styles.captureArea}>
                <View style={styles.frame} />
                <Text style={styles.hint}>Position ID within frame</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleDocumentCapture}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Capture Document</Text>
              </TouchableOpacity>
            </>
          )}

          {step === "biometric" && (
            <>
              <View style={styles.header}>
                <User size={60} color={tokens.colors.gold} strokeWidth={1.5} />
                <Text style={styles.title}>{t.biometric_capture_title}</Text>
                <Text style={styles.instructions}>{t.biometric_capture_instructions}</Text>
              </View>

              <View style={styles.captureArea}>
                <View style={styles.selfieFrame} />
                <Text style={styles.hint}>Position face in center</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleBiometricCapture}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Capture Selfie</Text>
              </TouchableOpacity>
            </>
          )}

          {step === "processing" && (
            <View style={styles.processingContainer}>
              <Text style={styles.processingText}>{t.verification_processing}</Text>
              <View style={styles.loader} />
            </View>
          )}
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
  header: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  captureArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 300,
    height: 180,
    borderWidth: 3,
    borderColor: tokens.colors.gold,
    borderRadius: 12,
    borderStyle: "dashed" as const,
  },
  selfieFrame: {
    width: 200,
    height: 260,
    borderWidth: 3,
    borderColor: tokens.colors.gold,
    borderRadius: 100,
    borderStyle: "dashed" as const,
  },
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: tokens.colors.textSecondary,
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
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  processingText: {
    fontSize: 20,
    color: tokens.colors.gold,
  },
  loader: {
    width: 50,
    height: 50,
    borderWidth: 4,
    borderColor: tokens.colors.gold,
    borderTopColor: "transparent" as const,
    borderRadius: 25,
  },
});
