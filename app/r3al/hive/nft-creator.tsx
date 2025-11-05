import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Image as ImageIcon, Sparkles, Camera, Wand2 } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import { useState } from "react";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import PhotoCameraModal from "@/components/PhotoCameraModal";

export default function NFTCreator() {
  const router = useRouter();
  const { createNFT, tokenBalance, userProfile } = useR3al();
  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [sourceImage, setSourceImage] = useState<string>("");
  const [transformedImage, setTransformedImage] = useState<string>("");
  const [mintCost, setMintCost] = useState<string>("10");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [nftStyle, setNftStyle] = useState<string>("cartoon");

  const handleImageCapture = (photoUri: string) => {
    console.log("[NFT Creator] Image captured:", photoUri.substring(0, 50));
    setSourceImage(photoUri);
    setTransformedImage("");
  };

  const handleTransformImage = async () => {
    if (!sourceImage) {
      Alert.alert("Error", "Please capture or select an image first");
      return;
    }

    setIsTransforming(true);
    try {
      console.log("[NFT Creator] Transforming image to", nftStyle, "style...");
      
      let stylePrompt = "";
      switch (nftStyle) {
        case "cartoon":
          stylePrompt = "Transform this into a vibrant cartoon NFT art style with bold outlines, bright colors, and simplified shapes. Make it look like a collectible digital art piece with a fun, animated aesthetic.";
          break;
        case "pixel":
          stylePrompt = "Transform this into pixel art NFT style with 8-bit or 16-bit retro gaming aesthetic. Use a limited color palette and pixelated appearance like classic video game sprites. Make it nostalgic and collectible.";
          break;
        case "anime":
          stylePrompt = "Transform this into anime/manga NFT art style with expressive features, dramatic lighting, and vibrant colors. Make it look like a collectible anime character card.";
          break;
        case "cyberpunk":
          stylePrompt = "Transform this into cyberpunk NFT art style with neon colors, glitch effects, futuristic elements, and a dark urban aesthetic. Add digital artifacts and holographic effects.";
          break;
        case "vaporwave":
          stylePrompt = "Transform this into vaporwave NFT aesthetic with pastel colors, retro 80s/90s vibes, geometric patterns, and surreal elements. Add nostalgic digital art effects.";
          break;
        default:
          stylePrompt = "Transform this into a unique NFT art style that makes it look like a valuable digital collectible.";
      }

      let base64Image = sourceImage;
      if (sourceImage.startsWith('data:')) {
        base64Image = sourceImage.split(',')[1];
      } else if (sourceImage.startsWith('file://')) {
        const response = await fetch(sourceImage);
        const blob = await response.blob();
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      console.log("[NFT Creator] Sending transform request...");
      const response = await fetch("https://toolkit.rork.com/images/edit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: stylePrompt,
          images: [
            {
              type: "image",
              image: base64Image,
            },
          ],
          aspectRatio: "1:1",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[NFT Creator] API error:", errorText);
        throw new Error(`Failed to transform image: ${response.statusText}`);
      }

      const data = await response.json();
      const transformedBase64 = `data:${data.image.mimeType};base64,${data.image.base64Data}`;
      
      console.log("[NFT Creator] Image transformed successfully");
      setTransformedImage(transformedBase64);
      Alert.alert("✨ Success!", "Your image has been transformed into NFT art!");
    } catch (error) {
      console.error("[NFT Creator] Transform error:", error);
      Alert.alert(
        "Transform Failed",
        error instanceof Error ? error.message : "Failed to transform image. Please try again or select a different style."
      );
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your NFT");
      return;
    }
    if (!transformedImage) {
      Alert.alert("Error", "Please transform your image first");
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
        imageUrl: transformedImage,
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
            setSourceImage("");
            setTransformedImage("");
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
            {transformedImage ? (
              <Image source={{ uri: transformedImage }} style={styles.previewImage} resizeMode="cover" />
            ) : sourceImage ? (
              <View style={styles.previewWithOverlay}>
                <Image source={{ uri: sourceImage }} style={styles.previewImage} resizeMode="cover" />
                <View style={styles.overlayBadge}>
                  <Text style={styles.overlayText}>Transform to NFT →</Text>
                </View>
              </View>
            ) : (
              <View style={styles.previewPlaceholder}>
                <ImageIcon size={64} color={tokens.colors.textSecondary} strokeWidth={1} />
                <Text style={styles.previewText}>Capture or Select Image</Text>
              </View>
            )}
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Step 1: Capture Image</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowCamera(true)}
                  activeOpacity={0.7}
                >
                  <Camera size={20} color={tokens.colors.background} strokeWidth={2} />
                  <Text style={styles.actionButtonText}>
                    {sourceImage ? "Change Image" : "Take/Select Photo"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {sourceImage && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Step 2: Choose NFT Style</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.styleRow}>
                  {[
                    { id: "cartoon", name: "Cartoon", emoji: "🎨" },
                    { id: "pixel", name: "Pixel Art", emoji: "👾" },
                    { id: "anime", name: "Anime", emoji: "⚡" },
                    { id: "cyberpunk", name: "Cyberpunk", emoji: "🌃" },
                    { id: "vaporwave", name: "Vaporwave", emoji: "🌸" },
                  ].map((style) => (
                    <TouchableOpacity
                      key={style.id}
                      style={[
                        styles.styleChip,
                        nftStyle === style.id && styles.styleChipActive,
                      ]}
                      onPress={() => setNftStyle(style.id)}
                    >
                      <Text style={styles.styleEmoji}>{style.emoji}</Text>
                      <Text
                        style={[
                          styles.styleChipText,
                          nftStyle === style.id && styles.styleChipTextActive,
                        ]}
                      >
                        {style.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <TouchableOpacity
                  style={[
                    styles.transformButton,
                    (isTransforming || transformedImage) && styles.transformButtonDisabled,
                  ]}
                  onPress={handleTransformImage}
                  disabled={isTransforming || !!transformedImage}
                  activeOpacity={0.7}
                >
                  {isTransforming ? (
                    <>
                      <ActivityIndicator size="small" color={tokens.colors.background} />
                      <Text style={styles.transformButtonText}>Transforming...</Text>
                    </>
                  ) : transformedImage ? (
                    <>
                      <Sparkles size={20} color={tokens.colors.background} strokeWidth={2} />
                      <Text style={styles.transformButtonText}>✓ Transformed</Text>
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} color={tokens.colors.background} strokeWidth={2} />
                      <Text style={styles.transformButtonText}>Transform to NFT</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {transformedImage && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Step 3: NFT Details</Text>
              </View>
            )}

            {transformedImage && (
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
            )}

            {transformedImage && (
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
            )}

            {transformedImage && (
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
            )}
          </View>

          {transformedImage && (
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
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 NFT Creation Guide</Text>
            <Text style={styles.infoText}>
              • Take/select any photo you want to transform{"\n"}
              • Choose your preferred NFT art style{"\n"}
              • AI will transform it into unique NFT art{"\n"}
              • Add title and description{"\n"}
              • Mint your NFT using Trust-Tokens{"\n"}
              • List for sale or gift to other users
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <PhotoCameraModal
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleImageCapture}
        photoType="gallery"
        title="Select Image for NFT"
      />
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
  previewWithOverlay: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  overlayBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: tokens.colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
  },
  overlayText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  buttonRow: {
    flexDirection: "row" as const,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: tokens.colors.gold,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
  styleRow: {
    flexDirection: "row" as const,
    gap: 12,
    paddingVertical: 8,
  },
  styleChip: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    backgroundColor: tokens.colors.surface,
  },
  styleChipActive: {
    borderColor: tokens.colors.gold,
    backgroundColor: tokens.colors.gold + "20",
  },
  styleEmoji: {
    fontSize: 18,
  },
  styleChipText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  styleChipTextActive: {
    color: tokens.colors.gold,
    fontWeight: "700" as const,
  },
  transformButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: tokens.colors.gold,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    marginTop: 12,
  },
  transformButtonDisabled: {
    opacity: 0.6,
  },
  transformButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: tokens.colors.background,
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
