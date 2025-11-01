import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import locales from "@/schemas/r3al/locale_tokens.json";

export default function ProfileSetup() {
  const router = useRouter();
  const { saveProfile, truthScore } = useR3al();
  const t = locales.en;
  const [name, setName] = useState("" as string);
  const [bio, setBio] = useState("" as string);

  const handleComplete = () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your name");
      return;
    }

    saveProfile({
      name: name.trim(),
      bio: bio.trim(),
      truthScore,
    });

    router.replace("/r3al/home");
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <User size={60} color={tokens.colors.gold} strokeWidth={1.5} />
            <Text style={styles.title}>{t.profile_title}</Text>
            <Text style={styles.subtitle}>{t.profile_subtitle}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>{t.name} *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your display name"
                placeholderTextColor={tokens.colors.textSecondary}
                maxLength={50}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t.bio}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself (optional)"
                placeholderTextColor={tokens.colors.textSecondary}
                multiline
                maxLength={200}
              />
              <Text style={styles.charCount}>{bio.length}/200</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, !name.trim() && styles.buttonDisabled]}
            onPress={handleComplete}
            disabled={!name.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t.complete}</Text>
          </TouchableOpacity>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    textAlign: "center",
  },
  form: {
    flex: 1,
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.text,
  },
  input: {
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    padding: 16,
    fontSize: 16,
    color: tokens.colors.text,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top" as const,
  },
  charCount: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    textAlign: "right" as const,
  },
  button: {
    backgroundColor: tokens.colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: tokens.colors.secondary,
  },
});
