import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, TrendingUp, TrendingDown, Award, RefreshCw, Zap, Coins, Shield, Star, Activity } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef } from "react";
import CyberCard from "@/components/CyberCard";
import GlitchText from "@/components/GlitchText";
import ScanlineOverlay from "@/components/ScanlineOverlay";

export default function TokenWallet() {
  const router = useRouter();
  const { tokenBalance: localBalance, nfts, userProfile } = useR3al();
  
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim, pulseAnim]);
  
  const balanceQuery = trpc.r3al.tokens.getBalance.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: false,
    onError: (error) => {
      console.error('[TokenWallet] Balance query error (backend unavailable):', error.message);
    },
  });
  
  const transactionsQuery = trpc.r3al.tokens.getTransactions.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: false,
    onError: (error) => {
      console.error('[TokenWallet] Transactions query error (backend unavailable):', error.message);
    },
  });
  
  const tokenBalance = balanceQuery.data?.balance || localBalance || {
    available: 0,
    earned: 0,
    spent: 0,
    lastUpdated: new Date().toISOString(),
  };

  const isLoading = false;
  
  const handleRefresh = () => {
    balanceQuery.refetch();
    transactionsQuery.refetch();
  };

  const backendTransactions = transactionsQuery.data?.transactions || [];
  
  const nftTransactions = [
    ...(nfts || [])
      .filter(nft => nft?.metadata?.creatorId === (userProfile?.name || 'user'))
      .map(nft => ({
        id: `nft_mint_${nft.id}`,
        type: 'spent' as const,
        amount: nft.metadata.tokenCost || 0,
        reason: `Minted "${nft.metadata.title}"`,
        timestamp: nft.metadata.mintedAt,
      })),
    ...(nfts || [])
      .filter(nft => 
        nft?.transferHistory?.some(t => 
          t.type === 'purchase' && t.to === (userProfile?.name || 'user')
        )
      )
      .map(nft => {
        const purchase = nft.transferHistory?.find(
          t => t.type === 'purchase' && t.to === (userProfile?.name || 'user')
        );
        return {
          id: `nft_purchase_${nft.id}`,
          type: 'spent' as const,
          amount: purchase?.price || 0,
          reason: `Purchased "${nft.metadata.title}"`,
          timestamp: purchase?.timestamp || new Date().toISOString(),
        };
      }),
  ];
  
  const transactions = [...(backendTransactions || []), ...(nftTransactions || [])]
    .filter(tx => tx && tx.timestamp)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#121218', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />
      <ScanlineOverlay opacity={0.05} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <View style={styles.iconGlow}>
              <ArrowLeft size={24} color="#00FFF0" strokeWidth={2} />
            </View>
          </TouchableOpacity>
          
          <GlitchText text="DIGITAL WALLET" style={styles.headerTitle} />
          
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton} disabled={isLoading}>
            <View style={styles.iconGlow}>
              <RefreshCw size={20} color="#00FFF0" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <CyberCard style={styles.balanceCard}>
            <Animated.View style={[styles.balanceGlow, { opacity: glowOpacity }]} />
            
            <View style={styles.balanceHeader}>
              <View style={styles.balanceIconContainer}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Coins size={48} color="#00FFF0" strokeWidth={1.5} />
                </Animated.View>
                <View style={styles.balanceIconGlow} />
              </View>
            </View>
            
            <Text style={styles.balanceLabel}>TRUST-TOKEN BALANCE</Text>
            
            <View style={styles.balanceValueContainer}>
              <GlitchText 
                text={`${tokenBalance?.available ?? 0}`}
                style={styles.balanceValue}
                glitchIntensity="medium"
              />
              <Zap size={32} color="#FFE900" strokeWidth={2} />
            </View>
            
            <Text style={styles.balanceDate}>
              SYS_UPDATED: {tokenBalance?.lastUpdated ? new Date(tokenBalance.lastUpdated).toLocaleTimeString() : 'LIVE'}
            </Text>
            
            <View style={styles.statsDivider} />
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <TrendingUp size={20} color="#00FF66" strokeWidth={2} />
                <Text style={styles.statLabel}>EARNED</Text>
                <Text style={styles.statValueGreen}>{tokenBalance?.earned ?? 0}</Text>
              </View>
              
              <View style={styles.statSeparator} />
              
              <View style={styles.statItem}>
                <TrendingDown size={20} color="#FF2E97" strokeWidth={2} />
                <Text style={styles.statLabel}>SPENT</Text>
                <Text style={styles.statValueRed}>{tokenBalance?.spent ?? 0}</Text>
              </View>
            </View>
          </CyberCard>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <LinearGradient
                colors={['#00FFF020', '#00FFF005']}
                style={styles.actionGradient}
              />
              <Shield size={24} color="#00FFF0" strokeWidth={2} />
              <Text style={styles.actionText}>SECURE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <LinearGradient
                colors={['#BD00FF20', '#BD00FF05']}
                style={styles.actionGradient}
              />
              <Star size={24} color="#BD00FF" strokeWidth={2} />
              <Text style={styles.actionText}>EARN</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <LinearGradient
                colors={['#FFE90020', '#FFE90005']}
                style={styles.actionGradient}
              />
              <Activity size={24} color="#FFE900" strokeWidth={2} />
              <Text style={styles.actionText}>HISTORY</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>{'//'} TRANSACTION_LOG</Text>
            </View>
          </View>

          {transactions.length === 0 ? (
            <CyberCard style={styles.emptyState}>
              <Text style={styles.emptyIcon}>⚡</Text>
              <Text style={styles.emptyTitle}>NO_DATA_FOUND</Text>
              <Text style={styles.emptyText}>
                Your transaction history will be logged here
              </Text>
            </CyberCard>
          ) : (
            <View style={styles.transactionList}>
              {transactions.map((tx, index) => (
                <CyberCard key={index} style={styles.transactionCard}>
                  <View style={[
                    styles.transactionIcon,
                    tx.type === 'earned' ? styles.transactionIconEarned : styles.transactionIconSpent
                  ]}>
                    {tx.type === 'earned' ? (
                      <TrendingUp size={20} color="#00FF66" strokeWidth={2} />
                    ) : (
                      <TrendingDown size={20} color="#FF2E97" strokeWidth={2} />
                    )}
                  </View>
                  
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionReason}>{tx.reason}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(tx.timestamp).toLocaleDateString()} • {new Date(tx.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                  
                  <Text style={[
                    styles.transactionAmount,
                    tx.type === 'earned' ? styles.transactionAmountEarned : styles.transactionAmountSpent
                  ]}>
                    {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                  </Text>
                </CyberCard>
              ))}
            </View>
          )}

          <CyberCard style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Award size={24} color="#FFE900" strokeWidth={2} />
              <Text style={styles.infoTitle}>EARN_MORE_TOKENS</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoList}>
              {[
                '→ Complete verification protocols',
                '→ Maintain high integrity scores',
                '→ Participate in community events',
                '→ Report system violations',
                '→ Trade NFTs in marketplace',
              ].map((item, i) => (
                <Text key={i} style={styles.infoItem}>{item}</Text>
              ))}
            </View>
          </CyberCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
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
    borderBottomWidth: 2,
    borderBottomColor: "#00FFF020",
  },
  backButton: {
    padding: 8,
  },
  iconGlow: {
    shadowColor: "#00FFF0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#00FFF0",
    letterSpacing: 2,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    padding: 28,
    marginBottom: 20,
    alignItems: "center",
    position: "relative" as const,
  },
  balanceGlow: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00FFF0",
    borderRadius: 12,
    opacity: 0.1,
  },
  balanceHeader: {
    marginBottom: 16,
  },
  balanceIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#0A0A0F",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#00FFF0",
    position: "relative" as const,
  },
  balanceIconGlow: {
    position: "absolute" as const,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#00FFF0",
    opacity: 0.2,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#A0A0B0",
    marginBottom: 12,
    letterSpacing: 2,
  },
  balanceValueContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 64,
    fontWeight: "bold" as const,
    color: "#00FFF0",
    textShadowColor: "#00FFF080",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  balanceDate: {
    fontSize: 10,
    color: "#606070",
    marginBottom: 20,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  statsDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#00FFF020",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row" as const,
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 6,
  },
  statLabel: {
    fontSize: 11,
    color: "#A0A0B0",
    fontWeight: "600" as const,
    letterSpacing: 1,
  },
  statValueGreen: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#00FF66",
  },
  statValueRed: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#FF2E97",
  },
  statSeparator: {
    width: 1,
    backgroundColor: "#00FFF020",
  },
  quickActions: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 28,
  },
  actionButton: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#00FFF030",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    overflow: "hidden",
    position: "relative" as const,
  },
  actionGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: "#00FFF0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#00FFF0",
    fontFamily: "monospace",
    letterSpacing: 1,
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
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#00FFF0",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  emptyText: {
    fontSize: 14,
    color: "#A0A0B0",
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
    padding: 16,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  transactionIconEarned: {
    backgroundColor: "#00FF6615",
    borderColor: "#00FF66",
  },
  transactionIconSpent: {
    backgroundColor: "#FF2E9715",
    borderColor: "#FF2E97",
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionReason: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  transactionDate: {
    fontSize: 11,
    color: "#606070",
    fontFamily: "monospace",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold" as const,
  },
  transactionAmountEarned: {
    color: "#00FF66",
  },
  transactionAmountSpent: {
    color: "#FF2E97",
  },
  infoCard: {
    padding: 20,
  },
  infoHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#FFE900",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  infoDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#FFE90030",
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    fontSize: 13,
    color: "#A0A0B0",
    lineHeight: 20,
    fontFamily: "monospace",
  },
});
