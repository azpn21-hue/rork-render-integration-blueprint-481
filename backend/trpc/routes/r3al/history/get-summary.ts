import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getHistorySummaryProcedure = protectedProcedure
  .input(z.object({
    period: z.enum(["day", "week", "month", "year"]).default("week"),
  }))
  .query(async ({ ctx, input }) => {
    const userId = ctx.user?.id || "anonymous";
    
    console.log(`[History] Generating ${input.period} summary for user: ${userId}`);

    const aiSummary = await generateAISummary(userId, input.period);

    return {
      userId,
      period: input.period,
      summary: aiSummary,
      stats: {
        totalEvents: 42,
        pulseUpdates: 18,
        hiveConnections: 5,
        qotdAnswers: 7,
        chatSessions: 12,
      },
      insights: [
        "Your pulse has been consistently calm this week",
        "You've made 3 new meaningful hive connections",
        "Your engagement peaked on Wednesday",
      ],
      timestamp: new Date().toISOString(),
    };
  });

async function generateAISummary(userId: string, period: string): Promise<string> {
  const summaries: Record<string, string> = {
    day: "Today you maintained steady energy with 6 pulse updates. Your emotional state remained balanced throughout.",
    week: "This week you've shown consistent presence with 42 interactions. Your pulse signature indicates growing coherence and 3 new hive connections strengthened your network.",
    month: "Over the past month, you've demonstrated remarkable growth with 180+ events logged. Your pulse has evolved from exploratory to deeply centered.",
    year: "Your year has been transformative. 2000+ logged events show a journey from discovery to mastery. Your hive has expanded 10x and your pulse signature is uniquely yours.",
  };

  return summaries[period] || summaries.week;
}
