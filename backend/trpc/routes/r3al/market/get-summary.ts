import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getMarketSummaryProcedure = protectedProcedure
  .input(
    z.object({
      symbols: z.array(z.string()).optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[Market] Fetching live market summary");

    let cryptoData = null;

    try {
      const cryptoResponse = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true"
      );
      if (cryptoResponse.ok) {
        const crypto = await cryptoResponse.json();
        cryptoData = [
          {
            symbol: "BTC",
            name: "Bitcoin",
            price: crypto.bitcoin?.usd || 43250,
            change: ((crypto.bitcoin?.usd_24h_change || 0) * crypto.bitcoin?.usd) / 100,
            changePercent: crypto.bitcoin?.usd_24h_change || 0,
            volume: crypto.bitcoin?.usd_24h_vol || 28000000000,
          },
          {
            symbol: "ETH",
            name: "Ethereum",
            price: crypto.ethereum?.usd || 2250,
            change: ((crypto.ethereum?.usd_24h_change || 0) * crypto.ethereum?.usd) / 100,
            changePercent: crypto.ethereum?.usd_24h_change || 0,
            volume: crypto.ethereum?.usd_24h_vol || 15000000000,
          },
          {
            symbol: "SOL",
            name: "Solana",
            price: crypto.solana?.usd || 98,
            change: ((crypto.solana?.usd_24h_change || 0) * crypto.solana?.usd) / 100,
            changePercent: crypto.solana?.usd_24h_change || 0,
            volume: crypto.solana?.usd_24h_vol || 980000000,
          },
        ];
        console.log("[Market] ✅ Fetched live crypto data");
      }
    } catch (error) {
      console.error("[Market] ❌ Failed to fetch crypto data:", error);
    }

    const calculateSentiment = () => {
      if (!cryptoData) {
        return { overall: "neutral", score: 50, trending: ["tech", "crypto", "ai"] };
      }
      const avgChange = cryptoData.reduce((sum, coin) => sum + coin.changePercent, 0) / cryptoData.length;
      if (avgChange > 2) return { overall: "bullish", score: 75, trending: ["tech", "crypto", "ai"] };
      if (avgChange > 0) return { overall: "positive", score: 60, trending: ["tech", "crypto"] };
      if (avgChange > -2) return { overall: "neutral", score: 50, trending: ["tech"] };
      return { overall: "bearish", score: 35, trending: ["bonds", "safe-haven"] };
    };

    const mockMarketData = {
      timestamp: new Date().toISOString(),
      indices: [
        {
          symbol: "SPY",
          name: "S&P 500",
          price: 445.67,
          change: 2.34,
          changePercent: 0.53,
          volume: 87234567,
        },
        {
          symbol: "DIA",
          name: "Dow Jones",
          price: 347.89,
          change: -1.23,
          changePercent: -0.35,
          volume: 12345678,
        },
        {
          symbol: "QQQ",
          name: "NASDAQ",
          price: 378.45,
          change: 4.56,
          changePercent: 1.22,
          volume: 56789012,
        },
      ],
      crypto: cryptoData || [
        {
          symbol: "BTC",
          name: "Bitcoin",
          price: 43250.78,
          change: 1234.56,
          changePercent: 2.94,
          volume: 28456789012,
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          price: 2267.89,
          change: -45.67,
          changePercent: -1.97,
          volume: 15678901234,
        },
        {
          symbol: "SOL",
          name: "Solana",
          price: 98.45,
          change: 3.21,
          changePercent: 3.37,
          volume: 987654321,
        },
      ],
      sentiment: calculateSentiment(),
      lastUpdated: new Date().toISOString(),
    };

    console.log("[Market] Returning market summary with", cryptoData ? "live" : "mock", "crypto data");

    return {
      success: true,
      data: mockMarketData,
    };
  });
