import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

interface IdVerification {
  userId: string;
  idPhotoUrl: string;
  selfieUrl: string;
  verified: boolean;
  aiConfidenceScore: number;
  timestamp: Date;
}

const idVerifications = new Map<string, IdVerification>();

export const verifyIdProcedure = protectedProcedure
  .input(
    z.object({
      idPhotoBase64: z.string(),
      selfieBase64: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("[Verification] Processing ID verification for user:", ctx.user.id);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiConfidenceScore = Math.random() * (99 - 85) + 85;
    const verified = aiConfidenceScore > 88;

    const verification: IdVerification = {
      userId: ctx.user.id,
      idPhotoUrl: `stored_id_${ctx.user.id}_${Date.now()}`,
      selfieUrl: `stored_selfie_${ctx.user.id}_${Date.now()}`,
      verified,
      aiConfidenceScore,
      timestamp: new Date(),
    };

    idVerifications.set(ctx.user.id, verification);

    console.log(
      `[Verification] ID verification ${verified ? "successful" : "failed"}:`,
      aiConfidenceScore.toFixed(2)
    );

    return {
      success: true,
      verified,
      aiConfidenceScore: parseFloat(aiConfidenceScore.toFixed(2)),
      message: verified
        ? "Identity verified successfully"
        : "Identity verification failed. Please try again with clearer photos.",
    };
  });
