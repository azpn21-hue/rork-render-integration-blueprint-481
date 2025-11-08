import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { generateObject, generateText } from "@rork/toolkit-sdk";
import { pool } from "../../../../db/config";
import crypto from "crypto";

const matchAnalysisSchema = z.object({
  matches: z.array(z.object({
    userId1: z.string(),
    userId2: z.string(),
    compatibilityScore: z.number().min(0).max(100),
    matchReasons: z.array(z.string()),
    potentialConcerns: z.array(z.string()).optional(),
    recommendedIcebreaker: z.string(),
    truthCompatibility: z.enum(['excellent', 'good', 'fair', 'poor'])
  }))
});

export const testMatchingProcedure = protectedProcedure
  .input(z.object({
    userId: z.string().optional(),
    testAllProfiles: z.boolean().default(false),
    minCompatibility: z.number().min(0).max(100).default(60),
    generateConversations: z.boolean().default(false)
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('[AI Testing] Running matching algorithm tests...');

    let targetUsers = [];
    let comparisonPool = [];

    if (input.testAllProfiles) {
      const result = await pool.query(
        `SELECT u.id, u.username, u.truth_score, p.display_name, p.bio, p.location
         FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE u.id LIKE 'test_%'`
      );
      targetUsers = result.rows;
      comparisonPool = result.rows;
    } else {
      const userId = input.userId || ctx.user?.id;
      if (!userId) throw new Error('No user ID provided');

      const targetResult = await pool.query(
        `SELECT u.id, u.username, u.truth_score, p.display_name, p.bio, p.location
         FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE u.id = $1`,
        [userId]
      );
      targetUsers = targetResult.rows;

      const poolResult = await pool.query(
        `SELECT u.id, u.username, u.truth_score, p.display_name, p.bio, p.location
         FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE u.id != $1 AND u.id LIKE 'test_%'
         LIMIT 20`,
        [userId]
      );
      comparisonPool = poolResult.rows;
    }

    console.log(`[AI Testing] Analyzing matches for ${targetUsers.length} users against ${comparisonPool.length} profiles`);

    const allMatches = [];

    for (const targetUser of targetUsers) {
      const candidatesForUser = comparisonPool.filter(c => c.id !== targetUser.id);
      
      if (candidatesForUser.length === 0) continue;

      const analysisPrompt = `Analyze compatibility between this user and potential matches for a truth-based dating app.

Target User:
- Name: ${targetUser.display_name} (@${targetUser.username})
- Truth Score: ${targetUser.truth_score}/100
- Bio: ${targetUser.bio || 'No bio'}
- Location: ${targetUser.location || 'Unknown'}

Potential Matches:
${candidatesForUser.slice(0, 10).map(c => 
  `- ${c.display_name} (@${c.username}): Truth ${c.truth_score}/100, ${c.location || 'Unknown'}\n  Bio: ${c.bio || 'No bio'}`
).join('\n\n')}

Analyze and rank the top 5 matches considering:
1. Truth score compatibility (similar scores tend to work better)
2. Personality compatibility based on bios
3. Geographic proximity
4. Shared values and authenticity markers
5. Potential for meaningful connection

For each match, provide compatibility score (0-100), reasons, concerns, and an ice-breaker question.`;

      try {
        const matches = await generateObject({
          messages: [{ role: "user", content: analysisPrompt }],
          schema: matchAnalysisSchema
        });

        for (const match of matches.matches) {
          if (match.compatibilityScore >= input.minCompatibility) {
            const matchId = `match_${crypto.randomUUID()}`;
            
            await pool.query(
              `INSERT INTO matches (id, user_id_1, user_id_2, compatibility_score, status, match_reasons, created_by_ai) 
               VALUES ($1, $2, $3, $4, 'suggested', $5, true)
               ON CONFLICT DO NOTHING`,
              [
                matchId,
                targetUser.id,
                match.userId2,
                match.compatibilityScore,
                JSON.stringify({
                  reasons: match.matchReasons,
                  concerns: match.potentialConcerns || [],
                  icebreaker: match.recommendedIcebreaker,
                  truthCompatibility: match.truthCompatibility
                })
              ]
            );

            allMatches.push({
              matchId,
              user1: targetUser.username,
              user2: candidatesForUser.find(c => c.id === match.userId2)?.username,
              score: match.compatibilityScore,
              reasons: match.matchReasons,
              icebreaker: match.recommendedIcebreaker
            });
          }
        }

        console.log(`[AI Testing] ✓ Found ${matches.matches.length} potential matches for ${targetUser.username}`);

        if (input.generateConversations && matches.matches.length > 0) {
          const topMatch = matches.matches[0];
          const conversationPrompt = `Generate a realistic initial conversation between two matched users:

User 1: ${targetUser.display_name} (Truth: ${targetUser.truth_score}/100)
User 2: ${candidatesForUser.find(c => c.id === topMatch.userId2)?.display_name}

Ice-breaker: "${topMatch.recommendedIcebreaker}"

Generate 6-8 messages of natural, authentic conversation that reflects getting to know each other.`;

          const conversation = await generateText({
            messages: [{ role: "user", content: conversationPrompt }]
          });

          console.log(`[AI Testing] Sample conversation:\n${conversation}`);
        }
      } catch (error) {
        console.error(`[AI Testing] Failed to analyze matches for ${targetUser.username}:`, error);
      }
    }

    console.log(`[AI Testing] ✓ Generated ${allMatches.length} total matches`);

    return {
      success: true,
      totalMatches: allMatches.length,
      usersAnalyzed: targetUsers.length,
      averageMatchesPerUser: (allMatches.length / targetUsers.length).toFixed(2),
      topMatches: allMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, 10),
      statistics: {
        excellent: allMatches.filter(m => m.score >= 85).length,
        good: allMatches.filter(m => m.score >= 70 && m.score < 85).length,
        fair: allMatches.filter(m => m.score >= 60 && m.score < 70).length
      }
    };
  });
