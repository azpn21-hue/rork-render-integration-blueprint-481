import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";

interface CyberGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  gap?: number;
}

export default function CyberGrid({ children, columns = 2, gap = 12 }: CyberGridProps) {
  return (
    <View style={[styles.grid, { gap }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  },
});
