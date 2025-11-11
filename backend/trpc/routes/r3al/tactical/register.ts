import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const registerTacticalUserProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    serviceBranch: z.enum(['army', 'navy', 'air_force', 'marines', 'coast_guard', 'police', 'fire', 'ems', 'other']),
    rank: z.string().optional(),
    badgeNumber: z.string().optional(),
    department: z.string().optional(),
    verificationDocuments: z.any().optional(),
  }))
  .mutation(async ({ input }) => {
    console.log("[Tactical] Registering tactical user:", input.userId);

    // Mock implementation - in production, this would:
    // 1. Store verification documents securely
    // 2. Initiate verification process
    // 3. Notify verification team

    const mockTacticalUser = {
      tacticalUserId: `tactical_${Date.now()}`,
      userId: input.userId,
      serviceBranch: input.serviceBranch,
      rank: input.rank,
      badgeNumber: input.badgeNumber,
      department: input.department,
      verifiedStatus: 'pending' as const,
      clearanceLevel: 'basic' as const,
      tacticalModeEnabled: true,
      operationalStatus: 'off_duty' as const,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      tacticalUser: mockTacticalUser,
      message: "Tactical registration submitted for verification",
    };
  });
