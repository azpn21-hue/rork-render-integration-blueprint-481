import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import { useState } from "react";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function NFTCreator() {
  const router = useRouter();
  const { createNFT, tokenBalance, userProfile } = useR3al();
  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [mintCost, setMintCost] = useState<string>("10");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your NFT");
      return;
    }
    if (!imageUrl.trim()) {
      Alert.alert("Error", "Please enter an image URL");
      return;
    }

    const cost = parseInt(mintCost) || 10;
    if (tokenBalance.available < cost) {
      Alert.alert(
        "Insufficient Tokens",
        `You need ${cost} Trust-Tokens to mint this NFT. You currently have ${tokenBalance.available}.`
      );
      return;
    }

    setIsCreating(true);
    try {
      const nft = createNFT({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        tokenCost: cost,
      });

      Alert.alert(
        "🎨 NFT Created!",
        `"${nft.metadata.title}" has been minted successfully for ${cost} Trust-Tokens.`,
        [
          { text: "View Gallery", onPress: () => router.replace("/r3al/hive/nft-gallery") },
          { text: "Create Another", onPress: () => {
            setTitle("");
            setDescription("");
            setImageUrl("");
          }}
        ]
      );
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to create NFT");
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
          <Text style={styles.headerTitle}>Create NFT</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Your Trust-Token Balance</Text>
            <Text style={styles.balanceValue}>{tokenBalance.available} 🪙</Text>
            <Text style={styles.balanceSubtext}>Minting Cost: {mintCost} tokens</Text>
          </View>

          <View style={styles.previewCard}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.previewPlaceholder}>
                <ImageIcon size={64} color={tokens.colors.textSecondary} strokeWidth={1} />
                <Text style={styles.previewText}>Image Preview</Text>
              </View>
            )}
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NFT Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter NFT title"
                placeholderTextColor={tokens.colors.textSecondary}
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your NFT"
                placeholderTextColor={tokens.colors.textSecondary}
                multiline
                numberOfLines={4}
                maxLength={300}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image URL *</Text>
              <TextInput
                style={styles.input}
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor={tokens.colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mint Cost (Tokens)</Text>
              <TextInput
                style={styles.input}
                value={mintCost}
                onChangeText={setMintCost}
                placeholder="10"
                placeholderTextColor={tokens.colors.textSecondary}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, isCreating && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={isCreating}
            activeOpacity={0.7}
          >
            <Sparkles size={24} color={tokens.colors.background} strokeWidth={2} />
            <Text style={styles.createButtonText}>
              {isCreating ? "Minting..." : "Mint NFT"}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 NFT Creation Tips</Text>
            <Text style={styles.infoText}>
              • Use high-quality images (minimum 512x512px){"\n"}
              • Choose a memorable title{"\n"}
              • Add rich descriptions to increase value{"\n"}
              • Mint cost affects rarity perception{"\n"}
              • You can list for sale or gift after minting
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
  balanceCard: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: tokens.colors.text,
  },
  previewCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    overflow: "hidden",
    marginBottom: 24,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  previewText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
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
