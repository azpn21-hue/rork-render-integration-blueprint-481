import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import locales from "@/schemas/r3al/locale_tokens.json";

export default function Welcome() {
  const router = useRouter();
  const t = locales.en;

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.welcome_title}</Text>
            <Text style={styles.subtitle}>{t.welcome_subtitle}</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.message}>{t.welcome_message}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/r3al/onboarding/consent")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t.start}</Text>
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
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 16,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: tokens.colors.goldLight,
    letterSpacing: 1,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 20,
    color: tokens.colors.text,
    textAlign: "center",
    lineHeight: 30,
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
