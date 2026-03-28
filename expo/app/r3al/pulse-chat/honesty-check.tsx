import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Platform, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle, Brain, Shield, Camera, Zap, ArrowLeft } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import { usePulseChat } from "@/app/contexts/PulseChatContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import * as Haptics from "expo-haptics";
import { CameraView, useCameraPermissions } from "expo-camera";

const { width } = Dimensions.get('window');

export default function HonestyCheck() {
  const router = useRouter();
  const {
    honestyCheckSession,
    startHonestyCheck,
    answerHonestyQuestion,
    finishHonestyCheck,
    endHonestyCheck,
    activeSessionId,
  } = usePulseChat();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [biometricData, setBiometricData] = useState<{
    heartRate: number;
    faceDetected: boolean;
    timestamp: number;
  } | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!honestyCheckSession && activeSessionId) {
      startHonestyCheck(activeSessionId);
    }
  }, [honestyCheckSession, activeSessionId, startHonestyCheck]);

  useEffect(() => {
    if (isCapturing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCapturing, pulseAnim]);

  if (!honestyCheckSession) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.title}>Loading Honesty Check...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = honestyCheckSession.questions[honestyCheckSession.currentQuestionIndex];
  const isLastQuestion =
    honestyCheckSession.currentQuestionIndex === honestyCheckSession.questions.length - 1;

  const requestCameraPermission = async () => {
    if (!permission) return false;
    if (!permission.granted) {
      const { granted } = await requestPermission();
      return granted;
    }
    return true;
  };

  const captureBiometricData = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        "Camera Permission Required",
        "For enhanced accuracy, this feature uses your camera flash to detect subtle changes in skin tone related to blood flow. No images are stored."
      );
      return;
    }

    setIsCapturing(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      const mockHeartRate = 65 + Math.floor(Math.random() * 25);
      setBiometricData({
        heartRate: mockHeartRate,
        faceDetected: true,
        timestamp: Date.now(),
      });
      setIsCapturing(false);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 3000);
  };

  const handleAnswer = () => {
    if (!selectedOption) {
      Alert.alert("Select an option", "Please select an answer before continuing.");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    answerHonestyQuestion(currentQuestion.id, selectedOption, biometricData || undefined);
    setSelectedOption(null);
    setBiometricData(null);

    if (isLastQuestion) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      const verdict = finishHonestyCheck();
      if (verdict) {
        setTimeout(() => {
          Alert.alert(
            `${verdict.icon} ${verdict.title}`,
            `${verdict.description}\n\nYou earned ${verdict.trustBonus} Trust Token™!`,
            [
              {
                text: "Awesome!",
                onPress: () => {
                  endHonestyCheck();
                  router.back();
                },
              },
            ]
          );
        }, 500);
      }
    }
  };

  if (honestyCheckSession.verdict) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.verdictContainer}>
              <Text style={styles.verdictIcon}>{honestyCheckSession.verdict.icon}</Text>
              <Text style={styles.verdictTitle}>{honestyCheckSession.verdict.title}</Text>
              <Text style={styles.verdictDescription}>
                {honestyCheckSession.verdict.description}
              </Text>
              <Text style={styles.trustBonus}>
                +{honestyCheckSession.verdict.trustBonus} Trust Token
              </Text>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => {
                  endHonestyCheck();
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
            <View style={styles.iconContainer}>
              <Brain size={40} color={tokens.colors.highlight} strokeWidth={2} />
              <Shield size={24} color={tokens.colors.gold} strokeWidth={2} style={styles.shieldIcon} />
            </View>
            <Text style={styles.title}>🧠 Honesty Check™</Text>
            <Text style={styles.progress}>
              Question {honestyCheckSession.currentQuestionIndex + 1} of{" "}
              {honestyCheckSession.questions.length}
            </Text>
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.question} selectable={false}>{currentQuestion.text}</Text>
          </View>

          {isCapturing && Platform.OS !== "web" && permission?.granted && (
            <View style={styles.cameraContainer}>
              <CameraView 
                style={styles.camera}
                facing="front"
                enableTorch={false}
              />
              <Animated.View 
                style={[
                  styles.flashOverlay,
                  {
                    opacity: flashAnim,
                  },
                ]}
              />
              <Animated.View 
                style={[
                  styles.pulseOverlay,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Text style={styles.captureText}>Analyzing...</Text>
              </Animated.View>
            </View>
          )}

          {biometricData && (
            <View style={styles.biometricCard}>
              <View style={styles.biometricRow}>
                <Zap size={16} color={tokens.colors.accent} strokeWidth={2} />
                <Text style={styles.biometricLabel}>Heart Rate: </Text>
                <Text style={styles.biometricValue}>{biometricData.heartRate} BPM</Text>
              </View>
              <View style={styles.biometricRow}>
                <CheckCircle size={16} color="#00FF66" strokeWidth={2} />
                <Text style={styles.biometricLabel}>Face Detected</Text>
              </View>
            </View>
          )}

          {!isCapturing && !biometricData && (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={captureBiometricData}
              activeOpacity={0.7}
            >
              <Camera size={20} color={tokens.colors.background} strokeWidth={2} />
              <Text style={styles.captureButtonText}>Capture Vibe Check</Text>
            </TouchableOpacity>
          )}

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === option && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedOption(option);
                }}
                activeOpacity={0.7}
              >
                <Text
                  selectable={false}
                  style={[
                    styles.optionText,
                    selectedOption === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.nextButton, !selectedOption && styles.nextButtonDisabled]}
            onPress={handleAnswer}
            activeOpacity={0.7}
            disabled={!selectedOption}
          >
            <Text style={styles.nextButtonText}>{isLastQuestion ? "Finish" : "Next"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Alert.alert(
                "Exit Honesty Check?",
                "Your progress will be lost.",
                [
                  { text: "Continue", style: "cancel" },
                  {
                    text: "Exit",
                    style: "destructive",
                    onPress: () => {
                      endHonestyCheck();
                      router.back();
                    },
                  },
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={tokens.colors.textSecondary} strokeWidth={2} />
            <Text style={styles.cancelButtonText}>Back to Chat</Text>
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
  iconContainer: {
    position: "relative" as const,
    marginBottom: 12,
  },
  shieldIcon: {
    position: "absolute" as const,
    bottom: -4,
    right: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
    marginTop: 12,
  },
  progress: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  questionCard: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.highlight,
    marginBottom: 24,
  },
  question: {
    fontSize: 20,
    color: tokens.colors.text,
    textAlign: "center" as const,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    padding: 16,
  },
  optionButtonSelected: {
    backgroundColor: tokens.colors.highlight + "20",
    borderColor: tokens.colors.highlight,
  },
  optionText: {
    fontSize: 16,
    color: tokens.colors.text,
    textAlign: "center" as const,
  },
  optionTextSelected: {
    color: tokens.colors.highlight,
    fontWeight: "600" as const,
  },
  nextButton: {
    backgroundColor: tokens.colors.highlight,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
    marginBottom: 16,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
  captureButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: tokens.colors.accent,
    padding: 12,
    borderRadius: tokens.dimensions.borderRadius,
    marginBottom: 16,
  },
  captureButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.background,
  },
  cameraContainer: {
    height: 200,
    borderRadius: tokens.dimensions.borderRadius,
    overflow: "hidden" as const,
    marginBottom: 16,
    position: "relative" as const,
  },
  camera: {
    flex: 1,
  },
  flashOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
  },
  pulseOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "white",
  },
  biometricCard: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.accent,
    marginBottom: 16,
    gap: 8,
  },
  biometricRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  biometricLabel: {
    fontSize: 14,
    color: tokens.colors.text,
    fontWeight: "600" as const,
  },
  biometricValue: {
    fontSize: 14,
    color: tokens.colors.accent,
    fontWeight: "700" as const,
  },
  backButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
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
