import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const getPersonalizedSummaryProcedure = protectedProcedure
  .input(
    z.object({
      dataType: z.enum(["all", "engagement", "market", "social"]).default("all"),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log("[AI Insights] Generating personalized summary for user:", ctx.user.id);

    const mockSummaries = {
      engagement: {
        title: "Your Engagement This Week",
        summary: "You've been highly active, completing 6 honesty checks and participating in 14 pulse chats. Your truth score improved by 5 points, reflecting your commitment to authentic communication.",
        highlights: [
          "Completed 6/7 daily check-ins",
          "Truth score: 87 (+5)",
          "Active in 3 Circles",
        ],
      },
      market: {
        title: "Market Pulse Relevant to You",
        summary: "Based on your interests in tech and crypto, this week showed strong gains. BTC is up 2.94% and tech stocks rallied on strong earnings.",
        highlights: [
          "Tech sector: +1.8%",
          "Crypto sentiment: Bullish",
          "5 trending opportunities",
        ],
      },
      social: {
        title: "Your Hive Activity",
        summary: "Your connections value your authenticity. You received 3 new endorsements and your posts generated 42% more engagement than last week.",
        highlights: [
          "3 new endorsements received",
          "Post engagement: +42%",
          "2 new Circle invitations",
        ],
      },
    };

    let summaries = [];
    if (input.dataType === "all") {
      summaries = Object.values(mockSummaries);
    } else {
      summaries = [mockSummaries[input.dataType]];
    }

    const overallSummary = input.dataType === "all"
      ? "This week has been productive across all areas. Your engagement is up, market opportunities align with your interests, and your social connections are growing stronger."
      : summaries[0].summary;

    console.log("[AI Insights] Generated personalized summary");

    return {
      success: true,
      overallSummary,
      sections: summaries,
      generatedAt: new Date().toISOString(),
    };
  });
