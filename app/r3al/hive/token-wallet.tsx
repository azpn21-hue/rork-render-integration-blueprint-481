import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, TrendingUp, TrendingDown, Award } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function TokenWallet() {
  const router = useRouter();
  const { tokenBalance, nfts, userProfile } = useR3al();

  if (!tokenBalance) {
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
            <Text style={styles.headerTitle}>Token Wallet</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: tokens.colors.text }}>Loading...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const transactions = [
    { type: 'earned', amount: 100, reason: 'Initial bonus', date: tokenBalance.lastUpdated },
    ...nfts
      .filter(nft => nft.metadata.creatorId === (userProfile?.name || 'user'))
      .map(nft => ({
        type: 'spent' as const,
        amount: nft.metadata.tokenCost,
        reason: `Minted "${nft.metadata.title}"`,
        date: nft.metadata.mintedAt,
      })),
    ...nfts
      .filter(nft => 
        nft.transferHistory.some(t => 
          t.type === 'purchase' && t.to === (userProfile?.name || 'user')
        )
      )
      .map(nft => {
        const purchase = nft.transferHistory.find(
          t => t.type === 'purchase' && t.to === (userProfile?.name || 'user')
        );
        return {
          type: 'spent' as const,
          amount: purchase?.price || 0,
          reason: `Purchased "${nft.metadata.title}"`,
          date: purchase?.timestamp || new Date().toISOString(),
        };
      }),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <Text style={styles.headerTitle}>Token Wallet</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>{tokenBalance.available} 🪙</Text>
            <Text style={styles.balanceDate}>
              Updated {new Date(tokenBalance.lastUpdated).toLocaleString()}
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#4ade80" strokeWidth={2} />
              <Text style={styles.statValue}>{tokenBalance.earned}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>

            <View style={styles.statCard}>
              <TrendingDown size={24} color="#f87171" strokeWidth={2} />
              <Text style={styles.statValue}>{tokenBalance.spent}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📜</Text>
              <Text style={styles.emptyTitle}>No Transactions Yet</Text>
              <Text style={styles.emptyText}>
                Your token transactions will appear here
              </Text>
            </View>
          ) : (
            <View style={styles.transactionList}>
              {transactions.map((tx, index) => (
                <View key={index} style={styles.transactionCard}>
                  <View style={[
                    styles.transactionIcon,
                    tx.type === 'earned' ? styles.transactionIconEarned : styles.transactionIconSpent
                  ]}>
                    {tx.type === 'earned' ? (
                      <TrendingUp size={20} color="#4ade80" strokeWidth={2} />
                    ) : (
                      <TrendingDown size={20} color="#f87171" strokeWidth={2} />
                    )}
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionReason}>{tx.reason}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(tx.date).toLocaleDateString()} at {new Date(tx.date).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    tx.type === 'earned' ? styles.transactionAmountEarned : styles.transactionAmountSpent
                  ]}>
                    {tx.type === 'earned' ? '+' : '-'}{tx.amount} 🪙
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.infoCard}>
            <Award size={20} color={tokens.colors.gold} strokeWidth={2} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Earn More Tokens</Text>
              <Text style={styles.infoText}>
                • Complete verification steps{"\n"}
                • Maintain high integrity scores{"\n"}
                • Participate in community events{"\n"}
                • Report bugs and violations{"\n"}
                • Sell NFTs in the marketplace
              </Text>
            </View>
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
    padding: 32,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 8,
  },
  balanceDate: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  statsGrid: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "20",
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  sectionHeader: {
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
  },
  transactionList: {
    gap: 12,
    marginBottom: 24,
  },
  transactionCard: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "20",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionIconEarned: {
    backgroundColor: "#4ade8020",
  },
  transactionIconSpent: {
    backgroundColor: "#f8717120",
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionReason: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold" as const,
  },
  transactionAmountEarned: {
    color: "#4ade80",
  },
  transactionAmountSpent: {
    color: "#f87171",
  },
  infoCard: {
    flexDirection: "row" as const,
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "20",
    gap: 12,
  },
  infoContent: {
    flex: 1,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  infoText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
});
