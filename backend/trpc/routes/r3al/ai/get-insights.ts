import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getInsightsProcedure = protectedProcedure
  .input(
    z.object({
      timeframe: z.enum(["day", "week", "month"]).default("week"),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log("[AI Insights] Generating insights for user:", ctx.user.id);

    const insights = {
      summary: "Your engagement has been trending upward this week with a 23% increase in meaningful interactions.",
      metrics: {
        pulseActivity: {
          current: 85,
          previous: 69,
          change: 23,
          trend: "up" as const,
        },
        truthScore: {
          current: 87,
          previous: 82,
          change: 6,
          trend: "up" as const,
        },
        hiveConnections: {
          current: 42,
          previous: 38,
          change: 11,
          trend: "up" as const,
        },
        tokenBalance: {
          current: 1250,
          previous: 980,
          change: 28,
          trend: "up" as const,
        },
      },
      insights: [
        {
          id: "insight_1",
          type: "engagement",
          title: "Peak Activity Times",
          description: "Your Pulse is strongest on weekends between 2-6 PM. Consider scheduling important conversations during these windows.",
          priority: "high",
          actionable: true,
        },
        {
          id: "insight_2",
          type: "social",
          title: "Hive Growth",
          description: "Your connections show 30% higher sentiment compared to last week. Your authenticity is building trust.",
          priority: "medium",
          actionable: false,
        },
        {
          id: "insight_3",
          type: "financial",
          title: "Token Earning Pattern",
          description: "You earn the most tokens through honesty checks and daily engagement. Keep up the consistency!",
          priority: "low",
          actionable: true,
        },
      ],
      recommendations: [
        {
          id: "rec_1",
          title: "Complete Daily Check-ins",
          description: "Earn up to 50 bonus tokens this week by maintaining your daily streak.",
          type: "action",
        },
        {
          id: "rec_2",
          title: "Explore Market Pulse",
          description: "Based on your interests, you might enjoy the new Market Data feature.",
          type: "feature",
        },
      ],
      generatedAt: new Date().toISOString(),
      timeframe: input.timeframe,
    };

    console.log("[AI Insights] Generated", insights.insights.length, "insights");

    return {
      success: true,
      insights,
    };
  });
