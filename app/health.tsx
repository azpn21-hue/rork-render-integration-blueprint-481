import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform, TouchableOpacity, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "@/app/config/api";

interface Probe {
  ok?: boolean;
  status?: number;
  upstream?: unknown;
  error?: string;
}

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(false);
  const [backend, setBackend] = useState<unknown>(null);
  const [probe, setProbe] = useState<Probe | null>(null);
  const [error, setError] = useState<string>("");

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [b, p] = await Promise.all([
        api.get("/health"),
        api.get("/probe/gateway"),
      ]);
      setBackend(b.data);
      setProbe(p.data as Probe);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <>
      <Stack.Screen options={{ title: "System Health" }} />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: Math.max(12, insets.top), paddingBottom: Math.max(12, insets.bottom) }]}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchStatus} />}
        >
          <Text style={styles.title}>Deployment Diagnostics</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Backend /health</Text>
            {loading && !backend ? (
              <ActivityIndicator color="#60A5FA" />
            ) : (
              <Text style={styles.mono} testID="health-backend-json">{JSON.stringify(backend ?? {}, null, 2)}</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>AI Gateway Probe</Text>
            {loading && !probe ? (
              <ActivityIndicator color="#60A5FA" />
            ) : (
              <Text style={styles.mono} testID="health-gateway-json">{JSON.stringify(probe ?? {}, null, 2)}</Text>
            )}
          </View>

          {error ? (
            <View style={[styles.card, styles.errorCard]}>
              <Text style={styles.cardTitle}>Error</Text>
              <Text style={[styles.mono, styles.errorText]} testID="health-error-text">{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity onPress={fetchStatus} disabled={loading} style={styles.button} testID="health-refresh-button">
            <Text style={styles.buttonText}>{loading ? "Refreshing..." : "Refresh"}</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Web base: {Platform.OS === 'web' ? 'web build' : 'native runtime'}. Ensure env EXPO_PUBLIC_RORK_API_BASE_URL and EXPO_PUBLIC_AI_BASE_URL are set.
          </Text>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 16, gap: 16 },
  title: { color: "#E2E8F0", fontSize: 22, fontWeight: "700" as const },
  card: { backgroundColor: "rgba(30,41,59,0.7)", borderColor: "rgba(148,163,184,0.2)", borderWidth: 1, borderRadius: 12, padding: 12 },
  errorCard: { borderColor: "rgba(239,68,68,0.4)" },
  cardTitle: { color: "#93C5FD", fontWeight: "700" as const, marginBottom: 8 },
  mono: { color: "#E5E7EB", fontFamily: Platform.select({ web: "monospace", default: undefined }), fontSize: 12 },
  errorText: { color: "#FCA5A5" },
  button: { backgroundColor: "#3B82F6", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontWeight: "700" as const },
  hint: { color: "#94A3B8", fontSize: 12, textAlign: "center" },
});
