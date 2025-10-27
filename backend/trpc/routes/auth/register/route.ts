import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const registerInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const registerProcedure = publicProcedure
  .input(registerInput)
  .mutation(async ({ input }) => {
    console.log("[Backend] Registration attempt for:", input.email);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!input.email || !input.password || !input.name) {
      throw new Error("All fields are required");
    }

    if (input.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const mockToken = `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const mockUserId = `user_${Date.now()}`;

    return {
      success: true,
      userId: mockUserId,
      email: input.email,
      name: input.name,
      token: mockToken,
    };
  });

export default registerProcedure;
