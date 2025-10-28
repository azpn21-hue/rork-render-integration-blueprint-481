import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, Platform } from "react-native";
import { theme } from "@/app/theme";

export default function SensorBar() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = () => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: Platform.OS !== "web",
      }).start(() => loop());
    };
    loop();
  }, [anim]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.6, 0.1] });

  return (
    <View style={styles.container} testID="sensor-bar">
      <Animated.View style={[styles.pulse, { transform: [{ translateX }], opacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    backgroundColor: "rgba(44,231,225,0.15)",
    overflow: "hidden",
  },
  pulse: {
    height: 6,
    width: 100,
    backgroundColor: theme.colors.sensor,
  },
});
