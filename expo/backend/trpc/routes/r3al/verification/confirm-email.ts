import { publicProcedure } from "../../../create-context";
import { z } from "zod";

const emailStorage = new Map<string, { code: string; expiresAt: Date }>();
const verifiedEmails = new Set<string>();

export const confirmEmailVerificationProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      code: z.string().length(6),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Verification] Confirming email:", input.email);

    const stored = emailStorage.get(input.email);

    if (!stored) {
      throw new Error("No verification code found. Please request a new code.");
    }

    if (new Date() > stored.expiresAt) {
      emailStorage.delete(input.email);
      throw new Error("Verification code expired. Please request a new code.");
    }

    if (stored.code !== input.code) {
      throw new Error("Invalid verification code.");
    }

    verifiedEmails.add(input.email);
    emailStorage.delete(input.email);

    console.log("[Verification] Email verified:", input.email);

    return {
      success: true,
      verified: true,
      message: "Email verified successfully",
    };
  });
