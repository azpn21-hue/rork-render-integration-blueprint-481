import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useR3al, Question } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import locales from "@/schemas/r3al/locale_tokens.json";

export default function Questionnaire() {
  const router = useRouter();
  const { questions, saveAnswer, answers } = useR3al();
  const t = locales.en;
  const [currentIndex, setCurrentIndex] = useState(0 as number);
  const [currentAnswer, setCurrentAnswer] = useState("" as string | number);

  const currentQuestion = questions[currentIndex] as Question;
  const isLastQuestion = currentIndex === questions.length - 1;



  const handleNext = () => {
    if (currentAnswer) {
      saveAnswer({
        questionId: currentQuestion.id,
        value: currentAnswer,
        timestamp: Date.now(),
      });

      if (isLastQuestion) {
        console.log("[Questionnaire] Last question answered → /r3al/questionnaire/result");
        router.replace("/r3al/questionnaire/result");
      } else {
        setCurrentIndex(currentIndex + 1);
        const nextQuestion = questions[currentIndex + 1];
        const nextAnswer = answers.find((a) => a.questionId === nextQuestion?.id);
        setCurrentAnswer(nextAnswer?.value || "");
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevQuestion = questions[currentIndex - 1];
      const prevAnswer = answers.find((a) => a.questionId === prevQuestion?.id);
      setCurrentAnswer(prevAnswer?.value || "");
    }
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  currentAnswer === option && styles.optionSelected,
                ]}
                onPress={() => setCurrentAnswer(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentAnswer === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "free-text":
        return (
          <TextInput
            style={styles.textInput}
            value={String(currentAnswer)}
            onChangeText={setCurrentAnswer}
            placeholder="Type your answer here..."
            placeholderTextColor={tokens.colors.textSecondary}
            multiline
            maxLength={currentQuestion.max_length}
          />
        );

      case "likert":
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.labels?.map((label, index) => (
              <TouchableOpacity
                key={label}
                style={[
                  styles.option,
                  currentAnswer === label && styles.optionSelected,
                ]}
                onPress={() => setCurrentAnswer(label)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentAnswer === label && styles.optionTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "slider":
        return (
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>{currentAnswer || currentQuestion.min}</Text>
            <View style={styles.sliderButtons}>
              {Array.from(
                { length: (currentQuestion.max || 10) - (currentQuestion.min || 1) + 1 },
                (_, i) => (currentQuestion.min || 1) + i
              ).map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.sliderButton,
                    currentAnswer === num && styles.sliderButtonSelected,
                  ]}
                  onPress={() => setCurrentAnswer(num)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.sliderButtonText,
                      currentAnswer === num && styles.sliderButtonTextSelected,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
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
            <Text style={styles.title}>{t.questionnaire_title}</Text>
            <Text style={styles.progress}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
            {renderQuestionInput()}
          </View>

          <View style={styles.navigation}>
            {currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handleBack}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonSecondaryText}>{t.back}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, !currentAnswer && styles.buttonDisabled]}
              onPress={handleNext}
              disabled={!currentAnswer}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isLastQuestion ? t.submit_questionnaire : t.next}
              </Text>
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
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  questionContainer: {
    flex: 1,
    gap: 24,
  },
  questionText: {
    fontSize: 18,
    color: tokens.colors.text,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    backgroundColor: "transparent" as const,
  },
  optionSelected: {
    backgroundColor: tokens.colors.gold,
  },
  optionText: {
    fontSize: 16,
    color: tokens.colors.text,
  },
  optionTextSelected: {
    color: tokens.colors.secondary,
    fontWeight: "600" as const,
  },
  textInput: {
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    padding: 16,
    fontSize: 16,
    color: tokens.colors.text,
    minHeight: 120,
    textAlignVertical: "top" as const,
  },
  sliderContainer: {
    gap: 16,
    alignItems: "center",
  },
  sliderValue: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  sliderButtons: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
    justifyContent: "center",
  },
  sliderButton: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderButtonSelected: {
    backgroundColor: tokens.colors.gold,
  },
  sliderButtonText: {
    fontSize: 16,
    color: tokens.colors.text,
  },
  sliderButtonTextSelected: {
    color: tokens.colors.secondary,
    fontWeight: "600" as const,
  },
  navigation: {
    flexDirection: "row" as const,
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
    backgroundColor: tokens.colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "transparent" as const,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.secondary,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
});
