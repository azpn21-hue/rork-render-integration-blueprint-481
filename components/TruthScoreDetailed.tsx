import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, ScrollView } from "react-native";
import { Award, TrendingUp, Shield, Heart, Eye, CheckCircle, Target } from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import { TruthScore } from "@/app/contexts/R3alContext";

export type TruthScoreDetailedProps = {
  truthScore: TruthScore;
  showBreakdown?: boolean;
  testID?: string;
};

type CategoryInfo = {
  key: keyof TruthScore['details'];
  label: string;
  icon: React.ReactNode;
  color: string;
};

const CATEGORIES: CategoryInfo[] = [
  {
    key: "honesty",
    label: "Honesty",
    icon: <Heart size={20} color="#EF4444" strokeWidth={2} />,
    color: "#EF4444",
  },
  {
    key: "integrity",
    label: "Integrity",
    icon: <Shield size={20} color="#3B82F6" strokeWidth={2} />,
    color: "#3B82F6",
  },
  {
    key: "transparency",
    label: "Transparency",
    icon: <Eye size={20} color="#8B5CF6" strokeWidth={2} />,
    color: "#8B5CF6",
  },
  {
    key: "accountability",
    label: "Accountability",
    icon: <CheckCircle size={20} color="#10B981" strokeWidth={2} />,
    color: "#10B981",
  },
  {
    key: "diligence",
    label: "Diligence",
    icon: <Target size={20} color="#F59E0B" strokeWidth={2} />,
    color: "#F59E0B",
  },
  {
    key: "values",
    label: "Values",
    icon: <Award size={20} color={tokens.colors.gold} strokeWidth={2} />,
    color: tokens.colors.gold,
  },
];

export default function TruthScoreDetailed({ truthScore, showBreakdown = true, testID }: TruthScoreDetailedProps) {
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const scorePercent = Math.max(0, Math.min(100, truthScore.score));

  useEffect(() => {
    Animated.spring(scoreAnim, {
      toValue: scorePercent,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [scorePercent, scoreAnim]);

  const renderCategoryBar = (category: CategoryInfo) => {
    const value = truthScore.details[category.key] as number || 0;
    const barWidth = Math.max(0, Math.min(100, value * 10));

    return (
      <View key={category.key} style={styles.categoryRow}>
        <View style={styles.categoryHeader}>
          {category.icon}
          <Text style={styles.categoryLabel}>{category.label}</Text>
        </View>
        <View style={styles.categoryBarContainer}>
          <View style={styles.categoryBarBg}>
            <View 
              style={[
                styles.categoryBarFg, 
                { width: `${barWidth}%`, backgroundColor: category.color }
              ]} 
            />
          </View>
          <Text style={[styles.categoryValue, { color: category.color }]}>
            {value}/10
          </Text>
        </View>
      </View>
    );
  };

  const getLevelColor = () => {
    if (scorePercent >= 80) return "#10B981";
    if (scorePercent >= 60) return tokens.colors.gold;
    if (scorePercent >= 40) return "#F59E0B";
    return "#EF4444";
  };

  const getLevelLabel = () => {
    if (scorePercent >= 90) return "Elite";
    if (scorePercent >= 80) return "Exceptional";
    if (scorePercent >= 70) return "High Integrity";
    if (scorePercent >= 60) return "Good Standing";
    if (scorePercent >= 40) return "Building Trust";
    return "Getting Started";
  };

  return (
    <ScrollView style={styles.container} testID={testID}>
      <View style={styles.mainScoreCard}>
        <View style={styles.scoreIconContainer}>
          <Award size={48} color={tokens.colors.gold} strokeWidth={1.5} />
        </View>
        
        <Text style={styles.scoreTitle}>Truth Score</Text>
        <Text style={styles.scoreValue}>{scorePercent}</Text>
        
        <View style={styles.scoreLevelContainer}>
          <TrendingUp size={18} color={getLevelColor()} strokeWidth={2} />
          <Text style={[styles.levelText, { color: getLevelColor() }]}>
            {getLevelLabel()}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <Animated.View
              style={[
                styles.progressFg,
                {
                  width: scoreAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor: getLevelColor(),
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.summaryText}>{truthScore.summary}</Text>
      </View>

      {showBreakdown && (
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Shield size={24} color={tokens.colors.gold} strokeWidth={2} />
            <Text style={styles.breakdownTitle}>Integrity Breakdown</Text>
          </View>

          <View style={styles.categoriesContainer}>
            {CATEGORIES.map((category) => renderCategoryBar(category))}
          </View>

          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>Analysis</Text>
            <Text style={styles.analysisText}>
              {truthScore.details.analysisText || `Your integrity profile shows balanced characteristics across ${CATEGORIES.length} key dimensions. Continue engaging authentically to build your reputation.`}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.achievementCard}>
        <Text style={styles.achievementTitle}>🏆 What This Means</Text>
        <Text style={styles.achievementText}>
          • Your Truth Score reflects your authenticity and engagement{"\n"}
          • Higher scores unlock premium features and trust badges{"\n"}
          • Scores update based on community interactions{"\n"}
          • Endorsements from verified users boost your score{"\n"}
          • Consistent honest engagement builds long-term trust
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainScoreCard: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    marginBottom: 16,
  },
  scoreIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: tokens.colors.gold,
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  scoreLevelContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  levelText: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 16,
  },
  progressBg: {
    height: 12,
    backgroundColor: tokens.colors.background,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFg: {
    height: 12,
    borderRadius: 6,
  },
  summaryText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  breakdownCard: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
    marginBottom: 16,
  },
  breakdownHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  categoriesContainer: {
    gap: 16,
    marginBottom: 20,
  },
  categoryRow: {
    gap: 10,
  },
  categoryHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.text,
  },
  categoryBarContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  categoryBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: tokens.colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  categoryBarFg: {
    height: 8,
    borderRadius: 4,
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: "700" as const,
    minWidth: 40,
    textAlign: "right" as const,
  },
  analysisContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "20",
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  analysisText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
  },
  achievementCard: {
    backgroundColor: tokens.colors.background,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "20",
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  achievementText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
});
