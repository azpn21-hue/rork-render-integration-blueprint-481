import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface ResonanceVisualizerProps {
  resonance: number;
  activeParticipants?: number;
  animated?: boolean;
}

export default function ResonanceVisualizer({
  resonance,
  activeParticipants = 0,
  animated = true,
}: ResonanceVisualizerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnims = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (!animated) return;

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1 + resonance * 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    const rippleAnimations = rippleAnims.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 600),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      )
    );

    pulseAnimation.start();
    rippleAnimations.forEach((anim) => anim.start());

    return () => {
      pulseAnimation.stop();
      rippleAnimations.forEach((anim) => anim.stop());
    };
  }, [animated, resonance]);

  const getResonanceColor = (value: number): string => {
    if (value < 0.3) return "#ef4444";
    if (value < 0.6) return "#f59e0b";
    if (value < 0.8) return "#10b981";
    return "#06b6d4";
  };

  const resonanceColor = getResonanceColor(resonance);
  const coreSize = 120;

  return (
    <View style={styles.container}>
      {rippleAnims.map((anim, index) => {
        const scale = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.5],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.6, 0.3, 0],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.ripple,
              {
                width: coreSize,
                height: coreSize,
                borderRadius: coreSize / 2,
                borderColor: resonanceColor,
                transform: [{ scale }],
                opacity,
              },
            ]}
          />
        );
      })}

      <Animated.View
        style={[
          styles.core,
          {
            width: coreSize,
            height: coreSize,
            borderRadius: coreSize / 2,
            backgroundColor: resonanceColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.coreInner}>
          {Array.from({ length: Math.min(activeParticipants, 8) }).map(
            (_, index) => {
              const angle = (index / Math.max(activeParticipants, 1)) * Math.PI * 2;
              const radius = 35;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <View
                  key={index}
                  style={[
                    styles.participantDot,
                    {
                      transform: [{ translateX: x }, { translateY: y }],
                    },
                  ]}
                />
              );
            }
          )}
        </View>
      </Animated.View>

      <View style={styles.coherenceIndicator}>
        <View
          style={[
            styles.coherenceBar,
            {
              width: `${resonance * 100}%`,
              backgroundColor: resonanceColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  ripple: {
    position: "absolute",
    borderWidth: 2,
  },
  core: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  coreInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  participantDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  coherenceIndicator: {
    position: "absolute",
    bottom: -30,
    width: width * 0.6,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  coherenceBar: {
    height: "100%",
    borderRadius: 2,
  },
});
