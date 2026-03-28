import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { pool } from "../../../../db/config";

export const getSecureSessionsProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      limit: z.number().int().min(1).max(50).default(20),
    })
  )
  .query(async ({ input }) => {
    console.log('[Tactical-SecureGrid] Fetching secure sessions for:', input.userId);

    try {
      const result = await pool.query(
        `SELECT 
          session_id,
          user_id,
          tunnel_endpoint,
          encryption_level,
          location_masked,
          bytes_transferred,
          status,
          started_at,
          ended_at
        FROM secure_grid_sessions
        WHERE user_id = $1
        ORDER BY started_at DESC
        LIMIT $2`,
        [input.userId, input.limit]
      );

      const sessions = result.rows.map((row) => ({
        sessionId: row.session_id,
        userId: row.user_id,
        tunnelEndpoint: row.tunnel_endpoint,
        encryptionLevel: row.encryption_level,
        locationMasked: row.location_masked,
        bytesTransferred: row.bytes_transferred,
        status: row.status,
        startedAt: row.started_at,
        endedAt: row.ended_at,
        duration: row.ended_at 
          ? new Date(row.ended_at).getTime() - new Date(row.started_at).getTime()
          : null,
      }));

      const stats = {
        totalSessions: sessions.length,
        activeSessions: sessions.filter(s => s.status === 'active').length,
        totalBytesTransferred: sessions.reduce((sum, s) => sum + (s.bytesTransferred || 0), 0),
      };

      return {
        success: true,
        sessions,
        stats,
      };
    } catch (error) {
      console.error('[Tactical-SecureGrid] Failed to fetch sessions:', error);
      throw new Error('Failed to fetch secure sessions');
    }
  });
