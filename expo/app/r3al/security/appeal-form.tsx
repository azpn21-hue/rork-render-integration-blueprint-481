import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Send } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import { useState } from "react";

export default function AppealForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { submitAppeal } = useR3al();
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !details.trim()) {
      Alert.alert("Missing Information", "Please fill in both subject and explanation fields.");
      return;
    }

    if (details.length > 1000) {
      Alert.alert("Too Long", "Explanation must be 1000 characters or less.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitAppeal({
        eventId: String(params.eventId),
        screen: String(params.screen),
        timestamp: String(params.timestamp),
        subject: subject.trim(),
        details: details.trim(),
        submittedAt: new Date().toISOString(),
      });

      Alert.alert(
        "Appeal Submitted",
        "Our moderation team will review your request shortly. You'll receive a notification when a decision is made.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("[AppealForm] Submit error:", error);
      Alert.alert("Error", "Failed to submit appeal. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>Appeal Alert</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Alert Details</Text>
            <Text style={styles.infoText}>
              Screen: {String(params.screen || "Unknown").replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </Text>
            <Text style={styles.infoText}>
              Time: {new Date(String(params.timestamp)).toLocaleString()}
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formLabel}>Subject</Text>
            <TextInput
              style={styles.textInput}
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description of your appeal"
              placeholderTextColor={tokens.colors.textSecondary}
              maxLength={100}
              editable={!isSubmitting}
            />

            <Text style={styles.formLabel}>Explanation</Text>
            <Text style={styles.helperText}>
              Explain why you believe this capture alert was triggered in error. Our moderation team reviews every request.
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={details}
              onChangeText={setDetails}
              placeholder="Provide a detailed explanation..."
              placeholderTextColor={tokens.colors.textSecondary}
              maxLength={1000}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
            <Text style={styles.charCount}>
              {details.length} / 1000 characters
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => router.back()}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonSecondaryText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Send size={18} color={tokens.colors.background} strokeWidth={2} />
              <Text style={styles.buttonPrimaryText}>
                {isSubmitting ? "Submitting..." : "Submit Appeal"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  header: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + '20',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  infoCard: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + '30',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: tokens.colors.text,
    marginBottom: 4,
  },
  formCard: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  textInput: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold + '40',
    borderRadius: tokens.dimensions.borderRadius,
    padding: 16,
    fontSize: 16,
    color: tokens.colors.text,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 160,
    paddingTop: 16,
  },
  charCount: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    textAlign: "right" as const,
    marginTop: -8,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: tokens.dimensions.borderRadius,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  buttonPrimary: {
    backgroundColor: tokens.colors.gold,
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.background,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
