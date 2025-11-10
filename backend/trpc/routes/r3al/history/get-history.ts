import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getHistoryProcedure = protectedProcedure
  .input(z.object({
    userId: z.string().optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    eventType: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }))
  .query(async ({ ctx, input }) => {
    const userId = input.userId || ctx.user?.id || "anonymous";
    
    console.log(`[History] Fetching history for user: ${userId}`, {
      limit: input.limit,
      offset: input.offset,
    });

    const mockEvents = generateMockHistory(userId, input.limit, input.offset);

    return {
      userId,
      events: mockEvents,
      total: 42,
      hasMore: input.offset + input.limit < 42,
      summary: {
        totalEvents: 42,
        mostFrequentEvent: "pulse_update",
        averageDailyActivity: 6,
        streakDays: 7,
      },
    };
  });

function generateMockHistory(userId: string, limit: number, offset: number) {
  const eventTypes = [
    "pulse_update",
    "hive_connection",
    "qotd_answer",
    "nft_mint",
    "chat_session",
    "profile_update",
  ];

  const events = [];
  for (let i = 0; i < limit; i++) {
    const index = offset + i;
    const date = new Date();
    date.setHours(date.getHours() - index * 2);

    events.push({
      eventId: `event_${index}_${userId}`,
      eventType: eventTypes[index % eventTypes.length],
      timestamp: date.toISOString(),
      metadata: {
        source: "app",
        platform: "mobile",
      },
      duration: Math.floor(Math.random() * 300) + 30,
    });
  }

  return events;
}
