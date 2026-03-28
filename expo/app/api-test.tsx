import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ApiTestPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [results, setResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState(false);

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://localhost:10000";
      }
      return window.location.origin;
    }
    return "http://localhost:10000";
  };

  const tests = [
    { name: 'Root', url: '/' },
    { name: 'Health', url: '/health' },
    { name: 'tRPC Health', url: '/api/trpc/health' },
    { name: 'tRPC Example Hi', url: '/api/trpc/example.hi' },
    { name: 'tRPC R3AL Tokens Balance', url: '/api/trpc/r3al.tokens.getBalance?input=%7B%22json%22%3Anull%7D' },
  ];

  const runTest = async (test: typeof tests[0]) => {
    const baseUrl = getBaseUrl();
    const fullUrl = `${baseUrl}${test.url}`;
    
    console.log(`[API Test] Testing: ${test.name} at ${fullUrl}`);
    
    try {
      const response = await fetch(fullUrl);
      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      
      return {
        status: response.status,
        ok: response.ok,
        data,
      };
    } catch (error: any) {
      return {
        status: 0,
        ok: false,
        error: error.message,
      };
    }
  };

  const runAllTests = useCallback(async () => {
    setTesting(true);
    setResults({});
    
    const newResults: Record<string, any> = {};
    
    for (const test of tests) {
      const result = await runTest(test);
      newResults[test.name] = result;
      setResults({ ...newResults });
    }
    
    setTesting(false);
  }, []);

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>API Connection Test</Text>
        <Text style={styles.subtitle}>Base URL: {getBaseUrl()}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, testing && styles.buttonDisabled]} 
        onPress={runAllTests}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'Testing...' : 'Run Tests Again'}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.results}>
        {tests.map((test) => {
          const result = results[test.name];
          
          return (
            <View key={test.name} style={styles.testResult}>
              <View style={styles.testHeader}>
                <Text style={styles.testName}>{test.name}</Text>
                {result && (
                  <View style={[
                    styles.statusBadge,
                    result.ok ? styles.statusSuccess : styles.statusError
                  ]}>
                    <Text style={styles.statusText}>
                      {result.status || 'ERR'}
                    </Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.testUrl}>{test.url}</Text>
              
              {result && (
                <View style={styles.resultData}>
                  <Text style={styles.resultLabel}>Response:</Text>
                  <Text style={styles.resultText}>
                    {JSON.stringify(result, null, 2)}
                  </Text>
                </View>
              )}
              
              {!result && testing && (
                <Text style={styles.loadingText}>Testing...</Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace' as const,
  },
  button: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  results: {
    flex: 1,
    padding: 16,
  },
  testResult: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusSuccess: {
    backgroundColor: '#4CAF50',
  },
  statusError: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  testUrl: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace' as const,
    marginBottom: 12,
  },
  resultData: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 4,
    color: '#333',
  },
  resultText: {
    fontSize: 11,
    fontFamily: 'monospace' as const,
    color: '#666',
  },
  loadingText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic' as const,
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
});
