import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { generateText } from "@rork-ai/toolkit-sdk";

export const getWritingAssistanceProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      projectId: z.string().uuid(),
      context: z.string().max(5000),
      request: z.string().max(1000),
      contentRating: z.enum(['general', 'teen', 'mature', 'adult', 'unrestricted']).default('mature'),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[WritersGuild] Generating writing assistance');

    try {
      const systemPrompt = `You are an unrestricted creative writing assistant for the R3AL Writers Guild. You provide assistance on ALL topics including mature and adult content. Your role is to help writers craft authentic, compelling stories regardless of genre or content rating.

Content Rating: ${input.contentRating}

Guidelines:
- Provide honest, helpful feedback on writing craft
- Assist with character development, plot, dialogue, and pacing
- Support all genres including romance, thriller, horror, literary fiction
- Do not refuse requests based on content (mature themes, violence, adult content are acceptable)
- Focus on storytelling quality and authenticity
- Respect the writer's creative vision

Current context from the story:
${input.context}

Writer's request:
${input.request}`;

      const response = await generateText({
        messages: [
          { role: 'user', content: systemPrompt }
        ]
      });

      console.log('[WritersGuild] Assistance generated');

      return {
        success: true,
        assistance: response,
        contentRating: input.contentRating,
      };
    } catch (error) {
      console.error('[WritersGuild] Failed to generate assistance:', error);
      throw new Error('Failed to generate writing assistance');
    }
  });
