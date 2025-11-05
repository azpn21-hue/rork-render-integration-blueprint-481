import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getMarketNewsProcedure = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(10),
      category: z.enum(["all", "stocks", "crypto", "economy"]).default("all"),
    })
  )
  .query(async ({ input }) => {
    console.log("[Market] Fetching live market news");

    let liveNews: any[] = [];

    try {
      const newsResponse = await fetch(
        "https://newsdata.io/api/1/news?apikey=pub_6383218e01e5b3ec5d58f0f6f29fce8f8ad81&q=market%20OR%20stock%20OR%20crypto%20OR%20bitcoin%20OR%20economy&language=en&category=business"
      );
      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        if (newsData.results && Array.isArray(newsData.results)) {
          liveNews = newsData.results.slice(0, input.limit).map((article: any, index: number) => ({
            id: `news_live_${index}`,
            title: article.title || "Market Update",
            summary: article.description || article.content?.substring(0, 150) + "..." || "Latest market news.",
            source: article.source_id || "Market News",
            url: article.link || "https://example.com",
            timestamp: article.pubDate || new Date().toISOString(),
            category: article.category?.[0] === "business" ? "stocks" : "all",
            sentiment: article.sentiment || "neutral",
            relevance: 0.9,
          }));
          console.log("[Market] ✅ Fetched", liveNews.length, "live news articles");
        }
      }
    } catch (error) {
      console.error("[Market] ❌ Failed to fetch live news:", error);
    }

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

    const allNews = liveNews.length > 0 ? liveNews : mockNews;
    const filteredNews = input.category === "all" 
      ? allNews 
      : allNews.filter(n => n.category === input.category);

    const news = filteredNews.slice(0, input.limit);

    console.log("[Market] Returning", news.length, liveNews.length > 0 ? "live" : "mock", "news items");

    return {
      success: true,
      news,
      category: input.category,
    };
  });
