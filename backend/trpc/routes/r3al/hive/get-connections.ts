import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getHiveConnectionsProcedure = protectedProcedure
  .input(z.object({
    userId: z.string().optional(),
    limit: z.number().min(1).max(100).default(20),
    status: z.enum(["active", "pending", "all"]).default("active"),
  }))
  .query(async ({ ctx, input }) => {
    const userId = input.userId || ctx.user?.id || "anonymous";
    
    console.log(`[Hive] Getting connections for user: ${userId}`);

    const connections = generateMockConnections(userId, input.limit, input.status);

    return {
      userId,
      connections,
      total: connections.length,
      stats: {
        activeConnections: 12,
        pendingRequests: 3,
        totalResonance: 0.87,
      },
    };
  });

function generateMockConnections(userId: string, limit: number, status: string) {
  const connections = [];
  const statuses = status === "all" ? ["active", "pending"] : [status];

  for (let i = 0; i < Math.min(limit, 15); i++) {
    connections.push({
      connectionId: `conn_${i}_${userId}`,
      userId: `user_${i + 1000}`,
      displayName: `User ${i + 1000}`,
      avatarUrl: `https://i.pravatar.cc/150?u=${i + 1000}`,
      status: statuses[i % statuses.length],
      resonanceScore: Math.random() * 0.3 + 0.7,
      connectedAt: new Date(Date.now() - i * 86400000).toISOString(),
      sharedInterests: ["pulse", "growth", "connection"].slice(0, Math.floor(Math.random() * 3) + 1),
      pulseCompatibility: Math.random() * 0.2 + 0.8,
    });
  }

  return connections;
}
