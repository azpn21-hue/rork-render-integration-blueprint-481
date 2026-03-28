import { z } from "zod";
import { protectedProcedure } from "../../../create-context";

export const runFullTestSuiteProcedure = protectedProcedure
  .input(z.object({
    profileCount: z.number().min(5).max(50).default(20),
    includeMatching: z.boolean().default(true),
    includeFeed: z.boolean().default(true),
    includeInteractions: z.boolean().default(true),
    interactionDensity: z.enum(['sparse', 'moderate', 'high']).default('moderate'),
    cleanupFirst: z.boolean().default(false)
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('[AI Testing] 🚀 Starting full test suite...');
    
    const results = {
      profiles: null as any,
      feed: null as any,
      interactions: null as any,
      matching: null as any,
      cleanup: null as any,
      timing: {
        start: new Date(),
        end: null as Date | null,
        duration: 0
      }
    };

    try {
      if (input.cleanupFirst) {
        console.log('[AI Testing] Step 1: Cleaning up existing test data...');
        const { cleanupTestDataProcedure } = await import('./cleanup-test-data');
        results.cleanup = await cleanupTestDataProcedure({
          input: {
            confirmDeletion: true,
            deleteProfiles: true,
            deletePosts: true,
            deleteInteractions: true,
            deleteMatches: true
          },
          ctx,
          type: 'mutation',
          path: 'r3al.testing.cleanup',
          getRawInput: async () => ({})
        });
        console.log('[AI Testing] ✓ Cleanup complete');
      }

      console.log(`[AI Testing] Step 2: Generating ${input.profileCount} test profiles...`);
      const { generateTestProfilesProcedure } = await import('./generate-profiles');
      results.profiles = await generateTestProfilesProcedure({
        input: {
          count: input.profileCount,
          profileTypes: ['high_truth', 'moderate_truth', 'low_truth', 'ideal_match'],
          demographicMix: true,
          includeMatching: false
        },
        ctx,
        type: 'mutation',
        path: 'r3al.testing.generateProfiles',
        getRawInput: async () => ({})
      });
      console.log(`[AI Testing] ✓ Created ${results.profiles.count} profiles`);

      await new Promise(resolve => setTimeout(resolve, 2000));

      if (input.includeFeed) {
        console.log('[AI Testing] Step 3: Generating feed content...');
        const { generateFeedContentProcedure } = await import('./generate-feed-content');
        results.feed = await generateFeedContentProcedure({
          input: {
            count: 5,
            forAllTestProfiles: true,
            contentTypes: ['authentic_sharing', 'questions', 'vulnerability', 'daily_life']
          },
          ctx,
          type: 'mutation',
          path: 'r3al.testing.generateFeed',
          getRawInput: async () => ({})
        });
        console.log(`[AI Testing] ✓ Created ${results.feed.totalPosts} posts`);

        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (input.includeInteractions) {
        console.log('[AI Testing] Step 4: Generating interactions...');
        const { generateInteractionsProcedure } = await import('./generate-interactions');
        results.interactions = await generateInteractionsProcedure({
          input: {
            testProfilesOnly: true,
            interactionDensity: input.interactionDensity,
            includeComments: true,
            naturalPatterns: true
          },
          ctx,
          type: 'mutation',
          path: 'r3al.testing.generateInteractions',
          getRawInput: async () => ({})
        });
        console.log(`[AI Testing] ✓ Created ${results.interactions.totalInteractions} interactions`);

        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (input.includeMatching) {
        console.log('[AI Testing] Step 5: Running matching algorithm...');
        const { testMatchingProcedure } = await import('./test-matching');
        results.matching = await testMatchingProcedure({
          input: {
            testAllProfiles: true,
            minCompatibility: 60,
            generateConversations: false
          },
          ctx,
          type: 'mutation',
          path: 'r3al.testing.testMatching',
          getRawInput: async () => ({})
        });
        console.log(`[AI Testing] ✓ Generated ${results.matching.totalMatches} matches`);
      }

      results.timing.end = new Date();
      results.timing.duration = results.timing.end.getTime() - results.timing.start.getTime();

      console.log(`[AI Testing] ✅ Full test suite complete in ${(results.timing.duration / 1000).toFixed(2)}s`);

      return {
        success: true,
        summary: {
          profiles: results.profiles?.count || 0,
          posts: results.feed?.totalPosts || 0,
          interactions: results.interactions?.totalInteractions || 0,
          matches: results.matching?.totalMatches || 0,
          duration: `${(results.timing.duration / 1000).toFixed(2)}s`
        },
        details: {
          profiles: results.profiles?.summary,
          feed: results.feed?.summary,
          interactions: results.interactions?.stats,
          matching: results.matching?.statistics
        },
        timing: results.timing
      };
    } catch (error) {
      console.error('[AI Testing] ❌ Test suite failed:', error);
      throw error;
    }
  });
