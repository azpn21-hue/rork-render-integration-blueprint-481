import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { PhoneOff, Mic, MicOff, Camera as CameraIcon, CameraOff } from "lucide-react-native";
import { useState, useEffect } from "react";
import { usePulseChat } from "@/app/contexts/PulseChatContext";
import PulseRing from "@/components/PulseRing";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import * as Haptics from "expo-haptics";

export default function VideoCall() {
  const router = useRouter();
  const { videoCall, startVideoCall, endVideoCall, activeSessionId, getActiveSession } = usePulseChat();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const activeSession = getActiveSession();

  useEffect(() => {
    if (!videoCall.active && activeSessionId && activeSession) {
      startVideoCall(activeSessionId, activeSession.participants);
    }
  }, [videoCall.active, activeSessionId, activeSession, startVideoCall]);

  useEffect(() => {
    if (!videoCall.active || !videoCall.startTime) return;

    const interval = setInterval(() => {
      const start = new Date(videoCall.startTime as string).getTime();
      const now = Date.now();
      const duration = Math.floor((now - start) / 1000);
      setCallDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [videoCall.active, videoCall.startTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert("End Call", "Are you sure you want to end this video call?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Call",
        style: "destructive",
        onPress: () => {
          endVideoCall();
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          router.back();
        },
      },
    ]);
  };

  if (!videoCall.active) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.title}>Connecting...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.videoContainer}>
            <View style={styles.remoteVideo}>
              <PulseRing color="blue" intensity={0.8} size={120} />
              <Text style={styles.videoLabel}>
                {activeSession?.participantNames[activeSession.participants[1]]}
              </Text>
              <Text style={styles.encryptedBadge}>🔒 End-to-end encrypted</Text>
              <Text style={styles.demoNotice}>Entertainment Feature Only</Text>
            </View>

            <View style={styles.localVideo}>
              {isCameraOff ? (
                <View style={styles.cameraOffIndicator}>
                  <CameraOff size={32} color={tokens.colors.text} strokeWidth={1.5} />
                </View>
              ) : (
                <Text style={styles.localLabel}>You</Text>
              )}
            </View>
          </View>

          <View style={styles.callInfo}>
            <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
            <Text style={styles.status}>Connected</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setIsMuted(!isMuted);
              }}
              activeOpacity={0.7}
            >
              {isMuted ? (
                <MicOff size={28} color={tokens.colors.text} strokeWidth={1.5} />
              ) : (
                <Mic size={28} color={tokens.colors.text} strokeWidth={1.5} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.endCallButton}
              onPress={handleEndCall}
              activeOpacity={0.7}
            >
              <PhoneOff size={32} color={tokens.colors.text} strokeWidth={1.5} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setIsCameraOff(!isCameraOff);
              }}
              activeOpacity={0.7}
            >
              {isCameraOff ? (
                <CameraOff size={28} color={tokens.colors.text} strokeWidth={1.5} />
              ) : (
                <CameraIcon size={28} color={tokens.colors.text} strokeWidth={1.5} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              🫀 Entertainment feature only • No biometric data recorded
            </Text>
            <Text style={styles.disclaimerText}>Auto-deletes after 7 days</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    textAlign: "center" as const,
  },
  videoContainer: {
    flex: 1,
    position: "relative" as const,
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  videoLabel: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
    marginTop: 16,
  },
  encryptedBadge: {
    fontSize: 12,
    color: tokens.colors.highlight,
    marginTop: 8,
  },
  demoNotice: {
    fontSize: 10,
    color: tokens.colors.textSecondary,
    marginTop: 4,
  },
  localVideo: {
    position: "absolute" as const,
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  localLabel: {
    fontSize: 14,
    color: tokens.colors.text,
  },
  cameraOffIndicator: {
    alignItems: "center",
    justifyContent: "center",
  },
  callInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  duration: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: tokens.colors.highlight,
  },
  controls: {
    flexDirection: "row" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonActive: {
    backgroundColor: tokens.colors.error + "30",
    borderColor: tokens.colors.error,
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: tokens.colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  disclaimer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
    gap: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
  },
});
