import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getLocalNewsProcedure = protectedProcedure
  .input(
    z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
      radius: z.number().min(1).max(100).default(25),
      limit: z.number().min(1).max(50).default(10),
    })
  )
  .query(async ({ input }) => {
    console.log("[Location] Fetching local news near:", input.lat, input.lon);

    const mockLocalNews = [
      {
        id: "local_news_1",
        title: "City Council Approves New Community Center",
        summary: "Local government invests $5M in new community facility set to open next spring.",
        source: "Local News Network",
        category: "community",
        location: "Downtown",
        distance: 2.3,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        imageUrl: null,
        relevance: 0.92,
      },
      {
        id: "local_news_2",
        title: "Tech Startup Raises $10M, Plans Local Expansion",
        summary: "Growing startup announces major funding round and commitment to hire 50 local employees.",
        source: "Business Journal",
        category: "business",
        location: "Tech District",
        distance: 4.7,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        imageUrl: null,
        relevance: 0.88,
      },
      {
        id: "local_news_3",
        title: "Weekend Farmers Market Returns This Saturday",
        summary: "Popular community market kicks off spring season with 40+ local vendors.",
        source: "Community Herald",
        category: "events",
        location: "City Park",
        distance: 1.5,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        imageUrl: null,
        relevance: 0.85,
      },
      {
        id: "local_news_4",
        title: "New Transit Route Improves Downtown Access",
        summary: "Public transportation expansion makes downtown more accessible for commuters.",
        source: "Transit Authority",
        category: "transportation",
        location: "Metro Area",
        distance: 3.2,
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        imageUrl: null,
        relevance: 0.79,
      },
      {
        id: "local_news_5",
        title: "Local Restaurant Named Best in State",
        summary: "Award-winning chef's restaurant receives prestigious culinary recognition.",
        source: "Food Magazine",
        category: "food",
        location: "Arts District",
        distance: 5.1,
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        imageUrl: null,
        relevance: 0.76,
      },
    ];

    const news = mockLocalNews
      .filter(n => n.distance <= input.radius)
      .slice(0, input.limit);

    console.log("[Location] Returning", news.length, "local news items");

    return {
      success: true,
      news,
      location: {
        lat: input.lat,
        lon: input.lon,
      },
      radius: input.radius,
    };
  });
