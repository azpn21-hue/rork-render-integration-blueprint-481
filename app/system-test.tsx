import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { trpcClient } from '@/lib/trpc';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react-native';

type TestResult = {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message?: string;
  duration?: number;
};

export default function SystemTestPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, status: TestResult['status'], message?: string, duration?: number) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { ...t, status, message, duration } : t);
      }
      return [...prev, { name, status, message, duration }];
    });
  };

  const runTest = async (name: string, testFn: () => Promise<void>) => {
    const startTime = Date.now();
    updateTest(name, 'pending');
    try {
      await testFn();
      const duration = Date.now() - startTime;
      updateTest(name, 'success', 'Passed', duration);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateTest(name, 'error', error.message || 'Failed', duration);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    console.log('🧪 Starting comprehensive system test...');

    // Backend Health
    await runTest('Backend Health', async () => {
      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'http://localhost:10000';
      const response = await fetch(`${baseUrl}/health`);
      if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
      const data = await response.json();
      console.log('✅ Backend health:', data);
    });

    // tRPC Routes Available
    await runTest('tRPC Routes', async () => {
      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'http://localhost:10000';
      const response = await fetch(`${baseUrl}/api/routes`);
      if (!response.ok) throw new Error(`Routes check failed: ${response.status}`);
      const data = await response.json();
      if (data.r3alCount === 0) throw new Error('No R3AL routes found');
      console.log('✅ Routes available:', data.count, 'R3AL:', data.r3alCount);
    });

    // Example Route
    await runTest('Example: Hi', async () => {
      const result = await trpcClient.example.hi.query();
      if (!result?.greeting) throw new Error('No greeting received');
      console.log('✅ Example route:', result.greeting);
    });

    // Health Route
    await runTest('Health Route', async () => {
      const result = await trpcClient.health.query();
      if (!result?.status) throw new Error('No status received');
      console.log('✅ Health route:', result);
    });

    // Verification Status
    await runTest('Verification: Get Status', async () => {
      const result = await trpcClient.r3al.verification.getStatus.query();
      console.log('✅ Verification status:', result);
    });

    // Profile: Get Profile
    await runTest('Profile: Get Profile', async () => {
      const result = await trpcClient.r3al.profile.getProfile.query({ userId: 'test-user' });
      console.log('✅ Profile retrieved:', result);
    });

    // Tokens: Get Balance
    await runTest('Tokens: Get Balance', async () => {
      const result = await trpcClient.r3al.tokens.getBalance.query();
      console.log('✅ Token balance:', result);
    });

    // QOTD: Get Daily
    await runTest('QOTD: Get Daily Question', async () => {
      const result = await trpcClient.r3al.qotd.getDaily.query();
      if (!result?.question) throw new Error('No question received');
      console.log('✅ QOTD:', result.question);
    });

    // Feed: Get Trending
    await runTest('Feed: Get Trending', async () => {
      const result = await trpcClient.r3al.feed.getTrending.query({ limit: 5 });
      console.log('✅ Trending posts:', result.length);
    });

    // Market: Get Summary
    await runTest('Market: Get Summary', async () => {
      const result = await trpcClient.r3al.market.getSummary.query();
      console.log('✅ Market summary:', result);
    });

    // AI: Get Insights
    await runTest('AI: Get Insights', async () => {
      const result = await trpcClient.r3al.ai.getInsights.query({ topic: 'test' });
      console.log('✅ AI insights:', result);
    });

    // Location: Get Local News
    await runTest('Location: Get Local News', async () => {
      const result = await trpcClient.r3al.location.getLocalNews.query({ lat: 0, lon: 0, radius: 10 });
      console.log('✅ Local news:', result.length);
    });

    // DM: Get Conversations
    await runTest('DM: Get Conversations', async () => {
      const result = await trpcClient.r3al.dm.getConversations.query();
      console.log('✅ DM conversations:', result.length);
    });

    // Match: Suggest
    await runTest('Match: Get Suggestions', async () => {
      const result = await trpcClient.r3al.match.suggest.query({ limit: 5 });
      console.log('✅ Match suggestions:', result.length);
    });

    // ML: Get Recommendations
    await runTest('ML: Get Recommendations', async () => {
      const result = await trpcClient.r3al.ml.getRecommendations.query({ type: 'users' });
      console.log('✅ ML recommendations:', result.length);
    });

    setIsRunning(false);

    const successCount = tests.filter(t => t.status === 'success').length;
    const errorCount = tests.filter(t => t.status === 'error').length;
    const totalCount = tests.length;

    console.log('🎉 Test suite complete!');
    console.log(`✅ Passed: ${successCount}/${totalCount}`);
    console.log(`❌ Failed: ${errorCount}/${totalCount}`);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    const size = 20;
    switch (status) {
      case 'success':
        return <CheckCircle size={size} color="#10b981" />;
      case 'error':
        return <XCircle size={size} color="#ef4444" />;
      case 'warning':
        return <AlertCircle size={size} color="#f59e0b" />;
      default:
        return <ActivityIndicator size="small" color="#06b6d4" />;
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const totalCount = tests.length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'System Test',
          headerStyle: { backgroundColor: '#0a0a0a' },
          headerTintColor: '#00f0ff',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#00f0ff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Header Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Tests</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#10b981' }]}>{successCount}</Text>
            <Text style={styles.statLabel}>Passed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#ef4444' }]}>{errorCount}</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#00f0ff' }]}>{successRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        {/* Run Button */}
        <TouchableOpacity
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
          onPress={runAllTests}
          disabled={isRunning}
        >
          {isRunning ? (
            <ActivityIndicator color="#000" />
          ) : (
            <RefreshCw size={20} color="#000" />
          )}
          <Text style={styles.runButtonText}>
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Text>
        </TouchableOpacity>

        {/* Test Results */}
        <View style={styles.testsContainer}>
          {tests.length === 0 && !isRunning && (
            <Text style={styles.emptyText}>Click &quot;Run All Tests&quot; to begin</Text>
          )}
          {tests.map((test, index) => (
            <View key={test.name} style={styles.testItem}>
              <View style={styles.testHeader}>
                <View style={styles.testIcon}>
                  {getStatusIcon(test.status)}
                </View>
                <Text style={styles.testName}>{test.name}</Text>
              </View>
              {test.message && (
                <Text style={[
                  styles.testMessage,
                  test.status === 'error' && styles.testMessageError
                ]}>
                  {test.message}
                </Text>
              )}
              {test.duration !== undefined && (
                <Text style={styles.testDuration}>{test.duration}ms</Text>
              )}
            </View>
          ))}
        </View>

        {/* Backend Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Backend Configuration</Text>
          <Text style={styles.infoText}>
            URL: {process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'localhost:10000'}
          </Text>
          <Text style={styles.infoText}>
            Environment: {process.env.NODE_ENV || 'development'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#00f0ff33',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00f0ff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#888',
    textTransform: 'uppercase',
  },
  runButton: {
    backgroundColor: '#00f0ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  runButtonDisabled: {
    opacity: 0.6,
  },
  runButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  testsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  testItem: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00f0ff33',
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  testIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  testMessage: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    marginLeft: 36,
  },
  testMessageError: {
    color: '#ef4444',
  },
  testDuration: {
    fontSize: 10,
    color: '#00f0ff',
    marginTop: 4,
    marginLeft: 36,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    padding: 40,
  },
  infoContainer: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00f0ff33',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00f0ff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});
