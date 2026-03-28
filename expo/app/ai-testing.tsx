import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { Play, Trash2, Users, MessageSquare, Heart, Sparkles, CheckCircle2 } from 'lucide-react-native';

export default function AITestingScreen() {
  const insets = useSafeAreaInsets();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [profileCount, setProfileCount] = useState('20');
  const [interactionDensity, setInteractionDensity] = useState<'sparse' | 'moderate' | 'high'>('moderate');

  const runFullSuiteMutation = trpc.r3al.testing.runFullSuite.useMutation();
  const cleanupMutation = trpc.r3al.testing.cleanup.useMutation();
  const generateProfilesMutation = trpc.r3al.testing.generateProfiles.useMutation();
  const generateFeedMutation = trpc.r3al.testing.generateFeed.useMutation();
  const generateInteractionsMutation = trpc.r3al.testing.generateInteractions.useMutation();
  const testMatchingMutation = trpc.r3al.testing.testMatching.useMutation();

  const handleRunFullSuite = async () => {
    try {
      setIsRunning(true);
      setTestResults(null);

      console.log('[AI Testing UI] Starting full test suite...');
      
      const result = await runFullSuiteMutation.mutateAsync({
        profileCount: parseInt(profileCount) || 20,
        includeMatching: true,
        includeFeed: true,
        includeInteractions: true,
        interactionDensity,
        cleanupFirst: true
      });

      console.log('[AI Testing UI] Test suite complete:', result);
      setTestResults(result);
      
      Alert.alert(
        'Test Suite Complete!',
        `Created ${result.summary.profiles} profiles, ${result.summary.posts} posts, ${result.summary.interactions} interactions, and ${result.summary.matches} matches in ${result.summary.duration}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('[AI Testing UI] Error:', error);
      Alert.alert('Error', `Test suite failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCleanup = async () => {
    Alert.alert(
      'Confirm Cleanup',
      'This will delete all test profiles, posts, and interactions. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsRunning(true);
              await cleanupMutation.mutateAsync({
                confirmDeletion: true,
                deleteProfiles: true,
                deletePosts: true,
                deleteInteractions: true,
                deleteMatches: true
              });
              setTestResults(null);
              Alert.alert('Success', 'Test data cleaned up successfully');
            } catch (error) {
              Alert.alert('Error', `Cleanup failed: ${error}`);
            } finally {
              setIsRunning(false);
            }
          }
        }
      ]
    );
  };

  const handleGenerateProfiles = async () => {
    try {
      setIsRunning(true);
      const result = await generateProfilesMutation.mutateAsync({
        count: parseInt(profileCount) || 20,
        profileTypes: ['high_truth', 'moderate_truth', 'low_truth', 'ideal_match'],
        demographicMix: true,
        includeMatching: false
      });
      Alert.alert('Success', `Created ${result.count} test profiles`);
    } catch (error) {
      Alert.alert('Error', `Failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleGenerateFeed = async () => {
    try {
      setIsRunning(true);
      const result = await generateFeedMutation.mutateAsync({
        count: 5,
        forAllTestProfiles: true,
        contentTypes: ['authentic_sharing', 'questions', 'vulnerability', 'daily_life']
      });
      Alert.alert('Success', `Created ${result.totalPosts} posts`);
    } catch (error) {
      Alert.alert('Error', `Failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleGenerateInteractions = async () => {
    try {
      setIsRunning(true);
      const result = await generateInteractionsMutation.mutateAsync({
        testProfilesOnly: true,
        interactionDensity,
        includeComments: true,
        naturalPatterns: true
      });
      Alert.alert('Success', `Created ${result.totalInteractions} interactions`);
    } catch (error) {
      Alert.alert('Error', `Failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleTestMatching = async () => {
    try {
      setIsRunning(true);
      const result = await testMatchingMutation.mutateAsync({
        testAllProfiles: true,
        minCompatibility: 60,
        generateConversations: false
      });
      Alert.alert('Success', `Generated ${result.totalMatches} matches`);
    } catch (error) {
      Alert.alert('Error', `Failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'AI Testing Suite',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff'
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.header}>
          <Sparkles size={32} color="#00ff88" />
          <Text style={styles.title}>AI-Powered Testing</Text>
          <Text style={styles.subtitle}>
            Generate realistic test profiles with AI to test matching, feed, and interactions
          </Text>
        </View>

        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>Configuration</Text>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Profile Count:</Text>
            <TextInput
              style={styles.input}
              value={profileCount}
              onChangeText={setProfileCount}
              keyboardType="number-pad"
              placeholder="20"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Interaction Density:</Text>
            <View style={styles.segmentedControl}>
              {(['sparse', 'moderate', 'high'] as const).map((density) => (
                <TouchableOpacity
                  key={density}
                  style={[
                    styles.segmentButton,
                    interactionDensity === density && styles.segmentButtonActive
                  ]}
                  onPress={() => setInteractionDensity(density)}
                  disabled={isRunning}
                >
                  <Text style={[
                    styles.segmentText,
                    interactionDensity === density && styles.segmentTextActive
                  ]}>
                    {density}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.mainActions}>
          <TouchableOpacity
            style={[styles.primaryButton, isRunning && styles.buttonDisabled]}
            onPress={handleRunFullSuite}
            disabled={isRunning}
          >
            {isRunning ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Play size={24} color="#000" />
                <Text style={styles.primaryButtonText}>Run Full Test Suite</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, isRunning && styles.buttonDisabled]}
            onPress={handleCleanup}
            disabled={isRunning}
          >
            <Trash2 size={20} color="#fff" />
            <Text style={styles.dangerButtonText}>Cleanup Test Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.individualActions}>
          <Text style={styles.sectionTitle}>Individual Tests</Text>
          
          <TouchableOpacity
            style={[styles.actionButton, isRunning && styles.buttonDisabled]}
            onPress={handleGenerateProfiles}
            disabled={isRunning}
          >
            <Users size={20} color="#00ff88" />
            <Text style={styles.actionButtonText}>Generate Profiles Only</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isRunning && styles.buttonDisabled]}
            onPress={handleGenerateFeed}
            disabled={isRunning}
          >
            <MessageSquare size={20} color="#00ff88" />
            <Text style={styles.actionButtonText}>Generate Feed Content</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isRunning && styles.buttonDisabled]}
            onPress={handleGenerateInteractions}
            disabled={isRunning}
          >
            <Heart size={20} color="#00ff88" />
            <Text style={styles.actionButtonText}>Generate Interactions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isRunning && styles.buttonDisabled]}
            onPress={handleTestMatching}
            disabled={isRunning}
          >
            <CheckCircle2 size={20} color="#00ff88" />
            <Text style={styles.actionButtonText}>Test Matching Algorithm</Text>
          </TouchableOpacity>
        </View>

        {testResults && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Test Results</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Users size={24} color="#00ff88" />
                <Text style={styles.statValue}>{testResults.summary.profiles}</Text>
                <Text style={styles.statLabel}>Profiles</Text>
              </View>

              <View style={styles.statCard}>
                <MessageSquare size={24} color="#00ff88" />
                <Text style={styles.statValue}>{testResults.summary.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>

              <View style={styles.statCard}>
                <Heart size={24} color="#00ff88" />
                <Text style={styles.statValue}>{testResults.summary.interactions}</Text>
                <Text style={styles.statLabel}>Interactions</Text>
              </View>

              <View style={styles.statCard}>
                <CheckCircle2 size={24} color="#00ff88" />
                <Text style={styles.statValue}>{testResults.summary.matches}</Text>
                <Text style={styles.statLabel}>Matches</Text>
              </View>
            </View>

            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>Details</Text>
              <Text style={styles.detailsText}>
                Duration: {testResults.summary.duration}
              </Text>
              {testResults.details.profiles && (
                <Text style={styles.detailsText}>
                  Avg Truth Score: {testResults.details.profiles.averageTruthScore.toFixed(1)}
                </Text>
              )}
              {testResults.details.matching && (
                <Text style={styles.detailsText}>
                  High Quality Matches: {testResults.details.matching.excellent}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  configSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  configItem: {
    marginBottom: 16,
  },
  configLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#00ff88',
  },
  segmentText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  segmentTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  mainActions: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#00ff88',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  dangerButton: {
    backgroundColor: '#ff3366',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  individualActions: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#00ff88',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonText: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsSection: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00ff88',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  detailsCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
});
