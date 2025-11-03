import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react-native";
import { useState, useEffect } from "react";
import { usePulseChat } from "@/app/contexts/PulseChatContext";
import PulseRing from "@/components/PulseRing";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import * as Haptics from "expo-haptics";

export default function Realification() {
  const router = useRouter();
  const {
    realificationSession,
    startRealificationSession,
    answerRealificationQuestion,
    finishRealification,
    endRealificationSession,
    activeSessionId,
  } = usePulseChat();

  const [answer, setAnswer] = useState("");
  const [pulseColor, setPulseColor] = useState<"green" | "blue" | "crimson">("green");

  useEffect(() => {
    if (!realificationSession && activeSessionId) {
      startRealificationSession(activeSessionId, ["user", "participant"]);
    }
  }, [realificationSession, activeSessionId, startRealificationSession]);

  useEffect(() => {
    const interval = setInterval(() => {
      const colors: Array<"green" | "blue" | "crimson"> = ["green", "blue", "crimson"];
      setPulseColor(colors[Math.floor(Math.random() * colors.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!realificationSession) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.title}>Loading Realification...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = realificationSession.questions[realificationSession.currentQuestionIndex];
  const isLastQuestion = realificationSession.currentQuestionIndex === realificationSession.questions.length - 1;

  const handleAnswer = () => {
    if (!answer.trim()) {
      Alert.alert("Answer required", "Please enter an answer before continuing.");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    answerRealificationQuestion(currentQuestion.id, answer.trim());
    setAnswer("");

    if (isLastQuestion) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      const verdict = finishRealification();
      if (verdict) {
        setTimeout(() => {
          Alert.alert(
            `${verdict.icon} ${verdict.title}`,
            verdict.description + `\n\nYou earned ${verdict.trustBonus} Trust Score bonus!`,
            [
              {
                text: "Awesome!",
                onPress: () => {
                  endRealificationSession();
                  router.back();
                },
              },
            ]
          );
        }, 500);
      }
    }
  };

  if (realificationSession.verdict) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.verdictContainer}>
              <Text style={styles.verdictIcon}>{realificationSession.verdict.icon}</Text>
              <Text style={styles.verdictTitle}>{realificationSession.verdict.title}</Text>
              <Text style={styles.verdictDescription}>
                {realificationSession.verdict.description}
              </Text>
              <Text style={styles.trustBonus}>
                +{realificationSession.verdict.trustBonus} Trust Score
              </Text>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => {
                  endRealificationSession();
                  router.back();
                }}
                activeOpacity={0.7}
              >
                <CheckCircle size={24} color={tokens.colors.background} strokeWidth={1.5} />
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Sparkles size={32} color={tokens.colors.accent} strokeWidth={2} />
            <Text style={styles.title}>🫀 Realification™</Text>
            <Text style={styles.progress}>
              Question {realificationSession.currentQuestionIndex + 1} of{" "}
              {realificationSession.questions.length}
            </Text>
          </View>

          <View style={styles.pulseContainer}>
            <PulseRing color={pulseColor} intensity={1} size={150} />
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.question}>{currentQuestion.text}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Your answer..."
            placeholderTextColor={tokens.colors.textSecondary}
            value={answer}
            onChangeText={setAnswer}
            autoFocus
            multiline
          />

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleAnswer}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? "Finish" : "Next"}
            </Text>
            <ArrowRight size={24} color={tokens.colors.background} strokeWidth={1.5} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              Alert.alert(
                "Cancel Realification™?",
                "Your progress will be lost.",
                [
                  { text: "Continue", style: "cancel" },
                  {
                    text: "Cancel",
                    style: "destructive",
                    onPress: () => {
                      endRealificationSession();
                      router.back();
                    },
                  },
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  pulseContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  questionCard: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.accent,
    marginBottom: 24,
  },
  question: {
    fontSize: 20,
    color: tokens.colors.text,
    textAlign: "center" as const,
    lineHeight: 28,
  },
  input: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    padding: 16,
    fontSize: 16,
    color: tokens.colors.text,
    marginBottom: 24,
    minHeight: 60,
  },
  nextButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: tokens.colors.accent,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    marginBottom: 16,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
  },
  verdictContainer: {
    alignItems: "center",
    padding: 32,
  },
  verdictIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  verdictTitle: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 16,
  },
  verdictDescription: {
    fontSize: 18,
    color: tokens.colors.text,
    textAlign: "center" as const,
    marginBottom: 24,
  },
  trustBonus: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.highlight,
    marginBottom: 32,
  },
  doneButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: tokens.colors.gold,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    minWidth: 200,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
});
