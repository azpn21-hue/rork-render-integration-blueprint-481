import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVerification } from "@/app/contexts/VerificationContext";
import { CheckCircle, XCircle, Shield, Mail, Smartphone, Camera, Award } from "lucide-react-native";

export default function VerificationStatusScreen() {
  const router = useRouter();
  const { status, isLoading, refetchStatus } = useVerification();

  const verificationSteps = [
    {
      title: "Email Verification",
      description: "Confirm your email address",
      verified: status.emailVerified,
      icon: Mail,
      route: "/r3al/verification/email",
    },
    {
      title: "Phone Verification",
      description: "Verify your phone number",
      verified: status.phoneVerified,
      icon: Smartphone,
      route: "/r3al/verification/sms",
    },
    {
      title: "ID Verification",
      description: "Upload photo ID and selfie",
      verified: status.idVerified,
      icon: Camera,
      route: "/r3al/verification/id",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Verification Status", headerShown: true }} />
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Shield size={80} color={status.isFullyVerified ? "#00D4AA" : "#888"} />
          <Text style={styles.title}>
            {status.isFullyVerified ? "Fully Verified" : "Verification Progress"}
          </Text>
          <Text style={styles.subtitle}>
            {status.completionPercentage}% Complete
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${status.completionPercentage}%` },
            ]}
          />
        </View>

        {status.isFullyVerified && status.verificationBadge && (
          <View style={styles.badgeContainer}>
            <Award size={40} color="#D4AF37" />
            <Text style={styles.badgeText}>R3AL Verified Badge</Text>
            <Text style={styles.badgeId}>Badge ID: {status.verificationBadge.slice(-8)}</Text>
          </View>
        )}

        {status.aiConfidenceScore && (
          <View style={styles.confidenceBox}>
            <Text style={styles.confidenceLabel}>AI Confidence Score</Text>
            <Text style={styles.confidenceScore}>
              {status.aiConfidenceScore.toFixed(1)}%
            </Text>
          </View>
        )}

        <View style={styles.stepsContainer}>
          {verificationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.stepCard,
                  step.verified && styles.stepCardVerified,
                ]}
                onPress={() => !step.verified && router.push(step.route as any)}
              >
                <View style={styles.stepIcon}>
                  <Icon size={32} color={step.verified ? "#00D4AA" : "#888"} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                <View style={styles.stepStatus}>
                  {step.verified ? (
                    <CheckCircle size={28} color="#00D4AA" />
                  ) : (
                    <XCircle size={28} color="#888" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {status.isFullyVerified ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/r3al/home")}
          >
            <Text style={styles.buttonText}>Continue to R3AL</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => refetchStatus()}
          >
            <Text style={styles.secondaryButtonText}>Refresh Status</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.lastUpdated}>
          Last updated: {new Date(status.lastUpdated).toLocaleString()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#00D4AA",
    fontWeight: "600" as const,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 4,
    marginBottom: 32,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00D4AA",
    borderRadius: 4,
  },
  badgeContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  badgeText: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#D4AF37",
    marginTop: 12,
  },
  badgeId: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  confidenceBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  confidenceLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  confidenceScore: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#00D4AA",
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  stepCardVerified: {
    borderColor: "#00D4AA",
  },
  stepIcon: {
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#888",
  },
  stepStatus: {
    marginLeft: 12,
  },
  primaryButton: {
    backgroundColor: "#00D4AA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#00D4AA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#00D4AA",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
});
