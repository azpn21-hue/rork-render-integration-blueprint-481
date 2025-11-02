import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function Index() {
  const router = useRouter();
  const { isLoading, hasConsented, isVerified, answers, truthScore, userProfile } = useR3al();

  useEffect(() => {
    if (!isLoading) {
      if (userProfile?.name && truthScore) {
        router.replace("/r3al/home");
      } else if (truthScore && !userProfile?.name) {
        router.replace("/r3al/profile/setup");
      } else if (answers.length > 0) {
        router.replace("/r3al/questionnaire/result");
      } else if (isVerified) {
        router.replace("/r3al/questionnaire/index");
      } else if (hasConsented) {
        router.replace("/r3al/verification/intro");
      } else {
        router.replace("/r3al/splash");
      }
    }
  }, [isLoading, hasConsented, isVerified, answers, truthScore, userProfile, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={tokens.colors.gold} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tokens.colors.background,
  },
});
