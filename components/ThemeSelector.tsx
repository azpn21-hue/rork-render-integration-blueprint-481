import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ALL_THEMES, useTheme } from "@/app/contexts/ThemeContext";

export default function ThemeSelector() {
  const { setThemeName, themeName } = useTheme();
  const options = useMemo(() => ALL_THEMES, []);

  return (
    <View style={styles.row} testID="theme-selector">
      {options.map((t) => {
        const isActive = themeName === t;
        return (
          <Pressable
            key={t}
            onPress={() => setThemeName(t)}
            style={[styles.pill, isActive ? styles.pillActive : styles.pillIdle]}
            android_ripple={{ color: "#ffffff22" }}
            testID={`theme-pill-${t}`}
          >
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelIdle]}>{t}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginVertical: 12 },
  pill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999, borderWidth: 1 },
  pillActive: { backgroundColor: "#ffffff14", borderColor: "#ffffff55" },
  pillIdle: { backgroundColor: "transparent", borderColor: "#ffffff22" },
  label: { fontSize: 12, fontWeight: "700" as const },
  labelActive: { color: "#FFFFFF" },
  labelIdle: { color: "#D1D5DB" },
});