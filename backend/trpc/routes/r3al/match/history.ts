import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const getMatchHistoryProcedure = protectedProcedure
  .input(
    z
      .object({
        limit: z.number().optional(),
        filter: z.enum(["all", "liked", "connected", "skipped"]).optional(),
      })
      .optional()
  )
  .query(async ({ input, ctx }) => {
    console.log("[Match] Fetching history for user:", ctx.user.id);

    const limit = input?.limit || 50;
    const filter = input?.filter || "all";

    const mockHistory = [
      {
        id: "hist_001",
        targetId: "user_001",
        result: "connected",
        matchScore: 0.92,
        profile: {
          handle: "r3al_aurora",
          displayName: "Aurora Chen",
          avatarUrl: "https://i.pravatar.cc/150?img=5",
          trustScore: 89.5,
        },
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "hist_002",
        targetId: "user_002",
        result: "liked",
        matchScore: 0.88,
        profile: {
          handle: "r3al_phoenix",
          displayName: "Phoenix Martinez",
          avatarUrl: "https://i.pravatar.cc/150?img=12",
          trustScore: 91.2,
        },
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "hist_003",
        targetId: "user_003",
        result: "skipped",
        matchScore: 0.75,
        profile: {
          handle: "r3al_wanderer",
          displayName: "Wanderer Jones",
          avatarUrl: "https://i.pravatar.cc/150?img=15",
          trustScore: 82.1,
        },
        timestamp: new Date(Date.now() - 259200000).toISOString(),
      },
    ];

    const filtered =
      filter === "all"
        ? mockHistory
        : mockHistory.filter((h) => h.result === filter);

    return {
      success: true,
      history: filtered.slice(0, limit),
      total: filtered.length,
      filter,
    };
  });
