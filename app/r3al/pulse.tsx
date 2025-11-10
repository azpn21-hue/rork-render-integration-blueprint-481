import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { Activity } from "lucide-react-native";
import { 
  usePulseState, 
  useUpdatePulseState, 
  useSharePulse,
  type EmotionalState,
  getEmotionalStateColor,
} from "@/services/pulse";

export default function PulseScreen() {
  const [selectedState, setSelectedState] = useState<EmotionalState>("calm");
  const pulseAnimation = new Animated.Value(1);

  const { data: pulseState, isLoading } = usePulseState();
  const updatePulse = useUpdatePulseState();
  const sharePulse = useSharePulse();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const handleUpdatePulse = async () => {
    try {
      await updatePulse.mutateAsync({
        emotionalState: selectedState,
        interactionData: {
          type: "reflection",
          intensity: 0.8,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Failed to update pulse:", error);
    }
  };

  const handleSharePulse = async () => {
    if (!pulseState) return;

    try {
      await sharePulse.mutateAsync({
        targetType: "feed",
        message: "Sharing my pulse energy",
        pulseSnapshot: {
          emotionalState: pulseState.emotionalState,
          heartbeat: pulseState.heartbeat,
          signature: pulseState.pulseSignature,
        },
      });
    } catch (error) {
      console.error("Failed to share pulse:", error);
    }
  };

  const emotionalStates: EmotionalState[] = ["calm", "excited", "anxious", "focused", "creative", "tired"];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Pulse" }} />
        <Text style={styles.loadingText}>Loading your pulse...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Pulse" }} />

      <View style={styles.pulseContainer}>
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              transform: [{ scale: pulseAnimation }],
              backgroundColor: getEmotionalStateColor(pulseState?.emotionalState || "calm"),
            },
          ]}
        >
          <Activity size={80} color="#FFF" />
        </Animated.View>

        <Text style={styles.heartbeatText}>{pulseState?.heartbeat || 60} BPM</Text>
        <Text style={styles.stateText}>{pulseState?.emotionalState || "calm"}</Text>
      </View>

      {pulseState?.metrics && (
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Coherence</Text>
            <Text style={styles.metricValue}>{(pulseState.metrics.coherence * 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Energy</Text>
            <Text style={styles.metricValue}>{(pulseState.metrics.energy * 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Resonance</Text>
            <Text style={styles.metricValue}>{(pulseState.metrics.resonance * 100).toFixed(0)}%</Text>
          </View>
        </View>
      )}

      <View style={styles.stateSelector}>
        <Text style={styles.sectionTitle}>Update Your State</Text>
        <View style={styles.stateGrid}>
          {emotionalStates.map((state) => (
            <TouchableOpacity
              key={state}
              style={[
                styles.stateButton,
                selectedState === state && styles.stateButtonActive,
                { borderColor: getEmotionalStateColor(state) },
              ]}
              onPress={() => setSelectedState(state)}
            >
              <Text
                style={[
                  styles.stateButtonText,
                  selectedState === state && styles.stateButtonTextActive,
                ]}
              >
                {state}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.updateButton, updatePulse.isPending && styles.updateButtonDisabled]}
        onPress={handleUpdatePulse}
        disabled={updatePulse.isPending}
      >
        <Text style={styles.updateButtonText}>
          {updatePulse.isPending ? "Syncing..." : "Sync Pulse"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.shareButton, sharePulse.isPending && styles.shareButtonDisabled]}
        onPress={handleSharePulse}
        disabled={sharePulse.isPending}
      >
        <Text style={styles.shareButtonText}>
          {sharePulse.isPending ? "Sharing..." : "Share to Feed"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  pulseContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  pulseCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  heartbeatText: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "700" as const,
    marginBottom: 8,
  },
  stateText: {
    color: "#AAA",
    fontSize: 18,
    textTransform: "capitalize" as const,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  metricCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 100,
  },
  metricLabel: {
    color: "#AAA",
    fontSize: 14,
    marginBottom: 8,
  },
  metricValue: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700" as const,
  },
  stateSelector: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  stateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  stateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "#1A1A1A",
  },
  stateButtonActive: {
    backgroundColor: "#333",
  },
  stateButtonText: {
    color: "#AAA",
    fontSize: 14,
    textTransform: "capitalize" as const,
  },
  stateButtonTextActive: {
    color: "#FFF",
    fontWeight: "600" as const,
  },
  updateButton: {
    backgroundColor: "#4FC3F7",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  updateButtonDisabled: {
    opacity: 0.5,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  shareButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 40,
    alignItems: "center",
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
