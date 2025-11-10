import React, { useRef, useState } from 'react';
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

type TestDefinition = {
  name: string;
  executor: () => Promise<void>;
};

const testUserId = 'system-test-user';

export default function SystemTestPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const testsRef = useRef<TestResult[]>([]);

  const updateTest = (name: string, status: TestResult['status'], message?: string, duration?: number) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      const updated = existing
        ? prev.map(t => (t.name === name ? { ...t, status, message, duration } : t))
        : [...prev, { name, status, message, duration }];
      testsRef.current = updated;
      return updated;
    });
  };

  const runTest = async (name: string, testFn: () => Promise<void>) => {
    const startTime = Date.now();
    console.log(`[SystemTest] Starting ${name}`);
    updateTest(name, 'pending');
    try {
      await testFn();
      const duration = Date.now() - startTime;
      console.log(`[SystemTest] ✅ ${name} (${duration}ms)`);
      updateTest(name, 'success', 'Passed', duration);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`[SystemTest] ❌ ${name}`, error);
      updateTest(name, 'error', error.message || 'Failed', duration);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    testsRef.current = [];
    setTests([]);

    console.log('🧪 Starting comprehensive system test run');

    const backendBaseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'http://localhost:10000';
    const signatureTemplate = Array.from({ length: 20 }, (_, index) => 58 + index);

    const testDefinitions: TestDefinition[] = [
      {
        name: 'Backend Health',
        executor: async () => {
          const response = await fetch(`${backendBaseUrl}/health`);
          if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
          const payload = await response.json();
          console.log('[SystemTest] Backend health payload', payload);
        },
      },
      {
        name: 'tRPC Routes',
        executor: async () => {
          const response = await fetch(`${backendBaseUrl}/api/routes`);
          if (!response.ok) throw new Error(`Routes check failed: ${response.status}`);
          const payload = await response.json();
          if (!payload || typeof payload.r3alCount !== 'number') throw new Error('Unexpected routes payload');
          if (payload.r3alCount === 0) throw new Error('No R3AL routes found');
          console.log('[SystemTest] Route counts', payload);
        },
      },
      {
        name: 'Example: Hi',
        executor: async () => {
          const result = await trpcClient.example.hi.query();
          if (!result?.greeting) throw new Error('Greeting missing');
          console.log('[SystemTest] Example greeting', result.greeting);
        },
      },
      {
        name: 'Health Route',
        executor: async () => {
          const result = await trpcClient.health.query();
          if (!result?.status) throw new Error('Status missing');
          console.log('[SystemTest] Health status', result);
        },
      },
      {
        name: 'Verification: Get Status',
        executor: async () => {
          const status = await trpcClient.r3al.verification.getStatus.query();
          if (!status) throw new Error('Verification payload missing');
          console.log('[SystemTest] Verification status payload', status);
        },
      },
      {
        name: 'Profile: Get Profile',
        executor: async () => {
          const profile = await trpcClient.r3al.profile.getProfile.query({ userId: testUserId });
          if (!profile?.success) throw new Error('Profile fetch failed');
          console.log('[SystemTest] Profile payload', profile.profile);
        },
      },
      {
        name: 'Tokens: Get Balance',
        executor: async () => {
          const balance = await trpcClient.r3al.tokens.getBalance.query();
          if (!balance?.success) throw new Error('Token balance fetch failed');
          console.log('[SystemTest] Token balance', balance.balance);
        },
      },
      {
        name: 'QOTD: Get Daily Question',
        executor: async () => {
          const qotd = await trpcClient.r3al.qotd.getDaily.query();
          if (!qotd?.question) throw new Error('Question missing');
          console.log('[SystemTest] QOTD prompt', qotd.question.prompt);
        },
      },
      {
        name: 'Feed: Get Trending',
        executor: async () => {
          const feed = await trpcClient.r3al.feed.getTrending.query({ limit: 5, offset: 0 });
          if (!feed?.posts || feed.posts.length === 0) throw new Error('No trending posts');
          console.log('[SystemTest] Trending feed count', feed.posts.length);
        },
      },
      {
        name: 'Market: Get Summary',
        executor: async () => {
          const summary = await trpcClient.r3al.market.getSummary.query({});
          if (!summary?.success) throw new Error('Market summary fetch failed');
          console.log('[SystemTest] Market summary timestamp', summary.data?.timestamp);
        },
      },
      {
        name: 'AI: Get Insights',
        executor: async () => {
          const insights = await trpcClient.r3al.ai.getInsights.query({ timeframe: 'week' });
          if (!insights?.success) throw new Error('AI insights fetch failed');
          console.log('[SystemTest] AI insights count', insights.insights?.insights?.length ?? 0);
        },
      },
      {
        name: 'Location: Get Local News',
        executor: async () => {
          const news = await trpcClient.r3al.location.getLocalNews.query({ lat: 37.7749, lon: -122.4194, radius: 10, limit: 5 });
          if (!news?.success) throw new Error('Local news fetch failed');
          console.log('[SystemTest] Local news count', news.news.length);
        },
      },
      {
        name: 'DM: Get Conversations',
        executor: async () => {
          const conversations = await trpcClient.r3al.dm.getConversations.query({ userId: testUserId });
          if (!conversations?.success) throw new Error('Conversations fetch failed');
          console.log('[SystemTest] Conversation count', conversations.conversations.length);
        },
      },
      {
        name: 'Match: Get Suggestions',
        executor: async () => {
          const suggestions = await trpcClient.r3al.match.suggest.query();
          if (!suggestions?.success) throw new Error('Match suggestions fetch failed');
          console.log('[SystemTest] Match suggestions count', suggestions.suggestions.length);
        },
      },
      {
        name: 'ML: Get Recommendations',
        executor: async () => {
          const recommendations = await trpcClient.r3al.ml.getRecommendations.query({ userId: testUserId, type: 'matches', limit: 5, includeReasons: true });
          if (!recommendations?.recommendations) throw new Error('Recommendations missing');
          console.log('[SystemTest] Recommendation count', recommendations.recommendations.length);
        },
      },
      {
        name: 'Pulse: Get State',
        executor: async () => {
          const state = await trpcClient.r3al.pulse.getState.query({ userId: testUserId });
          if (!state?.heartbeat) throw new Error('Pulse state missing heartbeat');
          console.log('[SystemTest] Pulse heartbeat', state.heartbeat);
        },
      },
      {
        name: 'Pulse: Update State',
        executor: async () => {
          const response = await trpcClient.r3al.pulse.updateState.mutate({
            emotionalState: 'focused',
            heartbeat: 72,
            interactionData: {
              type: 'activity',
              intensity: 0.6,
              timestamp: new Date().toISOString(),
            },
          });
          if (!response?.success) throw new Error('Pulse update failed');
          console.log('[SystemTest] Pulse update metrics', response.metrics);
        },
      },
      {
        name: 'Pulse: Share Snapshot',
        executor: async () => {
          const share = await trpcClient.r3al.pulse.sharePulse.mutate({
            targetType: 'hive',
            message: 'System test pulse share',
            pulseSnapshot: {
              emotionalState: 'focused',
              heartbeat: 72,
              signature: signatureTemplate,
            },
          });
          if (!share?.success) throw new Error('Pulse share failed');
          console.log('[SystemTest] Pulse share id', share.shareId);
        },
      },
      {
        name: 'History: Log Event',
        executor: async () => {
          const event = await trpcClient.r3al.history.logEvent.mutate({
            eventType: 'pulse_update',
            metadata: {
              context: 'system-test',
              timestamp: new Date().toISOString(),
            },
            duration: 90,
          });
          if (!event?.success) throw new Error('History logging failed');
          console.log('[SystemTest] Logged history event', event.eventId);
        },
      },
      {
        name: 'History: Get History',
        executor: async () => {
          const history = await trpcClient.r3al.history.getHistory.query({ userId: testUserId, limit: 5, offset: 0 });
          if (!history?.events) throw new Error('History fetch failed');
          console.log('[SystemTest] History events returned', history.events.length);
        },
      },
      {
        name: 'History: Get Summary',
        executor: async () => {
          const summary = await trpcClient.r3al.history.getSummary.query({ period: 'week' });
          if (!summary?.summary) throw new Error('History summary missing');
          console.log('[SystemTest] History summary period', summary.period);
        },
      },
      {
        name: 'Hive: Get Connections',
        executor: async () => {
          const hiveConnections = await trpcClient.r3al.hive.getConnections.query({ userId: testUserId, limit: 5, status: 'all' });
          if (!hiveConnections?.connections) throw new Error('Hive connections missing');
          console.log('[SystemTest] Hive connections count', hiveConnections.connections.length);
        },
      },
      {
        name: 'Hive: Generate NFT',
        executor: async () => {
          const nft = await trpcClient.r3al.hive.generateNFT.mutate({
            pulseData: {
              emotionalState: 'focused',
              heartbeat: 72,
              signature: signatureTemplate,
            },
            customization: {
              colorScheme: 'vibrant',
              style: 'abstract',
            },
          });
          if (!nft?.success) throw new Error('NFT generation failed');
          console.log('[SystemTest] Generated NFT id', nft.nftId);
        },
      },
      {
        name: 'Hive: Get NFT',
        executor: async () => {
          const nft = await trpcClient.r3al.hive.getNFT.query({ userId: testUserId });
          if (!nft) throw new Error('Hive NFT payload missing');
          if (nft.hasNFT && !nft.nft) throw new Error('NFT metadata missing');
          console.log('[SystemTest] Hive NFT availability', nft.hasNFT);
        },
      },
    ];

    for (const definition of testDefinitions) {
      console.log(`[SystemTest] ▶️ ${definition.name}`);
      await runTest(definition.name, definition.executor);
    }

    setIsRunning(false);

    const finalResults = testsRef.current;
    const passed = finalResults.filter(item => item.status === 'success').length;
    const failed = finalResults.filter(item => item.status === 'error').length;
    const total = finalResults.length;

    console.log('🎉 Test suite complete!');
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${failed}/${total}`);
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
        <View style={styles.statsContainer} testID="system-test-stats">
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

        <TouchableOpacity
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
          onPress={runAllTests}
          disabled={isRunning}
          testID="system-test-run-all"
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

        <View style={styles.testsContainer} testID="system-test-results">
          {tests.length === 0 && !isRunning && (
            <Text style={styles.emptyText}>Click &quot;Run All Tests&quot; to begin</Text>
          )}
          {tests.map((test, index) => (
            <View key={test.name} style={styles.testItem} testID={`system-test-item-${index}`}>
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
