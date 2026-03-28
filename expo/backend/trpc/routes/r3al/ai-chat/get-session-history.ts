import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { pool } from "../../../../db/config";
import { TRPCError } from "@trpc/server";

export const getSessionHistoryProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    sessionId: z.string(),
    limit: z.number().default(50),
    offset: z.number().default(0),
  }))
  .query(async ({ input }) => {
    console.log("[AI Chat] Getting session history:", input.sessionId);

    try {
      const client = await pool.connect();
      
      try {
        const result = await client.query(
          `SELECT message_id, role, content, context, created_at as timestamp
           FROM r3al_ai_chat_messages
           WHERE user_id = $1 AND session_id = $2
           ORDER BY created_at ASC
           LIMIT $3 OFFSET $4`,
          [input.userId, input.sessionId, input.limit + 1, input.offset]
        );

        const hasMore = result.rows.length > input.limit;
        const messages = result.rows.slice(0, input.limit).map(row => ({
          messageId: row.message_id,
          role: row.role as 'user' | 'assistant',
          content: row.content,
          context: row.context,
          timestamp: row.timestamp.toISOString(),
        }));

        return {
          success: true,
          messages,
          hasMore,
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("[AI Chat] Error getting history:", error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve chat history',
      });
    }
  });
