import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const sendSecureCommProcedure = publicProcedure
  .input(
    z.object({
      senderId: z.string(),
      recipientId: z.string().optional(),
      commType: z.enum(['message', 'alert', 'briefing', 'sitrep', 'request']),
      priority: z.enum(['routine', 'normal', 'priority', 'immediate', 'flash']).default('normal'),
      content: z.string().min(1).max(5000),
      encrypted: z.boolean().default(true),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[Tactical-HQ] Sending secure communication:', input.commType);

    try {
      const senderCheck = await pool.query(
        `SELECT tactical_id, role, organization 
        FROM tactical_users 
        WHERE user_id = $1`,
        [input.senderId]
      );

      if (senderCheck.rows.length === 0) {
        throw new Error('Sender not registered in Tactical HQ');
      }

      const result = await pool.query(
        `INSERT INTO tactical_comms 
        (sender_id, recipient_id, comm_type, priority, content, encrypted, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *`,
        [
          input.senderId,
          input.recipientId || null,
          input.commType,
          input.priority,
          input.content,
          input.encrypted,
        ]
      );

      const comm = result.rows[0];

      console.log('[Tactical-HQ] Communication sent:', comm.comm_id);

      return {
        success: true,
        comm: {
          commId: comm.comm_id,
          senderId: comm.sender_id,
          recipientId: comm.recipient_id,
          commType: comm.comm_type,
          priority: comm.priority,
          encrypted: comm.encrypted,
          createdAt: comm.created_at,
        },
      };
    } catch (error) {
      console.error('[Tactical-HQ] Failed to send communication:', error);
      throw new Error('Failed to send secure communication');
    }
  });
