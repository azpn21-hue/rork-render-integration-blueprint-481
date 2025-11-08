import { protectedProcedure } from "@/backend/trpc/create-context";

export const getMatchInsightsProcedure = protectedProcedure.query(async ({ ctx }) => {
  console.log("[Match] Generating insights for user:", ctx.user.id);

  const insights = {
    personalityProfile: {
      primaryTraits: ["Empathetic", "Creative", "Curious"],
      secondaryTraits: ["Analytical", "Authentic", "Growth-oriented"],
      connectionStyle: "Deep, meaningful relationships",
      energyType: "Balanced introvert-extrovert",
    },
    matchingPatterns: {
      mostSuccessful: "Flow Resonance",
      averageScore: 0.87,
      connectionRate: 0.65,
      preferredTraits: ["Authenticity", "Creativity", "Empathy"],
    },
    recommendations: [
      {
        type: "connection",
        title: "Expand your Circle",
        description: "Your high empathy score suggests you'd thrive in collaborative Circles",
        action: "Browse Circle suggestions",
      },
      {
        type: "growth",
        title: "Balance energy levels",
        description: "Consider connections with complementary energy types for growth",
        action: "Adjust match preferences",
      },
      {
        type: "optimization",
        title: "Complete verification",
        description: "Level 3 verification unlocks premium match algorithms",
        action: "Complete ID verification",
      },
    ],
    weeklyStats: {
      suggestionsViewed: 24,
      connectionsRequested: 7,
      acceptanceRate: 0.71,
      averageMatchScore: 0.84,
    },
  };

  return {
    success: true,
    insights,
    generatedAt: new Date().toISOString(),
  };
});
