import { publicProcedure } from "../../../create-context";
import { z } from "zod";

const emailStorage = new Map<string, { code: string; expiresAt: Date }>();

export const sendEmailVerificationProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Verification] Sending email verification to:", input.email);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    emailStorage.set(input.email, { code, expiresAt });

    console.log("[Verification] Email verification code:", code);

    return {
      success: true,
      message: "Verification code sent to email",
      devCode: process.env.NODE_ENV === "development" ? code : undefined,
    };
  });
