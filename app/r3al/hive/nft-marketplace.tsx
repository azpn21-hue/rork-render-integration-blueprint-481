import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, ShoppingCart, TrendingUp } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function NFTMarketplace() {
  const router = useRouter();
  const { nfts, userProfile, tokenBalance, purchaseNFT } = useR3al();

  const forSaleNFTs = nfts.filter(
    nft => nft.forSale && nft.ownerId !== (userProfile?.name || 'user')
  );

  const handlePurchase = (nftId: string) => {
    const nft = nfts.find(n => n.id === nftId);
    if (!nft || !nft.salePrice) return;

    Alert.alert(
      "Purchase NFT",
      `Purchase "${nft.metadata.title}" for ${nft.salePrice} Trust-Tokens?\n\nYour balance: ${tokenBalance.available} 🪙`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Buy Now",
          onPress: () => {
            try {
              purchaseNFT(nftId);
              Alert.alert(
                "🎉 Purchase Complete!",
                `You now own "${nft.metadata.title}". Check your gallery to view it.`,
                [{ text: "View Gallery", onPress: () => router.push("/r3al/hive/nft-gallery") }]
              );
            } catch (error) {
              Alert.alert("Error", error instanceof Error ? error.message : "Purchase failed");
            }
          },
        },
      ]
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
          <Text style={styles.headerTitle}>NFT Marketplace</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <Text style={styles.balanceValue}>{tokenBalance.available} 🪙</Text>
          </View>

          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={tokens.colors.gold} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Available NFTs</Text>
          </View>

          {forSaleNFTs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🛍️</Text>
              <Text style={styles.emptyTitle}>No NFTs for Sale</Text>
              <Text style={styles.emptyText}>
                Check back later or create your own NFTs to list in the marketplace
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {forSaleNFTs.map((nft) => (
                <View key={nft.id} style={styles.nftCard}>
                  <Image source={{ uri: nft.metadata.imageUrl }} style={styles.nftImage} resizeMode="cover" />
                  <View style={styles.nftInfo}>
                    <Text style={styles.nftTitle} numberOfLines={1}>{nft.metadata.title}</Text>
                    <Text style={styles.nftCreator} numberOfLines={1}>
                      by {nft.metadata.creatorName}
                    </Text>
                    {nft.metadata.description && (
                      <Text style={styles.nftDescription} numberOfLines={2}>
                        {nft.metadata.description}
                      </Text>
                    )}
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Price</Text>
                      <Text style={styles.priceValue}>{nft.salePrice} 🪙</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      tokenBalance.available < (nft.salePrice || 0) && styles.buyButtonDisabled
                    ]}
                    onPress={() => handlePurchase(nft.id)}
                    disabled={tokenBalance.available < (nft.salePrice || 0)}
                  >
                    <ShoppingCart size={18} color={tokens.colors.background} strokeWidth={2} />
                    <Text style={styles.buyButtonText}>
                      {tokenBalance.available < (nft.salePrice || 0) ? "Insufficient Tokens" : "Buy Now"}
                    </Text>
                  </TouchableOpacity>
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
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
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
  nftInfo: {
    padding: 16,
    gap: 4,
  },
  nftTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  nftCreator: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  nftDescription: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "20",
  },
  priceLabel: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  buyButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: tokens.colors.gold,
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: tokens.dimensions.borderRadius,
  },
  buyButtonDisabled: {
    opacity: 0.5,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
});
