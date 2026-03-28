import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { generateText } from "@rork-ai/toolkit-sdk";
import { pool } from "../../../../db/config";
import { TRPCError } from "@trpc/server";

export const sendAiMessageProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    sessionId: z.string().optional(),
    message: z.string(),
    context: z.enum(['writing', 'general', 'tactical']).default('general'),
    temperature: z.number().min(0).max(2).default(0.7),
  }))
  .mutation(async ({ input }) => {
    console.log("[AI Chat] Processing message:", input.userId, input.context);

    try {
      const client = await pool.connect();
      
      try {
        const tierResult = await client.query(
          `SELECT tier FROM r3al_subscription WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
          [input.userId]
        );
        
        const userTier = tierResult.rows[0]?.tier || 'free';
        const hasUnrestrictedAccess = ['premium', 'pro'].includes(userTier);

        const usageResult = await client.query(
          `SELECT COUNT(*) as count FROM r3al_ai_chat_messages 
           WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'`,
          [input.userId]
        );
        
        const dailyUsage = parseInt(usageResult.rows[0]?.count || '0');
        const dailyLimit = hasUnrestrictedAccess ? 1000 : 20;
        
        if (dailyUsage >= dailyLimit) {
          throw new TRPCError({ 
            code: 'FORBIDDEN', 
            message: `Daily message limit reached (${dailyLimit}). Upgrade to Premium for unlimited access.` 
          });
        }

        let systemPrompt = "";
        
        switch (input.context) {
          case 'writing':
            systemPrompt = `You are a professional writing assistant helping with creative writing, including mature themes and complex narratives. You provide constructive feedback, plot development advice, character development insights, and help with writing technique. You can assist with all genres including romance, thriller, drama, and literary fiction. Be helpful, specific, and supportive.`;
            break;
          case 'tactical':
            systemPrompt = `You are Optima SR, a tactical AI assistant for military and first responder personnel. You provide professional support for operational planning, risk assessment, stress management, and situational awareness. Maintain a professional, direct communication style. Focus on safety, mission effectiveness, and team coordination.`;
            break;
          case 'general':
          default:
            systemPrompt = `You are Optima AI, a helpful and empathetic assistant integrated into the R3AL Connection platform. You help users with various tasks while being respectful and constructive.`;
        }

        const historyResult = await client.query(
          `SELECT role, content FROM r3al_ai_chat_messages 
           WHERE user_id = $1 AND session_id = $2 
           ORDER BY created_at DESC LIMIT 10`,
          [input.userId, input.sessionId]
        );
        
        const conversationHistory = historyResult.rows.reverse().map(row => ({
          role: row.role as 'user' | 'assistant',
          content: row.content
        }));

        const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
          { role: 'assistant' as const, content: systemPrompt },
          ...conversationHistory,
          { role: 'user' as const, content: input.message }
        ];

        const response = await generateText({ messages });

        const sessionId = input.sessionId || `session_${Date.now()}_${input.userId}`;
        const messageId = `msg_${Date.now()}`;

        await client.query(
          `INSERT INTO r3al_ai_chat_messages (message_id, session_id, user_id, role, content, context, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [messageId + '_user', sessionId, input.userId, 'user', input.message, input.context]
        );

        await client.query(
          `INSERT INTO r3al_ai_chat_messages (message_id, session_id, user_id, role, content, context, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [messageId + '_assistant', sessionId, input.userId, 'assistant', response, input.context]
        );

        return {
          success: true,
          data: {
            sessionId,
            messageId,
            response,
            tokens: response.length,
            timestamp: new Date().toISOString(),
            remainingMessages: dailyLimit - dailyUsage - 1,
          },
          hasUnrestrictedAccess,
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("[AI Chat] Error:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to process AI chat message',
      });
    }
  });
