import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown, DollarSign, Newspaper } from "lucide-react-native";

export default function MarketPulseScreen() {
  const [activeTab, setActiveTab] = useState<"summary" | "news">("summary");

  const summaryQuery = trpc.r3al.market.getSummary.useQuery(
    {},
    { enabled: activeTab === "summary" }
  );

  const newsQuery = trpc.r3al.market.getNews.useQuery(
    { limit: 20, category: "all" },
    { enabled: activeTab === "news" }
  );

  const isLoading = activeTab === "summary" ? summaryQuery.isLoading : newsQuery.isLoading;
  const error = activeTab === "summary" ? summaryQuery.error : newsQuery.error;
  const refetch = activeTab === "summary" ? summaryQuery.refetch : newsQuery.refetch;

  const renderChangeIndicator = (change: number) => {
    const isPositive = change >= 0;
    return (
      <View style={[styles.changeContainer, isPositive ? styles.positiveChange : styles.negativeChange]}>
        {isPositive ? <TrendingUp size={14} color="#10B981" /> : <TrendingDown size={14} color="#EF4444" />}
        <Text style={[styles.changeText, isPositive ? styles.positiveText : styles.negativeText]}>
          {isPositive ? "+" : ""}{change.toFixed(2)}%
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Market Pulse",
          headerStyle: { backgroundColor: "#000000" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "summary" && styles.activeTab]}
          onPress={() => setActiveTab("summary")}
        >
          <Text style={[styles.tabText, activeTab === "summary" && styles.activeTabText]}>
            Summary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "news" && styles.activeTab]}
          onPress={() => setActiveTab("news")}
        >
          <Text style={[styles.tabText, activeTab === "news" && styles.activeTabText]}>
            News
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#FF6B3D" />
        }
      >
        {isLoading && !summaryQuery.data && !newsQuery.data && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B3D" />
            <Text style={styles.loadingText}>Loading market data...</Text>
          </View>
        )}

        {error && !summaryQuery.data && !newsQuery.data && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load market data</Text>
            <Text style={styles.errorSubtext}>
              The server is experiencing high traffic. Cached data will be shown when available.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "summary" && summaryQuery.data && (
          <>
            <View style={styles.sentimentCard}>
              <Text style={styles.sentimentLabel}>Market Sentiment</Text>
              <Text style={styles.sentimentValue}>
                {summaryQuery.data.data.sentiment.overall.toUpperCase()}
              </Text>
              <Text style={styles.sentimentScore}>Score: {summaryQuery.data.data.sentiment.score}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Major Indices</Text>
              {summaryQuery.data.data.indices.map((index) => (
                <View key={index.symbol} style={styles.marketCard}>
                  <View style={styles.marketHeader}>
                    <View>
                      <Text style={styles.marketSymbol}>{index.symbol}</Text>
                      <Text style={styles.marketName}>{index.name}</Text>
                    </View>
                    {renderChangeIndicator(index.changePercent)}
                  </View>
                  <View style={styles.marketFooter}>
                    <View style={styles.priceContainer}>
                      <DollarSign size={16} color="#FF6B3D" />
                      <Text style={styles.price}>{index.price.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.volume}>Vol: {(index.volume / 1000000).toFixed(1)}M</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cryptocurrency</Text>
              {summaryQuery.data.data.crypto.map((coin) => (
                <View key={coin.symbol} style={styles.marketCard}>
                  <View style={styles.marketHeader}>
                    <View>
                      <Text style={styles.marketSymbol}>{coin.symbol}</Text>
                      <Text style={styles.marketName}>{coin.name}</Text>
                    </View>
                    {renderChangeIndicator(coin.changePercent)}
                  </View>
                  <View style={styles.marketFooter}>
                    <View style={styles.priceContainer}>
                      <DollarSign size={16} color="#FF6B3D" />
                      <Text style={styles.price}>{coin.price.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.volume}>Vol: {(coin.volume / 1000000000).toFixed(1)}B</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === "news" && newsQuery.data && (
          <View style={styles.section}>
            {newsQuery.data.news.map((article) => (
              <View key={article.id} style={styles.newsCard}>
                <View style={styles.newsHeader}>
                  <Newspaper size={16} color="#FF6B3D" />
                  <Text style={styles.newsSource}>{article.source}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                  </View>
                </View>
                <Text style={styles.newsTitle}>{article.title}</Text>
                <Text style={styles.newsSummary}>{article.summary}</Text>
                <Text style={styles.newsTime}>
                  {new Date(article.timestamp).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#121212",
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B3D",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#8E92BC",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  loadingText: {
    color: "#8E92BC",
    fontSize: 14,
  },
  sentimentCard: {
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  sentimentLabel: {
    color: "#8E92BC",
    fontSize: 14,
  },
  sentimentValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700" as const,
  },
  sentimentScore: {
    color: "#FF6B3D",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  marketCard: {
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  marketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marketSymbol: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700" as const,
  },
  marketName: {
    color: "#8E92BC",
    fontSize: 14,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  positiveChange: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  negativeChange: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  positiveText: {
    color: "#10B981",
  },
  negativeText: {
    color: "#EF4444",
  },
  marketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  price: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  volume: {
    color: "#8E92BC",
    fontSize: 12,
  },
  newsCard: {
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  newsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  newsSource: {
    color: "#FF6B3D",
    fontSize: 12,
    fontWeight: "600" as const,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: "#8E92BC",
    fontSize: 10,
    fontWeight: "600" as const,
  },
  newsTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    lineHeight: 22,
  },
  newsSummary: {
    color: "#8E92BC",
    fontSize: 14,
    lineHeight: 20,
  },
  newsTime: {
    color: "#8E92BC",
    fontSize: 12,
  },
  errorContainer: {
    alignItems: "center",
    padding: 48,
    gap: 12,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 18,
    fontWeight: "700" as const,
  },
  errorSubtext: {
    color: "#8E92BC",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#FF6B3D",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
