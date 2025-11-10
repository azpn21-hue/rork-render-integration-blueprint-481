import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { generateObject } from "@rork-ai/toolkit-sdk";
import { createPost, getPosts } from "../../../../db/queries";
import { pool } from "../../../../db/config";
import crypto from "crypto";

const feedContentSchema = z.object({
  posts: z.array(z.object({
    content: z.string(),
    type: z.enum(['thought', 'question', 'story', 'achievement', 'announcement']),
    tone: z.enum(['authentic', 'inspirational', 'vulnerable', 'playful', 'serious']),
    hashtags: z.array(z.string()).optional(),
    mentionsTruthPays: z.boolean(),
    engagementPotential: z.enum(['low', 'medium', 'high'])
  }))
});

export const generateFeedContentProcedure = protectedProcedure
  .input(z.object({
    userId: z.string().optional(),
    count: z.number().min(1).max(100).default(20),
    contentTypes: z.array(z.enum([
      'authentic_sharing',
      'questions',
      'achievements',
      'vulnerability',
      'humor',
      'philosophical',
      'daily_life',
      'relationship_insights'
    ])).optional(),
    forAllTestProfiles: z.boolean().default(false)
  }))
  .mutation(async ({ input }) => {
    console.log(`[AI Testing] Generating feed content...`);

    let targetUsers: Array<{ id: string; username: string; truth_score: number }> = [];

    if (input.forAllTestProfiles) {
      const result = await pool.query(
        `SELECT id, username, truth_score FROM users WHERE id LIKE 'test_%' ORDER BY RANDOM()`
      );
      targetUsers = result.rows;
      console.log(`[AI Testing] Found ${targetUsers.length} test profiles for content generation`);
    } else if (input.userId) {
      const result = await pool.query(
        `SELECT id, username, truth_score FROM users WHERE id = $1`,
        [input.userId]
      );
      targetUsers = result.rows;
    }

    if (targetUsers.length === 0) {
      throw new Error('No users found for content generation');
    }

    const allPosts = [];

    for (const user of targetUsers) {
      const postsToGenerate = input.forAllTestProfiles 
        ? Math.floor(Math.random() * 5) + 1 
        : input.count;

      const prompt = `Generate ${postsToGenerate} social media posts for a user on R3AL (a truth-based dating/social app).

User Profile:
- Username: ${user.username}
- Truth Score: ${user.truth_score}/100

Content Guidelines:
1. Posts should reflect authentic, real human experiences
2. Mix of vulnerability, humor, insights, and daily observations
3. Some posts should reference truth/authenticity themes
4. Varying lengths (20-280 characters)
5. Natural, conversational tone
6. Reflect the user's truth score in content authenticity
${input.contentTypes ? `\nFocus on: ${input.contentTypes.join(', ')}` : ''}

Make posts feel genuine, not corporate or overly polished.`;

      try {
        const content = await generateObject({
          messages: [{ role: "user", content: prompt }],
          schema: feedContentSchema
        });

        for (const post of content.posts) {
          const postId = `post_${crypto.randomUUID()}`;
          
          await createPost(user.id, {
            id: postId,
            content: post.content,
            media: {
              type: post.type,
              tone: post.tone,
              hashtags: post.hashtags || [],
              engagementPotential: post.engagementPotential
            }
          });

          allPosts.push({
            postId,
            userId: user.id,
            username: user.username,
            content: post.content,
            type: post.type,
            tone: post.tone
          });
        }

        console.log(`[AI Testing] ✓ Generated ${content.posts.length} posts for ${user.username}`);
      } catch (error) {
        console.error(`[AI Testing] ✗ Failed to generate posts for ${user.username}:`, error);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`[AI Testing] ✓ Total posts created: ${allPosts.length}`);

    return {
      success: true,
      totalPosts: allPosts.length,
      postsPerUser: input.forAllTestProfiles ? allPosts.length / targetUsers.length : input.count,
      posts: allPosts.slice(0, 10),
      summary: {
        users: targetUsers.length,
        posts: allPosts.length,
        avgPostsPerUser: (allPosts.length / targetUsers.length).toFixed(2)
      }
    };
  });
