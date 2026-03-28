import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Radio, 
  MapPin,
  Activity,
  TrendingUp,
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/app/contexts/AuthContext';

export default function TacticalHQScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const dashboardQuery = trpc.r3al.tactical.getDashboard.useQuery({
    userId: user?.id || '',
  });

  const srAnalysisQuery = trpc.r3al.tactical.getOptimaSRAnalysis.useQuery({
    userId: user?.id || '',
    analysisType: 'situational',
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dashboardQuery.refetch(),
      srAnalysisQuery.refetch(),
    ]);
    setRefreshing(false);
  };

  const dashboard = dashboardQuery.data?.dashboard;
  const srAnalysis = srAnalysisQuery.data?.analysis as any;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'R3AL HQ Tactical',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          headerRight: () => (
            <View style={styles.headerRight}>
              <View style={[
                styles.statusBadge,
                dashboard?.user.operationalStatus === 'on_duty' && styles.statusOnDuty,
              ]}>
                <Text style={styles.statusText}>
                  {dashboard?.user.operationalStatus?.replace('_', ' ').toUpperCase() || 'OFF DUTY'}
                </Text>
              </View>
            </View>
          ),
        }}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {dashboard?.user && (
          <View style={styles.userCard}>
            <View style={styles.userHeader}>
              <Shield size={32} color="#e74c3c" />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {dashboard.user.rank} - {dashboard.user.department}
                </Text>
                <Text style={styles.userMeta}>
                  {dashboard.user.serviceBranch} • Clearance: {dashboard.user.clearanceLevel}
                </Text>
                {dashboard.user.verifiedStatus === 'verified' && (
                  <View style={styles.verifiedBadge}>
                    <Shield size={12} color="#27ae60" />
                    <Text style={styles.verifiedText}>VERIFIED</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optima SR - Situational Awareness</Text>
          
          <View style={styles.threatCard}>
            <View style={styles.threatHeader}>
              <Activity size={24} color="#e74c3c" />
              <View style={styles.threatInfo}>
                <Text style={styles.threatLevel}>
                  Threat Level: {srAnalysis?.overallThreatLevel?.toUpperCase() || 'UNKNOWN'}
                </Text>
                <Text style={styles.threatMeta}>
                  {srAnalysis?.activeSituations || 0} Active Situations
                </Text>
              </View>
            </View>

            {srAnalysis?.recommendations && srAnalysis.recommendations.length > 0 && (
              <View style={styles.recommendations}>
                <Text style={styles.recommendationsTitle}>AI Recommendations:</Text>
                {srAnalysis.recommendations.map((rec: string, idx: number) => (
                  <View key={idx} style={styles.recommendationItem}>
                    <Text style={styles.recommendationText}>• {rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {dashboard?.activeIncidents && dashboard.activeIncidents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Incidents</Text>
            {dashboard.activeIncidents.map((incident: any) => (
              <TouchableOpacity
                key={incident.incidentId}
                style={styles.incidentCard}
                onPress={() => router.push(`/r3al/tactical/incident?id=${incident.incidentId}`)}
              >
                <View style={styles.incidentHeader}>
                  <AlertTriangle size={20} color="#f39c12" />
                  <View style={styles.incidentInfo}>
                    <Text style={styles.incidentTitle}>{incident.title}</Text>
                    <Text style={styles.incidentMeta}>
                      {incident.severity} • {new Date(incident.reportedAt).toLocaleTimeString()}
                    </Text>
                  </View>
                  <View style={[
                    styles.severityBadge,
                    incident.severity === 'high' && styles.severityHigh,
                    incident.severity === 'critical' && styles.severityCritical,
                  ]}>
                    <Text style={styles.severityText}>{incident.severity}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {dashboard?.team && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Team</Text>
            <TouchableOpacity
              style={styles.teamCard}
              onPress={() => router.push(`/r3al/tactical/team?id=${dashboard.team.teamId}`)}
            >
              <View style={styles.teamHeader}>
                <Users size={24} color="#3498db" />
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{dashboard.team.teamName}</Text>
                  <Text style={styles.teamMeta}>
                    {dashboard.team.teamType} • {dashboard.team.activeMemberCount} members active
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/r3al/tactical/comms')}
          >
            <Radio size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Comms</Text>
            {dashboard?.recentComms && dashboard.recentComms > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{dashboard.recentComms}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/r3al/tactical/map')}
          >
            <MapPin size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/r3al/tactical/analytics')}
          >
            <TrendingUp size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {dashboard?.aiInsights && dashboard.aiInsights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            {dashboard.aiInsights.map((insight: string, idx: number) => (
              <View key={idx} style={styles.insightCard}>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  headerRight: {
    marginRight: 16,
  },
  statusBadge: {
    backgroundColor: '#555',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOnDuty: {
    backgroundColor: '#27ae60',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#27ae60',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 12,
  },
  threatCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  threatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  threatInfo: {
    marginLeft: 12,
    flex: 1,
  },
  threatLevel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#e74c3c',
    marginBottom: 4,
  },
  threatMeta: {
    fontSize: 12,
    color: '#aaa',
  },
  recommendations: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 8,
  },
  recommendationItem: {
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
  },
  incidentCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incidentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 4,
  },
  incidentMeta: {
    fontSize: 12,
    color: '#aaa',
  },
  severityBadge: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityHigh: {
    backgroundColor: '#e74c3c',
  },
  severityCritical: {
    backgroundColor: '#c0392b',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#fff',
    textTransform: 'uppercase',
  },
  teamCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamInfo: {
    marginLeft: 12,
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  teamMeta: {
    fontSize: 12,
    color: '#aaa',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
    marginTop: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f39c12',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#fff',
  },
  insightCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  insightText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
});
