import { publicProcedure } from "../../../create-context";
import { z } from "zod";

const smsStorage = new Map<string, { code: string; expiresAt: Date }>();
const verifiedPhones = new Set<string>();

export const confirmSmsVerificationProcedure = publicProcedure
  .input(
    z.object({
      phoneNumber: z.string().min(10),
      code: z.string().length(6),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Verification] Confirming SMS:", input.phoneNumber);

    const stored = smsStorage.get(input.phoneNumber);

    if (!stored) {
      throw new Error("No verification code found. Please request a new code.");
    }

    if (new Date() > stored.expiresAt) {
      smsStorage.delete(input.phoneNumber);
      throw new Error("Verification code expired. Please request a new code.");
    }

    if (stored.code !== input.code) {
      throw new Error("Invalid verification code.");
    }

    verifiedPhones.add(input.phoneNumber);
    smsStorage.delete(input.phoneNumber);

    console.log("[Verification] Phone verified:", input.phoneNumber);

    return {
      success: true,
      verified: true,
      message: "Phone number verified successfully",
    };
  });
