import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface PulseRingProps {
  color: "green" | "blue" | "crimson";
  intensity?: number;
  size?: number;
}

export default function PulseRing({ color, intensity = 1, size = 200 }: PulseRingProps) {
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600 * intensity,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.8,
            duration: 600 * intensity,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 600 * intensity,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600 * intensity,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim, opacityAnim, intensity]);

  const colorMap = {
    green: "#00FF66",
    blue: "#00D4FF",
    crimson: "#DC143C",
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colorMap[color],
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.innerRing,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: (size * 0.7) / 2,
            borderColor: colorMap[color],
            opacity: opacityAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.core,
          {
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: (size * 0.3) / 2,
            backgroundColor: colorMap[color],
            opacity: opacityAnim,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute" as const,
    borderWidth: 4,
  },
  innerRing: {
    position: "absolute" as const,
    borderWidth: 3,
  },
  core: {
    position: "absolute" as const,
  },
});
