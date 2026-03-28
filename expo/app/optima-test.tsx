import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getHealth, sendPulse, sendHiveEvent, createNFT } from "@/lib/optima-bridge";
import { optimaCoreClient } from "@/lib/optima-core-client";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error";
  data?: any;
  error?: string;
  timestamp?: string;
}

export default function OptimaTestScreen() {
  const insets = useSafeAreaInsets();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, { ...result, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    // Test 1: Health Check (Axios)
    try {
      const health = await optimaCoreClient.health();
      addResult({
        name: "Health Check (Axios Client)",
        status: "success",
        data: health,
      });
    } catch (error: any) {
      addResult({
        name: "Health Check (Axios Client)",
        status: "error",
        error: error.message,
      });
    }

    // Test 2: Health Check (Fetch)
    try {
      const health = await getHealth();
      addResult({
        name: "Health Check (Fetch Bridge)",
        status: "success",
        data: health,
      });
    } catch (error: any) {
      addResult({
        name: "Health Check (Fetch Bridge)",
        status: "error",
        error: error.message,
      });
    }

    // Test 3: Send Pulse
    try {
      const pulse = await sendPulse("tyrone", "focused", "mobile_app_test");
      addResult({
        name: "Pulse Logging",
        status: "success",
        data: pulse,
      });
    } catch (error: any) {
      addResult({
        name: "Pulse Logging",
        status: "error",
        error: error.message,
      });
    }

    // Test 4: Hive Event
    try {
      const hive = await sendHiveEvent("tyrone", {
        testConnection: true,
        platform: "mobile",
        timestamp: new Date().toISOString(),
      });
      addResult({
        name: "Hive Event Submission",
        status: "success",
        data: hive,
      });
    } catch (error: any) {
      addResult({
        name: "Hive Event Submission",
        status: "error",
        error: error.message,
      });
    }

    // Test 5: Create NFT
    try {
      const nft = await createNFT("tyrone", {
        name: "Mobile Test NFT",
        type: "credential",
        platform: "react-native",
        timestamp: new Date().toISOString(),
      });
      addResult({
        name: "NFT Creation",
        status: "success",
        data: nft,
      });
    } catch (error: any) {
      addResult({
        name: "NFT Creation",
        status: "error",
        error: error.message,
      });
    }

    setIsRunning(false);
  };

  const renderResult = (result: TestResult, index: number) => {
    const statusColor =
      result.status === "success" ? "#10b981" : result.status === "error" ? "#ef4444" : "#6b7280";
    const statusIcon = result.status === "success" ? "✅" : result.status === "error" ? "❌" : "⏳";

    return (
      <View key={index} style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultIcon}>{statusIcon}</Text>
          <Text style={styles.resultName}>{result.name}</Text>
        </View>
        <Text style={[styles.resultStatus, { color: statusColor }]}>
          {result.status.toUpperCase()}
        </Text>
        {result.timestamp && (
          <Text style={styles.resultTime}>{result.timestamp}</Text>
        )}
        {result.data && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>Response:</Text>
            <Text style={styles.dataText}>{JSON.stringify(result.data, null, 2)}</Text>
          </View>
        )}
        {result.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorLabel}>Error:</Text>
            <Text style={styles.errorText}>{result.error}</Text>
          </View>
        )}
      </View>
    );
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Optima-Core Test",
          headerStyle: { backgroundColor: "#1f2937" },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Optima-Core Connection Test</Text>
          <Text style={styles.subtitle}>Testing all backend endpoints</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={runAllTests}
          disabled={isRunning}
        >
          {isRunning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Run All Tests</Text>
          )}
        </TouchableOpacity>

        {results.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Test Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>✅ Passed: {successCount}</Text>
              <Text style={styles.summaryText}>❌ Failed: {errorCount}</Text>
              <Text style={styles.summaryText}>📊 Total: {results.length}</Text>
            </View>
          </View>
        )}

        <View style={styles.resultsContainer}>
          {results.map((result, index) => renderResult(result, index))}
        </View>

        {results.length === 0 && !isRunning && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>👆 Tap &ldquo;Run All Tests&rdquo; to begin</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    padding: 20,
    backgroundColor: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#f1f5f9",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  button: {
    backgroundColor: "#3b82f6",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#64748b",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  summaryCard: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#f1f5f9",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryText: {
    fontSize: 14,
    color: "#94a3b8",
  },
  resultsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  resultCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  resultIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#f1f5f9",
    flex: 1,
  },
  resultStatus: {
    fontSize: 12,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  resultTime: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
  },
  dataContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  dataLabel: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  dataText: {
    fontSize: 12,
    color: "#cbd5e1",
    fontFamily: "monospace" as const,
  },
  errorContainer: {
    backgroundColor: "#450a0a",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#991b1b",
  },
  errorLabel: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#fca5a5",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
  },
});
