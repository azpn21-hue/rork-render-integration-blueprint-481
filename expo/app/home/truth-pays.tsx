import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from "react-native";
import { Stack } from "expo-router";
import TruthScoreCard from "@/components/TruthScoreCard";
import VerificationTimeline, { type TimelineItem } from "@/components/VerificationTimeline";
import TokenCarousel, { type RewardCard } from "@/components/TokenCarousel";
import SensorBar from "@/components/SensorBar";
import { theme } from "@/app/theme";
import { getTruthScore, type TruthScoreResponse } from "@/app/services/ai";
import { useAuth } from "@/app/contexts/AuthContext";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TruthPaysScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [score, setScore] = useState<number>(0);
  const [tier, setTier] = useState<string>("Loading");
  const [nextGoal, setNextGoal] = useState<string>("...");
  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res: TruthScoreResponse = await getTruthScore(user.id);
      if (res && "success" in res && res.success) {
        setScore(res.score);
        setTier(res.tier);
        setNextGoal(res.nextGoal);
        if (Platform.OS !== "web") {
          try { await Haptics.selectionAsync(); } catch {}
        }
      }
    } catch (e) {
      console.log("TruthPaysScreen load error", e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const timeline: TimelineItem[] = [
    { id: "1", label: "ID Verified", status: "done", icon: "check", timestamp: "Today" },
    { id: "2", label: "Intent Declared", status: "done", icon: "file", timestamp: "Today" },
    { id: "3", label: "Background Check", status: "pending", icon: "shield" },
    { id: "4", label: "Biometric Link", status: "pending", icon: "fingerprint" },
  ];

  const rewards: RewardCard[] = [
    { id: "r1", title: "Honeymoon Voucher", subtitle: "Win monthly fund draws", icon: "gift", accent: theme.colors.accent },
    { id: "r2", title: "R3AL Mentor", subtitle: "Earn cash + badge at Tier 4", icon: "crown", accent: theme.colors.sensor },
    { id: "r3", title: "Truth Tokens", subtitle: "Redeem for perks & merch", icon: "sparkles", accent: theme.colors.accent },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: Math.max(8, insets.bottom) }]}> 
      <Stack.Screen
        options={{
          title: "Truth Pays",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.white,
        }}
      />

      <SensorBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={theme.colors.sensor} />}>
        <TruthScoreCard score={score} tier={tier} nextGoal={nextGoal} loading={loading} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Transparency Journey</Text>
          <VerificationTimeline items={timeline} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          <TokenCarousel items={rewards} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
