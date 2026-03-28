import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Plus, DollarSign, Gift, X } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import { useState } from "react";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function NFTGallery() {
  const router = useRouter();
  const { nfts, userProfile, listNFTForSale, cancelNFTListing, giftNFT } = useR3al();
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);

  const myNFTs = nfts.filter(nft => nft.ownerId === (userProfile?.name || 'user'));

  const handleListForSale = (nftId: string) => {
    Alert.prompt(
      "List for Sale",
      "Enter the sale price in Trust-Tokens:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "List",
          onPress: (price) => {
            const parsedPrice = parseInt(price || "0");
            if (parsedPrice > 0) {
              listNFTForSale(nftId, parsedPrice);
              Alert.alert("Success", `NFT listed for ${parsedPrice} tokens`);
              setSelectedNFT(null);
            } else {
              Alert.alert("Error", "Please enter a valid price");
            }
          },
        },
      ],
      "plain-text",
      "",
      "number-pad"
    );
  };

  const handleCancelListing = (nftId: string) => {
    Alert.alert(
      "Cancel Listing",
      "Are you sure you want to remove this NFT from the marketplace?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            cancelNFTListing(nftId);
            setSelectedNFT(null);
          },
        },
      ]
    );
  };

  const handleGift = (nftId: string) => {
    Alert.prompt(
      "Gift NFT",
      "Enter recipient's username:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Gift",
          onPress: (recipient) => {
            if (recipient?.trim()) {
              try {
                giftNFT(nftId, recipient.trim());
                Alert.alert("🎁 Gift Sent!", `NFT has been gifted to ${recipient}`);
                setSelectedNFT(null);
              } catch (error) {
                Alert.alert("Error", error instanceof Error ? error.message : "Failed to gift NFT");
              }
            } else {
              Alert.alert("Error", "Please enter a recipient username");
            }
          },
        },
      ],
      "plain-text"
    );
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
          <Text style={styles.headerTitle}>My NFT Gallery</Text>
          <TouchableOpacity onPress={() => router.push("/r3al/hive/nft-creator")} style={styles.addButton}>
            <Plus size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{myNFTs.length}</Text>
              <Text style={styles.statLabel}>NFTs Owned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{myNFTs.filter(n => n.forSale).length}</Text>
              <Text style={styles.statLabel}>Listed</Text>
            </View>
          </View>

          {myNFTs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎨</Text>
              <Text style={styles.emptyTitle}>No NFTs Yet</Text>
              <Text style={styles.emptyText}>
                Create your first NFT to get started in the R3AL Hive marketplace
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push("/r3al/hive/nft-creator")}
              >
                <Plus size={20} color={tokens.colors.background} strokeWidth={2} />
                <Text style={styles.createButtonText}>Create NFT</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.grid}>
              {myNFTs.map((nft) => (
                <View key={nft.id} style={styles.nftCard}>
                  <Image source={{ uri: nft.metadata.imageUrl }} style={styles.nftImage} resizeMode="cover" />
                  {nft.forSale && (
                    <View style={styles.forSaleBadge}>
                      <Text style={styles.forSaleText}>FOR SALE</Text>
                    </View>
                  )}
                  <View style={styles.nftInfo}>
                    <Text style={styles.nftTitle} numberOfLines={1}>{nft.metadata.title}</Text>
                    {nft.forSale && nft.salePrice && (
                      <Text style={styles.nftPrice}>{nft.salePrice} 🪙</Text>
                    )}
                    {nft.metadata.description && (
                      <Text style={styles.nftDescription} numberOfLines={2}>
                        {nft.metadata.description}
                      </Text>
                    )}
                  </View>
                  <View style={styles.nftActions}>
                    {!nft.forSale ? (
                      <>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleListForSale(nft.id)}
                        >
                          <DollarSign size={18} color={tokens.colors.gold} strokeWidth={2} />
                          <Text style={styles.actionButtonText}>List</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleGift(nft.id)}
                        >
                          <Gift size={18} color={tokens.colors.gold} strokeWidth={2} />
                          <Text style={styles.actionButtonText}>Gift</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonFull]}
                        onPress={() => handleCancelListing(nft.id)}
                      >
                        <X size={18} color={tokens.colors.error} strokeWidth={2} />
                        <Text style={[styles.actionButtonText, { color: tokens.colors.error }]}>
                          Cancel Listing
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
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
  addButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsCard: {
    flexDirection: "row" as const,
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: tokens.colors.gold + "30",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  emptyText: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 24,
  },
  createButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: tokens.dimensions.borderRadius,
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
  grid: {
    gap: 16,
  },
  nftCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    overflow: "hidden",
  },
  nftImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: tokens.colors.background,
  },
  forSaleBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  forSaleText: {
    fontSize: 10,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
    letterSpacing: 0.5,
  },
  nftInfo: {
    padding: 16,
    gap: 8,
    minHeight: 120,
  },
  nftTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  nftPrice: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.text,
    marginTop: 4,
  },
  nftDescription: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
    marginTop: 8,
  },
  nftActions: {
    flexDirection: "row" as const,
    gap: 12,
    padding: 16,
    paddingTop: 0,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: tokens.colors.background,
    paddingVertical: 12,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  actionButtonFull: {
    borderColor: tokens.colors.error,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
});
