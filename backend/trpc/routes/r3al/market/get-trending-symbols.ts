import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getTrendingSymbolsProcedure = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(10),
      category: z.enum(["stocks", "crypto", "all"]).default("all"),
    })
  )
  .query(async ({ input }) => {
    console.log("[Market] Fetching trending symbols");

    const mockTrendingStocks = [
      { symbol: "AAPL", name: "Apple Inc.", change: 2.34, changePercent: 1.23, volume: 123456789 },
      { symbol: "MSFT", name: "Microsoft", change: 5.67, changePercent: 1.89, volume: 98765432 },
      { symbol: "GOOGL", name: "Alphabet", change: -1.23, changePercent: -0.45, volume: 87654321 },
      { symbol: "TSLA", name: "Tesla", change: 12.34, changePercent: 4.56, volume: 234567890 },
      { symbol: "NVDA", name: "NVIDIA", change: 8.90, changePercent: 2.12, volume: 178901234 },
    ];

    const mockTrendingCrypto = [
      { symbol: "BTC", name: "Bitcoin", change: 1234.56, changePercent: 2.94, volume: 28456789012 },
      { symbol: "ETH", name: "Ethereum", change: -45.67, changePercent: -1.97, volume: 15678901234 },
      { symbol: "SOL", name: "Solana", change: 3.21, changePercent: 3.37, volume: 987654321 },
      { symbol: "ADA", name: "Cardano", change: 0.12, changePercent: 5.67, volume: 567890123 },
      { symbol: "AVAX", name: "Avalanche", change: 2.34, changePercent: 6.78, volume: 456789012 },
    ];

    let trending = [];
    if (input.category === "stocks") {
      trending = mockTrendingStocks.slice(0, input.limit);
    } else if (input.category === "crypto") {
      trending = mockTrendingCrypto.slice(0, input.limit);
    } else {
      trending = [...mockTrendingStocks, ...mockTrendingCrypto].slice(0, input.limit);
    }

    console.log("[Market] Returning", trending.length, "trending symbols");

    return {
      success: true,
      trending,
      category: input.category,
    };
  });
