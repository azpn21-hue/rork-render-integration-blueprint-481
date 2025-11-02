import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform
} from "react-native";
import { useTutorial } from "@/app/contexts/TutorialContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SpotlightCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function TutorialOverlay() {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTutorial
  } = useTutorial();

  const { theme } = useTheme();
  const [spotlight, setSpotlight] = useState<SpotlightCoords | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (isActive && currentStep) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true
        })
      ]).start();

      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      );
      pulseLoop.start();

      return () => pulseLoop.stop();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [isActive, currentStep, fadeAnim, pulseAnim, slideAnim]);

  useEffect(() => {
    if (currentStep?.target && Platform.OS !== "web") {
      setSpotlight(null);
    }
  }, [currentStep]);

  if (!isActive || !currentStep) return null;

  const handleNext = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      nextStep();
    });
  };

  const handlePrevious = () => {
    Animated.timing(slideAnim, {
      toValue: 50,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      previousStep();
    });
  };

  const handleSkip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      skipTutorial();
    });
  };

  const getTooltipPosition = () => {
    const tooltipWidth = SCREEN_WIDTH - 48;
    const tooltipHeight = 220;

    if (!spotlight) {
      return {
        top: SCREEN_HEIGHT / 2 - tooltipHeight / 2,
        left: 24,
        width: tooltipWidth
      };
    }

    const { placement, spotlightPadding = 0 } = currentStep;

    switch (placement) {
      case "top":
        return {
          top: spotlight.y - tooltipHeight - spotlightPadding - 16,
          left: 24,
          width: tooltipWidth
        };
      case "bottom":
        return {
          top: spotlight.y + spotlight.height + spotlightPadding + 16,
          left: 24,
          width: tooltipWidth
        };
      case "center":
      default:
        return {
          top: SCREEN_HEIGHT / 2 - tooltipHeight / 2,
          left: 24,
          width: tooltipWidth
        };
    }
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <Modal
      visible={isActive}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.overlay,
            { opacity: fadeAnim }
          ]}
        />

        {spotlight && (
          <Animated.View
            style={[
              styles.spotlightBorder,
              {
                left: spotlight.x - (currentStep.spotlightPadding || 0),
                top: spotlight.y - (currentStep.spotlightPadding || 0),
                width: spotlight.width + (currentStep.spotlightPadding || 0) * 2,
                height: spotlight.height + (currentStep.spotlightPadding || 0) * 2,
                borderRadius: 12,
                transform: [{ scale: pulseAnim }],
                borderColor: theme.accent
              }
            ]}
          />
        )}

        <Animated.View
          style={[
            styles.tooltip,
            {
              backgroundColor: theme.surface,
              borderColor: theme.accent,
              ...tooltipPosition,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.tooltipHeader}>
            <View style={styles.headerLeft}>
              <Sparkles size={20} color={theme.accent} strokeWidth={2} />
              <Text style={[styles.optimaBadge, { color: theme.accent }]}>
                Optima
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleSkip}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={theme.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {currentStep.title}
          </Text>
          
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            {currentStep.optimaMessage || currentStep.message}
          </Text>

          <View style={styles.footer}>
            <View style={styles.progressDots}>
              {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentStepIndex
                          ? theme.accent
                          : theme.border
                    }
                  ]}
                />
              ))}
            </View>

            <View style={styles.navigation}>
              {currentStepIndex > 0 && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={[
                    styles.navButton,
                    { backgroundColor: theme.surface, borderColor: theme.border }
                  ]}
                >
                  <ChevronLeft size={20} color={theme.text} strokeWidth={2} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleNext}
                style={[
                  styles.navButton,
                  styles.primaryButton,
                  { backgroundColor: theme.accent }
                ]}
              >
                {currentStepIndex === totalSteps - 1 ? (
                  <Text style={[styles.buttonText, { color: theme.background }]}>
                    Finish
                  </Text>
                ) : (
                  <ChevronRight
                    size={20}
                    color={theme.background}
                    strokeWidth={2}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.85)"
  },
  spotlightBorder: {
    position: "absolute",
    borderWidth: 2,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12
  },
  tooltip: {
    position: "absolute",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  tooltipHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  optimaBadge: {
    fontSize: 14,
    fontWeight: "700"
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  progressDots: {
    flexDirection: "row",
    gap: 6
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  navigation: {
    flexDirection: "row",
    gap: 8
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1
  },
  primaryButton: {
    minWidth: 80,
    paddingHorizontal: 16
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700"
  }
});
