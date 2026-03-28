import { z } from "zod";

export const PromptRequest = z.object({
  prompt: z.string().min(1),
});

export type TPromptRequest = z.infer<typeof PromptRequest>;
