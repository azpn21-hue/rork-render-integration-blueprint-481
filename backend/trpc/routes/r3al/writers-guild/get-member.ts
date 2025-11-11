import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getGuildMemberProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input }) => {
    console.log("[Writers Guild] Getting member profile:", input.userId);

    // Mock implementation
    const mockMember = {
      memberId: `member_${input.userId}`,
      userId: input.userId,
      penName: "Writer Extraordinaire",
      bio: "Passionate storyteller exploring the depths of human emotion through words.",
      specialties: ["romance", "thriller", "literary fiction"],
      totalWordsWritten: 157830,
      totalProjects: 5,
      memberSince: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "premium" as const,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return {
      success: true,
      member: mockMember,
    };
  });
