import React, { useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Sparkles, Gift, Crown } from "lucide-react-native";
import { theme } from "@/app/theme";

export type RewardCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: "sparkles" | "gift" | "crown";
  accent?: string;
};

const { width } = Dimensions.get("window");

export default function TokenCarousel({ items }: { items: RewardCard[] }) {
  const ref = useRef<ScrollView | null>(null);

  const getIcon = (icon: RewardCard["icon"]) => {
    switch (icon) {
      case "sparkles":
        return <Sparkles color={theme.colors.accent} size={22} />;
      case "gift":
        return <Gift color={theme.colors.sensor} size={22} />;
      case "crown":
        return <Crown color={theme.colors.accent} size={22} />;
    }
  };

  const onScroll = (_e: NativeSyntheticEvent<NativeScrollEvent>) => {};

  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={styles.container}
      testID="token-carousel"
    >
      {items.map((item) => (
        <View key={item.id} style={[styles.card, { borderColor: (item.accent ?? theme.colors.sensor) + "33" }]}> 
          <View style={[styles.iconWrap, { backgroundColor: (item.accent ?? theme.colors.sensor) + "22" }]}>
            {getIcon(item.icon)}
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    gap: 12,
  },
  card: {
    width: width * 0.72,
    marginHorizontal: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 13,
  },
});
