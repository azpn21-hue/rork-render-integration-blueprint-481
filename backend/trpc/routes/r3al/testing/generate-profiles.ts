import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { generateObject, generateText } from "@rork-ai/toolkit-sdk";
import { createUser, createProfile, updateUserTruthScore, createVerification, updateTokenBalance } from "../../../../db/queries";
import crypto from "crypto";

const profileSchema = z.object({
  profiles: z.array(z.object({
    username: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    bio: z.string(),
    location: z.string(),
    age: z.number().min(18).max(100),
    gender: z.enum(['male', 'female', 'non-binary', 'other']),
    interests: z.array(z.string()),
    relationshipGoals: z.string(),
    personalityTraits: z.array(z.string()),
    truthScore: z.number().min(0).max(100),
    verificationLevel: z.enum(['none', 'basic', 'verified', 'premium']),
    questionnaireAnswers: z.object({
      identityIntegrity: z.record(z.any()),
      relationshipHistory: z.record(z.any()),
      boundariesSafety: z.record(z.any()),
      communication: z.record(z.any()),
      lifestyle: z.record(z.any()),
      digitalFootprint: z.record(z.any()),
      values: z.record(z.any())
    }),
    activityPatterns: z.object({
      postsPerWeek: z.number(),
      engagementRate: z.number(),
      avgResponseTime: z.number(),
      peakActivityHours: z.array(z.number())
    })
  }))
});

export const generateTestProfilesProcedure = protectedProcedure
  .input(z.object({
    count: z.number().min(1).max(50).default(5),
    profileTypes: z.array(z.enum([
      'high_truth',
      'moderate_truth',
      'low_truth',
      'mixed',
      'problematic',
      'ideal_match'
    ])).optional(),
    demographicMix: z.boolean().default(true),
    includeMatching: z.boolean().default(true)
  }))
  .mutation(async ({ input }) => {
    console.log(`[AI Testing] Generating ${input.count} test profiles...`);

    const prompt = `Generate ${input.count} realistic test user profiles for a dating/social verification app called R3AL.

Profile Distribution:
${input.profileTypes ? `Focus on: ${input.profileTypes.join(', ')}` : 'Balanced mix of all types'}

Profile Types:
- high_truth: 85-100 truth score, verified, consistent questionnaire answers
- moderate_truth: 60-84 truth score, some verification, mostly consistent
- low_truth: 40-59 truth score, minimal verification, inconsistent answers
- problematic: <40 truth score, red flags, verification issues
- ideal_match: Perfect compatibility indicators, high truth score
- mixed: Random distribution

Requirements:
1. Realistic names, bios, and details
2. Diverse demographics (age 21-65, various locations, interests)
3. Complete questionnaire answers based on their truth profile
4. Activity patterns that match their personality
5. Truth scores that align with their behavior patterns
6. Verification levels matching their truth scores

Make each profile unique and believable with specific details.`;

    const profiles = await generateObject({
      messages: [{ role: "user", content: prompt }],
      schema: profileSchema
    });

    console.log(`[AI Testing] Generated ${profiles.profiles.length} profiles, creating in database...`);

    const createdProfiles = [];

    for (const profile of profiles.profiles) {
      try {
        const userId = `test_${crypto.randomUUID()}`;
        const passwordHash = crypto.createHash('sha256').update('TestPassword123!').digest('hex');

        const user = await createUser({
          id: userId,
          username: profile.username,
          email: profile.email,
          passwordHash
        });

        await createProfile(userId, {
          displayName: profile.displayName,
          bio: profile.bio,
          avatarUrl: `https://i.pravatar.cc/300?u=${userId}`,
          location: profile.location
        });

        await updateUserTruthScore(userId, profile.truthScore);

        const verificationTypes = ['email', 'phone'];
        if (profile.verificationLevel === 'verified' || profile.verificationLevel === 'premium') {
          verificationTypes.push('id', 'background');
        }
        if (profile.verificationLevel === 'premium') {
          verificationTypes.push('biometric', 'social_media');
        }

        for (const type of verificationTypes) {
          await createVerification(userId, {
            type,
            status: 'verified',
            data: {
              verifiedAt: new Date().toISOString(),
              method: 'ai_test_generation'
            }
          });
        }

        const initialTokens = Math.floor(profile.truthScore * 10 + Math.random() * 500);
        await updateTokenBalance(userId, initialTokens, 'initial_bonus', 'Test profile generation bonus');

        createdProfiles.push({
          userId,
          username: profile.username,
          email: profile.email,
          displayName: profile.displayName,
          truthScore: profile.truthScore,
          verificationLevel: profile.verificationLevel,
          questionnaireAnswers: profile.questionnaireAnswers,
          activityPatterns: profile.activityPatterns,
          interests: profile.interests,
          relationshipGoals: profile.relationshipGoals,
          personalityTraits: profile.personalityTraits
        });

        console.log(`[AI Testing] ✓ Created profile: ${profile.username} (${profile.displayName})`);
      } catch (error) {
        console.error(`[AI Testing] ✗ Failed to create profile ${profile.username}:`, error);
      }
    }

    if (input.includeMatching) {
      console.log('[AI Testing] Generating match compatibility data...');
      
      const matchAnalysis = await generateText({
        messages: [{
          role: "user",
          content: `Analyze compatibility between these ${createdProfiles.length} profiles and suggest potential matches.
          
Profiles:
${createdProfiles.map(p => `- ${p.displayName} (${p.username}): ${p.relationshipGoals}, Interests: ${p.interests.join(', ')}, Truth Score: ${p.truthScore}`).join('\n')}

For each profile, suggest 3-5 best potential matches with compatibility scores (0-100) and reasons.`
        }]
      });

      console.log('[AI Testing] Match Analysis:', matchAnalysis);
    }

    console.log(`[AI Testing] ✓ Successfully created ${createdProfiles.length} test profiles`);

    return {
      success: true,
      count: createdProfiles.length,
      profiles: createdProfiles,
      summary: {
        totalCreated: createdProfiles.length,
        averageTruthScore: createdProfiles.reduce((sum, p) => sum + p.truthScore, 0) / createdProfiles.length,
        verificationLevels: {
          none: createdProfiles.filter(p => p.verificationLevel === 'none').length,
          basic: createdProfiles.filter(p => p.verificationLevel === 'basic').length,
          verified: createdProfiles.filter(p => p.verificationLevel === 'verified').length,
          premium: createdProfiles.filter(p => p.verificationLevel === 'premium').length
        }
      }
    };
  });
