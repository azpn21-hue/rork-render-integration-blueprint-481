import { z } from "zod";

export const ChatMessage = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1)
});

export const ChatRequest = z.object({
  messages: z.array(ChatMessage).min(1),
  stream: z.boolean().optional().default(true),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(1).max(8192).optional(),
  model: z.string().optional()
});

export type TChatRequest = z.infer<typeof ChatRequest>;
export type TChatMessage = z.infer<typeof ChatMessage>;