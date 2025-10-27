import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginProcedure = publicProcedure
  .input(loginInput)
  .mutation(async ({ input }) => {
    console.log("[Backend] Login attempt for:", input.email);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!input.email || !input.password) {
      throw new Error("Email and password are required");
    }

    const mockToken = `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const mockUserId = `user_${Date.now()}`;

    return {
      success: true,
      userId: mockUserId,
      email: input.email,
      name: input.email.split("@")[0],
      token: mockToken,
    };
  });

export default loginProcedure;
