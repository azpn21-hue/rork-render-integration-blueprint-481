import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Flame, Award, TrendingUp, MessageCircle, ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { trpc } from "@/lib/trpc";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function QotdScreen() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dailyQuery = trpc.r3al.qotd.getDaily.useQuery();
  const statsQuery = trpc.r3al.qotd.getStats.useQuery();
  const submitMutation = trpc.r3al.qotd.submitAnswer.useMutation();

  const handleSubmit = async () => {
    if (answer.trim().length < 10) {
      Alert.alert("Answer too short", "Please write at least 10 characters to reflect meaningfully.");
      return;
    }

    if (!dailyQuery.data?.question) {
      return;
    }

    setIsSubmitting(true);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const result = await submitMutation.mutateAsync({
        questionId: dailyQuery.data.question.id,
        answer: answer.trim(),
      });

      if (result.success) {
        Alert.alert(
          "✅ Reflection Saved",
          `${result.message}\n\nYou earned ${result.tokensEarned} Trust Tokens!\n\nCurrent streak: ${result.currentStreak} day${result.currentStreak !== 1 ? "s" : ""}`,
          [
            {
              text: "Continue",
              onPress: () => {
                setAnswer("");
                dailyQuery.refetch();
                statsQuery.refetch();
              },
            },
          ]
        );
      } else {
        Alert.alert("Already Answered", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit your answer. Please try again.");
      console.error("QotD submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dailyQuery.isLoading || statsQuery.isLoading) {
    return (
      <LinearGradient colors={[tokens.colors.background, tokens.colors.surface]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ActivityIndicator size="large" color={tokens.colors.gold} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const question = dailyQuery.data?.question;
  const meta = dailyQuery.data?.meta;
  const stats = statsQuery.data;

  return (
    <LinearGradient colors={[tokens.colors.background, tokens.colors.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Question of the Day</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Flame size={20} color={tokens.colors.gold} />
              <Text style={styles.statValue}>{stats?.currentStreak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Award size={20} color={tokens.colors.gold} />
              <Text style={styles.statValue}>{stats?.totalTokensEarned || 0}</Text>
              <Text style={styles.statLabel}>Tokens</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={20} color={tokens.colors.gold} />
              <Text style={styles.statValue}>{stats?.longestStreak || 0}</Text>
              <Text style={styles.statLabel}>Best</Text>
            </View>
          </View>

          {meta?.hasAnsweredToday ? (
            <View style={styles.completedCard}>
              <MessageCircle size={48} color={tokens.colors.gold} />
              <Text style={styles.completedTitle}>Already Reflected Today</Text>
              <Text style={styles.completedText}>
                Come back tomorrow for a new question!
              </Text>
              <Text style={styles.completedSubtext}>
                Current streak: {stats?.currentStreak || 0} day{stats?.currentStreak !== 1 ? "s" : ""}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.questionCard}>
                <Text style={styles.questionLabel}>Today&apos;s Reflection</Text>
                <Text style={styles.questionText}>{question?.prompt}</Text>
                <View style={styles.rewardBadge}>
                  <Award size={16} color={tokens.colors.background} />
                  <Text style={styles.rewardText}>+{meta?.rewardAvailable || 5} Tokens</Text>
                </View>
              </View>

              <View style={styles.answerSection}>
                <Text style={styles.answerLabel}>Your Response</Text>
                <TextInput
                  style={styles.answerInput}
                  placeholder="Share your thoughts (min. 10 characters)..."
                  placeholderTextColor={tokens.colors.textSecondary}
                  value={answer}
                  onChangeText={setAnswer}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>
                  {answer.length} characters
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting || answer.trim().length < 10}
                activeOpacity={0.7}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={tokens.colors.background} />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Reflection</Text>
                )}
              </TouchableOpacity>

              <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>
                  🔒 Your responses are encrypted and anonymized. QotD is a voluntary reflection tool,
                  not a psychological or medical assessment.
                </Text>
              </View>
            </>
          )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "20",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: tokens.colors.gold,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: tokens.colors.gold,
  },
  statLabel: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  questionCard: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    marginBottom: 24,
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.colors.gold,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 18,
    color: tokens.colors.text,
    lineHeight: 28,
    marginBottom: 16,
  },
  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  rewardText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.colors.background,
  },
  answerSection: {
    marginBottom: 24,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.colors.text,
    marginBottom: 12,
  },
  answerInput: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "50",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: tokens.colors.text,
    minHeight: 160,
  },
  characterCount: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    marginTop: 8,
    textAlign: "right",
  },
  submitButton: {
    backgroundColor: tokens.colors.gold,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.colors.background,
  },
  disclaimer: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "20",
  },
  disclaimerText: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    lineHeight: 18,
  },
  completedCard: {
    backgroundColor: tokens.colors.surface,
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    gap: 16,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: tokens.colors.gold,
    textAlign: "center",
  },
  completedText: {
    fontSize: 16,
    color: tokens.colors.text,
    textAlign: "center",
  },
  completedSubtext: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center",
  },
});
