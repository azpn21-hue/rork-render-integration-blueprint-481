import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { ShieldCheck, Trophy } from "lucide-react-native";
import { theme } from "@/app/theme";

export type TruthScoreCardProps = {
  score: number;
  tier: string;
  nextGoal: string;
  loading?: boolean;
  testID?: string;
};

export default function TruthScoreCard({ score, tier, nextGoal, loading, testID }: TruthScoreCardProps) {
  const animated = useRef(new Animated.Value(0)).current;
  const displayScore = Math.max(0, Math.min(1000, score));
  const progress = useMemo(() => displayScore / 1000, [displayScore]);

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [animated, progress]);

  const widthInterpolate = animated.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View style={styles.container} testID={testID ?? "truth-score-card"}>
      <View style={styles.headerRow}>
        <View style={styles.left}>
          <ShieldCheck color={theme.colors.accent} size={22} />
          <Text style={styles.title}>Truth Score</Text>
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>{loading ? "…" : displayScore}</Text>
        </View>
      </View>

      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressBarFg, { width: widthInterpolate }]} />
      </View>

      <View style={styles.tierRow}>
        <View style={styles.tierLeft}>
          <Trophy color={theme.colors.sensor} size={18} />
          <Text style={styles.tierText}>{tier}</Text>
        </View>
        <Text style={styles.nextGoal}>Next: {nextGoal}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    ...theme.shadows.card,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  scorePill: {
    backgroundColor: "rgba(255,200,69,0.12)",
    borderColor: "rgba(255,200,69,0.35)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    color: theme.colors.accent,
    fontWeight: "700",
    fontSize: 16,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "rgba(148,163,184,0.15)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFg: {
    height: 10,
    backgroundColor: theme.colors.accent,
    borderRadius: 6,
  },
  tierRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tierLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tierText: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  nextGoal: {
    color: theme.colors.muted,
    fontSize: 12,
  },
});
