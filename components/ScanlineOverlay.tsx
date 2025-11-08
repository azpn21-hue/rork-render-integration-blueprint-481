import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { cyberpunkTheme } from "@/app/theme";

interface ScanlineOverlayProps {
  speed?: number;
  opacity?: number;
  color?: string;
}

export default function ScanlineOverlay({
  speed = 3000,
  opacity = 0.05,
  color = cyberpunkTheme.colors.primary,
}: ScanlineOverlayProps) {
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scan = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: speed,
        useNativeDriver: true,
      })
    );

    scan.start();

    return () => scan.stop();
  }, [scanAnim, speed]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-100%", "100%"],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.scanline,
          {
            backgroundColor: color,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      />
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden" as const,
  },
  scanline: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
});
