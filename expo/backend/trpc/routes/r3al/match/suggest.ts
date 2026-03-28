import { protectedProcedure } from "@/backend/trpc/create-context";

export const suggestMatchesProcedure = protectedProcedure.query(async ({ ctx }) => {
  console.log("[Match] Generating suggestions for user:", ctx.user.id);
  
  const mockSuggestions = [
    {
      userId: "user_001",
      matchScore: 0.92,
      compatibilityType: "Flow Resonance",
      sharedTraits: ["Empathy", "Creativity", "Curiosity"],
      profile: {
        handle: "r3al_aurora",
        displayName: "Aurora Chen",
        bio: "Artist & truth seeker",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
        trustScore: 89.5,
        verificationLevel: 3,
      },
      suggestedAction: "Start Pulse Sync",
      aiInsight: "You both share a deep commitment to authentic expression and creative collaboration.",
    },
    {
      userId: "user_002",
      matchScore: 0.88,
      compatibilityType: "Complementary Energy",
      sharedTraits: ["Innovation", "Growth mindset", "Transparency"],
      profile: {
        handle: "r3al_phoenix",
        displayName: "Phoenix Martinez",
        bio: "Building the future",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
        trustScore: 91.2,
        verificationLevel: 2,
      },
      suggestedAction: "Send Connection Request",
      aiInsight: "Your complementary approaches to problem-solving create powerful synergy.",
    },
    {
      userId: "user_003",
      matchScore: 0.85,
      compatibilityType: "Shared Values",
      sharedTraits: ["Authenticity", "Community", "Learning"],
      profile: {
        handle: "r3al_sage",
        displayName: "Sage Thompson",
        bio: "Lifelong learner",
        avatarUrl: "https://i.pravatar.cc/150?img=8",
        trustScore: 87.8,
        verificationLevel: 2,
      },
      suggestedAction: "View Profile",
      aiInsight: "Strong value alignment creates a foundation for meaningful connection.",
    },
  ];

  return {
    success: true,
    suggestions: mockSuggestions,
    generatedAt: new Date().toISOString(),
  };
});
