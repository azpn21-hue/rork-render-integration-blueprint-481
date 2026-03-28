import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { trpcClient } from "@/lib/trpc";
import { Stack } from "expo-router";

export default function BackendTest() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);

  const tests = [
    {
      name: "Health Check",
      test: async () => {
        const response = await fetch(`${getBaseUrl()}/health`);
        return await response.json();
      },
    },
    {
      name: "Routes List",
      test: async () => {
        const response = await fetch(`${getBaseUrl()}/api/routes`);
        return await response.json();
      },
    },
    {
      name: "Token Balance (tRPC)",
      test: async () => {
        const result = await trpcClient.r3al.tokens.getBalance.query();
        return result;
      },
    },
    {
      name: "QOTD Daily Question",
      test: async () => {
        const result = await trpcClient.r3al.qotd.getDaily.query();
        return result;
      },
    },
    {
      name: "Profile Get",
      test: async () => {
        const result = await trpcClient.r3al.profile.getProfile.query({ profileId: "test-user" });
        return result;
      },
    },
    {
      name: "Example Hi",
      test: async () => {
        const result = await trpcClient.example.hi.query();
        return result;
      },
    },
    {
      name: "NFT Create (tRPC)",
      test: async () => {
        const result = await trpcClient.r3al.createNFT.mutate({
          name: "Test NFT",
          description: "Test NFT for backend testing",
          imageUrl: "https://picsum.photos/400/400",
          rarity: "common",
        });
        return result;
      },
    },
    {
      name: "Pulse Chat Start Session",
      test: async () => {
        const result = await trpcClient.r3al.pulseChat.startSession.mutate({
          recipientId: "test-recipient",
        });
        return result;
      },
    },
  ];

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setResults((prev) => ({ ...prev, [testName]: { status: "running" } }));
    try {
      const result = await testFn();
      setResults((prev) => ({
        ...prev,
        [testName]: { status: "success", data: result },
      }));
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        [testName]: { status: "error", error: error.message },
      }));
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    setResults({});
    for (const test of tests) {
      await runTest(test.name, test.test);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsRunningAll(false);
  };

  const getBaseUrl = () => {
    const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
    if (envUrl && envUrl.trim().length > 0) {
      return envUrl.replace(/\/$/, "");
    }

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://localhost:10000";
      }
      if (hostname.includes(".rork")) {
        return window.location.origin;
      }
      return window.location.origin;
    }

    return "http://localhost:10000";
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Backend Test", headerShown: true, headerStyle: { backgroundColor: "#000" }, headerTintColor: "#fff" }} />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Backend Connection Test</Text>
        <Text style={styles.subtitle}>Base URL: {getBaseUrl()}</Text>

        <TouchableOpacity 
          style={[styles.button, isRunningAll && styles.buttonDisabled]} 
          onPress={runAllTests}
          disabled={isRunningAll}
        >
          {isRunningAll ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Run All Tests</Text>
          )}
        </TouchableOpacity>

        {tests.map((test) => (
          <View key={test.name} style={styles.testCard}>
            <View style={styles.testHeader}>
              <Text style={styles.testName}>{test.name}</Text>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => runTest(test.name, test.test)}
              >
                <Text style={styles.smallButtonText}>Run</Text>
              </TouchableOpacity>
            </View>

            {results[test.name] && (
              <View style={styles.result}>
                <Text
                  style={[
                    styles.status,
                    results[test.name].status === "success" && styles.success,
                    results[test.name].status === "error" && styles.error,
                    results[test.name].status === "running" && styles.running,
                  ]}
                >
                  Status: {results[test.name].status.toUpperCase()}
                </Text>

                {results[test.name].data && (
                  <ScrollView horizontal style={styles.dataContainer}>
                    <Text style={styles.data}>
                      {JSON.stringify(results[test.name].data, null, 2)}
                    </Text>
                  </ScrollView>
                )}

                {results[test.name].error && (
                  <Text style={styles.errorText}>{results[test.name].error}</Text>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: "#555",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  testCard: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  testHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  testName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  smallButton: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  result: {
    marginTop: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  success: {
    color: "#4CAF50",
  },
  error: {
    color: "#F44336",
  },
  running: {
    color: "#FFC107",
  },
  dataContainer: {
    maxHeight: 200,
  },
  data: {
    fontSize: 12,
    color: "#4CAF50",
    fontFamily: "monospace",
  } as const,
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginTop: 4,
  },
});
