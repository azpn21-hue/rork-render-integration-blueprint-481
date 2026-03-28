import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: any;
}

export default function BackendDiagnostic() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'https://a-wozcefc4wlzlbxsknqi3r.rorktest.dev';

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    diagnostics.push({
      name: 'Configuration',
      status: 'success',
      message: `Backend URL: ${baseUrl}`,
      details: {
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
        environment: process.env.NODE_ENV || 'development',
      }
    });

    try {
      console.log('[Diagnostic] Testing root endpoint...');
      const rootResponse = await fetch(baseUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (rootResponse.ok) {
        const rootData = await rootResponse.json();
        diagnostics.push({
          name: 'Root Endpoint (/)',
          status: 'success',
          message: 'Backend is reachable',
          details: rootData,
        });
      } else {
        diagnostics.push({
          name: 'Root Endpoint (/)',
          status: 'error',
          message: `HTTP ${rootResponse.status}: ${rootResponse.statusText}`,
        });
      }
    } catch (error: any) {
      diagnostics.push({
        name: 'Root Endpoint (/)',
        status: 'error',
        message: error.message || 'Connection failed',
      });
    }

    try {
      console.log('[Diagnostic] Testing health endpoint...');
      const healthResponse = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        diagnostics.push({
          name: 'Health Endpoint (/health)',
          status: 'success',
          message: 'Health check passed',
          details: healthData,
        });
      } else {
        diagnostics.push({
          name: 'Health Endpoint (/health)',
          status: 'error',
          message: `HTTP ${healthResponse.status}: ${healthResponse.statusText}`,
        });
      }
    } catch (error: any) {
      diagnostics.push({
        name: 'Health Endpoint (/health)',
        status: 'error',
        message: error.message || 'Connection failed',
      });
    }

    try {
      console.log('[Diagnostic] Testing routes endpoint...');
      const routesResponse = await fetch(`${baseUrl}/api/routes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (routesResponse.ok) {
        const routesData = await routesResponse.json();
        diagnostics.push({
          name: 'Routes Endpoint (/api/routes)',
          status: 'success',
          message: `Found ${routesData.count} total routes, ${routesData.r3alCount} R3AL routes`,
          details: {
            totalRoutes: routesData.count,
            r3alRoutes: routesData.r3alCount,
            sampleRoutes: routesData.r3alRoutes?.slice(0, 5) || [],
          },
        });
      } else {
        const errorText = await routesResponse.text().catch(() => 'Unknown error');
        diagnostics.push({
          name: 'Routes Endpoint (/api/routes)',
          status: 'error',
          message: `HTTP ${routesResponse.status}: ${errorText.substring(0, 100)}`,
        });
      }
    } catch (error: any) {
      diagnostics.push({
        name: 'Routes Endpoint (/api/routes)',
        status: 'error',
        message: error.message || 'Connection failed',
      });
    }

    try {
      console.log('[Diagnostic] Testing tRPC health endpoint...');
      const trpcHealthUrl = `${baseUrl}/api/trpc/health?input=${encodeURIComponent(JSON.stringify({ json: null }))}`;
      const trpcHealthResponse = await fetch(trpcHealthUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (trpcHealthResponse.ok) {
        const trpcHealthData = await trpcHealthResponse.json();
        diagnostics.push({
          name: 'tRPC Health Route',
          status: 'success',
          message: 'tRPC is working correctly',
          details: trpcHealthData,
        });
      } else {
        const errorText = await trpcHealthResponse.text().catch(() => 'Unknown error');
        diagnostics.push({
          name: 'tRPC Health Route',
          status: 'error',
          message: `HTTP ${trpcHealthResponse.status}: ${errorText.substring(0, 100)}`,
        });
      }
    } catch (error: any) {
      diagnostics.push({
        name: 'tRPC Health Route',
        status: 'error',
        message: error.message || 'Connection failed',
      });
    }

    try {
      console.log('[Diagnostic] Testing tRPC verification endpoint...');
      const trpcVerificationUrl = `${baseUrl}/api/trpc/r3al.verification.getStatus?input=${encodeURIComponent(JSON.stringify({ json: null, meta: { values: ['undefined'], v: 1 } }))}`;
      const trpcVerificationResponse = await fetch(trpcVerificationUrl, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-user-123',
        },
      });
      
      if (trpcVerificationResponse.ok) {
        const trpcVerificationData = await trpcVerificationResponse.json();
        diagnostics.push({
          name: 'tRPC Verification Route (r3al.verification.getStatus)',
          status: 'success',
          message: 'R3AL verification route is working',
          details: trpcVerificationData,
        });
      } else {
        const errorText = await trpcVerificationResponse.text().catch(() => 'Unknown error');
        diagnostics.push({
          name: 'tRPC Verification Route (r3al.verification.getStatus)',
          status: 'error',
          message: `HTTP ${trpcVerificationResponse.status}: ${errorText.substring(0, 100)}`,
        });
      }
    } catch (error: any) {
      diagnostics.push({
        name: 'tRPC Verification Route (r3al.verification.getStatus)',
        status: 'error',
        message: error.message || 'Connection failed',
      });
    }

    setResults(diagnostics);
    setIsRunning(false);
  }, [baseUrl]);

  useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={24} color="#00ff9d" />;
      case 'error':
        return <XCircle size={24} color="#ff0055" />;
      case 'warning':
        return <AlertCircle size={24} color="#ffaa00" />;
      case 'loading':
        return <ActivityIndicator size="small" color="#00d4ff" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return '#00ff9d';
      case 'error':
        return '#ff0055';
      case 'warning':
        return '#ffaa00';
      case 'loading':
        return '#00d4ff';
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Backend Diagnostics',
          headerStyle: { backgroundColor: '#0a0a14' },
          headerTintColor: '#00d4ff',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#00d4ff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={runDiagnostics} disabled={isRunning}>
              <RefreshCw size={24} color={isRunning ? '#666' : '#00d4ff'} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Backend Connection Diagnostic</Text>
          <Text style={styles.subtitle}>
            Testing connection to {baseUrl}
          </Text>
        </View>

        {isRunning && results.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00d4ff" />
            <Text style={styles.loadingText}>Running diagnostics...</Text>
          </View>
        )}

        {results.map((result, index) => (
          <View key={index} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              {getStatusIcon(result.status)}
              <Text style={styles.resultName}>{result.name}</Text>
            </View>
            <Text style={[styles.resultMessage, { color: getStatusColor(result.status) }]}>
              {result.message}
            </Text>
            {result.details && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Details:</Text>
                <Text style={styles.detailsText}>
                  {JSON.stringify(result.details, null, 2)}
                </Text>
              </View>
            )}
          </View>
        ))}

        {results.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>
              ✅ Passed: {results.filter(r => r.status === 'success').length}
            </Text>
            <Text style={styles.summaryText}>
              ❌ Failed: {results.filter(r => r.status === 'error').length}
            </Text>
            <Text style={styles.summaryText}>
              ⚠️ Warnings: {results.filter(r => r.status === 'warning').length}
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What to do if tests fail:</Text>
          <Text style={styles.infoText}>
            1. Check that the backend is deployed to the Rork platform
          </Text>
          <Text style={styles.infoText}>
            2. Verify the EXPO_PUBLIC_RORK_API_BASE_URL in .env is correct
          </Text>
          <Text style={styles.infoText}>
            3. Ensure the backend/hono.ts file is properly exported
          </Text>
          <Text style={styles.infoText}>
            4. Check backend logs for initialization errors
          </Text>
          <Text style={styles.infoText}>
            5. Contact Rork support if the issue persists
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
  },
  backButton: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8892b0',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8892b0',
  },
  resultCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  resultMessage: {
    fontSize: 14,
    marginLeft: 36,
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#0f0f1a',
    borderRadius: 8,
    marginLeft: 36,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8892b0',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 11,
    color: '#8892b0',
    fontFamily: 'monospace',
  },
  summaryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffaa00',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#8892b0',
    marginBottom: 8,
    lineHeight: 20,
  },
});
