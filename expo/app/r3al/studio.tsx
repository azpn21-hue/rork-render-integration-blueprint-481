import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Music, Plus, Play, Share2, TrendingUp } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudioScreen() {
  const [activeTab, setActiveTab] = useState<'projects' | 'create'>('projects');
  const [newProject, setNewProject] = useState({
    title: '',
    genre: 'electronic',
    bpm: 120,
    mood: 'energetic',
  });

  const userId = 'demo_user';

  const projectsQuery = trpc.r3al.studio.getProjects.useQuery({
    userId,
    status: undefined,
    limit: 20,
    offset: 0,
  });

  const createMutation = trpc.r3al.studio.createProject.useMutation({
    onSuccess: () => {
      projectsQuery.refetch();
      setActiveTab('projects');
      setNewProject({ title: '', genre: 'electronic', bpm: 120, mood: 'energetic' });
    },
  });

  const generateMutation = trpc.r3al.studio.generateMusic.useMutation();

  const handleCreateProject = () => {
    if (!newProject.title) return;
    createMutation.mutate({
      userId,
      ...newProject,
    });
  };

  const handleGenerateMusic = (projectId: string) => {
    generateMutation.mutate({
      projectId,
      userId,
      prompt: `Create a ${newProject.genre} track at ${newProject.bpm} BPM with a ${newProject.mood} mood`,
      duration: 30,
      style: newProject.genre as any,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'R3AL Studio',
          headerStyle: { backgroundColor: '#0a0a0a' },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Music size={32} color="#00ff88" />
          <Text style={styles.title}>Music Lab</Text>
          <Text style={styles.subtitle}>Create, Generate, Share</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'projects' && styles.tabActive]}
            onPress={() => setActiveTab('projects')}
          >
            <Text style={[styles.tabText, activeTab === 'projects' && styles.tabTextActive]}>
              My Projects
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'create' && styles.tabActive]}
            onPress={() => setActiveTab('create')}
          >
            <Plus size={20} color={activeTab === 'create' ? '#00ff88' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>
              New Project
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'projects' && (
          <View style={styles.projectsSection}>
            {projectsQuery.isLoading && (
              <ActivityIndicator size="large" color="#00ff88" style={{ marginTop: 40 }} />
            )}

            {projectsQuery.data?.projects.length === 0 && (
              <View style={styles.emptyState}>
                <Music size={64} color="#333" />
                <Text style={styles.emptyText}>No projects yet</Text>
                <Text style={styles.emptySubtext}>Create your first music project</Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => setActiveTab('create')}
                >
                  <Plus size={20} color="#fff" />
                  <Text style={styles.emptyButtonText}>Create Project</Text>
                </TouchableOpacity>
              </View>
            )}

            {projectsQuery.data?.projects.map((project) => (
              <View key={project.projectId} style={styles.projectCard}>
                <View style={styles.projectHeader}>
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <Text style={styles.projectMeta}>
                      {project.genre} • {project.bpm} BPM • {project.stemCount} stems
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                    <Text style={styles.statusText}>{project.status}</Text>
                  </View>
                </View>

                <View style={styles.projectStats}>
                  <View style={styles.stat}>
                    <Play size={16} color="#00ff88" />
                    <Text style={styles.statText}>{project.totalPlays} plays</Text>
                  </View>
                  <View style={styles.stat}>
                    <TrendingUp size={16} color="#00ff88" />
                    <Text style={styles.statText}>{project.stemCount} tracks</Text>
                  </View>
                </View>

                <View style={styles.projectActions}>
                  {project.status === 'draft' && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleGenerateMusic(project.projectId)}
                    >
                      {generateMutation.isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <Music size={16} color="#fff" />
                          <Text style={styles.actionButtonText}>Generate</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}

                  {project.status === 'completed' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.shareButton]}
                      onPress={() => {}}
                    >
                      <Share2 size={16} color="#00ff88" />
                      <Text style={[styles.actionButtonText, styles.shareButtonText]}>Share</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'create' && (
          <View style={styles.createSection}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Project Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Summer Vibes"
                placeholderTextColor="#666"
                value={newProject.title}
                onChangeText={(title) => setNewProject({ ...newProject, title })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Genre</Text>
              <View style={styles.genreGrid}>
                {['electronic', 'pop', 'rock', 'ambient', 'jazz', 'hiphop'].map((genre) => (
                  <TouchableOpacity
                    key={genre}
                    style={[
                      styles.genreButton,
                      newProject.genre === genre && styles.genreButtonActive,
                    ]}
                    onPress={() => setNewProject({ ...newProject, genre })}
                  >
                    <Text
                      style={[
                        styles.genreButtonText,
                        newProject.genre === genre && styles.genreButtonTextActive,
                      ]}
                    >
                      {genre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>BPM: {newProject.bpm}</Text>
              <View style={styles.bpmControls}>
                <TouchableOpacity
                  style={styles.bpmButton}
                  onPress={() =>
                    setNewProject({ ...newProject, bpm: Math.max(60, newProject.bpm - 10) })
                  }
                >
                  <Text style={styles.bpmButtonText}>-10</Text>
                </TouchableOpacity>
                <Text style={styles.bpmValue}>{newProject.bpm}</Text>
                <TouchableOpacity
                  style={styles.bpmButton}
                  onPress={() =>
                    setNewProject({ ...newProject, bpm: Math.min(180, newProject.bpm + 10) })
                  }
                >
                  <Text style={styles.bpmButtonText}>+10</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.createButton, !newProject.title && styles.createButtonDisabled]}
              onPress={handleCreateProject}
              disabled={!newProject.title || createMutation.isLoading}
            >
              {createMutation.isLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Plus size={20} color="#000" />
                  <Text style={styles.createButtonText}>Create Project</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>💎 Premium Feature</Text>
              <Text style={styles.infoText}>
                Music generation requires a Premium or Unlimited subscription
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'draft':
      return '#666';
    case 'generating':
      return '#ffa500';
    case 'completed':
      return '#00ff88';
    case 'published':
      return '#00aaff';
    default:
      return '#666';
  }
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
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#fff',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#00ff88',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#00ff8810',
    borderColor: '#00ff88',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#666',
  },
  tabTextActive: {
    color: '#00ff88',
  },
  projectsSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  projectCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  projectMeta: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
    textTransform: 'capitalize' as const,
  },
  projectStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#888',
  },
  projectActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#00ff88',
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#000',
  },
  shareButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  shareButtonText: {
    color: '#00ff88',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#00ff88',
    borderRadius: 12,
    marginTop: 24,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#000',
  },
  createSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 12,
  },
  genreButtonActive: {
    backgroundColor: '#00ff8810',
    borderColor: '#00ff88',
  },
  genreButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#888',
    textTransform: 'capitalize' as const,
  },
  genreButtonTextActive: {
    color: '#00ff88',
  },
  bpmControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 12,
    padding: 12,
  },
  bpmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  bpmButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#00ff88',
  },
  bpmValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#00ff88',
    borderRadius: 12,
    marginTop: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#333',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#000',
  },
  infoBox: {
    backgroundColor: '#00ff8810',
    borderWidth: 1,
    borderColor: '#00ff88',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#00ff88',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
  },
});
