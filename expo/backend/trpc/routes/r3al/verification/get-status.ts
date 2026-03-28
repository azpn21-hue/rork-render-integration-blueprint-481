import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

interface VerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  idVerified: boolean;
  voiceVerified: boolean;
  aiConfidenceScore: number | null;
  verificationBadge: string | null;
  lastUpdated: Date;
}

const userVerifications = new Map<string, VerificationStatus>();

export const getVerificationStatusProcedure = protectedProcedure
  .input(
    z
      .object({
        userId: z.string().optional(),
      })
      .optional()
  )
  .query(async ({ input, ctx }) => {
    const userId = input?.userId || ctx.user.id;
    console.log("[Verification] Getting status for user:", userId);

    let status = userVerifications.get(userId);

    if (!status) {
      status = {
        emailVerified: false,
        phoneVerified: false,
        idVerified: false,
        voiceVerified: false,
        aiConfidenceScore: null,
        verificationBadge: null,
        lastUpdated: new Date(),
      };
      userVerifications.set(userId, status);
    }

    const isFullyVerified =
      status.emailVerified && status.phoneVerified && status.idVerified;

    return {
      ...status,
      isFullyVerified,
      completionPercentage: Math.round(
        ((status.emailVerified ? 1 : 0) +
          (status.phoneVerified ? 1 : 0) +
          (status.idVerified ? 1 : 0) +
          (status.voiceVerified ? 0.5 : 0)) /
          3.5 *
          100
      ),
    };
  });

export const updateVerificationStatusProcedure = protectedProcedure
  .input(
    z.object({
      emailVerified: z.boolean().optional(),
      phoneVerified: z.boolean().optional(),
      idVerified: z.boolean().optional(),
      voiceVerified: z.boolean().optional(),
      aiConfidenceScore: z.number().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("[Verification] Updating status for user:", ctx.user.id);

    const existing = userVerifications.get(ctx.user.id) || {
      emailVerified: false,
      phoneVerified: false,
      idVerified: false,
      voiceVerified: false,
      aiConfidenceScore: null,
      verificationBadge: null,
      lastUpdated: new Date(),
    };

    const updated: VerificationStatus = {
      ...existing,
      ...input,
      lastUpdated: new Date(),
    };

    const isFullyVerified =
      updated.emailVerified && updated.phoneVerified && updated.idVerified;

    if (isFullyVerified && !updated.verificationBadge) {
      updated.verificationBadge = `r3al_verified_${ctx.user.id}_${Date.now()}`;
    }

    userVerifications.set(ctx.user.id, updated);

    console.log("[Verification] Status updated:", updated);

    return {
      success: true,
      status: updated,
      isFullyVerified,
    };
  });
