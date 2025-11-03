import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity } from "react-native";
import { Coins, TrendingUp, TrendingDown, Award, Gift, ShoppingBag, Zap, History } from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import { TokenBalance } from "@/app/contexts/R3alContext";

export type TokenTransaction = {
  id: string;
  type: "earned" | "spent" | "gifted_received" | "gifted_sent";
  amount: number;
  reason: string;
  timestamp: string;
};

export type TrustTokenWalletProps = {
  balance: TokenBalance;
  recentTransactions?: TokenTransaction[];
  onEarnMore?: () => void;
  testID?: string;
};

const MOCK_TRANSACTIONS: TokenTransaction[] = [
  {
    id: "1",
    type: "earned",
    amount: 10,
    reason: "Completed daily verification",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "earned",
    amount: 5,
    reason: "Profile endorsement received",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "spent",
    amount: 50,
    reason: "Created NFT: Abstract Dreams",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "earned",
    amount: 3,
    reason: "Question of the Day submission",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

export default function TrustTokenWallet({ 
  balance, 
  recentTransactions = MOCK_TRANSACTIONS,
  onEarnMore,
  testID 
}: TrustTokenWalletProps) {
  const safeBalance = balance || {
    available: 0,
    earned: 0,
    spent: 0,
    lastUpdated: new Date().toISOString(),
  };
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <TrendingUp size={20} color="#10B981" strokeWidth={2} />;
      case "spent":
        return <ShoppingBag size={20} color="#EF4444" strokeWidth={2} />;
      case "gifted_received":
        return <Gift size={20} color="#8B5CF6" strokeWidth={2} />;
      case "gifted_sent":
        return <TrendingDown size={20} color="#F59E0B" strokeWidth={2} />;
      default:
        return <Coins size={20} color={tokens.colors.gold} strokeWidth={2} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earned":
      case "gifted_received":
        return "#10B981";
      case "spent":
      case "gifted_sent":
        return "#EF4444";
      default:
        return tokens.colors.text;
    }
  };

  return (
    <ScrollView style={styles.container} testID={testID}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={handlePress}
        style={styles.balanceCard}
      >
        <Animated.View style={[styles.balanceGlow, { opacity: glowOpacity }]} />
        
        <Animated.View style={[styles.balanceContent, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.coinIconContainer}>
            <Coins size={48} color={tokens.colors.gold} strokeWidth={1.5} />
          </View>
          
          <Text style={styles.balanceLabel}>Trust-Token Balance</Text>
          <Text style={styles.balanceValue}>{safeBalance.available.toLocaleString()}</Text>
          
          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <TrendingUp size={16} color="#10B981" strokeWidth={2} />
              <Text style={styles.balanceStatLabel}>Earned</Text>
              <Text style={[styles.balanceStatValue, { color: "#10B981" }]}>
                {safeBalance.earned.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.balanceStat}>
              <ShoppingBag size={16} color="#EF4444" strokeWidth={2} />
              <Text style={styles.balanceStatLabel}>Spent</Text>
              <Text style={[styles.balanceStatValue, { color: "#EF4444" }]}>
                {safeBalance.spent.toLocaleString()}
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.earnSection}>
        <View style={styles.earnHeader}>
          <Zap size={24} color={tokens.colors.gold} strokeWidth={2} />
          <Text style={styles.earnTitle}>Earn More Tokens</Text>
        </View>
        
        <View style={styles.earnGrid}>
          <TouchableOpacity style={styles.earnCard} activeOpacity={0.7} onPress={onEarnMore}>
            <Award size={24} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.earnCardTitle}>Complete Verification</Text>
            <Text style={styles.earnCardReward}>+10 tokens</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.earnCard} activeOpacity={0.7} onPress={onEarnMore}>
            <History size={24} color="#8B5CF6" strokeWidth={2} />
            <Text style={styles.earnCardTitle}>Daily Question</Text>
            <Text style={styles.earnCardReward}>+3 tokens</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.earnCard} activeOpacity={0.7} onPress={onEarnMore}>
            <Gift size={24} color="#10B981" strokeWidth={2} />
            <Text style={styles.earnCardTitle}>Give Endorsement</Text>
            <Text style={styles.earnCardReward}>+2 tokens</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.earnCard} activeOpacity={0.7} onPress={onEarnMore}>
            <TrendingUp size={24} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.earnCardTitle}>Weekly Streak</Text>
            <Text style={styles.earnCardReward}>+25 tokens</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.transactionsSection}>
        <View style={styles.transactionsHeader}>
          <History size={20} color={tokens.colors.gold} strokeWidth={2} />
          <Text style={styles.transactionsTitle}>Recent Activity</Text>
        </View>

        <View style={styles.transactionsList}>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                {getTransactionIcon(transaction.type)}
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionReason}>{transaction.reason}</Text>
                <Text style={styles.transactionTime}>{formatDate(transaction.timestamp)}</Text>
              </View>

              <Text
                style={[
                  styles.transactionAmount,
                  { color: getTransactionColor(transaction.type) },
                ]}
              >
                {transaction.type === "earned" || transaction.type === "gifted_received" ? "+" : "-"}
                {transaction.amount}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🪙 About Trust-Tokens</Text>
        <Text style={styles.infoText}>
          • Earned through authentic engagement and verification{"\n"}
          • Used to mint NFTs and unlock premium features{"\n"}
          • Cannot be purchased - only earned{"\n"}
          • Higher integrity scores earn more tokens{"\n"}
          • Gift tokens to recognize valuable contributions
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceCard: {
    position: "relative" as const,
    marginBottom: 24,
    borderRadius: tokens.dimensions.borderRadius,
    overflow: "hidden",
  },
  balanceGlow: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
  },
  balanceContent: {
    backgroundColor: tokens.colors.surface,
    padding: 28,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 3,
    borderColor: tokens.colors.gold,
    alignItems: "center",
  },
  coinIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: tokens.colors.gold,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  balanceValue: {
    fontSize: 56,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 20,
  },
  balanceStats: {
    flexDirection: "row" as const,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "30",
    paddingTop: 16,
  },
  balanceStat: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  balanceStatLabel: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  balanceStatValue: {
    fontSize: 18,
    fontWeight: "bold" as const,
  },
  statDivider: {
    width: 1,
    backgroundColor: tokens.colors.gold + "30",
  },
  earnSection: {
    marginBottom: 24,
  },
  earnHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  earnTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  earnGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  earnCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    alignItems: "center",
    gap: 8,
  },
  earnCardTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: tokens.colors.text,
    textAlign: "center",
  },
  earnCardReward: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  transactionsList: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
    overflow: "hidden",
  },
  transactionItem: {
    flexDirection: "row" as const,
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "10",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
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
  transactionTime: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold" as const,
  },
  infoCard: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "20",
    marginBottom: 16,
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
