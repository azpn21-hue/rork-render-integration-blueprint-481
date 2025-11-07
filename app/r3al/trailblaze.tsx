import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, User, TrendingUp, Clock, MapPin, Heart, MessageCircle, Users, Award, Zap } from 'lucide-react-native';
import { useTrailblaze } from '@/app/contexts/TrailblazeContext';
import React from "react";

export default function TrailblazeScreen() {
  const { 
    isTracking, 
    activities, 
    stats, 
    loadHistory, 
    loadStats, 
    enableTracking, 
    disableTracking,
    ACTIVITY_DISPLAY_NAMES 
  } = useTrailblaze();

  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const userId = 'current_user';

  const loadData = useCallback(() => {
    loadHistory(userId, { limit: 20 });
    loadStats(userId, period);
  }, [period, loadHistory, loadStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      resonate: <Heart size={18} color="#D4AF37" />,
      amplify: <TrendingUp size={18} color="#D4AF37" />,
      witness: <Award size={18} color="#D4AF37" />,
      circle_join: <Users size={18} color="#D4AF37" />,
      dm_sent: <MessageCircle size={18} color="#D4AF37" />,
      post_created: <Activity size={18} color="#D4AF37" />,
      follow_user: <User size={18} color="#D4AF37" />,
      tokens_earned: <Zap size={18} color="#D4AF37" />,
    };
    return iconMap[type] || <Activity size={18} color="#D4AF37" />;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Trailblaze',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#D4AF37',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1a1a1a', '#000']}
          style={styles.header}
        >
          <Text style={styles.title}>Your Digital Trail</Text>
          <Text style={styles.subtitle}>Track your journey through R3AL</Text>

          <View style={styles.trackingControl}>
            <View>
              <Text style={styles.trackingLabel}>Activity Tracking</Text>
              <Text style={styles.trackingDesc}>
                {isTracking ? 'Recording your journey' : 'Paused'}
              </Text>
            </View>
            <Switch
              value={isTracking}
              onValueChange={(value) => value ? enableTracking() : disableTracking()}
              trackColor={{ false: '#333', true: '#D4AF37' }}
              thumbColor="#fff"
            />
          </View>
        </LinearGradient>

        {stats && (
          <View style={styles.statsSection}>
            <View style={styles.periodSelector}>
              {(['day', 'week', 'month', 'all'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.periodButton, period === p && styles.periodButtonActive]}
                  onPress={() => setPeriod(p)}
                >
                  <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Activity size={24} color="#D4AF37" />
                <Text style={styles.statValue}>{stats.stats.totalActivities}</Text>
                <Text style={styles.statLabel}>Total Actions</Text>
              </View>

              <View style={styles.statCard}>
                <Heart size={24} color="#D4AF37" />
                <Text style={styles.statValue}>{stats.stats.resonanceGiven}</Text>
                <Text style={styles.statLabel}>Resonances</Text>
              </View>

              <View style={styles.statCard}>
                <Users size={24} color="#D4AF37" />
                <Text style={styles.statValue}>{stats.stats.circlesJoined}</Text>
                <Text style={styles.statLabel}>Circles</Text>
              </View>

              <View style={styles.statCard}>
                <Zap size={24} color="#D4AF37" />
                <Text style={styles.statValue}>{stats.stats.tokensEarned}</Text>
                <Text style={styles.statLabel}>Tokens Earned</Text>
              </View>
            </View>

            {stats.stats.truthScoreChange !== 0 && (
              <View style={styles.truthScoreChange}>
                <TrendingUp size={20} color={stats.stats.truthScoreChange > 0 ? '#00ff88' : '#ff4444'} />
                <Text style={[
                  styles.truthScoreText,
                  { color: stats.stats.truthScoreChange > 0 ? '#00ff88' : '#ff4444' }
                ]}>
                  Truth Score {stats.stats.truthScoreChange > 0 ? '+' : ''}{stats.stats.truthScoreChange}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {activities.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPin size={48} color="#666" />
              <Text style={styles.emptyText}>No activity recorded yet</Text>
              <Text style={styles.emptySubtext}>
                {isTracking 
                  ? 'Start exploring to build your trail' 
                  : 'Enable tracking to record your journey'}
              </Text>
            </View>
          ) : (
            activities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  {getActivityIcon(activity.activityType)}
                </View>
                
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    {ACTIVITY_DISPLAY_NAMES[activity.activityType]}
                  </Text>
                  
                  {activity.metadata && (
                    <Text style={styles.activityMeta} numberOfLines={1}>
                      {activity.metadata.userName || activity.metadata.postTitle || 
                       activity.metadata.circleName || activity.metadata.nftTitle || 
                       'Details available'}
                    </Text>
                  )}
                  
                  <View style={styles.activityFooter}>
                    <Clock size={12} color="#666" />
                    <Text style={styles.activityTime}>
                      {formatTimestamp(activity.timestamp)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
  },
  trackingControl: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  trackingLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 4,
  },
  trackingDesc: {
    fontSize: 14,
    color: '#999',
  },
  statsSection: {
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row' as const,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center' as const,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#D4AF37',
  },
  periodText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600' as const,
  },
  periodTextActive: {
    color: '#000',
  },
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center' as const,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  truthScoreChange: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    gap: 8,
  },
  truthScoreText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  activitySection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center' as const,
  },
  activityCard: {
    flexDirection: 'row' as const,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 4,
  },
  activityMeta: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});
