import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, X, Activity } from "lucide-react-native";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error";
  message?: string;
}

export default function TestFeatures() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const updateResult = (name: string, status: "pending" | "success" | "error", message?: string) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        return prev.map(r => r.name === name ? { name, status, message } : r);
      }
      return [...prev, { name, status, message }];
    });
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    // Test 1: Health Check
    updateResult("Health Check", "pending");
    try {
      const health = await trpc.health.query();
      updateResult("Health Check", "success", JSON.stringify(health));
    } catch (error: any) {
      updateResult("Health Check", "error", error.message);
    }

    // Test 2: Token Balance
    updateResult("Token Balance", "pending");
    try {
      const balance = await trpc.r3al.tokens.getBalance.query();
      updateResult("Token Balance", "success", `Balance: ${balance.balance.available}`);
    } catch (error: any) {
      updateResult("Token Balance", "error", error.message);
    }

    // Test 3: QOTD Get Daily
    updateResult("QOTD Get Daily", "pending");
    try {
      const qotd = await trpc.r3al.qotd.getDaily.query();
      updateResult("QOTD Get Daily", "success", `Question: ${qotd.question.prompt.substring(0, 50)}...`);
    } catch (error: any) {
      updateResult("QOTD Get Daily", "error", error.message);
    }

    // Test 4: QOTD Stats
    updateResult("QOTD Stats", "pending");
    try {
      const stats = await trpc.r3al.qotd.getStats.query();
      updateResult("QOTD Stats", "success", `Streak: ${stats.currentStreak}, Tokens: ${stats.totalTokensEarned}`);
    } catch (error: any) {
      updateResult("QOTD Stats", "error", error.message);
    }

    // Test 5: Profile Get
    updateResult("Profile Get", "pending");
    try {
      const profile = await trpc.r3al.profile.getProfile.query({ userId: "test-user" });
      updateResult("Profile Get", "success", `Profile: ${profile.profile.name}`);
    } catch (error: any) {
      updateResult("Profile Get", "error", error.message);
    }

    // Test 6: Optima Health
    updateResult("Optima Health", "pending");
    try {
      const optima = await trpc.r3al.optima.health.query();
      updateResult("Optima Health", "success", `Status: ${optima.status}`);
    } catch (error: any) {
      updateResult("Optima Health", "error", error.message);
    }

    setTesting(false);
    Alert.alert("Tests Complete", `Passed: ${results.filter(r => r.status === "success").length}/${results.length}`);
  };

  const getStatusIcon = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "success":
        return <Check size={20} color="#10B981" strokeWidth={2} />;
      case "error":
        return <X size={20} color="#EF4444" strokeWidth={2} />;
      case "pending":
        return <Activity size={20} color="#F59E0B" strokeWidth={2} />;
    }
  };

  const getStatusColor = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "pending":
        return "#F59E0B";
    }
  };

  return (
    <LinearGradient colors={[tokens.colors.background, tokens.colors.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feature Tests</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🧪 Backend Connectivity Test</Text>
            <Text style={styles.infoText}>
              This will test all major features to ensure backend connectivity.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.testButton, testing && styles.testButtonDisabled]}
            onPress={runTests}
            disabled={testing}
            activeOpacity={0.7}
          >
            <Text style={styles.testButtonText}>{testing ? "Testing..." : "Run All Tests"}</Text>
          </TouchableOpacity>

          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Test Results:</Text>
            {results.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No tests run yet</Text>
              </View>
            ) : (
              results.map((result, index) => (
                <View key={index} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    {getStatusIcon(result.status)}
                    <Text style={styles.resultName}>{result.name}</Text>
                  </View>
                  {result.message && (
                    <View style={[styles.resultMessage, { borderLeftColor: getStatusColor(result.status) }]}>
                      <Text style={styles.resultMessageText}>{result.message}</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
  },
  testButton: {
    backgroundColor: tokens.colors.gold,
    padding: 18,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
    marginBottom: 24,
  },
  testButtonDisabled: {
    opacity: 0.5,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
  resultsSection: {
    gap: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: tokens.colors.surface,
    padding: 40,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  resultCard: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
  },
  resultHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.text,
    flex: 1,
  },
  resultMessage: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "20",
    borderLeftWidth: 3,
    paddingLeft: 12,
  },
  resultMessageText: {
    fontSize: 13,
    color: tokens.colors.textSecondary,
    lineHeight: 18,
  },
});
