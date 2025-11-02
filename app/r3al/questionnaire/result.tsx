import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Award, TrendingUp } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import locales from "@/schemas/r3al/locale_tokens.json";

export default function ScoreResult() {
  const router = useRouter();
  const { truthScore, calculateTruthScore } = useR3al();
  const t = locales.en;
  const [animatedScore, setAnimatedScore] = useState(0 as number);

  useEffect(() => {
    if (!truthScore) {
      calculateTruthScore();
    }
  }, [truthScore, calculateTruthScore]);

  useEffect(() => {
    if (truthScore) {
      let currentScore = 0 as number;
      const targetScore = truthScore.score;
      const duration = 2000 as number;
      const steps = 50 as number;
      const increment = targetScore / steps;
      const stepDuration = duration / steps;

      const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
          setAnimatedScore(targetScore);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(currentScore));
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [truthScore]);

  if (!truthScore) {
    return null;
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return tokens.colors.success;
      case "medium":
        return tokens.colors.goldLight;
      default:
        return tokens.colors.accent;
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
            <Award size={80} color={tokens.colors.gold} strokeWidth={1.5} />
            <Text style={styles.title}>{t.truthscore_your_score}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{animatedScore}</Text>
            <Text style={[styles.level, { color: getLevelColor(truthScore.level) }]}>
              {truthScore.summary}
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            
            {Object.entries(truthScore.details).map(([key, value]) => {
              if (typeof value === "number" && key !== "consistencyChart") {
                return (
                  <View key={key} style={styles.categoryRow}>
                    <Text style={styles.categoryName}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
                    </Text>
                    <View style={styles.categoryBar}>
                      <View
                        style={[
                          styles.categoryBarFill,
                          { width: `${value * 10}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.categoryValue}>{value}/10</Text>
                  </View>
                );
              }
              return null;
            })}
          </View>

          <View style={styles.analysisContainer}>
            <TrendingUp size={24} color={tokens.colors.gold} strokeWidth={1.5} />
            <Text style={styles.analysisText}>{truthScore.details.analysisText}</Text>
          </View>

          <View style={styles.navigation}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/r3al/profile/setup")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t.finish}</Text>
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
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginTop: 16,
  },
  scoreContainer: {
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 32,
  },
  score: {
    fontSize: 80,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  level: {
    fontSize: 24,
    fontWeight: "600" as const,
    marginTop: 8,
  },
  detailsContainer: {
    marginBottom: 32,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  categoryName: {
    fontSize: 14,
    color: tokens.colors.text,
    width: 100,
  },
  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: tokens.colors.surface,
    borderRadius: 4,
    overflow: "hidden" as const,
  },
  categoryBarFill: {
    height: "100%",
    backgroundColor: tokens.colors.goldLight,
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    width: 40,
    textAlign: "right" as const,
  },
  analysisContainer: {
    flexDirection: "row" as const,
    gap: 12,
    padding: 16,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    marginBottom: 32,
  },
  analysisText: {
    flex: 1,
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 22,
  },
  navigation: {
    marginTop: "auto" as const,
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
