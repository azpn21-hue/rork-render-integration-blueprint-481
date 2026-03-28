import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Zap, Users, Activity, TrendingUp } from 'lucide-react-native';
import { useMemoryGraph } from '@/app/contexts/MemoryGraphContext';

const { width } = Dimensions.get('window');

export default function MemoryGraphScreen() {
  const {
    emotions,
    pulses,
    interactions,
    isLoadingContext,
    refreshContext,
    logEmotion,
    logPulse,
    findSimilarUsers
  } = useMemoryGraph();

  const [similarUsers, setSimilarUsers] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    refreshContext();
  }, [refreshContext]);

  const handleTestEmotion = async () => {
    const valence = Math.random() * 2 - 1;
    const arousal = Math.random() * 2 - 1;
    await logEmotion(valence, arousal, 'Test emotion from UI');
  };

  const handleTestPulse = async () => {
    const bpm = 60 + Math.random() * 40;
    const resonance = Math.random();
    await logPulse(bpm, resonance);
  };

  const handleFindSimilar = async () => {
    setLoadingSimilar(true);
    try {
      const users = await findSimilarUsers();
      setSimilarUsers(users);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const getEmotionColor = (valence: number, arousal: number) => {
    if (valence > 0.3 && arousal > 0.3) return ['#4CAF50', '#81C784'];
    if (valence < -0.3 && arousal > 0.3) return ['#F44336', '#E57373'];
    if (valence < -0.3 && arousal < -0.3) return ['#2196F3', '#64B5F6'];
    return ['#FF9800', '#FFB74D'];
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Memory Graph Engine',
          headerStyle: { backgroundColor: '#0A0118' },
          headerTintColor: '#00FFFF'
        }} 
      />

      <LinearGradient
        colors={['#0A0118', '#1A0A2E', '#0A0118']}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Brain size={40} color="#00FFFF" />
            <Text style={styles.headerTitle}>240 IQ Memory Engine</Text>
            <Text style={styles.headerSubtitle}>
              Cognitive memory backbone for contextual reasoning
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Zap size={24} color="#FF00FF" />
              <Text style={styles.statValue}>{emotions.length}</Text>
              <Text style={styles.statLabel}>Emotions</Text>
            </View>

            <View style={styles.statCard}>
              <Activity size={24} color="#00FFFF" />
              <Text style={styles.statValue}>{pulses.length}</Text>
              <Text style={styles.statLabel}>Pulses</Text>
            </View>

            <View style={styles.statCard}>
              <Users size={24} color="#FFD700" />
              <Text style={styles.statValue}>{interactions.length}</Text>
              <Text style={styles.statLabel}>Interactions</Text>
            </View>
          </View>

          <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>Test Memory Logging</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleTestEmotion}
            >
              <LinearGradient
                colors={['#FF00FF', '#8B00FF']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Zap size={20} color="#FFF" />
                <Text style={styles.buttonText}>Log Test Emotion</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleTestPulse}
            >
              <LinearGradient
                colors={['#00FFFF', '#0080FF']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Activity size={20} color="#FFF" />
                <Text style={styles.buttonText}>Log Test Pulse</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleFindSimilar}
              disabled={loadingSimilar}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loadingSimilar ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <TrendingUp size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Find Similar Users</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {isLoadingContext && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#00FFFF" size="large" />
              <Text style={styles.loadingText}>Loading memory graph...</Text>
            </View>
          )}

          {emotions.length > 0 && (
            <View style={styles.dataSection}>
              <Text style={styles.sectionTitle}>Recent Emotions</Text>
              {emotions.map((emotion, index) => {
                const colors = getEmotionColor(emotion.valence, emotion.arousal);
                return (
                  <View key={emotion.id || index} style={styles.dataCard}>
                    <LinearGradient
                      colors={colors}
                      style={styles.emotionIndicator}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    <View style={styles.dataContent}>
                      <Text style={styles.dataTitle}>{emotion.context}</Text>
                      <Text style={styles.dataDetail}>
                        Valence: {emotion.valence.toFixed(2)} | Arousal: {emotion.arousal.toFixed(2)}
                      </Text>
                      <Text style={styles.dataTime}>
                        {new Date(emotion.timestamp).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {pulses.length > 0 && (
            <View style={styles.dataSection}>
              <Text style={styles.sectionTitle}>Recent Pulses</Text>
              {pulses.map((pulse, index) => (
                <View key={pulse.id || index} style={styles.dataCard}>
                  <LinearGradient
                    colors={['#00FFFF', '#0080FF']}
                    style={styles.emotionIndicator}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                  <View style={styles.dataContent}>
                    <Text style={styles.dataTitle}>Pulse Event</Text>
                    <Text style={styles.dataDetail}>
                      BPM: {pulse.bpm.toFixed(0)} | Resonance: {pulse.resonance_index.toFixed(2)}
                    </Text>
                    <Text style={styles.dataTime}>
                      {new Date(pulse.timestamp).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {similarUsers.length > 0 && (
            <View style={styles.dataSection}>
              <Text style={styles.sectionTitle}>Similar Users</Text>
              {similarUsers.map((user, index) => (
                <View key={user.id || index} style={styles.dataCard}>
                  <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    style={styles.emotionIndicator}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                  <View style={styles.dataContent}>
                    <Text style={styles.dataTitle}>User {user.user_id.slice(0, 8)}</Text>
                    <Text style={styles.dataDetail}>
                      Similarity: {(1 - user.distance).toFixed(3)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Memory Graph Engine v2.41
            </Text>
            <Text style={styles.footerSubtext}>
              Persistent contextual memory for 240 IQ reasoning
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0118'
  },
  gradient: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 16
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#AAA',
    marginTop: 8,
    textAlign: 'center' as const
  },
  statsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.2)'
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 8
  },
  statLabel: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 4
  },
  actionSection: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFF',
    marginBottom: 16
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden'
  },
  buttonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32
  },
  loadingText: {
    color: '#AAA',
    marginTop: 12,
    fontSize: 14
  },
  dataSection: {
    marginBottom: 24
  },
  dataCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  emotionIndicator: {
    height: 4,
    width: '100%'
  },
  dataContent: {
    padding: 16
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
    marginBottom: 4
  },
  dataDetail: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 4
  },
  dataTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16
  },
  footerText: {
    fontSize: 14,
    color: '#00FFFF',
    fontWeight: '600' as const
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  }
});
