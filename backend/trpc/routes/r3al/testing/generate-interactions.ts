import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { generateObject } from "@rork-ai/toolkit-sdk";
import { pool } from "../../../../db/config";
import crypto from "crypto";

const interactionSchema = z.object({
  interactions: z.array(z.object({
    type: z.enum(['resonate', 'amplify', 'witness', 'comment']),
    targetUserId: z.string(),
    targetPostId: z.string().optional(),
    commentText: z.string().optional(),
    likelihood: z.number().min(0).max(100)
  }))
});

export const generateInteractionsProcedure = protectedProcedure
  .input(z.object({
    testProfilesOnly: z.boolean().default(true),
    interactionDensity: z.enum(['sparse', 'moderate', 'high']).default('moderate'),
    includeComments: z.boolean().default(true),
    naturalPatterns: z.boolean().default(true)
  }))
  .mutation(async ({ input }) => {
    console.log(`[AI Testing] Generating interactions with ${input.interactionDensity} density...`);

    const usersResult = await pool.query(
      input.testProfilesOnly
        ? `SELECT id, username, truth_score FROM users WHERE id LIKE 'test_%'`
        : `SELECT id, username, truth_score FROM users`
    );
    const users = usersResult.rows;

    const postsResult = await pool.query(
      `SELECT p.id, p.user_id, p.content, u.truth_score 
       FROM posts p 
       JOIN users u ON p.user_id = u.id
       ${input.testProfilesOnly ? "WHERE u.id LIKE 'test_%'" : ''}
       ORDER BY p.created_at DESC 
       LIMIT 100`
    );
    const posts = postsResult.rows;

    console.log(`[AI Testing] Found ${users.length} users and ${posts.length} posts`);

    const densityMultiplier = {
      sparse: 0.3,
      moderate: 0.6,
      high: 0.9
    }[input.interactionDensity];

    const allInteractions = [];
    const interactionTables: { [key: string]: string } = {
      resonate: 'post_resonances',
      amplify: 'post_amplifications',
      witness: 'post_witnesses',
      comment: 'post_comments'
    };

    for (const user of users) {
      const postSample = posts
        .filter(p => p.user_id !== user.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(posts.length * densityMultiplier));

      if (postSample.length === 0) continue;

      for (const post of postSample) {
        const shouldInteract = Math.random() < densityMultiplier;
        if (!shouldInteract) continue;

        const interactionTypes: Array<'resonate' | 'amplify' | 'witness' | 'comment'> = ['resonate'];
        if (Math.random() > 0.7) interactionTypes.push('amplify');
        if (Math.random() > 0.8) interactionTypes.push('witness');
        if (input.includeComments && Math.random() > 0.6) interactionTypes.push('comment');

        for (const interactionType of interactionTypes) {
          try {
            const interactionId = `${interactionType}_${crypto.randomUUID()}`;

            if (interactionType === 'comment') {
              const commentPrompt = `Generate a brief, authentic comment (10-60 words) in response to this post:
              
"${post.content}"

The commenter has a truth score of ${user.truth_score}/100. Make the comment natural, supportive, or thought-provoking.`;

              const commentResult = await generateObject({
                messages: [{ role: "user", content: commentPrompt }],
                schema: z.object({
                  comment: z.string()
                })
              });

              await pool.query(
                `INSERT INTO post_comments (id, post_id, user_id, content) 
                 VALUES ($1, $2, $3, $4)`,
                [interactionId, post.id, user.id, commentResult.comment]
              );

              allInteractions.push({
                type: interactionType,
                userId: user.id,
                postId: post.id,
                comment: commentResult.comment
              });
            } else {
              const tableName = interactionTables[interactionType];
              await pool.query(
                `INSERT INTO ${tableName} (id, post_id, user_id) 
                 VALUES ($1, $2, $3) 
                 ON CONFLICT DO NOTHING`,
                [interactionId, post.id, user.id]
              );

              allInteractions.push({
                type: interactionType,
                userId: user.id,
                postId: post.id
              });
            }

            await pool.query(
              `UPDATE posts 
               SET ${interactionType}_count = COALESCE(${interactionType}_count, 0) + 1 
               WHERE id = $1`,
              [post.id]
            );

          } catch (error) {
            console.error(`[AI Testing] Failed to create ${interactionType}:`, error);
          }
        }
      }

      console.log(`[AI Testing] ✓ Generated interactions for ${user.username}`);
    }

    const stats = {
      resonates: allInteractions.filter(i => i.type === 'resonate').length,
      amplifies: allInteractions.filter(i => i.type === 'amplify').length,
      witnesses: allInteractions.filter(i => i.type === 'witness').length,
      comments: allInteractions.filter(i => i.type === 'comment').length
    };

    console.log(`[AI Testing] ✓ Created ${allInteractions.length} interactions:`, stats);

    return {
      success: true,
      totalInteractions: allInteractions.length,
      stats,
      interactionsPerUser: (allInteractions.length / users.length).toFixed(2),
      sample: allInteractions.slice(0, 10)
    };
  });
