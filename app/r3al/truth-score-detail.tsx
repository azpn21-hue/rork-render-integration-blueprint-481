import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import TruthScoreDetailed from "@/components/TruthScoreDetailed";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function TruthScoreDetailPage() {
  const router = useRouter();
  const { truthScore, userProfile } = useR3al();

  const scoreData = truthScore || {
    score: userProfile?.truthScore?.score || 84,
    summary: "High Integrity Standing",
    details: {
      honesty: 8.5,
      integrity: 8.8,
      transparency: 8.2,
      accountability: 8.6,
      diligence: 8.4,
      values: 9.0,
      analysisText: "Your integrity profile demonstrates strong ethical foundations and consistent authentic engagement.",
    },
  };

  return (
    <LinearGradient colors={[tokens.colors.background, tokens.colors.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Truth Score Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <TruthScoreDetailed truthScore={scoreData} showBreakdown={true} />
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
  header: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
});
