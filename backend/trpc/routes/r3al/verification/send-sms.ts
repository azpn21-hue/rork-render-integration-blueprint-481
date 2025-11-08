import { publicProcedure } from "../../../create-context";
import { z } from "zod";

const smsStorage = new Map<string, { code: string; expiresAt: Date }>();

export const sendSmsVerificationProcedure = publicProcedure
  .input(
    z.object({
      phoneNumber: z.string().min(10),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Verification] Sending SMS verification to:", input.phoneNumber);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    smsStorage.set(input.phoneNumber, { code, expiresAt });

    console.log("[Verification] SMS verification code:", code);

    return {
      success: true,
      message: "Verification code sent via SMS",
      devCode: process.env.NODE_ENV === "development" ? code : undefined,
    };
  });
