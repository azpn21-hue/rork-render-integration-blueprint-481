import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const getMarketNewsProcedure = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(10),
      category: z.enum(["all", "stocks", "crypto", "economy"]).default("all"),
    })
  )
  .query(async ({ input }) => {
    console.log("[Market] Fetching market news");

    const mockNews = [
      {
        id: "news_1",
        title: "Tech Stocks Rally on Strong Earnings Reports",
        summary: "Major tech companies report better-than-expected earnings, driving market optimism.",
        source: "Financial Times",
        url: "https://example.com/news/1",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        category: "stocks",
        sentiment: "positive",
        relevance: 0.95,
      },
      {
        id: "news_2",
        title: "Bitcoin Reaches New Monthly High",
        summary: "Bitcoin surges past resistance levels as institutional interest grows.",
        source: "CoinDesk",
        url: "https://example.com/news/2",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        category: "crypto",
        sentiment: "positive",
        relevance: 0.92,
      },
      {
        id: "news_3",
        title: "Federal Reserve Signals Rate Stability",
        summary: "Fed officials suggest maintaining current interest rates through next quarter.",
        source: "Bloomberg",
        url: "https://example.com/news/3",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        category: "economy",
        sentiment: "neutral",
        relevance: 0.88,
      },
      {
        id: "news_4",
        title: "AI Stocks Continue Upward Momentum",
        summary: "Artificial intelligence sector shows sustained growth across multiple companies.",
        source: "CNBC",
        url: "https://example.com/news/4",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        category: "stocks",
        sentiment: "positive",
        relevance: 0.90,
      },
      {
        id: "news_5",
        title: "Ethereum Network Upgrade Successful",
        summary: "Latest Ethereum update improves transaction speeds and reduces gas fees.",
        source: "CryptoNews",
        url: "https://example.com/news/5",
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        category: "crypto",
        sentiment: "positive",
        relevance: 0.87,
      },
    ];

    const filteredNews = input.category === "all" 
      ? mockNews 
      : mockNews.filter(n => n.category === input.category);

    const news = filteredNews.slice(0, input.limit);

    console.log("[Market] Returning", news.length, "news items");

    return {
      success: true,
      news,
      category: input.category,
    };
  });
