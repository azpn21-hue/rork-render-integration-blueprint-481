import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getTacticalDashboardProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input }) => {
    console.log("[Tactical] Getting dashboard for:", input.userId);

    // Mock implementation
    const mockDashboard = {
      user: {
        tacticalUserId: `tactical_${input.userId}`,
        userId: input.userId,
        serviceBranch: 'police' as const,
        rank: 'Sergeant',
        department: 'Metro PD',
        verifiedStatus: 'verified' as const,
        clearanceLevel: 'tactical' as const,
        operationalStatus: 'on_duty' as const,
      },
      activeIncidents: [
        {
          incidentId: "inc_001",
          title: "Traffic Incident - Highway 101",
          severity: "medium" as const,
          status: "active" as const,
          reportedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
      ],
      team: {
        teamId: "team_001",
        teamName: "Alpha Squad",
        teamType: "squad" as const,
        activeMemberCount: 6,
      },
      recentComms: 2,
      aiInsights: [
        "Traffic patterns show elevated risk in sector 7",
        "Resource allocation optimal for current shift",
      ],
    };

    return {
      success: true,
      dashboard: mockDashboard,
    };
  });
