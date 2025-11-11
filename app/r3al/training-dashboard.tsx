import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { AlertCircle, CheckCircle, Clock, Play, RefreshCw, TrendingUp } from 'lucide-react-native';

export default function TrainingDashboardScreen() {
  const [selectedModelType, setSelectedModelType] = useState<'policy' | 'empathy' | 'timing' | 'tone'>('policy');
  const [trainingEpochs, setTrainingEpochs] = useState<string>('50');
  const [syntheticSamples, setSyntheticSamples] = useState<string>('500');

  const { data: modelsData, refetch: refetchModels } = trpc.r3al.training.getModelVersions.useQuery();
  const trainModelMutation = trpc.r3al.training.trainModel.useMutation();
  const deployModelMutation = trpc.r3al.training.deployModel.useMutation();
  const { data: monitoringData } = trpc.r3al.training.monitorModel.useQuery(
    { versionId: modelsData?.versions.find((v) => v.status === 'deployed')?.versionId || '' },
    { enabled: !!modelsData?.versions.find((v) => v.status === 'deployed') }
  );

  const handleTrain = async () => {
    try {
      const result = await trainModelMutation.mutateAsync({
        modelType: selectedModelType,
        sourceDataType: 'pulse',
        epochs: parseInt(trainingEpochs) || 50,
        syntheticSamples: parseInt(syntheticSamples) || 500,
      });

      console.log('[Training Dashboard] Training complete:', result);
      refetchModels();
    } catch (error) {
      console.error('[Training Dashboard] Training failed:', error);
    }
  };

  const handleDeploy = async (versionId: string) => {
    try {
      const result = await deployModelMutation.mutateAsync({
        versionId,
        deploymentType: 'full_rollout',
        trafficPercentage: 100,
      });

      console.log('[Training Dashboard] Deployment result:', result);
      refetchModels();
    } catch (error) {
      console.error('[Training Dashboard] Deployment failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training':
        return '#FF6B6B';
      case 'evaluating':
        return '#FFA500';
      case 'deployed':
        return '#51CF66';
      case 'archived':
        return '#868E96';
      default:
        return '#868E96';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'training':
        return <Clock size={16} color="#FF6B6B" />;
      case 'evaluating':
        return <AlertCircle size={16} color="#FFA500" />;
      case 'deployed':
        return <CheckCircle size={16} color="#51CF66" />;
      default:
        return <Clock size={16} color="#868E96" />;
    }
  };

  const getHealthColor = (health?: string) => {
    switch (health) {
      case 'healthy':
        return '#51CF66';
      case 'degraded':
        return '#FFA500';
      case 'critical':
        return '#FF6B6B';
      default:
        return '#868E96';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ title: '240 IQ Training Loop', headerShown: true }} />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Synthetic Training Loop</Text>
          <Text style={styles.subtitle}>Contextual RL & Model Management</Text>
        </View>

        {monitoringData && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>System Health</Text>
            <View style={styles.healthContainer}>
              <View
                style={[
                  styles.healthBadge,
                  { backgroundColor: getHealthColor(monitoringData.health) + '20' },
                ]}
              >
                <Text style={[styles.healthText, { color: getHealthColor(monitoringData.health) }]}>
                  {monitoringData.health?.toUpperCase() || 'UNKNOWN'}
                </Text>
              </View>

              {monitoringData.metrics && (
                <View style={styles.metricsGrid}>
                  {monitoringData.metrics.empathyScore !== undefined && (
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Empathy</Text>
                      <Text style={styles.metricValue}>
                        {(monitoringData.metrics.empathyScore * 100).toFixed(1)}%
                      </Text>
                    </View>
                  )}
                  {monitoringData.metrics.falseInterventionRate !== undefined && (
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>FIR</Text>
                      <Text style={styles.metricValue}>
                        {(monitoringData.metrics.falseInterventionRate * 100).toFixed(1)}%
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {monitoringData.recommendations && monitoringData.recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                {monitoringData.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.recommendationText}>
                    • {rec}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Train New Model</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Model Type</Text>
            <View style={styles.buttonRow}>
              {(['policy', 'empathy', 'timing', 'tone'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    selectedModelType === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setSelectedModelType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedModelType === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Epochs</Text>
            <TextInput
              style={styles.input}
              value={trainingEpochs}
              onChangeText={setTrainingEpochs}
              keyboardType="number-pad"
              placeholder="50"
              placeholderTextColor="#868E96"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Synthetic Samples</Text>
            <TextInput
              style={styles.input}
              value={syntheticSamples}
              onChangeText={setSyntheticSamples}
              keyboardType="number-pad"
              placeholder="500"
              placeholderTextColor="#868E96"
            />
          </View>

          <TouchableOpacity
            style={[styles.trainButton, trainModelMutation.isLoading && styles.trainButtonDisabled]}
            onPress={handleTrain}
            disabled={trainModelMutation.isLoading}
          >
            {trainModelMutation.isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Play size={20} color="#FFFFFF" />
                <Text style={styles.trainButtonText}>Start Training</Text>
              </>
            )}
          </TouchableOpacity>

          {trainModelMutation.isSuccess && trainModelMutation.data && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Training Complete!</Text>
              <Text style={styles.resultText}>
                Version: {trainModelMutation.data.version.versionTag}
              </Text>
              <Text style={styles.resultText}>
                Real Samples: {trainModelMutation.data.dataSummary.realSamples}
              </Text>
              <Text style={styles.resultText}>
                Synthetic: {trainModelMutation.data.dataSummary.syntheticSamples}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Model Versions</Text>
            <TouchableOpacity onPress={() => refetchModels()} style={styles.refreshButton}>
              <RefreshCw size={20} color="#4DABF7" />
            </TouchableOpacity>
          </View>

          {modelsData?.versions && modelsData.versions.length > 0 ? (
            modelsData.versions.map((version) => (
              <View key={version.versionId} style={styles.versionCard}>
                <View style={styles.versionHeader}>
                  <View style={styles.versionInfo}>
                    {getStatusIcon(version.status)}
                    <Text style={styles.versionTag}>{version.versionTag}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(version.status) + '20' },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(version.status) }]}>
                      {version.status}
                    </Text>
                  </View>
                </View>

                {version.metrics && (
                  <View style={styles.versionMetrics}>
                    {version.metrics.empathyScore !== undefined && (
                      <View style={styles.versionMetricItem}>
                        <Text style={styles.versionMetricLabel}>Empathy</Text>
                        <Text style={styles.versionMetricValue}>
                          {(version.metrics.empathyScore * 100).toFixed(1)}%
                        </Text>
                      </View>
                    )}
                    {version.metrics.falseInterventionRate !== undefined && (
                      <View style={styles.versionMetricItem}>
                        <Text style={styles.versionMetricLabel}>FIR</Text>
                        <Text style={styles.versionMetricValue}>
                          {(version.metrics.falseInterventionRate * 100).toFixed(1)}%
                        </Text>
                      </View>
                    )}
                    {version.metrics.rewardStability !== undefined && (
                      <View style={styles.versionMetricItem}>
                        <Text style={styles.versionMetricLabel}>Stability</Text>
                        <Text style={styles.versionMetricValue}>
                          {(version.metrics.rewardStability * 100).toFixed(1)}%
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {version.status === 'evaluating' && (
                  <TouchableOpacity
                    style={styles.deployButton}
                    onPress={() => handleDeploy(version.versionId)}
                    disabled={deployModelMutation.isLoading}
                  >
                    {deployModelMutation.isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <TrendingUp size={16} color="#FFFFFF" />
                        <Text style={styles.deployButtonText}>Deploy</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No model versions yet. Train your first model above!</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Synthetic Training Loop</Text>
          <Text style={styles.infoText}>
            This system enables continuous AI learning while preserving user privacy through:
          </Text>
          <Text style={styles.infoPoint}>• Data anonymization with differential privacy</Text>
          <Text style={styles.infoPoint}>• Synthetic data generation (VAE, Diffusion, GAN)</Text>
          <Text style={styles.infoPoint}>• Reinforcement learning policy training</Text>
          <Text style={styles.infoPoint}>• Contextual reward modeling</Text>
          <Text style={styles.infoPoint}>• A/B testing and safe rollouts</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#868E96',
  },
  card: {
    backgroundColor: '#1A1F3A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  refreshButton: {
    padding: 8,
  },
  healthContainer: {
    gap: 16,
  },
  healthBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  healthText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#0A0E27',
    padding: 12,
    borderRadius: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#868E96',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#4DABF7',
  },
  recommendationsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFA50020',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFA500',
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFA500',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 13,
    color: '#FFA500',
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#0A0E27',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#4DABF7',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#868E96',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#0A0E27',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#FFFFFF',
  },
  trainButton: {
    backgroundColor: '#4DABF7',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trainButtonDisabled: {
    opacity: 0.6,
  },
  trainButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  resultContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#51CF6620',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#51CF66',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#51CF66',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 13,
    color: '#51CF66',
    marginBottom: 2,
  },
  versionCard: {
    backgroundColor: '#0A0E27',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  versionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  versionTag: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  versionMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  versionMetricItem: {
    flex: 1,
  },
  versionMetricLabel: {
    fontSize: 11,
    color: '#868E96',
    marginBottom: 2,
  },
  versionMetricValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#4DABF7',
  },
  deployButton: {
    backgroundColor: '#51CF66',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deployButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 14,
    color: '#868E96',
    textAlign: 'center',
    padding: 24,
  },
  infoCard: {
    backgroundColor: '#1A1F3A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#868E96',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoPoint: {
    fontSize: 13,
    color: '#868E96',
    marginBottom: 6,
    lineHeight: 18,
  },
});
