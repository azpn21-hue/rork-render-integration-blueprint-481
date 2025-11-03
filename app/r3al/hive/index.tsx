import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Plus, Image as ImageIcon, Store, Wallet } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function HiveHome() {
  const router = useRouter();
  const { nfts, tokenBalance, userProfile } = useR3al();

  const myNFTs = nfts.filter(nft => nft.ownerId === (userProfile?.name || 'user'));
  const forSaleNFTs = nfts.filter(nft => nft.forSale);

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
          <Text style={styles.headerTitle}>R3AL Hive™</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>NFT Marketplace</Text>
            <Text style={styles.heroSubtitle}>
              Create, trade, and gift unique digital assets using Trust-Tokens™
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{myNFTs.length}</Text>
                <Text style={styles.heroStatLabel}>Your NFTs</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{tokenBalance.available}</Text>
                <Text style={styles.heroStatLabel}>Tokens</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{forSaleNFTs.length}</Text>
                <Text style={styles.heroStatLabel}>For Sale</Text>
              </View>
            </View>
          </View>

          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => router.push("/r3al/hive/nft-creator")}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Plus size={32} color={tokens.colors.gold} strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>Create NFT</Text>
              <Text style={styles.menuDescription}>
                Mint new NFTs using Trust-Tokens
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => router.push("/r3al/hive/nft-gallery")}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <ImageIcon size={32} color={tokens.colors.gold} strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>My Gallery</Text>
              <Text style={styles.menuDescription}>
                View and manage your NFT collection
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => router.push("/r3al/hive/nft-marketplace")}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Store size={32} color={tokens.colors.gold} strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>Marketplace</Text>
              <Text style={styles.menuDescription}>
                Browse and purchase NFTs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => router.push("/r3al/hive/token-wallet")}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Wallet size={32} color={tokens.colors.gold} strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>Token Wallet</Text>
              <Text style={styles.menuDescription}>
                View balance and transaction history
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🪙 Trust-Token™ Economy</Text>
            <Text style={styles.infoText}>
              • Earn tokens through verification and community engagement{"\n"}
              • Use tokens to mint NFTs and unlock features{"\n"}
              • Trade NFTs in the marketplace{"\n"}
              • Gift NFTs to other users{"\n"}
              • Higher integrity scores earn more tokens
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
  heroCard: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: tokens.colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  heroStats: {
    flexDirection: "row" as const,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "30",
    paddingTop: 16,
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroStatValue: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  heroDivider: {
    width: 1,
    backgroundColor: tokens.colors.gold + "30",
  },
  menuGrid: {
    gap: 16,
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 16,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
  },
  menuTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  menuDescription: {
    position: "absolute",
    left: 92,
    right: 20,
    bottom: 20,
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
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
