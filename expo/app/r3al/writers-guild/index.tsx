import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, BookOpen, Edit3, FileText, MessageCircle } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/app/contexts/AuthContext';

export default function WritersGuildScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    genre: '',
    description: '',
    contentType: 'novel' as 'novel' | 'short_story' | 'screenplay' | 'poetry' | 'other',
    matureContent: false,
  });

  const projectsQuery = trpc.r3al.writersGuild.getProjects.useQuery({
    userId: user?.id || '',
  });

  const memberQuery = trpc.r3al.writersGuild.getMember.useQuery({
    userId: user?.id || '',
  });

  const createProjectMutation = trpc.r3al.writersGuild.createProject.useMutation({
    onSuccess: () => {
      projectsQuery.refetch();
      setShowNewProject(false);
      setNewProject({
        title: '',
        genre: '',
        description: '',
        contentType: 'novel',
        matureContent: false,
      });
    },
  });

  const startSessionMutation = trpc.r3al.writersGuild.startSession.useMutation({
    onSuccess: (data) => {
      router.push(`/r3al/writers-guild/session?sessionId=${data.session.sessionId}&projectId=${data.session.projectId}`);
    },
  });

  const handleCreateProject = () => {
    if (!newProject.title) return;
    createProjectMutation.mutate({
      userId: user?.id || '',
      ...newProject,
    });
  };

  const handleStartWriting = (projectId: string) => {
    startSessionMutation.mutate({
      userId: user?.id || '',
      projectId,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Writers Guild',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {memberQuery.data?.member && (
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <BookOpen size={32} color="#6c5ce7" />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{memberQuery.data.member.penName}</Text>
                <Text style={styles.profileBio}>{memberQuery.data.member.bio}</Text>
              </View>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{memberQuery.data.member.totalWordsWritten.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Words Written</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{memberQuery.data.member.totalProjects}</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{memberQuery.data.member.tier}</Text>
                <Text style={styles.statLabel}>Tier</Text>
              </View>
            </View>

            {memberQuery.data.member.specialties && memberQuery.data.member.specialties.length > 0 && (
              <View style={styles.specialtiesRow}>
                {memberQuery.data.member.specialties.map((specialty, idx) => (
                  <View key={idx} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Projects</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowNewProject(true)}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.addButtonText}>New Project</Text>
          </TouchableOpacity>
        </View>

        {projectsQuery.data?.projects.map((project) => (
          <TouchableOpacity
            key={project.projectId}
            style={styles.projectCard}
            onPress={() => handleStartWriting(project.projectId)}
          >
            <View style={styles.projectHeader}>
              <FileText size={24} color="#6c5ce7" />
              <View style={styles.projectTitleContainer}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                {project.matureContent && (
                  <View style={styles.matureTag}>
                    <Text style={styles.matureTagText}>18+</Text>
                  </View>
                )}
              </View>
            </View>

            {project.genre && (
              <Text style={styles.projectGenre}>{project.genre}</Text>
            )}

            {project.description && (
              <Text style={styles.projectDescription} numberOfLines={2}>
                {project.description}
              </Text>
            )}

            <View style={styles.projectFooter}>
              <View style={styles.projectMeta}>
                <Text style={styles.projectMetaText}>{project.contentType}</Text>
                <Text style={styles.projectMetaText}>•</Text>
                <Text style={styles.projectMetaText}>{project.wordCount.toLocaleString()} words</Text>
              </View>

              <View style={styles.projectActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Edit3 size={18} color="#6c5ce7" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={18} color="#6c5ce7" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {projectsQuery.data?.projects.length === 0 && (
          <View style={styles.emptyState}>
            <BookOpen size={64} color="#666" />
            <Text style={styles.emptyText}>No projects yet</Text>
            <Text style={styles.emptySubtext}>Create your first writing project to get started</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showNewProject}
        animationType="slide"
        transparent
        onRequestClose={() => setShowNewProject(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Writing Project</Text>

            <TextInput
              style={styles.input}
              placeholder="Project Title"
              placeholderTextColor="#666"
              value={newProject.title}
              onChangeText={(title) => setNewProject({ ...newProject, title })}
            />

            <TextInput
              style={styles.input}
              placeholder="Genre (optional)"
              placeholderTextColor="#666"
              value={newProject.genre}
              onChangeText={(genre) => setNewProject({ ...newProject, genre })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor="#666"
              value={newProject.description}
              onChangeText={(description) => setNewProject({ ...newProject, description })}
              multiline
              numberOfLines={3}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Mature Content (18+)</Text>
              <Switch
                value={newProject.matureContent}
                onValueChange={(matureContent) => setNewProject({ ...newProject, matureContent })}
                trackColor={{ false: '#666', true: '#6c5ce7' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNewProject(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateProject}
                disabled={!newProject.title || createProjectMutation.isPending}
              >
                <Text style={styles.createButtonText}>
                  {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#6c5ce7',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#6c5ce7',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  specialtyTag: {
    backgroundColor: '#6c5ce733',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: '#6c5ce7',
    fontWeight: '600' as const,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  projectCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    flex: 1,
  },
  matureTag: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  matureTagText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#fff',
  },
  projectGenre: {
    fontSize: 14,
    color: '#6c5ce7',
    marginBottom: 4,
    marginLeft: 36,
  },
  projectDescription: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    marginLeft: 36,
    marginBottom: 12,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 36,
    marginTop: 8,
  },
  projectMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  projectMetaText: {
    fontSize: 12,
    color: '#666',
  },
  projectActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0f0f1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 16,
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#6c5ce7',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
