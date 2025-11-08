import { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, TextStyle, Animated } from "react-native";
import { cyberpunkTheme } from "@/app/theme";

interface GlitchTextProps {
  children: string;
  style?: TextStyle;
  glitchIntensity?: "low" | "medium" | "high";
  continuous?: boolean;
}

export default function GlitchText({
  children,
  style,
  glitchIntensity = "medium",
  continuous = false,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const glitchAnim = useRef(new Animated.Value(0)).current;

  const glitchChars = "!<>-_\\/[]{}—=+*^?#________";

  const getRandomChar = () => {
    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
  };

  const glitchText = () => {
    const originalText = children;
    let iterations = 0;
    const maxIterations = glitchIntensity === "high" ? 10 : glitchIntensity === "medium" ? 5 : 3;

    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return Math.random() < 0.5 ? getRandomChar() : char;
          })
          .join("")
      );

      iterations += 1;

      if (iterations >= originalText.length + maxIterations) {
        clearInterval(interval);
        setDisplayText(originalText);
      }
    }, 30);
  };

  useEffect(() => {
    if (continuous) {
      const triggerGlitch = setInterval(() => {
        if (Math.random() > 0.7) {
          glitchText();
        }
      }, 3000);

      return () => clearInterval(triggerGlitch);
    } else {
      glitchText();
    }
  }, [children, continuous, glitchIntensity]);

  return (
    <Animated.View style={{ opacity: glitchAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }) }}>
      <Text style={[styles.text, style]}>{displayText}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: cyberpunkTheme.colors.primary,
    fontWeight: "700" as const,
    letterSpacing: 1,
  },
});
