import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Hexagon } from "lucide-react-native";
import { useCircles } from "@/app/contexts/CirclesContext";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

const CATEGORIES = ["Technology", "Community", "Business", "Arts & Design", "Leadership", "Health", "Education", "Entertainment"];
const ICONS = ["💡", "🤝", "🚀", "🎨", "👑", "⛓️", "🔥", "⭐", "🌟", "💎", "🎯", "🌈"];
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#EF4444", "#06B6D4", "#84CC16"];

export default function CreateCirclePage() {
  const router = useRouter();
  const { createCircle } = useCircles();
  const { userProfile } = useR3al();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Community");
  const [selectedIcon, setSelectedIcon] = useState("🤝");
  const [selectedColor, setSelectedColor] = useState("#10B981");
  const [isPrivate, setIsPrivate] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a circle name");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    setIsCreating(true);
    try {
      const circle = createCircle({
        name: name.trim(),
        description: description.trim(),
        category,
        icon: selectedIcon,
        color: selectedColor,
        isPrivate,
        requiresApproval,
        avgTruthScore: userProfile?.truthScore?.score || 75,
        activityLevel: "low",
        createdBy: userProfile?.name || "user",
      });

      Alert.alert(
        "🎉 Circle Created!",
        `"${circle.name}" has been created successfully. Invite members to grow your community!`,
        [
          {
            text: "View Circle",
            onPress: () => router.replace(`/r3al/circles/${circle.id}`),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to create circle");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Circle</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.previewCard}>
            <View style={[styles.previewIcon, { backgroundColor: selectedColor + "20" }]}>
              <Text style={styles.previewEmoji}>{selectedIcon}</Text>
            </View>
            <Text style={styles.previewName}>{name || "Circle Name"}</Text>
            <Text style={styles.previewDescription}>
              {description || "Circle description will appear here"}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Circle Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter circle name"
                placeholderTextColor={tokens.colors.textSecondary}
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your circle's purpose"
                placeholderTextColor={tokens.colors.textSecondary}
                multiline
                numberOfLines={4}
                maxLength={200}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      category === cat && styles.chipActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Circle Icon</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconGrid}>
                {ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconButton,
                      selectedIcon === icon && styles.iconButtonActive,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Text style={styles.iconEmoji}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Circle Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorGrid}>
                {COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorButtonActive,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Privacy Settings</Text>
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setIsPrivate(!isPrivate)}
              >
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Private Circle</Text>
                  <Text style={styles.toggleDescription}>
                    Only invited members can see this circle
                  </Text>
                </View>
                <View style={[styles.toggle, isPrivate && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, isPrivate && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setRequiresApproval(!requiresApproval)}
              >
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Require Approval</Text>
                  <Text style={styles.toggleDescription}>
                    Admin must approve join requests
                  </Text>
                </View>
                <View style={[styles.toggle, requiresApproval && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, requiresApproval && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, isCreating && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={isCreating}
          >
            <Hexagon size={24} color={tokens.colors.background} strokeWidth={2} />
            <Text style={styles.createButtonText}>
              {isCreating ? "Creating..." : "Create Circle"}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Circle Tips</Text>
            <Text style={styles.infoText}>
              • Choose a clear, descriptive name{"\n"}
              • Write a compelling description{"\n"}
              • Set appropriate privacy settings{"\n"}
              • Private circles are great for close groups{"\n"}
              • Approval helps maintain quality
            </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  previewCard: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    marginBottom: 24,
  },
  previewIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  previewEmoji: {
    fontSize: 40,
  },
  previewName: {
    fontSize: 22,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
    maxWidth: 280,
  },
  form: {
    gap: 20,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  input: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    borderRadius: tokens.dimensions.borderRadius,
    padding: 16,
    fontSize: 16,
    color: tokens.colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  chipScroll: {
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: tokens.colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
  },
  chipActive: {
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.gold,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  chipTextActive: {
    color: tokens.colors.gold,
  },
  iconGrid: {
    gap: 12,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
  },
  iconButtonActive: {
    borderColor: tokens.colors.gold,
    borderWidth: 3,
  },
  iconEmoji: {
    fontSize: 28,
  },
  colorGrid: {
    gap: 12,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "transparent",
  },
  colorButtonActive: {
    borderColor: tokens.colors.gold,
    borderWidth: 4,
  },
  toggleRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    marginBottom: 12,
  },
  toggleInfo: {
    flex: 1,
    gap: 4,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.text,
  },
  toggleDescription: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  toggle: {
    width: 48,
    height: 28,
    backgroundColor: tokens.colors.background,
    borderRadius: 14,
    padding: 3,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: tokens.colors.gold,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: tokens.colors.textSecondary,
  },
  toggleThumbActive: {
    backgroundColor: tokens.colors.background,
    alignSelf: "flex-end",
  },
  createButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: tokens.colors.gold,
    padding: 18,
    borderRadius: tokens.dimensions.borderRadius,
    marginBottom: 24,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
  infoCard: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "20",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
});
