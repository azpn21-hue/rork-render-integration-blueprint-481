import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const getCommsProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      commType: z.enum(['message', 'alert', 'briefing', 'sitrep', 'request']).optional(),
      priority: z.enum(['routine', 'normal', 'priority', 'immediate', 'flash']).optional(),
      limit: z.number().int().min(1).max(100).default(50),
    })
  )
  .query(async ({ input }) => {
    console.log('[Tactical-HQ] Fetching communications for:', input.userId);

    try {
      let query = `
        SELECT c.*, 
               t.role as sender_role,
               t.organization as sender_org
        FROM tactical_comms c
        LEFT JOIN tactical_users t ON c.sender_id = t.user_id
        WHERE (c.sender_id = $1 OR c.recipient_id = $1 OR c.recipient_id IS NULL)
      `;

      const params: any[] = [input.userId];

      if (input.commType) {
        query += ` AND c.comm_type = $${params.length + 1}`;
        params.push(input.commType);
      }

      if (input.priority) {
        query += ` AND c.priority = $${params.length + 1}`;
        params.push(input.priority);
      }

      query += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
      params.push(input.limit);

      const result = await pool.query(query, params);

      const comms = result.rows.map((row) => ({
        commId: row.comm_id,
        senderId: row.sender_id,
        senderRole: row.sender_role,
        senderOrg: row.sender_org,
        recipientId: row.recipient_id,
        commType: row.comm_type,
        priority: row.priority,
        content: row.encrypted ? '[ENCRYPTED]' : row.content,
        encrypted: row.encrypted,
        readAt: row.read_at,
        createdAt: row.created_at,
      }));

      return {
        success: true,
        comms,
        total: result.rows.length,
      };
    } catch (error) {
      console.error('[Tactical-HQ] Failed to fetch communications:', error);
      throw new Error('Failed to fetch communications');
    }
  });
