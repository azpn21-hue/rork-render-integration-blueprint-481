import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Shield,
  Lock,
  MapPin,
  Wifi,
  Send,
  Settings,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react-native';
import { useAuth } from '@/app/contexts/AuthContext';
import { secureGridManager } from '@/lib/securegrid';
import { trpc } from '@/lib/trpc';

export default function SecureCommsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [message, setMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [locationMaskingEnabled, setLocationMaskingEnabled] = useState(true);
  const [vpnEnabled, setVpnEnabled] = useState(true);
  const [obfuscationLevel, setObfuscationLevel] = useState<'low' | 'medium' | 'high' | 'maximum'>('high');

  const sendCommMutation = trpc.r3al.tactical.sendSecureComm.useMutation();

  useEffect(() => {
    initializeSecureGrid();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(updateSecurityStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const initializeSecureGrid = async () => {
    if (!user?.id) return;

    try {
      await secureGridManager.initialize(user.id);
      await updateSecurityStatus();
      setIsInitialized(true);
      console.log('[SecureComms] SecureGrid initialized');
    } catch (error) {
      console.error('[SecureComms] Initialization failed:', error);
      Alert.alert('Error', 'Failed to initialize secure communications');
    }
  };

  const updateSecurityStatus = async () => {
    try {
      const status = await secureGridManager.getSecurityStatus();
      setSecurityStatus(status);
    } catch (error) {
      console.error('[SecureComms] Failed to get security status:', error);
    }
  };

  const handleSendSecureMessage = async () => {
    if (!message.trim() || !user?.id) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      const result = await sendCommMutation.mutateAsync({
        senderId: user.id,
        recipientId: recipientId || undefined,
        commType: 'message',
        priority: 'normal',
        content: message,
        encrypted: encryptionEnabled,
      });

      if (result.success) {
        Alert.alert('Success', 'Secure message sent');
        setMessage('');
      }
    } catch (error) {
      console.error('[SecureComms] Failed to send message:', error);
      Alert.alert('Error', 'Failed to send secure message');
    }
  };

  const updateConfig = () => {
    secureGridManager.updateConfig({
      encryption: {
        enabled: encryptionEnabled,
        rotateKeysInterval: 86400000,
      },
      locationMasking: {
        enabled: locationMaskingEnabled,
        obfuscationLevel,
      },
      vpnTunnel: {
        enabled: vpnEnabled,
        tunnelProtocol: 'custom',
        encryptionLevel: 'military',
        killSwitch: true,
        splitTunneling: false,
      },
    });
    updateSecurityStatus();
  };

  useEffect(() => {
    if (isInitialized) {
      updateConfig();
    }
  }, [encryptionEnabled, locationMaskingEnabled, vpnEnabled, obfuscationLevel]);

  const getSecurityColor = (score: number) => {
    if (score >= 80) return '#27ae60';
    if (score >= 50) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'SecureGrid Communications',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {securityStatus && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Shield size={32} color={getSecurityColor(securityStatus.overallSecurityScore)} />
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>Security Status</Text>
                <Text style={[
                  styles.statusScore,
                  { color: getSecurityColor(securityStatus.overallSecurityScore) }
                ]}>
                  {securityStatus.overallSecurityScore}/100
                </Text>
              </View>
            </View>

            <View style={styles.statusDetails}>
              <View style={styles.statusRow}>
                <Lock size={16} color={securityStatus.encryption.enabled ? '#27ae60' : '#e74c3c'} />
                <Text style={styles.statusText}>
                  Encryption: {securityStatus.encryption.enabled ? 'Active' : 'Disabled'}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <MapPin size={16} color={securityStatus.locationMasking.enabled ? '#27ae60' : '#e74c3c'} />
                <Text style={styles.statusText}>
                  Location Masking: {securityStatus.locationMasking.level}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Wifi size={16} color={securityStatus.vpnTunnel.status === 'active' ? '#27ae60' : '#e74c3c'} />
                <Text style={styles.statusText}>
                  VPN Tunnel: {securityStatus.vpnTunnel.status}
                </Text>
              </View>

              {securityStatus.vpnTunnel.endpoint && (
                <Text style={styles.endpointText}>
                  Endpoint: {securityStatus.vpnTunnel.endpoint}
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Configuration</Text>

          <View style={styles.configCard}>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>End-to-End Encryption</Text>
              <Switch
                value={encryptionEnabled}
                onValueChange={setEncryptionEnabled}
                trackColor={{ false: '#555', true: '#27ae60' }}
                thumbColor={encryptionEnabled ? '#fff' : '#ccc'}
              />
            </View>

            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Location Masking</Text>
              <Switch
                value={locationMaskingEnabled}
                onValueChange={setLocationMaskingEnabled}
                trackColor={{ false: '#555', true: '#27ae60' }}
                thumbColor={locationMaskingEnabled ? '#fff' : '#ccc'}
              />
            </View>

            <View style={styles.configRow}>
              <Text style={styles.configLabel}>VPN Tunnel</Text>
              <Switch
                value={vpnEnabled}
                onValueChange={setVpnEnabled}
                trackColor={{ false: '#555', true: '#27ae60' }}
                thumbColor={vpnEnabled ? '#fff' : '#ccc'}
              />
            </View>

            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Obfuscation Level</Text>
              <View style={styles.levelButtons}>
                {(['low', 'medium', 'high', 'maximum'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelButton,
                      obfuscationLevel === level && styles.levelButtonActive,
                    ]}
                    onPress={() => setObfuscationLevel(level)}
                  >
                    <Text style={[
                      styles.levelButtonText,
                      obfuscationLevel === level && styles.levelButtonTextActive,
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Secure Message</Text>

          <View style={styles.messageCard}>
            <TextInput
              style={styles.input}
              placeholder="Recipient ID (optional for broadcast)"
              placeholderTextColor="#666"
              value={recipientId}
              onChangeText={setRecipientId}
            />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Enter your secure message..."
              placeholderTextColor="#666"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                (!message.trim() || sendCommMutation.isPending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendSecureMessage}
              disabled={!message.trim() || sendCommMutation.isPending}
            >
              <Send size={20} color="#fff" />
              <Text style={styles.sendButtonText}>
                {sendCommMutation.isPending ? 'Sending...' : 'Send Secure Message'}
              </Text>
            </TouchableOpacity>

            {encryptionEnabled && (
              <View style={styles.securityNote}>
                <CheckCircle size={14} color="#27ae60" />
                <Text style={styles.securityNoteText}>
                  This message will be encrypted end-to-end
                </Text>
              </View>
            )}

            {!encryptionEnabled && (
              <View style={[styles.securityNote, styles.securityWarning]}>
                <AlertTriangle size={14} color="#e74c3c" />
                <Text style={[styles.securityNoteText, styles.warningText]}>
                  Warning: Encryption is disabled
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>SecureGrid Features:</Text>
          <Text style={styles.infoText}>• AES-256 End-to-End Encryption</Text>
          <Text style={styles.infoText}>• Location Obfuscation & Proxy Routing</Text>
          <Text style={styles.infoText}>• VPN Tunnel with Kill Switch</Text>
          <Text style={styles.infoText}>• Forward Secrecy with Key Rotation</Text>
          <Text style={styles.infoText}>• Military-Grade Security</Text>
        </View>
      </ScrollView>
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
  statusCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  statusScore: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  statusDetails: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#aaa',
  },
  endpointText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginTop: 4,
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
  configCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#2a2a3e',
  },
  levelButtonActive: {
    backgroundColor: '#27ae60',
  },
  levelButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#aaa',
    textTransform: 'capitalize',
  },
  levelButtonTextActive: {
    color: '#fff',
  },
  messageCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
  },
  input: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#555',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#fff',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  securityWarning: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderColor: '#e74c3c',
  },
  securityNoteText: {
    fontSize: 12,
    color: '#27ae60',
  },
  warningText: {
    color: '#e74c3c',
  },
  infoSection: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 4,
  },
});
