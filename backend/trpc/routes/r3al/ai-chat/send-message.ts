import { publicProcedure } from "../../../create-context";
import { z } from "zod";

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

    // Check user tier and permissions
    // In production, query subscription to determine if user has unrestricted access
    const hasUnrestrictedAccess = true; // Mock - replace with actual tier check

    // Build system prompt based on context
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

    // Mock response - replace with actual AI gateway call
    // In production: const response = await aiGateway.chat({ messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: input.message }], temperature: input.temperature });
    const mockResponse = {
      sessionId: input.sessionId || `session_${Date.now()}`,
      messageId: `msg_${Date.now()}`,
      response: `This is a mock response to: "${input.message.substring(0, 50)}..."\n\nIn production, this would call the AI gateway with the ${input.context} context (${systemPrompt.substring(0, 50)}...) and process your request with temperature ${input.temperature}.`,
      tokens: 150,
      timestamp: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockResponse,
      hasUnrestrictedAccess,
    };
  });
