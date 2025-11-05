import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const getMarketSummaryProcedure = protectedProcedure
  .input(
    z.object({
      symbols: z.array(z.string()).optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[Market] Fetching market summary");

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
      crypto: [
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
      sentiment: {
        overall: "bullish",
        score: 72,
        trending: ["tech", "crypto", "ai"],
      },
      lastUpdated: new Date().toISOString(),
    };

    console.log("[Market] Returning market summary");

    return {
      success: true,
      data: mockMarketData,
    };
  });
